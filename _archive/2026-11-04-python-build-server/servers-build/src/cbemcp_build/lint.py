"""lint_project: the tenant grammar, checked before a package goes anywhere.

The tenant runs a strict validator where the local XVM is loose, so a package that runs on a
developer's machine can still be refused by the Deploy Wizard, or deploy and then fail quietly (a
trigger spelled wrong fires nothing; an unknown path answers the boot page). The rules are data —
`tenant-grammar.json`, one entry per rule with its profile, severity, message and fix — and this
module is the engine that applies them to a package held in memory (`cbemcp_build.package`). The
same engine runs over stdio and on the hosted build endpoint (files in the request) and, through
`cbemcp`'s tenant endpoint, on a stored project read back from the database.

Rule G00 is the XSD validation `upload_project` and `deploy` already run, applied to every XML file
reached from the manifest through xlink:href; the other rules are the grammar the schemas cannot
express. Nothing here writes, and nothing here needs a tenant.
"""
from __future__ import annotations

import json
import os
import posixpath
import re
from typing import Any, Callable, Literal

from mcp.server.mcpserver.exceptions import ToolError

from cbemcp_build.package import MANIFEST, LintFile, Package, XmlFile, check_relative_path, component_names
from cbemcp_build.schema import XSD_DIR, manifest_custom_tags, schema_for_custom_tags
from cbemcp_build.xmltree import XLINK_ACTUATE, XLINK_HREF, XSL_NS, local_name

__all__ = ["GRAMMAR_PATH", "LintFile", "Package", "XmlFile", "MANIFEST", "Profile", "PROFILES", "check_relative_path",
           "component_names", "init", "lint", "load_grammar", "native_component_names"]

GRAMMAR_PATH = os.path.join(os.path.dirname(__file__), "tenant-grammar.json")

Profile = Literal["build", "ship"]
PROFILES = ("build", "ship")
SEVERITIES = ("error", "warning", "info")

LOGIN_PROCESS_HREF = "xios://apps/login.xml"
STYLE_EXTENSIONS = (".css",)
SCRIPT_EXTENSIONS = (".js", ".mjs")
FONT_EXTENSIONS = (".woff", ".woff2", ".ttf", ".otf", ".eot")
PLATFORM_HOSTS = (".cloudbackend.com", ".cloudbackend.cloud")

_NCNAME = re.compile(r"^[A-Za-z_][A-Za-z0-9._-]*$")
_FUNCTION_CALL = re.compile(r"(?<![\w.#$\-:])([A-Za-z_][\w\-]*)\s*\(")
_QUOTED = re.compile(r"'[^']*'|\"[^\"]*\"")
# not a character reference (&#215;) and not a {#view#component} token
_HEX_COLOUR = re.compile(r"(?<![&\w{#])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?!#)")
_CSS_VAR = re.compile(r"var\([^)]*\)")
_VIEW_COMPONENT_REF = re.compile(r"(?<![\w$])#([A-Za-z_][\w\-]*)#([A-Za-z_][\w\-]*)")
_FETCH_EXTERNAL = re.compile(r"\bfetch\s*\(\s*[\"'`](https?:)?//([^/\"'`]+)")
_XHR_OPEN = re.compile(r"\.open\s*\(\s*[\"'`][A-Za-z]+[\"'`]\s*,\s*[\"'`](https?:)?//([^/\"'`]+)")
_XHR_NEW = re.compile(r"\bnew\s+XMLHttpRequest\b")
_DEPLOYMENT_NAME = re.compile(r"^[a-z0-9]+$")

# Secret shapes. The value is never written into a finding, only the kind.
_SECRET_SHAPES: list[tuple[str, re.Pattern[str]]] = [
    (kind, re.compile(pattern)) for kind, pattern in [
        ("a private key block", r"-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----"),
        ("a JSON Web Token", r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}"),
        ("an OpenAI-style secret key", r"\bsk-[A-Za-z0-9_-]{20,}"),
        ("an AWS access key id", r"\bAKIA[0-9A-Z]{16}\b"),
        ("a GitHub token", r"\bgh[pousr]_[A-Za-z0-9]{30,}"),
        ("a Slack token", r"\bxox[abprs]-[A-Za-z0-9-]{10,}"),
        ("a Google API key", r"\bAIza[0-9A-Za-z_-]{35}"),
        ("a bearer token in a header", r"(?i)\bbearer\s+[A-Za-z0-9_\-.=]{24,}"),
        ("a credential assignment", r"(?i)\b(?:api[_-]?key|secret[_-]?key|access[_-]?token|client[_-]?secret|password)\b\s*[:=]\s*[\"'][^\"'\s]{12,}[\"']"),
    ]
]

_native_names_cache: frozenset[str] | None = None


def native_component_names() -> frozenset[str]:
    """Every element name view.xsd declares, read from the vendored schema (never hand-kept)."""
    global _native_names_cache
    if _native_names_cache is None:
        with open(os.path.join(XSD_DIR, "view.xsd"), encoding="utf-8") as f:
            _native_names_cache = frozenset(re.findall(r'<xs:element name="([^"]+)"', f.read()))
    return _native_names_cache


# ---------------------------------------------------------------- the grammar

class Rule:

    def __init__(self, data: dict[str, Any]) -> None:
        self.id: str = data["id"]
        self.title: str = data["title"]
        self.profile: str = data["profile"]
        self.severity: str = data["severity"]
        self.message: str = data["message"]
        self.fix: str = data["fix"]
        self.notes: str = data.get("notes", "")
        if self.profile not in PROFILES or self.severity not in SEVERITIES:
            raise ValueError(f"grammar rule {self.id}: bad profile or severity")


class Grammar:

    def __init__(self, data: dict[str, Any]) -> None:
        self.version: str = data["grammar_version"]
        self.rules: dict[str, Rule] = {r["id"]: Rule(r) for r in data["rules"]}
        functions = data["allowed_xpath_functions"]
        self.allowed_functions: frozenset[str] = frozenset(functions["functions"])
        self.functions_status: str = functions["status"]
        self.limits: dict[str, int] = data["limits"]


_grammar: Grammar | None = None


def load_grammar() -> Grammar:
    global _grammar
    if _grammar is None:
        with open(GRAMMAR_PATH, encoding="utf-8") as f:
            _grammar = Grammar(json.load(f))
    return _grammar


# ---------------------------------------------------------------- findings

class Report:

    def __init__(self, grammar: Grammar, active: set[str]) -> None:
        self.grammar = grammar
        self.active = active
        self.findings: dict[str, list[dict[str, Any]]] = {"error": [], "warning": [], "info": []}

    def add(self, rule_id: str, *, file: str = "", line: int = 0, severity: str | None = None, **ctx: Any) -> None:
        if rule_id not in self.active:
            return
        rule = self.grammar.rules[rule_id]
        ctx.setdefault("file", file or "(package)")
        ctx.setdefault("line", line)
        finding = {
            "rule": rule_id,
            "file": file,
            "line": line,
            "message": safe_format(rule.message, ctx),
            "fix": safe_format(rule.fix, ctx),
        }
        bucket = self.findings[severity or rule.severity]
        if finding not in bucket:
            bucket.append(finding)


def safe_format(template: str, ctx: dict[str, Any]) -> str:
    class Missing(dict):
        def __missing__(self, key: str) -> str:
            return "{" + key + "}"
    return template.format_map(Missing(ctx))


# ---------------------------------------------------------------- the rules

RuleFn = Callable[[Package, Report], None]


def rule_g00(pkg: Package, report: Report) -> None:
    for path, (message, line) in pkg.parse_errors.items():
        report.add("G00", file=path, line=line, reason=f"not well-formed XML: {message}")
    if pkg.manifest is None:
        return
    try:
        schema = schema_for_custom_tags(manifest_custom_tags(pkg.manifest.root))
    except ToolError as ex:
        report.add("G00", file=MANIFEST, line=0, reason=str(ex))
        return
    # The files the deploy validator validates: the manifest and, transitively, every XML file an
    # xlink:href reaches from it. A plain href (a style, a skin) is only checked to exist (G07).
    queue = [MANIFEST]
    seen: set[str] = set()
    while queue:
        path = queue.pop(0)
        if path in seen or path not in pkg.xml:
            continue
        seen.add(path)
        xf = pkg.xml[path]
        for err in schema.iter_errors(xf.root):
            reason = str(getattr(err, "reason", "") or err)
            elem = getattr(err, "elem", None)
            if _is_proxy_complaint(err, reason):
                report.add("G17", file=path, line=xf.line(elem) if elem is not None else 0)
                continue
            report.add("G00", file=path, line=xf.line(elem) if elem is not None else 0, reason=reason)
        for elem in xf.root.iter():
            href = elem.attrib.get(XLINK_HREF)
            if href:
                target = pkg.resolve(path, href)
                if target and target.lower().endswith(".xml"):
                    queue.append(target)


def _is_proxy_complaint(err: Exception, reason: str) -> bool:
    elem = getattr(err, "elem", None)
    if elem is not None and local_name(elem.tag) == "operation" and elem.attrib.get("name") == "channel":
        return "'proxy'" in reason
    return False


def rule_g01(pkg: Package, report: Report) -> None:
    if MANIFEST not in pkg.files:
        report.add("G01", file=MANIFEST, detail="there is no index.xml at the package root")
        return
    if MANIFEST in pkg.parse_errors:
        return
    xf = pkg.xml.get(MANIFEST)
    if xf is None or local_name(xf.root.tag) != "application":
        tag = local_name(xf.root.tag) if xf is not None else "?"
        report.add("G01", file=MANIFEST, line=1, detail=f"the root element is <{tag}>, not <application>")
        return
    about = xf.root.find("./about")
    if about is None:
        report.add("G01", file=MANIFEST, line=1, detail="the manifest has no <about> element")
    elif not about.attrib.get("version"):
        report.add("G01", file=MANIFEST, line=xf.line(about), detail="<about> has no version attribute")
    for proc in pkg.manifest_processes:
        if "version" in proc.attrib:
            report.add("G01", file=MANIFEST, line=xf.line(proc), detail="<process> carries a version attribute")
    for path, pxf in pkg.process_files.items():
        if "version" in pxf.root.attrib:
            report.add("G01", file=path, line=pxf.line(pxf.root), detail="<process> carries a version attribute")


def rule_g02(pkg: Package, report: Report) -> None:
    for path in pkg.order:
        if posixpath.basename(path).lower() == "view.xml":
            report.add("G02", file=path, line=1, detail="a view file named view.xml")
    seen: dict[str, list[tuple[int, str]]] = {}
    for view in pkg.manifest_views:
        name = view.attrib.get("name", "")
        if name:
            seen.setdefault(name, []).append((pkg.manifest.line(view), view.attrib.get("screen", "")))
    for name, decls in seen.items():
        if len(decls) < 2:
            continue
        screens = [s for _, s in decls]
        if "" in screens or len(set(screens)) != len(screens):
            report.add("G02", file=MANIFEST, line=decls[1][0],
                       detail=f"view name {name!r} is declared {len(decls)} times without a distinct screen= on each")


def _expressions(value: str) -> list[str]:
    """The {…} expressions in an attribute value or text, braces balanced."""
    out: list[str] = []
    depth = 0
    start = -1
    for i, ch in enumerate(value):
        if ch == "{":
            if depth == 0:
                start = i + 1
            depth += 1
        elif ch == "}" and depth > 0:
            depth -= 1
            if depth == 0:
                out.append(value[start:i])
    return out


def rule_g03(pkg: Package, report: Report) -> None:
    allowed = report.grammar.allowed_functions
    for xf, root in pkg.view_docs() + pkg.process_docs():
        for elem in root.iter():
            if local_name(elem.tag) == "script":
                continue
            sources: list[str] = []
            for attr, value in elem.attrib.items():
                if local_name(attr) in ("select", "test", "match"):
                    sources.append(value)
                sources.extend(_expressions(value))
            if elem.text:
                sources.extend(_expressions(elem.text))
            for source in sources:
                stripped = _QUOTED.sub("''", source)
                for m in _FUNCTION_CALL.finditer(stripped):
                    name = m.group(1)
                    if name not in allowed:
                        report.add("G03", file=xf.path, line=xf.line(elem), function=name)


def rule_g04(pkg: Package, report: Report) -> None:
    for xf, root in pkg.process_docs():
        for elem in root.iter():
            if local_name(elem.tag) == "operation" and elem.attrib.get("name") == "call" and "step" in elem.attrib:
                report.add("G04", file=xf.path, line=xf.line(elem))


def rule_g05(pkg: Package, report: Report) -> None:
    for xf, root in pkg.view_docs():
        for elem in root.iter():
            tag = local_name(elem.tag)
            if tag in ("select", "option", "a") and not elem.tag.startswith("{"):
                report.add("G05", file=xf.path, line=xf.line(elem), tag=tag)


def rule_g06(pkg: Package, report: Report) -> None:
    for xf, root in pkg.process_docs():
        scripts = [s for s in root if local_name(s.tag) == "script" and s.attrib.get("href")]
        if not scripts:
            continue
        if not any(local_name(s.tag) == "step" and s.attrib.get("id") == "start" for s in root):
            report.add("G06", file=xf.path, line=xf.line(scripts[0]))


def rule_g07(pkg: Package, report: Report) -> None:
    for path, xf in pkg.xml.items():
        for elem in xf.root.iter():
            for attr in ("href", XLINK_HREF):
                href = elem.attrib.get(attr)
                if href is None:
                    continue
                if elem.tag.startswith("{" + XSL_NS) and local_name(elem.tag) not in ("import", "include"):
                    continue
                target = pkg.resolve(path, href)
                attr_name = "xlink:href" if attr == XLINK_HREF else "href"
                if target is None:
                    report.add("G07", file=path, line=xf.line(elem), attr=attr_name, href=href,
                               detail="escapes the package root")
                elif target and target not in pkg.files:
                    report.add("G07", file=path, line=xf.line(elem), attr=attr_name, href=href,
                               detail="does not resolve to a file in the package")


def rule_g08(pkg: Package, report: Report) -> None:
    if pkg.manifest is None:
        return
    native = native_component_names()
    for comp in pkg.manifest.root.findall("./components/component"):
        tag = (comp.attrib.get("tag") or comp.attrib.get("name") or "").strip()
        if tag == "":
            continue
        if not _NCNAME.match(tag):
            report.add("G08", file=MANIFEST, line=pkg.manifest.line(comp), detail=f"component tag {tag!r} is not an XML name")
        elif tag in native:
            report.add("G08", file=MANIFEST, line=pkg.manifest.line(comp), severity="warning",
                       detail=f"component tag {tag!r} shadows a native component of the same name")


def rule_g09(pkg: Package, report: Report) -> None:
    for path in pkg.order:
        text = pkg.files[path]
        for i, ch in enumerate(text):
            if ord(ch) > 0x7F:
                report.add("G09", file=path, line=text.count("\n", 0, i) + 1)
                break


def rule_g10(pkg: Package, report: Report) -> None:
    # colours outside the theme
    for path in pkg.order:
        is_view = path in pkg.view_files
        is_style = path.lower().endswith(STYLE_EXTENSIONS) or path.lower().endswith((".xsl", ".xslt"))
        if not (is_view or is_style):
            continue
        stripped = _CSS_VAR.sub("var()", pkg.files[path])
        m = _HEX_COLOUR.search(stripped)
        if m:
            report.add("G10", file=path, line=stripped.count("\n", 0, m.start()) + 1,
                       detail=f"{path}: a hex colour outside the token theme")
    if pkg.manifest is not None:
        for view in pkg.manifest_views:
            if not len(view):
                continue
            for elem in view.iter():
                for value in elem.attrib.values():
                    if _HEX_COLOUR.search(_CSS_VAR.sub("var()", value)):
                        report.add("G10", file=MANIFEST, line=pkg.manifest.line(elem),
                                   detail="a hex colour in an inline view, outside the token theme")
                        break
        themes = [t for t in pkg.manifest.root if local_name(t.tag) == "theme"]
        token_themes = [t for t in themes if t.attrib.get("tokens", "").lower() == "true"]
        if len(token_themes) == 0:
            report.add("G10", file=MANIFEST, line=1, detail="no <theme tokens=\"true\"> token block in the manifest")
        elif len(token_themes) > 1:
            report.add("G10", file=MANIFEST, line=pkg.manifest.line(token_themes[1]),
                       detail=f"{len(token_themes)} token themes; exactly one is scoped to the app")
        else:
            theme = token_themes[0]
            tokens = theme.find("./tokens")
            if tokens is None or len(tokens) == 0:
                report.add("G10", file=MANIFEST, line=pkg.manifest.line(theme), detail="the token theme has no <tokens> knobs")
            else:
                names = {local_name(t.tag) for t in tokens}
                if not names & {"font-sans", "font-family"}:
                    report.add("G10", file=MANIFEST, line=pkg.manifest.line(tokens),
                               detail="the token theme does not declare a font family (font-sans)")
                for t in tokens:
                    if "var(" in (t.text or ""):
                        report.add("G10", file=MANIFEST, line=pkg.manifest.line(t),
                                   detail=f"token {local_name(t.tag)} is not a literal value")
                        break


def _is_platform_host(host: str) -> bool:
    host = host.lower().split(":")[0]
    return any(host == h.lstrip(".") or host.endswith(h) for h in PLATFORM_HOSTS)


def rule_g11(pkg: Package, report: Report) -> None:
    for path in pkg.order:
        if not path.lower().endswith(SCRIPT_EXTENSIONS):
            continue
        text = pkg.files[path]
        for m in _FETCH_EXTERNAL.finditer(text):
            if not _is_platform_host(m.group(2)):
                report.add("G11", file=path, line=text.count("\n", 0, m.start()) + 1,
                           detail=f"fetch() to {m.group(2)}")
        if _XHR_NEW.search(text):
            for m in _XHR_OPEN.finditer(text):
                if not _is_platform_host(m.group(2)):
                    report.add("G11", file=path, line=text.count("\n", 0, m.start()) + 1,
                               detail=f"XMLHttpRequest to {m.group(2)}")


def rule_g12(pkg: Package, report: Report) -> None:
    for path in pkg.order:
        text = pkg.files[path]
        for kind, pattern in _SECRET_SHAPES:
            m = pattern.search(text)
            if m:
                report.add("G12", file=path, line=text.count("\n", 0, m.start()) + 1, kind=kind)


def rule_g13(pkg: Package, report: Report) -> None:
    if not pkg.tenant_target:
        return
    for xf, root in pkg.process_docs():
        guarded: set[int] = set()
        for elem in root.iter():
            if local_name(elem.tag) in ("when", "otherwise"):
                for inner in elem.iter():
                    guarded.add(id(inner))
        for elem in root.iter():
            if local_name(elem.tag) != "operation" or elem.attrib.get("name") not in ("database", "change", "save"):
                continue
            value = elem.attrib.get("value", "")
            if not value.startswith("home://"):
                continue
            writes = elem.attrib.get("name") != "database" or any(local_name(c.tag) in ("create", "delete", "copy", "move", "rename") for c in elem)
            if writes and id(elem) not in guarded:
                report.add("G13", file=xf.path, line=xf.line(elem), href=value)


def rule_g14(pkg: Package, report: Report) -> None:
    for path, xf in pkg.xml.items():
        if not path.lower().endswith((".xsl", ".xslt")):
            continue
        for elem in xf.root.iter():
            if elem.tag == "{%s}apply-templates" % XSL_NS:
                if "select" in elem.attrib:
                    report.add("G14", file=path, line=xf.line(elem), detail="xsl:apply-templates over a node set")
                else:
                    report.add("G14", file=path, line=xf.line(elem), severity="warning", detail="xsl:apply-templates")
            elif local_name(elem.tag) == "br" and not elem.tag.startswith("{" + XSL_NS):
                report.add("G14", file=path, line=xf.line(elem), detail="a <br/>, which renders as two line breaks")


def rule_g15(pkg: Package, report: Report) -> None:
    limit = report.grammar.limits["font_file_warning_bytes"]
    for path in pkg.order:
        if path.lower().endswith(FONT_EXTENSIONS):
            size = len(pkg.files[path].encode("utf-8"))
            if size > limit:
                report.add("G15", file=path, size=size)


def rule_g16(pkg: Package, report: Report) -> None:
    limits = report.grammar.limits
    if len(pkg.order) > limits["max_files"]:
        report.add("G16", detail=f"{len(pkg.order)} files, the limit is {limits['max_files']}")
    total = 0
    for path in pkg.order:
        text = pkg.files[path]
        size = len(text.encode("utf-8"))
        total += size
        if size > limits["max_file_bytes"]:
            report.add("G16", file=path, detail=f"{path} is {size} bytes, the limit is {limits['max_file_bytes']} per file")
        head = text[:4096]
        control = sum(1 for c in head if ord(c) < 0x20 and c not in "\t\n\r")
        if "\x00" in head or (head and control / len(head) > 0.05):
            report.add("G16", file=path, detail=f"{path} is not a text file")
    if total > limits["max_total_bytes"]:
        report.add("G16", detail=f"{total} bytes in all, the limit is {limits['max_total_bytes']}")


def rule_g17(pkg: Package, report: Report) -> None:
    # The vendored schema is lax about a channel operation's children, so the proxy is found
    # here by walking every process; G00 adds the same finding only if the schema complains,
    # and Report.add drops the duplicate.
    for xf, root in pkg.process_docs():
        for elem in root.iter():
            if local_name(elem.tag) == "operation" and elem.attrib.get("name") == "channel":
                if any(local_name(c.tag) == "proxy" for c in elem):
                    report.add("G17", file=xf.path, line=xf.line(elem))


def rule_g18(pkg: Package, report: Report) -> None:
    if pkg.manifest is not None:
        name = pkg.manifest.root.attrib.get("name", "")
        if name and not _DEPLOYMENT_NAME.match(name):
            report.add("G18", file=MANIFEST, line=1,
                       detail=f"the application name {name!r} is not [a-z0-9]+, so it cannot be the deployment name as it is")
        elif name.startswith("xios"):
            report.add("G18", file=MANIFEST, line=1, detail=f"the application name {name!r} begins with xios")
    for path in pkg.order:
        top = path.split("/")[0]
        if "/" in path and top.lower().startswith("xios"):
            report.add("G18", file=path, detail=f"the folder {top!r} begins with xios, which the host's robots.txt disallows")
            break


def rule_g19(pkg: Package, report: Report) -> None:
    if not pkg.view_names:
        return
    for xf, root in pkg.process_docs():
        for elem in root.iter():
            tag = local_name(elem.tag)
            if tag == "trigger" and "view" in elem.attrib:
                view, comp = elem.attrib["view"], elem.attrib.get("component", "")
                if "{" in view or "{" in comp:
                    continue
                if view not in pkg.view_names:
                    report.add("G19", file=xf.path, line=xf.line(elem), detail=f"trigger names view {view!r}, which no view declares")
                elif comp and comp not in pkg.view_components.get(view, set()):
                    report.add("G19", file=xf.path, line=xf.line(elem), detail=f"trigger names component {comp!r}, which view {view!r} does not have")
            if tag == "component" and "view" in elem.attrib and "name" in elem.attrib:
                view, comp = elem.attrib["view"], elem.attrib["name"]
                if "{" in view or "{" in comp:
                    continue
                if view not in pkg.view_names:
                    report.add("G19", file=xf.path, line=xf.line(elem), detail=f"<component view={view!r}> names a view no view declares")
                elif comp not in pkg.view_components.get(view, set()):
                    report.add("G19", file=xf.path, line=xf.line(elem), detail=f"component {comp!r} is not in view {view!r}")
            if tag == "operation" and elem.attrib.get("name") in ("action",) and elem.attrib.get("value", "").startswith("#"):
                view = elem.attrib["value"][1:].split("#")[0]
                if "{" not in view and view in pkg.view_names:
                    for child in elem:
                        if local_name(child.tag) == "component":
                            comp = child.attrib.get("name", "")
                            if comp and "{" not in comp and comp not in pkg.view_components.get(view, set()):
                                report.add("G19", file=xf.path, line=xf.line(child), detail=f"component {comp!r} is not in view {view!r}")
                elif "{" not in view and view:
                    report.add("G19", file=xf.path, line=xf.line(elem), detail=f"action on view {view!r}, which no view declares")
            sources = list(elem.attrib.values()) + ([elem.text] if elem.text else [])
            for source in sources:
                for m in _VIEW_COMPONENT_REF.finditer(source):
                    view, comp = m.group(1), m.group(2)
                    if view not in pkg.view_names:
                        report.add("G19", file=xf.path, line=xf.line(elem), detail=f"#{view}#{comp} names view {view!r}, which no view declares")
                    elif comp not in pkg.view_components.get(view, set()):
                        report.add("G19", file=xf.path, line=xf.line(elem), detail=f"#{view}#{comp}: component {comp!r} is not in view {view!r}")


def rule_g20(pkg: Package, report: Report) -> None:
    if pkg.manifest is None or pkg.manifest.root.find("./login") is None:
        return
    xf = pkg.manifest
    login_procs = [p for p in pkg.manifest_processes if p.attrib.get(XLINK_HREF, "").strip() == LOGIN_PROCESS_HREF]
    others = [p for p in pkg.manifest_processes if p not in login_procs]
    if not login_procs:
        report.add("G20", file=MANIFEST, line=xf.line(xf.root.find("./login")),
                   detail="<login> is declared but no <process xlink:href=\"xios://apps/login.xml\"/> loads the login application")
    else:
        login = login_procs[0]
        if login.attrib.get(XLINK_ACTUATE, "") != "onLoad":
            report.add("G20", file=MANIFEST, line=xf.line(login), detail="the login process must have xlink:actuate=\"onLoad\"")
        if others and xf.line(others[0]) < xf.line(login):
            report.add("G20", file=MANIFEST, line=xf.line(others[0]), detail="the main process precedes the login process")
    for proc in others:
        if proc.attrib.get(XLINK_ACTUATE, "") != "onRequest":
            report.add("G20", file=MANIFEST, line=xf.line(proc), detail="the app's own <process> must have xlink:actuate=\"onRequest\"")
    for view in pkg.manifest_views:
        if view.attrib.get(XLINK_ACTUATE, "") != "onRequest":
            report.add("G20", file=MANIFEST, line=xf.line(view), detail="the app's own <view> must have xlink:actuate=\"onRequest\"")


RULES: dict[str, RuleFn] = {
    "G00": rule_g00, "G01": rule_g01, "G02": rule_g02, "G03": rule_g03, "G04": rule_g04,
    "G05": rule_g05, "G06": rule_g06, "G07": rule_g07, "G08": rule_g08, "G09": rule_g09,
    "G10": rule_g10, "G11": rule_g11, "G12": rule_g12, "G13": rule_g13, "G14": rule_g14,
    "G15": rule_g15, "G16": rule_g16, "G17": rule_g17, "G18": rule_g18, "G19": rule_g19,
    "G20": rule_g20,
}


# ---------------------------------------------------------------- the entry point

def stats_for(pkg: Package) -> dict[str, Any]:
    by_type: dict[str, dict[str, int]] = {}
    total = 0
    for path in pkg.order:
        size = len(pkg.files[path].encode("utf-8"))
        total += size
        ext = pkg.extension(path) or "(none)"
        entry = by_type.setdefault(ext, {"files": 0, "bytes": 0})
        entry["files"] += 1
        entry["bytes"] += size
    return {"files": len(pkg.order), "bytes": total, "by_type": dict(sorted(by_type.items()))}


def lint(files: list[tuple[str, str]], profile: str = "build", rules: list[str] | None = None,
         *, tenant_target: bool | None = None, deployment_name: str | None = None) -> dict[str, Any]:
    """The lint result for `files` (path, content pairs). `tenant_target` overrides what the
    manifest says about where the package is going (the tenant endpoint knows); `deployment_name`
    is checked by G18 when given."""
    grammar = load_grammar()
    if profile not in PROFILES:
        raise ToolError(f"profile must be one of {', '.join(PROFILES)}")
    if not files:
        raise ToolError("Missing files, there is nothing to lint")
    if rules:
        unknown = [r for r in rules if r not in grammar.rules]
        if unknown:
            raise ToolError(f"Unknown rule id(s): {', '.join(unknown)}. Known: {', '.join(grammar.rules)}")
        active = set(rules)
    else:
        active = {r.id for r in grammar.rules.values() if r.profile == "build" or profile == "ship"}
    pkg = Package(files)
    if tenant_target is not None:
        pkg.tenant_target = tenant_target
    report = Report(grammar, active | ({"G17"} if "G00" in active else set()))
    for rule_id in sorted(active):
        RULES[rule_id](pkg, report)
    if deployment_name and "G18" in active:
        if not _DEPLOYMENT_NAME.match(deployment_name):
            report.add("G18", detail=f"deployment name {deployment_name!r} is not [a-z0-9]+")
        elif deployment_name.startswith("xios"):
            report.add("G18", detail=f"deployment name {deployment_name!r} begins with xios")
    for bucket in report.findings.values():
        bucket.sort(key=lambda f: (f["rule"], f["file"], f["line"]))
    return {
        "ok": len(report.findings["error"]) == 0,
        "profile": profile,
        "grammar_version": grammar.version,
        "rules_run": sorted(active),
        "errors": report.findings["error"],
        "warnings": report.findings["warning"],
        "info": report.findings["info"],
        "stats": stats_for(pkg),
        "xpath_functions_status": grammar.functions_status,
    }


# ---------------------------------------------------------------- the tool

def init(mcp: Any) -> None:
    """lint_project: the files travel in the request."""
    from mcp.types import ToolAnnotations

    @mcp.tool(
        title="Lint a project against the tenant grammar",
        annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False),
    )
    def lint_project(  # pyright: ignore[reportUnusedFunction]
        files: list[LintFile],
        profile: Profile = "build",
        rules: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        The tenant grammar checked on a XIOS/3 package held in the request: the XSD validation
        upload_project runs (G00) and twenty rules the schemas cannot express (G01-G20), each with
        the file, the line, a message and the fix. `profile` is `build` (what must hold before an
        upload) or `ship` (build plus what the served files must satisfy on a webshare); `rules`
        narrows the run to the ids listed. The result says whether the package is free of errors,
        lists errors, warnings and information separately, and carries the package's size by file
        type and the grammar's version. Nothing is written anywhere.
        """
        return lint([(f.path, f.content) for f in files], profile, rules)

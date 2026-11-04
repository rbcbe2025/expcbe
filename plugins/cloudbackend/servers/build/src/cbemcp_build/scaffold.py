"""scaffold_project: the design kit's first version of an app, as a pure function.

The xios3-app-design skill ships `designkit.py`, whose `app` command writes a complete first
version — manifest with a token theme, desktop and phone views, the process, a detail stylesheet,
the kit's two components, sample data — with the placeholders filled in. That generator is vendored
here unchanged (`designkit/`, see `sync-designkit.sh`) and called into a temporary directory, so a
client with no file system (claude.ai) gets exactly the files the shell command would write. On top
of that base the spec's extras are applied as insertions at fixed anchors in the generated files:
extra record fields, a login screen, extra screens in the navigation, proxy channels, a locale
file, and the files the advanced package layout expects beyond the kit (`layout/theme.xml`,
`images/logo.svg`, `llms.txt`).

Deterministic: the same spec gives the same files. Nothing is written outside the temporary
directory, which is removed before returning.
"""
from __future__ import annotations

import importlib.util
import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, Field

from mcp.server.mcpserver.exceptions import ToolError

KIT_DIR = os.path.join(os.path.dirname(__file__), "designkit")
KIT_SCRIPT = os.path.join(KIT_DIR, "scripts", "designkit.py")

# The record's spine: what the kit's example already has a column, a field and a line for.
SPINE_FIELDS = ("title", "status", "notes", "created")
_NCNAME = re.compile(r"^[A-Za-z_][A-Za-z0-9_-]*$")

FieldType = Literal["string", "text", "number", "date", "enum"]


class FieldSpec(BaseModel):
    name: str = Field(description="The element name of the field inside the record, an XML name, eg. 'customer'.")
    type: FieldType = Field(default="string", description="string (one line), text (multi-line), number, date, or enum with values.")
    label: str | None = Field(default=None, description="What the field is called on screen; defaults to the capitalised name.")
    values: list[str] | None = Field(default=None, description="For enum: the allowed values, shown as a hint.")


class ItemSpec(BaseModel):
    kind: str = Field(default="item", description="What one record is called, eg. 'project'.")
    fields: list[FieldSpec] = Field(default_factory=list, description="The record's fields beyond title, status, notes and created, which every record has.")


class DataSpec(BaseModel):
    scope: Literal["home", "tenant"] = Field(default="home", description="Which drive holds the records: home (the identity's own) or tenant (shared).")
    path: str | None = Field(default=None, description="The container path under the drive, eg. 'Planboard/Projects'. Defaults to <App>/<Kind>s.")
    sample: bool = Field(default=False, description="True binds the list to the bundled sample data instead of the container, so the app can be tried before a tenant exists.")


class ThemeSpec(BaseModel):
    direction: str | None = Field(default=None, description="ledger, studio, clinic, field, night or paper. Picked from the idea when omitted.")
    primary: str | None = Field(default=None, description="Override the primary seed, eg. '#4f46e5' (checked for contrast).")
    seeds: dict[str, str] | None = Field(default=None, description="Override any seeds by name (primary, on-primary, surface, ...); each on-colour is checked at 4.5:1.")


class LoginSpec(BaseModel):
    title: str | None = None
    description: str | None = None
    copyright: str | None = None
    create: str | None = Field(default=None, description="Text of the sign-up link; omit on a tenant without the CRM module.")
    reset: str | None = Field(default=None, description="Text of the password-reset link; omit on a tenant without the CRM module.")


class ChannelSpec(BaseModel):
    name: str = Field(description="The channel's protocol prefix, used as name:// in callService. Not xios, host or icon.")
    proxy: str = Field(description="The name of the proxy configured in the CloudBackend PaaS console.")
    title: str | None = None


class ScaffoldSpec(BaseModel):
    app: str = Field(description="The product name, eg. 'Planboard'. Its slug (lowercase letters and digits) becomes the application and deployment name.")
    title: str | None = Field(default=None, description="The window title; defaults to app.")
    idea: str | None = Field(default=None, description="One sentence: what it does, for whom. Picks the design direction.")
    item: ItemSpec = Field(default_factory=ItemSpec)
    data: DataSpec = Field(default_factory=DataSpec)
    screens: list[str] = Field(default_factory=list, description="Screens beyond the record list; each becomes a navigation entry to fill in.")
    theme: ThemeSpec = Field(default_factory=ThemeSpec)
    login: LoginSpec | bool | None = Field(default=None, description="A login screen: true for the defaults, or the texts.")
    locale: str | None = Field(default=None, description="A locale code, eg. 'en_US': writes locale/<code>.xml with the app's strings as keys.")
    channels: list[ChannelSpec] = Field(default_factory=list, description="Proxy channels for external APIs; each is declared in the process's start step.")


_kit = None


def kit():
    """The vendored designkit module, loaded once from its file (it is a script, not a package)."""
    global _kit
    if _kit is None:
        spec = importlib.util.spec_from_file_location("cbemcp_designkit", KIT_SCRIPT)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"cannot load the vendored design kit at {KIT_SCRIPT}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        _kit = module
    return _kit


def ascii_xml(text: str) -> str:
    """Text for an XML document with nothing above 0x7F: markup-significant characters escaped,
    the rest as numeric character references (a webshare labels an ASCII file ISO-8859-1)."""
    out = []
    for ch in text:
        if ch == "&":
            out.append("&amp;")
        elif ch == "<":
            out.append("&lt;")
        elif ch == ">":
            out.append("&gt;")
        elif ch == '"':
            out.append("&quot;")
        elif ord(ch) > 0x7F:
            out.append(f"&#{ord(ch)};")
        else:
            out.append(ch)
    return "".join(out)


def ascii_refs(text: str) -> str:
    """Non-ASCII characters in an already-escaped XML text replaced by character references."""
    return "".join(f"&#{ord(c)};" if ord(c) > 0x7F else c for c in text)


def ascii_plain(text: str) -> str:
    """Non-ASCII characters in a plain-text file replaced by '?'-free approximations: dropped
    accents where unicodedata knows them, '?' otherwise."""
    import unicodedata
    out = []
    for ch in text:
        if ord(ch) <= 0x7F:
            out.append(ch)
            continue
        base = unicodedata.normalize("NFKD", ch)
        stripped = "".join(c for c in base if ord(c) <= 0x7F)
        out.append(stripped or "?")
    return "".join(out)


def slugify(name: str) -> str:
    return kit().slugify(name)


def _label(field: FieldSpec) -> str:
    return field.label or field.name.replace("_", " ").replace("-", " ").capitalize()


def _replace_once(files: dict[str, str], path: str, anchor: str, replacement: str, *, every: bool = False) -> None:
    text = files[path]
    if anchor not in text:
        raise RuntimeError(f"scaffold: anchor not found in {path}: {anchor[:60]!r} (the vendored example drifted; run sync-designkit.sh and update the anchors)")
    files[path] = text.replace(anchor, replacement) if every else text.replace(anchor, replacement, 1)


def render_base(design: dict[str, Any], items_url: str, sample_url: str | None) -> dict[str, str]:
    """The kit's `app` output, read back from a temporary directory: one source for the files."""
    files: dict[str, str] = {}
    with tempfile.TemporaryDirectory(prefix="cbemcp-scaffold-") as tmp:
        out = Path(tmp) / "app"
        kit().write_app(design, out, items=items_url, sample=sample_url, force=True)
        for f in sorted(out.rglob("*")):
            if f.is_file():
                files[f.relative_to(out).as_posix()] = f.read_text(encoding="utf-8")
    return files


def apply_fields(files: dict[str, str], fields: list[FieldSpec], kind: str) -> list[str]:
    extras = [f for f in fields if f.name.lower() not in SPINE_FIELDS]
    if not extras:
        return []
    for f in extras:
        if not _NCNAME.match(f.name):
            raise ToolError(f"field name {f.name!r} is not an XML name (letters, digits, '-', '_')")
    names = {f.name for f in extras}
    if len(names) != len(extras):
        raise ToolError("field names must be unique")
    # the edit controls, in both views, before the Save/Delete row
    desktop_inputs = []
    phone_inputs = []
    for f in extras:
        label = ascii_refs(ascii_xml(_label(f)))
        hint = label
        if f.type == "enum" and f.values:
            hint = f"{label} ({', '.join(ascii_refs(ascii_xml(v)) for v in f.values)})"
        elif f.type == "date":
            hint = f"{label} (yyyy-mm-dd)"
        elif f.type == "number":
            hint = f"{label} (a number)"
        if f.type == "text":
            desktop_inputs.append(f'          <textarea name="{f.name}Input" width="100%" height="80" placeholder="{hint}"/>')
            phone_inputs.append(f'          <textarea name="{f.name}Input" width="100%" height="80" placeholder="{hint}"/>')
        else:
            desktop_inputs.append(f'          <input name="{f.name}Input" width="100%" placeholder="{hint}"/>')
            phone_inputs.append(f'          <input name="{f.name}Input" width="100%" placeholder="{hint}"/>')
    anchor = '          <panel name="actions" type="columns" width="100%" gap="8">'
    _replace_once(files, "views/app.xml", anchor, "\n".join(desktop_inputs) + "\n" + anchor)
    _replace_once(files, "views/app-phone.xml", anchor, "\n".join(phone_inputs) + "\n" + anchor)
    # the detail stylesheet: one line per field, before the Created line
    xsl_anchor = '        <p class="dk-muted">Created <xsl:value-of select="created"/></p>'
    xsl_lines = "".join(
        f'        <p class="dk-body">{ascii_refs(ascii_xml(_label(f)))}: <xsl:value-of select="{f.name}"/></p>\n' for f in extras)
    _replace_once(files, "xsl/detail.xsl", xsl_anchor, xsl_lines + xsl_anchor)
    # the process: bind on show, store on save (both branches), elements on create
    bind_anchor = ('    <operation name="bind" value="{$itemUrl}">\n'
                   '      <component view="App" name="notesInput" select="/item/notes"/>\n'
                   '    </operation>\n')
    binds = "".join(
        '    <operation name="bind" value="{$itemUrl}">\n'
        f'      <component view="App" name="{f.name}Input" select="/item/{f.name}"/>\n'
        '    </operation>\n' for f in extras)
    _replace_once(files, "processes/app.xml", bind_anchor, bind_anchor + binds)
    store_anchor = ('        <operation name="change" value="{$itemUrl}">\n'
                    '          <store select="/item/notes" type="replaceText">{#App#notesInput}</store>\n'
                    '        </operation>\n')
    stores = "".join(
        '        <operation name="change" value="{$itemUrl}">\n'
        f'          <store select="/item/{f.name}" type="replaceText">{{#App#{f.name}Input}}</store>\n'
        '        </operation>\n' for f in extras)
    if files["processes/app.xml"].count(store_anchor) != 2:
        raise RuntimeError("scaffold: the save step no longer has its two branches (the vendored example drifted)")
    _replace_once(files, "processes/app.xml", store_anchor, store_anchor + stores, every=True)
    elements = "".join(f"<{f.name}></{f.name}>" for f in extras)
    create_anchor = "<notes></notes><created>{$stamp}</created></item>"
    _replace_once(files, "processes/app.xml", create_anchor, f"<notes></notes>{elements}<created>{{$stamp}}</created></item>")
    # the sample records and the New document
    for path in ("data/new.xml", "data/item1.xml", "data/item2.xml", "data/item3.xml"):
        text = files[path]
        m = re.search(r"</notes><created>", text)
        if not m:
            raise RuntimeError(f"scaffold: {path} has no notes/created pair (the vendored example drifted)")
        files[path] = text[:m.start()] + "</notes>" + elements + "<created>" + text[m.end():]
    return [f.name for f in extras]


def apply_screens(files: dict[str, str], screens: list[str], items_title: str, item_kind: str) -> list[str]:
    extra = [s for s in screens if s.strip() and s.strip().lower() not in (items_title.lower(), item_kind.lower() + "s", "list", "detail", "new")]
    if not extra:
        return []
    seen: set[str] = set()
    items = []
    for s in extra:
        slug = slugify(s)
        if slug in seen or slug == "items":
            continue
        seen.add(slug)
        items.append(f'          <item name="{slug}" text="{ascii_refs(ascii_xml(s.strip()))}" icon="icon://folders2?color=primary"/>')
    anchor = ('          <item name="people" text="People" icon="icon://folders2?color=primary"/>\n'
              '          <item name="settings" text="Settings" icon="icon://note?color=primary"/>')
    for path in ("views/app.xml", "views/app-phone.xml"):
        _replace_once(files, path, anchor, "\n".join(items))
    return sorted(seen)


def apply_login(files: dict[str, str], login: LoginSpec, title: str) -> None:
    text = files["index.xml"]
    for view in ('<view name="App" screen="phone" xlink:actuate="onLoad" xlink:href="views/app-phone.xml"/>',
                 '<view name="App" screen="(min-width: 601px)" xlink:actuate="onLoad" xlink:href="views/app.xml"/>'):
        if view not in text:
            raise RuntimeError("scaffold: the manifest's view declarations drifted")
        text = text.replace(view, view.replace('xlink:actuate="onLoad"', 'xlink:actuate="onRequest"'))
    process = '  <process xlink:actuate="onLoad" xlink:href="processes/app.xml"/>'
    if process not in text:
        raise RuntimeError("scaffold: the manifest's process declaration drifted")
    text = text.replace(process, '  <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>\n'
                                 '  <process xlink:actuate="onRequest" xlink:href="processes/app.xml"/>')
    lines = ["  <!-- The login screen: the login application loads first and opens the view after sign-in; the",
             "       console counts the screen as configured only after the Staging configurator has saved. -->",
             "  <login>",
             f"    <title>{ascii_refs(ascii_xml(login.title or title))}</title>",
             f"    <description>{ascii_refs(ascii_xml(login.description or 'Sign in to continue.'))}</description>"]
    if login.copyright:
        lines.append(f"    <copyright>{ascii_refs(ascii_xml(login.copyright))}</copyright>")
    if login.create:
        lines.append(f"    <create>{ascii_refs(ascii_xml(login.create))}</create>")
    if login.reset:
        lines.append(f"    <reset>{ascii_refs(ascii_xml(login.reset))}</reset>")
    lines.append("  </login>")
    anchor = "  <!-- Two layouts, one name:"
    if anchor not in text:
        raise RuntimeError("scaffold: the manifest's layout comment drifted")
    files["index.xml"] = text.replace(anchor, "\n".join(lines) + "\n\n" + anchor, 1)


def apply_channels(files: dict[str, str], channels: list[ChannelSpec]) -> None:
    for c in channels:
        if not _NCNAME.match(c.name) or c.name.lower() in ("xios", "host", "icon", "home", "tenant"):
            raise ToolError(f"channel name {c.name!r} is not usable as a protocol prefix")
    ops = []
    for c in channels:
        ops.append("    <!-- proxy channel: the Deploy Wizard reports proxy as an unexpected child and deploys with Deploy Anyway -->")
        ops.append('    <operation name="channel" value="">')
        ops.append(f"      <name>{ascii_refs(ascii_xml(c.name))}</name>")
        ops.append(f"      <proxy>{ascii_refs(ascii_xml(c.proxy))}</proxy>")
        ops.append(f"      <title>{ascii_refs(ascii_xml(c.title or c.name))}</title>")
        ops.append("      <protocol>PROXY</protocol>")
        ops.append('      <adapter path="/" type="CompactJSON"/>')
        ops.append("    </operation>")
    anchor = '  <step id="init">\n'
    _replace_once(files, "processes/app.xml", anchor, anchor + "\n".join(ops) + "\n")


def locale_file(design: dict[str, Any], items_title: str, item: str) -> str:
    strings = [
        design["app"], items_title, f"New {item}", f"Search {item}s", "Back", "Edit", "Save", "Delete", "Cancel",
        f"Pick a {item} to see it here.", design["voice"]["first_run"], design["voice"]["empty"],
        design["voice"]["saved"], design["voice"]["failed"],
    ]
    keys = "\n".join(f'  <key id="{ascii_refs(ascii_xml(s))}">{ascii_refs(ascii_xml(s))}</key>' for s in dict.fromkeys(strings))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            "<!-- The application's strings as keys. get-label('key') in a process and l:text=\"key\" in a view read\n"
            "     the value for the reader's language; a key with no translation falls back to the key itself. -->\n"
            f"<keys>\n{keys}\n</keys>\n")


def logo_svg(design: dict[str, Any]) -> str:
    font = ascii_xml(design["knobs"]["font-display"])
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 120" width="640" height="120" role="img"\n'
            f'     aria-label="{ascii_refs(ascii_xml(design["app"]))}">\n'
            '  <!-- A text mark until a logo file exists; the login screen needs a full https:// URL to it. -->\n'
            f'  <text x="0" y="84" font-family="{font}" font-size="72" font-weight="{design["knobs"]["weight-bold"]}"\n'
            f'        fill="{design["seeds"]["primary"]}">{ascii_refs(ascii_xml(design["app"]))}</text>\n'
            "</svg>\n")


def llms_txt(spec: ScaffoldSpec, design: dict[str, Any], items_url: str, screens: list[str], fields: list[str]) -> str:
    title = spec.title or spec.app
    idea = spec.idea or f"{title}, a {design['direction_name'].lower()}-style application"
    lines = [
        f"# {title}",
        "",
        f"> {idea}. Built with XIOS/3 on CloudBackend PaaS.",
        "",
        "## What it does",
        f"- Records: {spec.item.kind}s with a title, a status, notes and a created date"
        + (f", plus {', '.join(fields)}" if fields else "") + f"; stored in {items_url}.",
        "- Screens: a list with search and an empty state, the detail of one record with its fields to edit, New / Save / Delete."
        + (f" Planned: {', '.join(screens)}." if screens else ""),
        f"- Login: {'a sign-in screen' if spec.login else 'none; the deployment decides who can open it'}.",
        f"- Look: the {design['direction_name']} direction ({design['tone']}), a token theme the runtime derives every hover and border from.",
        "",
        "## Files",
        "- /index.xml: the application manifest (the token theme, the two views, the process)",
        "- /views/app.xml and /views/app-phone.xml: the desktop and the phone layout, one name",
        "- /processes/app.xml: the logic (bind, create, change + save, delete)",
        "- /xsl/detail.xsl: the detail of one record",
        "- /layout/theme.xml: the token theme on its own, for designkit.py check",
        "- /images/logo.svg: the text mark",
        "",
        "This file is the real /llms.txt of the application; every other unknown path on this host answers the boot page.",
    ]
    return ascii_plain("\n".join(lines)) + "\n"


def scaffold(spec: ScaffoldSpec) -> dict[str, Any]:
    dk = kit()
    title = spec.title or spec.app
    item = spec.item.kind.strip() or "item"
    if not _NCNAME.match(item) or " " in item:
        raise ToolError("item.kind must be one word (letters, digits, '-', '_')")
    try:
        design = dk.make_design(spec.app, spec.idea or title, item, spec.theme.direction, spec.theme.primary)
        if spec.theme.seeds:
            unknown = [k for k in spec.theme.seeds if k not in dk.SEED_ORDER]
            if unknown:
                raise ToolError(f"unknown seed(s) {', '.join(unknown)}; the seeds are {', '.join(dk.SEED_ORDER)}")
            design["seeds"].update(spec.theme.seeds)
            problems = dk.check_seeds(design["seeds"])
            if problems:
                raise ToolError("contrast: " + "; ".join(problems))
    except SystemExit as ex:
        raise ToolError(str(ex)) from ex
    if title != spec.app:
        design["app"] = title  # the kit prints design["app"] as the title; the slug stays the app's
        design["slug"] = dk.slugify(spec.app)
    slug = design["slug"]
    items_path = (spec.data.path or f"{design['app']}/{item.capitalize()}s").strip("/")
    items_url = f"{spec.data.scope}://{items_path}"
    sample_url = f"home://Applications/{slug}/data/items.xml" if spec.data.sample else None

    files = render_base(design, items_url, sample_url)
    notes: list[str] = []
    fields = apply_fields(files, spec.item.fields, item)
    if fields:
        notes.append(f"Fields {', '.join(fields)} were added to both views, the detail stylesheet, the save step and the sample records as plain inputs; an enum shows its values as a hint, so give it a combobox by hand if a list is wanted.")
    screens = apply_screens(files, spec.screens, item.capitalize() + "s", item)
    if screens:
        notes.append(f"Navigation entries {', '.join(screens)} are placeholders: each needs a view of its own and a step in navPick.")
    if spec.login:
        login = spec.login if isinstance(spec.login, LoginSpec) else LoginSpec()
        apply_login(files, login, title)
        notes.append("The manifest declares the login screen (G20 order). The console counts it as configured only after the Staging card's Configure Login Page has saved; the logo there must be a full https:// URL on the Staging host, eg. https://<staging host>/images/logo.svg.")
        if login.create or login.reset:
            notes.append("create and reset show their links whatever the tenant has; on a tenant without the CRM module they lead into flows that cannot finish.")
    if spec.channels:
        apply_channels(files, spec.channels)
        notes.append(f"Channel(s) {', '.join(c.name for c in spec.channels)} are proxy channels declared in the start step with an empty value: the Deploy Wizard reports 'proxy is not a valid child of operation' and the deployment goes through with Deploy Anyway; the domain, headers, path and the key live in the console's proxy configuration, never in the package. Call them with callService through <name>://.")
    if spec.locale:
        code = spec.locale.strip()
        if not re.match(r"^[A-Za-z]{2,3}(_[A-Za-z]{2})?$", code):
            raise ToolError("locale must look like en_US or sv")
        files[f"locale/{code}.xml"] = locale_file(design, item.capitalize() + "s", item)
        _replace_once(files, "index.xml", "  <settings/>", f"  <settings>\n    <locale>locale/{code}.xml</locale>\n  </settings>")
        notes.append(f"locale/{code}.xml holds the strings as keys with the same text as values; translate the values, add xmlns:l=\"https://xios3.com/lang\" to <application> and prefix the attributes to localise (l:text, l:placeholder).")
    files["layout/theme.xml"] = dk.theme_xml(design) + "\n"
    files["images/logo.svg"] = logo_svg(design)
    files["llms.txt"] = llms_txt(spec, design, items_url, screens, fields)
    # ASCII everywhere a webshare serves text: references in XML, and the plain-text files
    for path in list(files):
        if path.endswith((".xml", ".xsl", ".svg")):
            files[path] = ascii_refs(files[path])
        elif path.endswith((".txt", ".md", ".css", ".js")):
            files[path] = ascii_plain(files[path])
    if slug.startswith("xios"):
        notes.append(f"The slug {slug!r} begins with xios; the host's robots.txt disallows it and /xios/ is the runtime's path, so deploy under another deployment name (G18).")
    if spec.data.sample:
        notes.append("Sample mode: the list is bound to data/items.xml and New / Save / Delete say so instead of writing; set data.sample to false for the container.")
    else:
        notes.append(f"The list is bound to {items_url}; the start step creates the container on first run when it does not exist.")
    notes.append(f"{len(files)} files; the package root is the project. lint_project(profile=build) on these files before upload_project, profile ship before a promotion.")
    notes.extend(schema_notes(files))
    return {
        "files": [{"path": p, "content": files[p]} for p in sorted(files)],
        "notes": notes,
        "design": {
            "direction": design["direction"], "direction_name": design["direction_name"], "tone": design["tone"],
            "slug": slug, "seeds": design["seeds"], "knobs": design["knobs"], "voice": design["voice"],
        },
    }


def schema_notes(files: dict[str, str]) -> list[str]:
    """What the vendored XIOS/3 schemas say about the generated package. The design kit's example
    and the schemas vendored from the VS Code extension do not agree everywhere (measured
    2026-11-04: the iconlist item attributes selected, detail, textstyle and detailstyle; three more
    constructs, text inside <about>, a label in a toolbar group and a status tag inside a panel,
    were changed in the kit the same day), and
    upload_project with validate=true refuses what the schema refuses, so the caller is told
    rather than surprised. Computed, not hand-kept: the note disappears when the two agree."""
    from cbemcp_build.lint import lint
    result = lint(list(files.items()), "build", ["G00"])
    complaints = sorted({e["message"].split(": ", 1)[1] for e in result["errors"]})
    if not complaints:
        return []
    return [f"The vendored XIOS/3 schemas (from the VS Code extension) reject {len(result['errors'])} place(s) in this package, "
            f"reported by lint_project as G00; upload_project with validate=true refuses the same, and the Deploy Wizard's "
            f"verdict on them has not been measured. Distinct complaints: " + "; ".join(complaints)]


def init(mcp: Any) -> None:
    from mcp.types import ToolAnnotations

    @mcp.tool(
        title="Scaffold a first version of an application",
        annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False),
    )
    def scaffold_project(  # pyright: ignore[reportUnusedFunction]
        spec: ScaffoldSpec,
    ) -> dict[str, Any]:
        """
        A complete first version of a XIOS/3 application from a spec, as files: the manifest with
        a token theme in one of six design directions, a desktop and a phone view sharing one name,
        the process (list bound to a container, detail bound to the selected record, create,
        change + save, delete, a status line), the detail stylesheet, the design kit's two
        components, sample records, the theme on its own under layout/, a text-mark logo under
        images/, and an llms.txt. The spec's extras are applied on top: extra record fields, a
        login screen, further navigation entries, proxy channels, a locale file. The same spec
        always gives the same files; the notes say what is a placeholder and what the console
        still has to do. Nothing is written anywhere.
        """
        return scaffold(spec)

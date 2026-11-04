"""The XIOS/3 schemas, vendored, and the application schema built from them.

`xsd/` is a copy of the VS Code extension's schema set (see `xsd/README.md` and `sync-xsd.sh`);
`application_schema` is loaded once at import, since loading view.xsd is slow. The deploy server
validates a stored project against the same object the lint applies as rule G00, so the two can
never disagree about what a valid manifest is.
"""
from __future__ import annotations

import logging
import os
import re
import xml.etree.ElementTree as ET

import xmlschema
from mcp.server.mcpserver.exceptions import ToolError

logger = logging.getLogger(__name__)

XSD_DIR = os.path.join(os.path.dirname(__file__), "xsd")

# application.xsd imports xlink.xsd by its w3.org URL, and xlink.xsd imports xml.xsd the
# same way. xmlschema would fall back to its own bundled copies, but pin both to the ones
# in xsd/ so validation depends on the files shipped here and never on a network fetch.
# This mirrors catalogs/catalog.xml in the VS Code extension, which does the same for the
# Java processor behind redhat.vscode-xml.
XSD_LOCATIONS = [
    ("http://www.w3.org/1999/xlink", os.path.join(XSD_DIR, "xlink.xsd")),
    ("http://www.w3.org/XML/1998/namespace", os.path.join(XSD_DIR, "xml.xsd")),
]

# This is slow so do it once
logger.info("Loading XML schema")
application_schema = xmlschema.XMLSchema11(os.path.join(XSD_DIR, "application.xsd"), locations=XSD_LOCATIONS)

# ── Custom components vs the schema (MCPCLO-2) ────────────────────────────────
#
# view.xsd models custom components deliberately (t_customComponent accepts
# anything) but ships `g_custom` EMPTY: a wildcard alongside the named
# components would violate XSD 1.0's Unique Particle Attribution rule, so the
# schema cannot pre-declare tags it does not know. The VS Code extension
# redefines the group at load time with one element per tag the workspace
# declares (src/xml/customSchema.ts). This is that same step, server-side:
# an app's own manifest <components> block names its tags, and validation of
# THAT app runs against a schema whose g_custom carries exactly those tags.
# An app with no custom components keeps the module-global schema untouched —
# and a view using an UNdeclared tag still fails, which is the schema working.

# Tags become element names in generated XSD text, so they must be clean
# NCNames — anything else is refused rather than interpolated.
_CUSTOM_TAG_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9._-]*$")

_EMPTY_G_CUSTOM = '<xs:group name="g_custom"><xs:sequence/></xs:group>'

_custom_schema_cache: dict[frozenset, xmlschema.XMLSchema11] = {}


def manifest_custom_tags(root: ET.Element) -> frozenset:
    """The custom tags an application manifest declares (its <components> block)."""
    tags = set()
    for comp in root.findall("./components/component"):
        tag = comp.attrib.get("tag") or comp.attrib.get("name") or ""
        tag = tag.strip()
        if tag == "":
            continue
        if not _CUSTOM_TAG_RE.match(tag):
            raise ToolError(f"Custom component tag {tag!r} is not a valid XML name")
        tags.add(tag)
    return frozenset(tags)


def schema_for_custom_tags(tags: frozenset) -> xmlschema.XMLSchema11:
    """The application schema with g_custom populated for `tags` (cached).

    Builds from a temp copy of the XSD set with view.xsd's empty g_custom
    replaced by a choice of the declared tags, each typed t_customComponent —
    the same occurrence shape as the named components in g_components. Building
    fails if a declared tag collides with a native element (UPA); that is
    surfaced as a ToolError naming the manifest as the thing to fix.
    """
    if not tags:
        return application_schema
    if tags in _custom_schema_cache:
        return _custom_schema_cache[tags]
    import shutil
    import tempfile
    # A declared tag whose name view.xsd ALREADY carries as a named element
    # (e.g. the kit's <rating> vs the schema's own t_rating) cannot ALSO be
    # added to the extension group — Element Declarations Consistent forbids
    # the same name with two types in one content model. But the named grammar
    # is a DIFFERENT component that happens to share the name (t_rating wants
    # <item> children; the kit's rating is attrs-only), so leaving it in place
    # would refuse the app's own component. The app declared the tag, so the
    # app's meaning wins: those element declarations are RETYPED to
    # t_customComponent in the patched copy. Discovered from the schema text,
    # not hand-kept; a named element with an inline type (no type= to retype)
    # stays as-is and is logged.
    with open(os.path.join(XSD_DIR, "view.xsd"), encoding="utf-8") as f:
        view_src_orig = f.read()
    named = set(re.findall(r'<xs:element name="([^"]+)"', view_src_orig))
    extend = sorted(t for t in tags if t not in named)
    retype = sorted(t for t in tags if t in named)
    if not extend and not retype:
        return application_schema
    group = (
        '<xs:group name="g_custom"><xs:choice>'
        + "".join(
            f'<xs:element name="{t}" type="t_customComponent" minOccurs="0" maxOccurs="unbounded"/>'
            for t in extend
        )
        + "</xs:choice></xs:group>"
    )
    tmp = tempfile.mkdtemp(prefix="cbemcp-xsd-")
    try:
        for name in os.listdir(XSD_DIR):
            if name.endswith(".xsd"):
                shutil.copy(os.path.join(XSD_DIR, name), os.path.join(tmp, name))
        view_path = os.path.join(tmp, "view.xsd")
        with open(view_path, encoding="utf-8") as f:
            view_src = f.read()
        if _EMPTY_G_CUSTOM not in view_src:
            raise ToolError(
                "view.xsd no longer carries the empty g_custom group this patch expects — "
                "re-align schema_for_custom_tags with the vendored schema (sync-xsd.sh?)")
        if extend:  # an empty <xs:choice> is invalid XSD — retype-only keeps the empty group
            view_src = view_src.replace(_EMPTY_G_CUSTOM, group, 1)
        for t in retype:
            patched, n = re.subn(
                rf'(<xs:element name="{re.escape(t)}" type=")[^"]+(")',
                rf"\g<1>t_customComponent\g<2>", view_src)
            if n:
                view_src = patched
                logger.info(f"custom tag {t!r} shadows a named element — retyped to t_customComponent ({n} site(s))")
            else:
                logger.warning(f"custom tag {t!r} shadows a named element with an inline type — left validating as named")
        with open(view_path, "w", encoding="utf-8") as f:
            f.write(view_src)
        locations = [
            ("http://www.w3.org/1999/xlink", os.path.join(tmp, "xlink.xsd")),
            ("http://www.w3.org/XML/1998/namespace", os.path.join(tmp, "xml.xsd")),
        ]
        try:
            schema = xmlschema.XMLSchema11(os.path.join(tmp, "application.xsd"), locations=locations)
        except xmlschema.XMLSchemaException as ex:
            raise ToolError(
                f"Could not extend the schema with custom component tags {extend + retype} — "
                f"a tag likely collides with a native component name: {ex}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    _custom_schema_cache[tags] = schema
    return schema


def xml_schema_check() -> None:
    """The xlink canary: a manifest using xlink:href on <view> and <process> must validate, so a
    schema sync that drops xlink support fails here (and at the deploy server's start) rather
    than on every user's deploy."""
    xml_data = """<application xmlns:xlink="http://www.w3.org/1999/xlink" name="test1" icon="icon://earth">
  <share>false</share>
  <settings>
    <path>home://</path>
    <locale>./locale/en_US.xml</locale>
  </settings>
  <about loader="false" version="1.0" revised="2026-08-03" created="2026-08-03" author="newuser1" publisher="testtenantcbe100">
    <description>Description for test1</description>
  </about>
  <resources>
  </resources>
  <view name="test1View" xlink:actuate="onLoad" xlink:href="./views/test1View.xml"/>
  <process step="start" xlink:actuate="onLoad" xlink:href="./processes/test1.xml"/>
</application>"""
    xml = ET.fromstring(xml_data)
    application_schema.validate(xml)

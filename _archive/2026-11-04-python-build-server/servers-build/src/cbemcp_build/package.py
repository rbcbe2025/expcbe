"""A XIOS/3 package held in memory: the files, parsed where they are XML, with the manifest's
declarations indexed.

This is the one shape every build tool works on. `lint` applies the tenant grammar to it,
`benchmark` counts it, and `scaffold` produces one. The files arrive as (path, content) pairs —
from an MCP request, from a directory, or read back out of a database by a server that has one —
and nothing here touches a tenant.

`check_relative_path` is the rule for a path inside a package: no '..', no control characters,
no empty name. It is a security control (it is what stops an uploaded path from escaping its
project container), so it lives here once and every caller imports it.
"""
from __future__ import annotations

import posixpath
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

from mcp.server.mcpserver.exceptions import ToolError
from pydantic import BaseModel, Field

from cbemcp_build.urlutils import url_is_relative
from cbemcp_build.xmltree import XLINK_HREF, XmlDocument, XmlSyntaxError, local_name, parse_xml

MANIFEST = "index.xml"
XML_EXTENSIONS = (".xml", ".xsl", ".xslt", ".xsd", ".svg")

# Internal schemes a link may use without pointing at a package file.
EXTERNAL_SCHEMES = ("http:", "https:", "xios:", "home:", "tenant:", "icon:", "data:", "mailto:", "tel:",
                    "javascript:", "blob:", "about:", "host:")


def check_relative_path(path: str) -> list[str]:
    """Split a project relative path into container names plus a file name, rejecting anything
    that could escape the project container or that isn't a usable object name."""
    parts: list[str] = []
    for part in path.replace("\\", "/").split("/"):
        part = part.strip()
        if part == "" or part == ".":
            continue
        if part == "..":
            raise ToolError(f"Invalid path '{path}': it must not contain '..'")
        if any(ord(c) < 0x20 for c in part):
            raise ToolError(f"Invalid path '{path}': it must not contain control characters")
        parts.append(part)
    if len(parts) == 0:
        raise ToolError(f"Invalid path '{path}': missing a file name")
    return parts


class LintFile(BaseModel):
    path: str = Field(description="File name relative to the package root, eg. 'index.xml' or 'views/mainView.xml'.")
    content: str = Field(description="The complete text content of the file.")


class XmlFile:

    def __init__(self, path: str, text: str, doc: XmlDocument) -> None:
        self.path = path
        self.text = text
        self.doc = doc
        self.root = doc.root

    def line(self, elem: ET.Element) -> int:
        return self.doc.line(elem)


class Package:
    """The files, parsed where they are XML, with the manifest's declarations indexed."""

    def __init__(self, files: list[tuple[str, str]]) -> None:
        self.files: dict[str, str] = {}
        self.order: list[str] = []
        self.xml: dict[str, XmlFile] = {}
        self.parse_errors: dict[str, tuple[str, int]] = {}
        for path, content in files:
            norm = "/".join(check_relative_path(path))
            if norm in self.files:
                raise ToolError(f"Duplicate path '{path}' in files")
            self.files[norm] = content
            self.order.append(norm)
        for path in self.order:
            if path.lower().endswith(XML_EXTENSIONS):
                try:
                    self.xml[path] = XmlFile(path, self.files[path], parse_xml(self.files[path]))
                except XmlSyntaxError as ex:
                    self.parse_errors[path] = (str(ex), ex.line)
        self.manifest: XmlFile | None = self.xml.get(MANIFEST)
        if self.manifest is not None and local_name(self.manifest.root.tag) != "application":
            self.manifest = None
        self.manifest_views: list[ET.Element] = []
        self.manifest_processes: list[ET.Element] = []
        self.view_files: dict[str, XmlFile] = {}
        self.process_files: dict[str, XmlFile] = {}
        self.view_names: set[str] = set()
        # view name -> every component name declared in a file or inline view of that name
        self.view_components: dict[str, set[str]] = {}
        self.tenant_target = False
        self._index()

    def _index(self) -> None:
        for path, xf in self.xml.items():
            tag = local_name(xf.root.tag)
            if tag == "view" and path != MANIFEST:
                self.view_files[path] = xf
            elif tag == "process" and path != MANIFEST:
                self.process_files[path] = xf
        if self.manifest is None:
            return
        root = self.manifest.root
        for child in root:
            tag = local_name(child.tag)
            if tag == "view":
                self.manifest_views.append(child)
            elif tag == "process":
                self.manifest_processes.append(child)
        settings_path = root.findtext("./settings/path", "") or ""
        share = (root.findtext("./share", "") or "").strip().lower()
        self.tenant_target = settings_path.strip().startswith("tenant://") or share == "true"
        for view in self.manifest_views:
            name = view.attrib.get("name", "")
            if name:
                self.view_names.add(name)
            names = self.view_components.setdefault(name, set())
            target = self.resolve(MANIFEST, view.attrib.get(XLINK_HREF, ""))
            if target and target in self.xml:
                names.update(component_names(self.xml[target].root))
            if len(view):
                names.update(component_names(view))
        # a view file nobody declared still names a view
        for path, xf in self.view_files.items():
            name = xf.root.attrib.get("name", "")
            if name and name not in self.view_names:
                self.view_names.add(name)
                self.view_components.setdefault(name, set()).update(component_names(xf.root))

    def resolve(self, from_path: str, href: str) -> str | None:
        """The package path an href in `from_path` points at; '' for an external or dynamic
        reference; None when it escapes the package root."""
        href = (href or "").strip()
        if href == "" or "{" in href or href.startswith("#"):
            return ""
        if href.lower().startswith(EXTERNAL_SCHEMES) or href.startswith("//"):
            return ""
        parts = urlsplit(href)
        if not url_is_relative(parts) or parts.scheme:
            return "" if parts.scheme else None
        path = parts.path
        if path == "":
            return ""
        joined = posixpath.normpath(posixpath.join(posixpath.dirname(from_path), path))
        if joined.startswith("../") or joined == ".." or joined.startswith("/"):
            return None
        return joined

    def process_docs(self) -> list[tuple[XmlFile, ET.Element]]:
        """Every process: the root of each process file, and each inline process in the manifest."""
        docs: list[tuple[XmlFile, ET.Element]] = [(xf, xf.root) for xf in self.process_files.values()]
        if self.manifest is not None:
            docs += [(self.manifest, p) for p in self.manifest_processes if len(p)]
        return docs

    def view_docs(self) -> list[tuple[XmlFile, ET.Element]]:
        docs: list[tuple[XmlFile, ET.Element]] = [(xf, xf.root) for xf in self.view_files.values()]
        if self.manifest is not None:
            docs += [(self.manifest, v) for v in self.manifest_views if len(v)]
        return docs

    def extension(self, path: str) -> str:
        base = posixpath.basename(path)
        return base.rpartition(".")[2].lower() if "." in base else ""


def component_names(view: ET.Element) -> set[str]:
    names = {view.attrib.get("name", "")}
    for elem in view.iter():
        name = elem.attrib.get("name")
        if name:
            names.add(name)
    names.discard("")
    return names

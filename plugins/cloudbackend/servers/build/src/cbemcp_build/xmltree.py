"""XML parsing that keeps line numbers.

`xml.etree.ElementTree` drops the line an element came from, and a lint finding without a line is
a finding the reader has to go and look for. This builds an ordinary ElementTree tree with expat and
records the line of every element on the side, so the rest of the server keeps using the ET API.

    doc = parse_xml(text)
    doc.root            # an ET.Element, namespaced tags as '{uri}local' like ET.fromstring
    doc.line(elem)      # the 1-based line the element's start tag is on

Raises `XmlSyntaxError` (with `.line`) on XML that does not parse.
"""
from __future__ import annotations

import xml.etree.ElementTree as ET
import xml.parsers.expat as expat

XLINK_NS = "http://www.w3.org/1999/xlink"
XLINK_HREF = "{%s}href" % XLINK_NS
XLINK_ACTUATE = "{%s}actuate" % XLINK_NS
XSL_NS = "http://www.w3.org/1999/XSL/Transform"


class XmlSyntaxError(ValueError):

    def __init__(self, message: str, line: int) -> None:
        super().__init__(message)
        self.line = line


class XmlDocument:
    root: ET.Element
    lines: dict[ET.Element, int]

    def __init__(self, root: ET.Element, lines: dict[ET.Element, int]) -> None:
        self.root = root
        self.lines = lines

    def line(self, elem: ET.Element) -> int:
        return self.lines.get(elem, 0)

    def iter(self):
        return self.root.iter()


def _qualify(name: str) -> str:
    # expat with namespace_separator='}' reports 'uri}local'; ET spells it '{uri}local'.
    return "{" + name if "}" in name else name


def local_name(tag: str) -> str:
    return tag.rpartition("}")[2] if tag.startswith("{") else tag


def parse_xml(text: str) -> XmlDocument:
    parser = expat.ParserCreate(namespace_separator="}")
    parser.buffer_text = True
    stack: list[ET.Element] = []
    lines: dict[ET.Element, int] = {}
    roots: list[ET.Element] = []

    def start(name: str, attrs: dict[str, str]) -> None:
        elem = ET.Element(_qualify(name), {_qualify(k): v for k, v in attrs.items()})
        lines[elem] = parser.CurrentLineNumber
        if stack:
            stack[-1].append(elem)
        else:
            roots.append(elem)
        stack.append(elem)

    def end(name: str) -> None:
        stack.pop()

    def chars(data: str) -> None:
        if not stack:
            return
        current = stack[-1]
        if len(current):
            last = current[-1]
            last.tail = (last.tail or "") + data
        else:
            current.text = (current.text or "") + data

    parser.StartElementHandler = start
    parser.EndElementHandler = end
    parser.CharacterDataHandler = chars
    try:
        parser.Parse(text, True)
    except expat.ExpatError as ex:
        raise XmlSyntaxError(expat.errors.messages.get(ex.code, str(ex)), ex.lineno) from ex
    if not roots:
        raise XmlSyntaxError("no root element", 1)
    return XmlDocument(roots[0], lines)

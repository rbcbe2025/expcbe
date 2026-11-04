"""benchmark_project: the measured half of the benchmark report.

Counts that are reproducible from the package alone — files, lines, bytes by type, views,
processes, steps, operations, triggers, components — and a Source column filled by the tool:
"measured" for what it counted, "client-supplied" for what the caller passed (tokens, cost, active
minutes, Lighthouse, timings), "not-available" for what nobody had. The reference comparison table
is deliberately not here: a comparison row without a twin measured on the same spec and host is
not a measurement, and the workflow skill carries the reference with its citation.
"""
from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from mcp.server.mcpserver.exceptions import ToolError

from cbemcp_build.package import MANIFEST, LintFile, Package
from cbemcp_build.xmltree import local_name

CLIENT_FIELDS = ("tokens_in", "tokens_out", "cost_usd", "active_minutes", "lighthouse", "timings")


class ClientFields(BaseModel):
    client: str = Field(default="", description="The client the application was built with, eg. 'Claude Code' or 'claude.ai'.")
    tokens_in: int | None = Field(default=None, description="Input tokens the build consumed, from the client's own cost report.")
    tokens_out: int | None = Field(default=None, description="Output tokens the build consumed.")
    cost_usd: float | None = Field(default=None, description="Cost of the build in USD, from the client's own cost report.")
    active_minutes: float | None = Field(default=None, description="Active minutes from the first prompt to the first Development URL, from timestamps.")
    lighthouse: dict[str, Any] | None = Field(default=None, description="A Lighthouse result as measured: scores plus route, preset, profile and date.")
    timings: dict[str, Any] | None = Field(default=None, description="Load timings as measured, eg. cold and warm medians of three.")


def measure(files: list[tuple[str, str]]) -> dict[str, Any]:
    pkg = Package(files)
    lines = sum(pkg.files[p].count("\n") + (1 if pkg.files[p] and not pkg.files[p].endswith("\n") else 0) for p in pkg.order)
    bytes_by_type: dict[str, int] = {}
    for path in pkg.order:
        ext = pkg.extension(path) or "(none)"
        bytes_by_type[ext] = bytes_by_type.get(ext, 0) + len(pkg.files[path].encode("utf-8"))
    views = len(pkg.manifest_views) if pkg.manifest is not None else len(pkg.view_files)
    processes = len(pkg.process_docs())
    steps = operations = triggers = 0
    for _, root in pkg.process_docs():
        for elem in root.iter():
            tag = local_name(elem.tag)
            if tag == "step":
                steps += 1
            elif tag == "operation":
                operations += 1
            elif tag == "trigger":
                triggers += 1
    components = 0
    for _, root in pkg.view_docs():
        components += sum(1 for elem in root.iter() if elem is not root and elem.attrib.get("name"))
    custom = len(pkg.manifest.root.findall("./components/component")) if pkg.manifest is not None else 0
    return {
        "files": len(pkg.order),
        "lines": lines,
        "bytes": sum(bytes_by_type.values()),
        "bytes_by_type": dict(sorted(bytes_by_type.items())),
        "views": views,
        "view_files": len(pkg.view_files),
        "processes": processes,
        "steps": steps,
        "operations": operations,
        "triggers": triggers,
        "components": components,
        "custom_components": custom,
        "has_manifest": pkg.manifest is not None and MANIFEST in pkg.files,
        "build_step": "none",
    }


def benchmark(files: list[tuple[str, str]], client: ClientFields | None) -> dict[str, Any]:
    if not files:
        raise ToolError("Missing files, there is nothing to measure")
    measured = measure(files)
    client = client or ClientFields()
    sources: dict[str, str] = {key: "measured" for key in measured}
    supplied: dict[str, Any] = {}
    for key in CLIENT_FIELDS:
        value = getattr(client, key)
        if value is None:
            sources[key] = "not-available"
        else:
            sources[key] = "client-supplied"
            supplied[key] = value
    rows: list[tuple[str, str, str]] = [
        ("Files", str(measured["files"]), "measured"),
        ("Lines", str(measured["lines"]), "measured"),
        ("Bytes", str(measured["bytes"]), "measured"),
        ("Bytes by type", ", ".join(f"{k} {v}" for k, v in measured["bytes_by_type"].items()) or "-", "measured"),
        ("Views (declared)", str(measured["views"]), "measured"),
        ("Processes", str(measured["processes"]), "measured"),
        ("Steps", str(measured["steps"]), "measured"),
        ("Operations", str(measured["operations"]), "measured"),
        ("Triggers", str(measured["triggers"]), "measured"),
        ("Named components", str(measured["components"]), "measured"),
        ("Custom components", str(measured["custom_components"]), "measured"),
        ("Build step", "none (XML and JavaScript are served as written)", "measured"),
    ]
    labels = {
        "tokens_in": "Tokens in", "tokens_out": "Tokens out", "cost_usd": "Cost (USD)",
        "active_minutes": "Active minutes to the first Development URL", "lighthouse": "Lighthouse",
        "timings": "Load timings",
    }
    for key in CLIENT_FIELDS:
        value = supplied.get(key)
        if value is None:
            rows.append((labels[key], "not available on this client", "not-available"))
        elif isinstance(value, dict):
            rows.append((labels[key], "; ".join(f"{k} {v}" for k, v in value.items()), "client-supplied"))
        else:
            rows.append((labels[key], str(value), "client-supplied"))
    client_name = client.client or "not stated"
    markdown = [
        "## Benchmark (measured)",
        "",
        f"Client: {client_name}. Every row names its source; nothing below is an estimate.",
        "",
        "| Measure | Value | Source |",
        "| --- | --- | --- |",
    ]
    markdown += [f"| {label} | {value} | {source} |" for label, value, source in rows]
    block_json = {"measured": measured, "client": {"client": client_name, **supplied}, "sources": sources}
    return {
        "measured": measured,
        "block_markdown": "\n".join(markdown) + "\n",
        "block_json": block_json,
        "sources": sources,
    }


def init(mcp: Any) -> None:
    from mcp.types import ToolAnnotations

    @mcp.tool(
        title="Benchmark a project",
        annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False),
    )
    def benchmark_project(  # pyright: ignore[reportUnusedFunction]
        files: list[LintFile],
        client_fields: ClientFields | None = None,
    ) -> dict[str, Any]:
        """
        The measured block of a benchmark report for a XIOS/3 package: files, lines, bytes by type,
        views, processes, steps, operations, triggers, named and custom components, and the build
        step (none). Values the client measured itself (tokens, cost, active minutes, Lighthouse,
        timings) are passed in `client_fields` and labelled client-supplied; a field nobody had is
        labelled not-available. The result carries the same block as markdown and as JSON, with a
        Source per row. The reference comparison table is not part of this tool.
        """
        return benchmark([(f.path, f.content) for f in files], client_fields)

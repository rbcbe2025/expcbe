"""The MCP server carrying the three build tools.

One function builds it, so the stdio entry point (`python -m cbemcp_build`) and the deploy
server's `/build` endpoint (`cbemcp.app.make_build_server`) register the same tools with the same
names, titles, annotations and descriptions.
"""
from __future__ import annotations

from mcp.server import MCPServer

from cbemcp_build import NAME, version

TITLE = "CloudBackend PaaS build tools"
INSTRUCTIONS = ("Read-only tools for XIOS/3 packages before they reach a tenant: lint_project checks the "
                "tenant grammar on files in the request, scaffold_project writes a first version of an "
                "application from a spec, benchmark_project measures a package. No tenant, no credentials.")


def make_server() -> MCPServer:
    from cbemcp_build import benchmark, lint, scaffold
    mcp = MCPServer(name=NAME, title=TITLE, version=version(), instructions=INSTRUCTIONS)
    for init in (lint.init, scaffold.init, benchmark.init):
        init(mcp)
    return mcp

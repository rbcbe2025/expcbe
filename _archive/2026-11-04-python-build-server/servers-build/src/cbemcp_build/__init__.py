"""cbemcp-build: the CloudBackend PaaS build tools for XIOS/3 packages, as a pure Python package.

Three MCP tools — `lint_project`, `scaffold_project`, `benchmark_project` — that work on files
held in memory, before a tenant exists and without credentials. `make_server()` is the MCP server
carrying them; `python -m cbemcp_build` serves it over stdio; the deploy server `cbemcp` mounts
the same server at its `/build` endpoint. Nothing here imports `cbemcp`.
"""
from __future__ import annotations

__version__ = "1.0.0"

NAME = "cbemcp-build"


def version() -> str:
    """The version an MCP client sees in serverInfo: the installed distribution's when the
    package is installed, else `__version__` (the vendored copy inside a plugin)."""
    import importlib.metadata
    try:
        return importlib.metadata.version(NAME)
    except importlib.metadata.PackageNotFoundError:
        return __version__


def make_server():
    """The MCP server with the three build tools registered (see `cbemcp_build.server`)."""
    from cbemcp_build.server import make_server as _make_server
    return _make_server()


__all__ = ["NAME", "__version__", "make_server", "version"]

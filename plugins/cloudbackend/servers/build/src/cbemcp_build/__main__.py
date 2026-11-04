"""`python -m cbemcp_build`: the build tools over stdio.

Standard output carries nothing but the MCP protocol: the SDK's stdio transport takes over
file descriptor 1 while it serves and sends any stray print to stderr. Logging goes to stderr
too, at WARNING unless CBEMCP_BUILD_LOG_LEVEL says otherwise.
"""
from __future__ import annotations

import logging
import os
import sys


def main() -> None:
    level = os.environ.get("CBEMCP_BUILD_LOG_LEVEL", "WARNING").upper()
    logging.basicConfig(level=getattr(logging, level, logging.WARNING), stream=sys.stderr,
                        format="%(levelname)s %(name)s: %(message)s")
    from cbemcp_build import make_server
    make_server().run(transport="stdio")


if __name__ == "__main__":
    main()

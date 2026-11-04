from urllib.parse import SplitResult, urlsplit


def url_is_relative(url: SplitResult | str) -> bool:
    """True for a reference with no scheme, no host and no leading slash: one that is resolved
    against the file it appears in, so it stays inside the package."""
    if isinstance(url, SplitResult):
        u = url
    else:
        u = urlsplit(url)
    return u.scheme == "" and u.netloc == "" and not u.path.startswith("/")

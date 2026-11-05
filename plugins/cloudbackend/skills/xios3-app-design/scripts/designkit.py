#!/usr/bin/env python3
"""designkit.py - the design brief, the token theme, a mood board and a first app, from one sentence.

    python3 scripts/designkit.py brief --app "Planboard" --idea "a project board for small agencies"
        -> design/design.json, design/design-brief.md, design/theme.xml, design/moodboard.html
           Picks a direction from the idea (ledger, studio, clinic, field, night, paper); --direction overrides.
    python3 scripts/designkit.py app --design design/design.json --items "home://Planboard/Projects" --out app
        -> a complete first version (manifest with the theme, desktop and phone views, process, detail
           stylesheet, the two kit components, sample data) with the placeholders filled in.
    python3 scripts/designkit.py check design/theme.xml
        -> every on-* colour against its surface, at 4.5:1 or better (WCAG AA for text), exit 1 if not.
    python3 scripts/designkit.py app --design design/design.json --out app --login
        -> the same app behind the runtime's login screen: sign in, sign up and forgot password, the CloudBackend
           PaaS sign-in's look (a dark grid page, the logo above a white card), logo.svg and login-bg.svg written.
    python3 scripts/designkit.py login app
        -> the login screen is complete: all three ways in, the texts, the logo and page, the wiring; exit 1 if not.
    python3 scripts/designkit.py icons app
        -> every icon:// in the app: a Lucide name, look=lucide, a colour (the on- colour on a filled button, the
           primary written out inside a list); exit 1 if not.
    python3 scripts/designkit.py moodboard design/design.json
        -> rewrites moodboard.html after you edited design.json by hand.

Standard library only; no network. Fonts are system stacks, so the app renders the same offline.
The directions live in ../assets/directions.json; the example app in ../assets/example/.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
SEED_ORDER = ["primary", "on-primary", "secondary", "on-secondary", "tertiary", "on-tertiary",
              "background", "surface", "on-surface", "error", "on-error", "lightIcon", "darkIcon", "grey"]
# each text colour and the colour it sits on
CONTRAST_PAIRS = [("on-primary", "primary"), ("on-secondary", "secondary"), ("on-tertiary", "tertiary"),
                  ("on-surface", "surface"), ("on-surface", "background"), ("on-error", "error")]


# ---------------------------------------------------------------- colour maths

def hex_to_rgb(h: str) -> tuple:
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if not re.fullmatch(r"[0-9a-fA-F]{6}", h):
        raise SystemExit(f"not a colour: #{h}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb) -> str:
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c)))) for c in rgb)


def luminance(h: str) -> float:
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def mix(a: str, b: str, t: float) -> str:
    """a mixed with b, t = share of b (0..1). The mood board uses it to show the derived tints
    (hover, border, muted text); the runtime derives its own from the seeds."""
    ra, rb = hex_to_rgb(a), hex_to_rgb(b)
    return rgb_to_hex(tuple(ra[i] + (rb[i] - ra[i]) * t for i in range(3)))


# ---------------------------------------------------------------- directions

def load_directions() -> dict:
    return json.loads((ASSETS / "directions.json").read_text(encoding="utf-8"))


def pick_direction(idea: str, directions: list) -> dict:
    words = re.findall(r"[a-z]+", idea.lower())
    best, score = None, -1
    for d in directions:
        s = sum(1 for k in d["keywords"] if k in words)
        if s > score:
            best, score = d, s
    return best if score > 0 else next(d for d in directions if d["id"] == "studio")


def check_seeds(seeds: dict) -> list:
    problems = []
    for text, on in CONTRAST_PAIRS:
        c = contrast(seeds[text], seeds[on])
        if c < 4.5:
            problems.append(f"{text} on {on}: {c:.2f}:1 (needs 4.5:1)")
    return problems


# ---------------------------------------------------------------- outputs

def theme_xml(design: dict) -> str:
    d = design
    knobs = "\n".join(f"      <{k}>{v}</{k}>" for k, v in d["knobs"].items())
    comps = "\n".join(f'      <{c} look="token"/>' for c in d["components_with_token_look"])
    colors = "\n".join(f'      <color name="{k}">{d["seeds"][k]}</color>' for k in SEED_ORDER)
    spinner = d["spinner_svg"].replace("{{GREY}}", d["seeds"]["grey"])
    return (f'  <!-- The look of {d["app"]}: a token theme. Seeds are the colours, knobs the type, spacing and shape;\n'
            f'       the runtime derives hovers, borders, selection tints and muted text from the seeds, so the\n'
            f'       view never names a colour. icon="lucide" selects the Lucide icon collection the runtime ships\n'
            f'       (references/icons.md). Direction: {d["direction"]} ({d["tone"]}). Generated by designkit.py. -->\n'
            f'  <theme name="{d["slug"]}" tokens="true" icon="lucide" dialogShadow="false">\n'
            f'    <tokens>\n{knobs}\n    </tokens>\n'
            f'    <components>\n{comps}\n    </components>\n'
            f'    <colors>\n{colors}\n    </colors>\n'
            f'    <spinner>{spinner}</spinner>\n'
            f'  </theme>')


def brief_md(design: dict) -> str:
    s, k, v = design["seeds"], design["knobs"], design["voice"]
    seeds = "\n".join(f"| {name} | `{s[name]}` |" for name in SEED_ORDER)
    return f"""# {design["app"]}: design brief

Generated by designkit.py on the idea "{design["idea"]}". Edit it; `design.json` is the machine-readable copy
(`designkit.py moodboard design/design.json` redraws the mood board from it).

## Who it is for, and what one visit does

- Audience: (one line: who opens it, and how often)
- The one job of a visit: (one line)
- Tone, three words: {design["tone"]}

## Direction: {design["direction_name"]}

{design["direction_for"]}. Layout: {design["layout"]}.

## Palette (the theme's seeds)

| Role | Value |
| --- | --- |
{seeds}

Every `on-` colour sits on the role above it at 4.5:1 or better. Hover, borders, selection and muted text are
derived by the runtime; never write a hex into a view.

## Type, spacing, shape (the knobs)

- Body: `{k["font-sans"]}`; display: `{k["font-display"]}`; code: `{k["font-mono"]}`
- Sizes: {k["text-sm"]} / {k["text-md"]} / {k["text-lg"]}; weights {k["weight-medium"]} / {k["weight-bold"]}; line height {k["leading-normal"]}
- Controls {k["control-height"]} tall (the density dial); radii {k["radius-sm"]} / {k["radius-md"]} / {k["radius-lg"]}

## Screens of the first version

1. **List**: every {design["item_word"]}, newest first, with a search box; empty state: "{v["empty"]}"
2. **Detail**: the selected {design["item_word"]}, readable at a glance, then its fields to edit
3. **New**: one action in the top bar; the new {design["item_word"]} opens in Detail

Phone: list first, detail on select, a Back button; the navigation becomes a menu button. Desktop: navigation
rail, list and detail side by side.

## Voice

- First run: "{v["first_run"]}"
- Empty list: "{v["empty"]}"
- After a save: "{v["saved"]}"
- After a failure: "{v["failed"]}"

## Icons

Lucide, the collection the runtime ships, selected by the theme (`icon="lucide"`) and named on every icon:
`icon://<name>?look=lucide&color=<colour>` (`references/icons.md`). By role: `plus` New, `pencil` Edit,
`trash-2` Delete, `check` Save, `x` Close, `search` Search, `menu` Menu, `arrow-left` Back, `settings` Settings,
`users` People, `clipboard-check` a {design["item_word"]}. Colour by where the icon sits: on a filled button the
button's `on-` colour (`on-primary`; Delete is a `xios-color-danger` button with `on-error`); on a toolbar or a card
`primary`; in a list the primary seed written out, `{design["seeds"]["primary"].lstrip("#").lower()}`, because a
list resolves colour names against the platform's theme. `designkit.py icons app` checks every icon.

## Logo

A text mark (the app name in the display face) until a logo file exists; the login screen takes a full
`https://` URL to it later.
"""


def moodboard_html(design: dict) -> str:
    s, k, v = design["seeds"], design["knobs"], design["voice"]
    on, surf, bg = s["on-surface"], s["surface"], s["background"]
    border = mix(surf, on, 0.14)
    muted = mix(surf, on, 0.62)
    hover = mix(s["primary"], on, 0.12)
    tint = mix(surf, s["primary"], 0.10)
    sw = "".join(
        f'<div class="sw"><i style="background:{s[name]}"></i><b>{name}</b><code>{s[name]}</code></div>'
        for name in SEED_ORDER)
    derived = "".join(
        f'<div class="sw"><i style="background:{val}"></i><b>{name}</b><code>{val}</code></div>'
        for name, val in [("hover (primary)", hover), ("border", border), ("muted text", muted), ("selection tint", tint)])
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{design["app"]} mood board</title>
<style>
:root{{--xios-color-primary:{s["primary"]};--xios-color-on-primary:{s["on-primary"]};--xios-color-secondary:{s["secondary"]};--xios-color-on-secondary:{s["on-secondary"]};--xios-color-tertiary:{s["tertiary"]};--xios-color-on-tertiary:{s["on-tertiary"]};--xios-color-background:{bg};--xios-color-surface:{surf};--xios-color-on-surface:{on};--xios-color-error:{s["error"]};--xios-color-on-error:{s["on-error"]};--xios-color-grey:{s["grey"]};
--xios-font-sans:{k["font-sans"]};--xios-font-display:{k["font-display"]};--xios-font-mono:{k["font-mono"]};--xios-text-sm:{k["text-sm"]};--xios-text-md:{k["text-md"]};--xios-text-lg:{k["text-lg"]};--xios-weight-medium:{k["weight-medium"]};--xios-weight-bold:{k["weight-bold"]};--xios-leading-normal:{k["leading-normal"]};--xios-control-height:{k["control-height"]};--xios-radius-sm:{k["radius-sm"]};--xios-radius-md:{k["radius-md"]};--xios-radius-lg:{k["radius-lg"]};
--border:{border};--muted:{muted};--hover:{hover};--tint:{tint}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--xios-color-background);color:var(--xios-color-on-surface);font:var(--xios-text-md)/var(--xios-leading-normal) var(--xios-font-sans);padding:24px}}
h1{{font:var(--xios-weight-bold) 28px/1.15 var(--xios-font-display);margin:0 0 4px}}h2{{font:var(--xios-weight-bold) var(--xios-text-lg)/1.3 var(--xios-font-display);margin:0 0 10px}}
.sub{{color:var(--muted);margin:0 0 24px}}.grid{{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.card{{background:var(--xios-color-surface);border:1px solid var(--border);border-radius:var(--xios-radius-lg);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.05)}}
.sws{{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}}.sw i{{display:block;height:48px;border-radius:var(--xios-radius-md);border:1px solid var(--border)}}.sw b{{display:block;font-size:var(--xios-text-sm);margin-top:4px}}.sw code{{font:11px var(--xios-font-mono);color:var(--muted)}}
.btn{{display:inline-flex;align-items:center;height:var(--xios-control-height);padding:0 14px;border-radius:var(--xios-radius-md);border:1px solid transparent;font:var(--xios-weight-bold) var(--xios-text-md) var(--xios-font-sans);margin:4px 6px 4px 0}}
.btn-p{{background:var(--xios-color-primary);color:var(--xios-color-on-primary)}}.btn-s{{background:var(--xios-color-secondary);color:var(--xios-color-on-secondary)}}.btn-e{{background:var(--xios-color-error);color:var(--xios-color-on-error)}}.btn-g{{border-color:var(--border);color:var(--xios-color-on-surface)}}
.input{{height:var(--xios-control-height);border:1px solid var(--border);border-radius:var(--xios-radius-sm);padding:0 10px;display:flex;align-items:center;color:var(--muted);background:var(--xios-color-surface)}}
.row{{display:flex;gap:10px;align-items:center;padding:10px;border-radius:var(--xios-radius-sm)}}.row.sel{{background:var(--tint)}}.row .t{{font-weight:var(--xios-weight-bold)}}.row .d{{color:var(--muted);font-size:var(--xios-text-sm)}}.row i{{width:20px;height:20px;border-radius:50%;background:var(--xios-color-primary);flex:none}}
.label{{font:var(--xios-weight-bold) 11px/1 var(--xios-font-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 8px}}
.status{{display:inline-block;padding:8px 12px;border-radius:var(--xios-radius-md);background:var(--xios-color-surface);border:1px solid var(--border);border-left:4px solid var(--xios-color-primary);margin:4px 8px 4px 0;font-size:var(--xios-text-sm)}}.status.ok{{border-left-color:var(--xios-color-secondary)}}.status.err{{border-left-color:var(--xios-color-error)}}
.type p{{margin:6px 0}}.mono{{font-family:var(--xios-font-mono)}}
</style></head><body>
<h1>{design["app"]}</h1>
<p class="sub">Direction: <b>{design["direction_name"]}</b> ({design["tone"]}). {design["idea"]}</p>
<div class="grid">
<div class="card"><h2>Seeds</h2><div class="sws">{sw}</div></div>
<div class="card"><h2>What the runtime derives</h2><p class="sub" style="margin-bottom:10px">Approximations of the tints the token tier computes from the seeds.</p><div class="sws">{derived}</div></div>
<div class="card type"><h2>Type</h2><p style="font:var(--xios-weight-bold) 24px/1.2 var(--xios-font-display)">Display: {design["app"]}</p><p>Body {k["text-md"]}: the quick brown fox jumps over the lazy dog, 0123456789.</p><p style="font-size:var(--xios-text-sm);color:var(--muted)">Caption {k["text-sm"]}: updated 2026-10-09, by you.</p><p class="mono" style="font-size:var(--xios-text-sm)">mono: home://Planboard/Projects/p20261009.xml</p><p class="label">Section label</p></div>
<div class="card"><h2>Controls</h2><span class="btn btn-p">New {design["item_word"]}</span><span class="btn btn-s">Save</span><span class="btn btn-g">Cancel</span><span class="btn btn-e">Delete</span><div class="input" style="margin-top:10px">Search {design["item_word"]}s</div></div>
<div class="card"><p class="label">{design["item_word"]}s</p><div class="row sel"><i></i><div><div class="t">First {design["item_word"]}</div><div class="d">2026-10-09</div></div></div><div class="row"><i></i><div><div class="t">Second {design["item_word"]}</div><div class="d">2026-10-08</div></div></div><p class="sub" style="margin:10px 0 0;font-size:var(--xios-text-sm)">Empty state: "{v["empty"]}"</p></div>
<div class="card"><h2>Voice</h2><span class="status">{v["first_run"]}</span><span class="status ok">{v["saved"]}</span><span class="status err">{v["failed"]}</span></div>
</div>
</body></html>
"""


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "", name.lower())
    return s or "app"


# ---------------------------------------------------------------- the design, and the app from it

def make_design(app: str, idea: str, item: str = "item", direction: str | None = None, primary: str | None = None) -> dict:
    """The design dict: the direction (picked from the idea unless named), its seeds, knobs and voice, and the
    app's names. Raises SystemExit on an unknown direction or an on-colour that fails 4.5:1."""
    data = load_directions()
    directions = data["directions"]
    d = next((x for x in directions if x["id"] == direction), None) if direction else pick_direction(idea, directions)
    if d is None:
        raise SystemExit(f"no direction {direction!r}; one of " + ", ".join(x["id"] for x in directions))
    design = {
        "app": app, "slug": slugify(app), "idea": idea, "item_word": item,
        "direction": d["id"], "direction_name": d["name"], "direction_for": d["for"], "tone": ", ".join(d["tone"]),
        "layout": d["layout"], "seeds": dict(d["seeds"]), "knobs": dict(d["knobs"]), "voice": dict(d["voice"]),
        "components_with_token_look": data["components_with_token_look"], "spinner_svg": data["spinner_svg"],
    }
    for key, text in design["voice"].items():
        design["voice"][key] = text.replace("{items}", item + "s").replace("{item}", item)
    if primary:
        design["seeds"]["primary"] = primary
        design["seeds"]["darkIcon"] = primary
    problems = check_seeds(design["seeds"])
    if problems:
        raise SystemExit("contrast:\n  " + "\n  ".join(problems))
    return design


def write_app(design: dict, out: Path, items: str | None = None, sample: str | None = None, force: bool = False,
              login: bool = False, login_page: str = "dark") -> int:
    """The example app with the theme and the names filled in, into out/. Returns the number of files."""
    src = ASSETS / "example"
    out = Path(out)
    if out.exists() and any(out.iterdir()) and not force:
        raise SystemExit(f"{out} is not empty; add --force to write into it")
    items_url = items or f"home://{design['app']}/{design['item_word'].capitalize()}s"
    parent, _, name = items_url.rpartition("/")
    sample_url = sample or f"home://Applications/{design['slug']}/data/items.xml"
    values = {
        "APP_NAME": design["slug"], "APP_TITLE": design["app"], "BRAND": design["app"],
        "THEME": theme_xml(design), "ITEMS_URL": items_url, "ITEMS_PARENT": parent + "/" if not parent.endswith("//") else parent,
        "ITEMS_NAME": name, "SAMPLE_URL": sample_url, "SAMPLE_BASE": sample_url.rpartition("/")[0],
        "ITEM": design["item_word"], "ITEMS": design["item_word"] + "s",
        "A_ITEM": ("an " if design["item_word"][:1].lower() in "aeiou" else "a ") + design["item_word"],
        "ICON_COLOR": design["seeds"]["primary"].lstrip("#").lower(),
        "ITEM_TITLE": design["item_word"].capitalize(), "ITEMS_TITLE": design["item_word"].capitalize() + "s",
        "VOICE_FIRST_RUN": design["voice"]["first_run"], "VOICE_EMPTY": design["voice"]["empty"],
        "VOICE_SAVED": design["voice"]["saved"], "VOICE_FAILED": design["voice"]["failed"],
        "SAMPLE": "true" if sample else "false",
    }
    n = 0
    # the example, then the kit's two components (assets/ui/DesignKit) next to it
    sources = [(f, f.relative_to(src)) for f in sorted(src.rglob("*"))]
    kit = ASSETS / "ui"
    sources += [(f, Path("ui") / f.relative_to(kit)) for f in sorted(kit.rglob("*"))]
    for f, rel in sources:
        if not f.is_file():
            continue
        dest = out / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if f.suffix in (".xml", ".xsl", ".css", ".js", ".md"):
            dest.write_text(fill(f.read_text(encoding="utf-8"), values), encoding="utf-8")
        else:
            shutil.copy2(f, dest)
        n += 1
    if login:
        index = out / "index.xml"
        index.write_text(wire_login(index.read_text(encoding="utf-8"), login_xml(design, login_page)), encoding="utf-8")
        (out / "logo.svg").write_text(logo_svg(design, login_page), encoding="utf-8")
        (out / "login-bg.svg").write_text(login_bg_svg(login_page), encoding="utf-8")
        n += 2
    return n


# ---------------------------------------------------------------- commands

def cmd_brief(a) -> int:
    design = make_design(a.app, a.idea, a.item, a.direction, a.primary)
    d = {"name": design["direction_name"]}
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "design.json").write_text(json.dumps(design, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    (out / "design-brief.md").write_text(brief_md(design), encoding="utf-8")
    (out / "theme.xml").write_text(theme_xml(design) + "\n", encoding="utf-8")
    (out / "moodboard.html").write_text(moodboard_html(design), encoding="utf-8")
    (out / "login.xml").write_text(login_xml(design) + "\n", encoding="utf-8")
    print(f"{design['app']}: direction {d['name']} ({design['tone']})\n"
          f"  {out / 'design-brief.md'}  the brief (edit it)\n  {out / 'theme.xml'}  paste into the manifest, or run: designkit.py app\n"
          f"  {out / 'moodboard.html'}  open in a browser\n  {out / 'login.xml'}  the login screen's settings (designkit.py app --login wires them in)")
    return 0


def cmd_moodboard(a) -> int:
    design = json.loads(Path(a.design).read_text(encoding="utf-8"))
    problems = check_seeds(design["seeds"])
    if problems:
        print("contrast:\n  " + "\n  ".join(problems))
    out = Path(a.design).parent / "moodboard.html"
    out.write_text(moodboard_html(design), encoding="utf-8")
    (Path(a.design).parent / "theme.xml").write_text(theme_xml(design) + "\n", encoding="utf-8")
    print(f"wrote {out} and theme.xml")
    return 1 if problems else 0


def cmd_check(a) -> int:
    text = Path(a.theme).read_text(encoding="utf-8")
    seeds = dict(re.findall(r'<color name="([^"]+)">(#[0-9a-fA-F]{3,6})</color>', text))
    missing = [n for n in SEED_ORDER if n not in seeds]
    problems = ([f"missing seed {n}" for n in missing] + check_seeds({**{n: "#000000" for n in missing}, **seeds}))
    if 'tokens="true"' not in text:
        problems.append('the theme element lacks tokens="true": without it the runtime reads a classic theme and derives nothing')
    if "<spinner>" not in text:
        problems.append("no <spinner>: every list and grid load would cost a 404 for wait.gif")
    print("ok: every on-colour reads at 4.5:1 or better" if not problems else "problems:\n  " + "\n  ".join(problems))
    return 1 if problems else 0


LUCIDE_NAMES = ASSETS / "lucide-names.txt"
FILLED_ROLES = {"primary", "secondary", "tertiary", "error"}


def lucide_names() -> set:
    return {l.strip() for l in LUCIDE_NAMES.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")}


def check_icons(folder: Path) -> list:
    """Every icon:// in the package's XML: a Lucide name, look=lucide, a colour, the on- colour on a filled
    button, and a written-out colour inside an iconlist. Returns (file, element, problem) tuples."""
    import xml.etree.ElementTree as ET
    from urllib.parse import parse_qs
    names, problems = lucide_names(), []
    for f in sorted(Path(folder).rglob("*.xml")):
        try:
            root = ET.parse(f).getroot()
        except ET.ParseError as e:
            problems.append((f, "-", f"not well-formed XML: {e}"))
            continue

        def walk(el, in_list):
            tag = el.tag.split("}")[-1]
            here = in_list or tag == "iconlist"
            for attr in ("icon", "src"):
                uri = el.get(attr, "")
                if not uri.startswith("icon://"):
                    continue
                name, _, query = uri[len("icon://"):].partition("?")
                q = {k: v[0] for k, v in parse_qs(query).items()}
                who = f"<{tag}{(' name=' + repr(el.get('name'))) if el.get('name') else ''}>"
                colour = q.get("color", "")
                if name not in names:
                    problems.append((f, who, f"{name!r} is not a Lucide name (an IconExperience name draws nothing under the Lucide theme)"))
                if q.get("look") != "lucide":
                    problems.append((f, who, f"{name}: add look=lucide"))
                if not colour:
                    problems.append((f, who, f"{name}: no color= (the runtime then loads the black outline as an image)"))
                elif here and not all(c in "0123456789abcdefABCDEF" for c in colour):
                    problems.append((f, who, f"{name}: in an iconlist write the colour out (the primary seed without #), not {colour!r}"))
                elif tag == "button" and colour in FILLED_ROLES:
                    on = "on-error" if "xios-color-danger" in el.get("class", "") else f"on-{colour}"
                    problems.append((f, who, f"{name}: on a filled button use {on} (color={colour} paints the icon in the button's own fill)"))
            for child in el:
                walk(child, here)

        walk(root, False)
    return problems


# ---------------------------------------------------------------- the login screen

# The page behind the login card, as the CloudBackend PaaS sign-in draws it: a deep navy (or a pale grey) with a faint
# 48 px grid. One SVG, scaled to cover; references/login.md.
LOGIN_PAGES = {"dark": {"from": "#0f1a33", "to": "#070b14", "grid": "#94b2de", "alpha": "0.07", "mark": "#eaf1fb"},
               "light": {"from": "#ffffff", "to": "#eef2f8", "grid": "#16375d", "alpha": "0.06", "mark": "#16375d"}}


def login_colour(design: dict) -> str:
    """The button and link colour on the login's white card: the primary seed, darkened until it reads at 4.5:1."""
    c = design["seeds"]["primary"]
    for _ in range(20):
        if contrast(c, "#ffffff") >= 4.5:
            break
        c = mix(c, "#000000", 0.08)
    return c


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def login_xml(design: dict, page: str = "dark") -> str:
    app, c = esc(design["app"]), login_colour(design)
    return (f'  <!-- The login screen: the runtime\'s own login application, the CloudBackend PaaS sign-in\'s shape (the logo above\n'
            f'       a white card, the fields, one full-width button) with all three ways in: sign in, sign up (create) and\n'
            f'       forgot password (reset). Keep create and reset: without them their links do not show.\n'
            f'       Generated by designkit.py; references/login.md. -->\n'
            f'  <login>\n'
            f'    <background dark="{"true" if page == "dark" else "false"}">login-bg.svg</background>\n'
            f'    <logo>logo.svg</logo>\n'
            f'    <title>Log in</title>\n'
            f'    <description>Welcome back. Log in to {app}.</description>\n'
            f'    <button>Log in</button>\n'
            f'    <buttonColor>{c}</buttonColor>\n'
            f'    <linkColor>{c}</linkColor>\n'
            f'    <reset>Forgot your password?</reset>\n'
            f'    <createPrompt>Don\'t have an account?</createPrompt>\n'
            f'    <create>Create an account</create>\n'
            f'    <copyright>Copyright &#169; {date.today().year} {app}</copyright>\n'
            f'  </login>')


def logo_svg(design: dict, page: str = "dark") -> str:
    """A text mark: the app name in the display face, light on the dark login page (dark on the light one)."""
    font = esc(design["knobs"].get("font-display") or design["knobs"].get("font-sans") or "system-ui, sans-serif").replace("&quot;", "'")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="44" viewBox="0 0 240 44">'
            f'<text x="120" y="31" text-anchor="middle" font-family="{font}" font-size="28" font-weight="700" '
            f'fill="{LOGIN_PAGES[page]["mark"]}">{esc(design["app"])}</text></svg>\n')


def login_bg_svg(page: str = "dark") -> str:
    g = LOGIN_PAGES[page]
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">'
            f'<defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="{g["grid"]}" '
            f'stroke-opacity="{g["alpha"]}" stroke-width="1"/></pattern><radialGradient id="r" cx="50%" cy="30%" r="75%">'
            f'<stop offset="0" stop-color="{g["from"]}"/><stop offset="1" stop-color="{g["to"]}"/></radialGradient></defs>'
            '<rect width="1600" height="1000" fill="url(#r)"/><rect width="1600" height="1000" fill="url(#g)"/></svg>\n')


def wire_login(index_xml: str, login: str) -> str:
    """The manifest behind the login: the views and the app process on request, the login application's process
    loaded first, the <login> settings after the theme. The desktop view is declared first, because after sign-in the
    login application opens the first declared view (references/login.md)."""
    phone = re.search(r'  <view name="App" screen="phone"[^>]*/>\n', index_xml)
    desk = re.search(r'  <view name="App" screen="\(min-width: 601px\)"[^>]*/>\n', index_xml)
    proc = re.search(r'  <process xlink:actuate="onLoad" xlink:href="processes/app.xml"/>\n', index_xml)
    if not (phone and desk and proc and "</theme>" in index_xml):
        raise SystemExit("--login: the manifest is not the kit's (views, process or theme not found)")
    views = (desk.group(0) + phone.group(0)).replace('xlink:actuate="onLoad"', 'xlink:actuate="onRequest"')
    out = index_xml.replace(phone.group(0), "").replace(desk.group(0), "")
    out = out.replace(proc.group(0), views
                      + '  <!-- the login application first; after sign-in it opens the first view and the app process -->\n'
                      + '  <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>\n'
                      + '  <process xlink:actuate="onRequest" xlink:href="processes/app.xml"/>\n')
    return out.replace("  </theme>\n", "  </theme>\n\n" + login + "\n", 1)


def check_login(folder: Path) -> list:
    """The login screen is complete: all three ways in, the texts, the logo and page, and the wiring."""
    import xml.etree.ElementTree as ET
    f = Path(folder) / "index.xml"
    try:
        root = ET.parse(f).getroot()
    except (OSError, ET.ParseError) as e:
        return [f"{f}: {e}"]
    X = "{http://www.w3.org/1999/xlink}"
    login = root.find("login")
    if login is None:
        return ["no <login> element: the app has no login screen (designkit.py app --login writes one)"]
    problems = []
    need = {"create": "the sign-up link (Create an account)", "reset": "the forgot-password link", "createPrompt": "the line before the sign-up link",
            "title": "the card's title", "description": "the line under the title", "button": "the sign-in button's text", "logo": "the logo",
            "background": "the page behind the card", "copyright": "the copyright line"}
    for tag, what in need.items():
        el = login.find(tag)
        if el is None or not (el.text or "").strip():
            problems.append(f"<login> has no <{tag}>: {what}")
    for tag in ("logo", "background"):
        el = login.find(tag)
        v = (el.text or "").strip() if el is not None else ""
        if v and "://" not in v and not v.startswith("#") and not (Path(folder) / v).exists():
            problems.append(f"<{tag}>{v}</{tag}>: no such file next to index.xml")
    procs = root.findall("process")
    hrefs = [(p.get(X + "href") or "", p.get(X + "actuate") or "") for p in procs]
    li = next((i for i, (h, _) in enumerate(hrefs) if h == "xios://apps/login.xml"), None)
    if li is None:
        problems.append('no <process xlink:href="xios://apps/login.xml"/>: the login application never starts')
    else:
        if hrefs[li][1] != "onLoad":
            problems.append("the login process must be xlink:actuate=\"onLoad\"")
        if any(a != "onRequest" for i, (h, a) in enumerate(hrefs) if i != li):
            problems.append("the app's own process must be xlink:actuate=\"onRequest\" (the login opens it after sign-in)")
        if any(i < li for i, (h, a) in enumerate(hrefs) if h != "xios://apps/login.xml"):
            problems.append("declare the login process before the app's own process")
    views = root.findall("view")
    if any((v.get(X + "actuate") or "") != "onRequest" for v in views):
        problems.append("every <view> must be xlink:actuate=\"onRequest\", or it opens before the user signs in")
    if views and views[0].get("screen") == "phone":
        problems.append("the first <view> is the phone one: after sign-in the login opens the first view, so declare the desktop view first")
    return problems


def fill(text: str, values: dict) -> str:
    for k, v in values.items():
        text = text.replace("{{" + k + "}}", v)
    left = sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", text)))
    if left:
        raise SystemExit("placeholders left: " + ", ".join(left))
    return text


def cmd_app(a) -> int:
    design = json.loads(Path(a.design).read_text(encoding="utf-8"))
    n = write_app(design, Path(a.out), a.items, a.sample, a.force, a.login, a.login_page)
    items_url = a.items or f"home://{design['app']}/{design['item_word'].capitalize()}s"
    print(f"wrote {n} files to {a.out}/ for {design['app']} ({design['direction_name']}): items in {items_url}"
          + (f", sample data from {a.sample}" if a.sample else ""))
    return 0


def cmd_login(a) -> int:
    problems = check_login(Path(a.folder))
    for p in problems:
        print(p)
    print(f"{len(problems)} login problem(s) in {a.folder}" if problems else
          f"the login screen in {a.folder} has sign in, sign up and forgot password, its texts, logo, page and wiring")
    return 1 if problems else 0


def cmd_icons(a) -> int:
    problems = check_icons(Path(a.folder))
    for f, who, problem in problems:
        print(f"{f}: {who}: {problem}")
    print(f"{len(problems)} icon problem(s) in {a.folder}" if problems else f"every icon in {a.folder} is a coloured Lucide icon")
    return 1 if problems else 0


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("brief", help="design.json, design-brief.md, theme.xml and moodboard.html from the idea")
    b.add_argument("--app", required=True, help='the product name, e.g. "Planboard"')
    b.add_argument("--idea", required=True, help="one sentence: what it does, for whom")
    b.add_argument("--item", default="item", help='what one record is called, e.g. "project" (default item)')
    b.add_argument("--direction", help="ledger | studio | clinic | field | night | paper (default: picked from the idea)")
    b.add_argument("--primary", help="override the primary seed, e.g. #4f46e5 (checked for contrast)")
    b.add_argument("--out", default="design")
    b.set_defaults(fn=cmd_brief)
    m = sub.add_parser("moodboard", help="redraw moodboard.html and theme.xml from an edited design.json")
    m.add_argument("design")
    m.set_defaults(fn=cmd_moodboard)
    c = sub.add_parser("check", help="contrast and completeness of a theme.xml")
    c.add_argument("theme")
    c.set_defaults(fn=cmd_check)
    g = sub.add_parser("app", help="the first version of the app from the example, with the theme and names filled in")
    g.add_argument("--design", default="design/design.json")
    g.add_argument("--items", help="the container the app lists, e.g. home://Planboard/Projects (default home://<App>/<Items>)")
    g.add_argument("--sample", help="a sample listing to run on instead of the container, e.g. home://Applications/<app>/data/items.xml")
    g.add_argument("--out", default="app")
    g.add_argument("--force", action="store_true")
    g.add_argument("--login", action="store_true", help="put the app behind the runtime's login screen (sign in, sign up, forgot password)")
    g.add_argument("--login-page", choices=["dark", "light"], default="dark", help="the page behind the login card (default dark, as the CloudBackend PaaS sign-in)")
    g.set_defaults(fn=cmd_app)
    ic = sub.add_parser("icons", help="check every icon:// in an app folder (Lucide names, look, colours)")
    ic.add_argument("folder")
    ic.set_defaults(fn=cmd_icons)
    lg = sub.add_parser("login", help="check the app's login screen: all three ways in, texts, logo, page, wiring")
    lg.add_argument("folder")
    lg.set_defaults(fn=cmd_login)
    a = ap.parse_args()
    sys.exit(a.fn(a))


if __name__ == "__main__":
    main()

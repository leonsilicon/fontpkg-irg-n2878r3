# IRG N2878R3: Final proposal to encode CJK Unified Ideographs Components - attached fonts

## 📦 Package Info

| Property | Value |
|----------|-------|
| Package Name | `fontpkg-irg-n2878r3` |
| Display Name | IRG N2878R3: Final proposal to encode CJK Unified Ideographs Components - attached fonts |
| Package Version | 1.0.0 |
| Font Version | 1.000 |
| Font File Count | 6 |
| Metadata Characters | 494 |
| Source | IRG N2878R3 |

> **Licensing note:** This is a private, local-only package. The source PDF and
> font metadata do not supply a public redistribution license for the attached
> fonts. See [`NOTICE.md`](./NOTICE.md) before sharing or publishing it.

## 📁 Included Files

| File | Font family | Source | Glyphs | Encoded characters | Size |
|------|-------------|--------|-------:|-------------------:|-----:|
| `gca-Regular.ttf` | `gca` | GCA | 121 | 120 | 98.48 KiB |
| `gcp-Regular.ttf` | `gcp` | Mainland China | 244 | 243 | 67.90 KiB |
| `hcp-Regular.ttf` | `hcp` | Hong Kong SAR | 207 | 206 | 46.11 KiB |
| `tcp-Regular.ttf` | `IRGN2878R2a_TCP` | TCA | 348 | 347 | 90.30 KiB |
| `ucp-Regular.ttf` | `ucp` | UTC, SAT, and horizontal extensions | 30 | 29 | 17.21 KiB |
| `vcp-Regular.ttf` | `vcp` | Vietnam | 13 | 12 | 11.83 KiB |
| `component.txt` | - | Unihan-style metadata for all proposed characters | - | 494 | 51.99 KiB |
| `index.css` | - | Six `@font-face` definitions | - | - | - |

The attached `component.txt` spans proposed code points `U+2FA20` through
`U+2FC16`. The proposal divides them into 119 characters for CJK Unified
Ideographs Components-A and 375 characters for Components-B.

## Local install

From another project, install this directory as a local dependency:

```sh
npm install ../fontpkg-irg-n2878r3
```

For web projects, import the included stylesheet:

```js
import "fontpkg-irg-n2878r3/index.css";
```

Then select the appropriate source font:

```html
<span style="font-family: gcp">&#x2FB71;</span>
```

Other platforms can load the TTFs directly through their normal font-asset
mechanism. Use the internal family names shown in the table above. In
particular, `tcp-Regular.ttf` has the internal family name
`IRGN2878R2a_TCP`, not `tcp`.

## U+2FB71

The component at `U+2FB71` is present in these three fonts:

| Font | Source reference |
|------|------------------|
| `gcp-Regular.ttf` | `GCP-00046` |
| `hcp-Regular.ttf` | `HCP-00477` |
| `tcp-Regular.ttf` | `TCP-01234` |

```text
Code point: U+2FB71
JavaScript: \u{2FB71}
Python:     \U0002FB71
HTML:       &#x2FB71;
```

These are small proposal/source fonts, not complete CJK text fonts. Place a
normal CJK font later in the fallback list if the surrounding text contains
ordinary ideographs.

## Extracting the source attachments

The fonts are standalone attachments in the official PDF; they are not merely
subsetted page-rendering fonts. With Poppler installed:

```sh
curl -fL \
  "https://www.unicode.org/irg/docs/n2878r3-CJKComponents.pdf" \
  -o n2878r3-CJKComponents.pdf

pdfdetach -list n2878r3-CJKComponents.pdf
mkdir n2878r3-attachments
pdfdetach -saveall -o n2878r3-attachments n2878r3-CJKComponents.pdf
```

## Checksums

```text
e63a77e5a56bff59f7c687ea2845a93b152599bdf2578ac993948a5968f6b023  component.txt
be01beafaa55f86c74f398d82e8c17643ae3293985a3ebab3309633057c6157e  gca-Regular.ttf
ec4c85144a993e4a9621bc140eda46f17283bd56610e33c0f616e1019a82a465  gcp-Regular.ttf
5645348704c418739c8331477804baaf19f665af4b5d675f58efc2da8716223d  hcp-Regular.ttf
45bd636018cd55741d81b34a83231909693f83fca06989d874e93cf50f42cc55  tcp-Regular.ttf
6563b189ffee975b5c775bdbbada66262674de392005103de521b9e5d0ab6982  ucp-Regular.ttf
2d2c41d5da05644598fa69857b7b145e94e24cd696a50db547ab3bd61cb0f63e  vcp-Regular.ttf
```

## Source

The assets come from the seven attachments to
[IRG N2878R3](https://www.unicode.org/irg/docs/n2878r3-CJKComponents.pdf),
*Final proposal to encode CJK Unified Ideographs Components*, dated
2026-03-11. The PDF explicitly describes the six fonts and the
Unihan-compatible `component.txt` file in section 3, "Attached Data".

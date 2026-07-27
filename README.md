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

| File | CSS family | Internal family | Source | Glyphs | Encoded characters | Size |
|------|------------|-----------------|--------|-------:|-------------------:|-----:|
| `irg-n2878r3-gca-Regular.ttf` | `IRG N2878R3 GCA` | `IRG N2878R3 GCA` | GCA | 121 | 120 | 98.68 KiB |
| `irg-n2878r3-gcp-Regular.ttf` | `IRG N2878R3 GCP` | `IRG N2878R3 GCP` | Mainland China | 244 | 243 | 68.10 KiB |
| `irg-n2878r3-hcp-Regular.ttf` | `IRG N2878R3 HCP` | `IRG N2878R3 HCP` | Hong Kong SAR | 207 | 206 | 46.31 KiB |
| `irg-n2878r3-tcp-Regular.ttf` | `IRG N2878R3 TCP` | `IRG N2878R3 TCP` | TCA | 348 | 347 | 90.46 KiB |
| `irg-n2878r3-ucp-Regular.ttf` | `IRG N2878R3 UCP` | `IRG N2878R3 UCP` | UTC, SAT, and horizontal extensions | 30 | 29 | 17.41 KiB |
| `irg-n2878r3-vcp-Regular.ttf` | `IRG N2878R3 VCP` | `IRG N2878R3 VCP` | Vietnam | 13 | 12 | 11.99 KiB |
| `component.txt` | - | - | Unihan-style metadata for all proposed characters | - | 494 | 51.99 KiB |
| `index.css` | - | - | Six `@font-face` definitions | - | - | - |

The attached `component.txt` spans proposed code points `U+2FA20` through
`U+2FC16`. The proposal divides them into 119 characters for CJK Unified
Ideographs Components-A and 375 characters for Components-B.

## Install

After redistribution permission is documented and the package is published:

```sh
npm install fontpkg-irg-n2878r3
```

Until then, install this directory as a local dependency:

```sh
npm install ../fontpkg-irg-n2878r3
```

For web projects, import the included stylesheet:

```js
import "fontpkg-irg-n2878r3/index.css";
```

Then select the appropriate source font:

```html
<span style="font-family: 'IRG N2878R3 GCP'">&#x2FB71;</span>
```

### Do the internal font-family names matter?

It depends on how the fonts are loaded:

- After importing `index.css`, use the package-specific CSS families shown in
  the table. The browser uses the family declared by `@font-face`, so the
  internal family name does not affect CSS selection.
- When installing a TTF into an operating system or loading it through a
  native font API, the internal family or PostScript name may be used. In that
  case the internal name matters.
- Renaming a TTF file alone does not change its internal names. The generator
  therefore rewrites the family, full, preferred-family, unique, and
  PostScript name records to use the same `IRG N2878R3` identity.

For example, `irg-n2878r3-gcp-Regular.ttf` has internal family
`IRG N2878R3 GCP` and PostScript name `IRG-N2878R3-GCP-Regular`. The original
TCP attachment's older `IRGN2878R2a_TCP` family is similarly replaced with
`IRG N2878R3 TCP`.

## U+2FB71

The component at `U+2FB71` is present in these three fonts:

| Font | Source reference |
|------|------------------|
| `irg-n2878r3-gcp-Regular.ttf` | `GCP-00046` |
| `irg-n2878r3-hcp-Regular.ttf` | `HCP-00477` |
| `irg-n2878r3-tcp-Regular.ttf` | `TCP-01234` |

```text
Code point: U+2FB71
JavaScript: \u{2FB71}
Python:     \U0002FB71
HTML:       &#x2FB71;
```

These are small proposal/source fonts, not complete CJK text fonts. Place a
normal CJK font later in the fallback list if the surrounding text contains
ordinary ideographs.

## Regenerating

The original PDF is committed as
[`data/n2878r3-CJKComponents.pdf`](./data/n2878r3-CJKComponents.pdf).
Generation is implemented entirely in TypeScript and requires Node.js
22.13 or newer:

```sh
npm install
npm run generate
```

[`_generate.ts`](./_generate.ts) uses `pdfjs-dist` to read all seven PDF
attachments, rebuilds the six OpenType name tables directly, and uses
`fonteditor-core` to parse and validate the source and generated fonts. It
validates the source PDF checksum, every attachment checksum, the exact
attachment set, each source family, generated internal names, and that every
non-name font table remains byte-for-byte unchanged before writing any output.
It separately checks glyph counts and Unicode cmaps. `component.txt` is copied
unchanged.

Run the typecheck and generator together with:

```sh
npm run check
```

The source PDF, generator, TypeScript configuration, and development
dependencies are repository inputs; the npm package's `files` allowlist keeps
them out of the published tarball.

## Checksums

These are checksums of the generated package files. The font checksums differ
from the original attachments because the OpenType name tables are rewritten.

```text
e63a77e5a56bff59f7c687ea2845a93b152599bdf2578ac993948a5968f6b023  component.txt
1ac77125e95b095a7a68465ab0338d414a991af7cc74e1ef54a94fba1346fbf0  irg-n2878r3-gca-Regular.ttf
f712b6d069e5ed588aa3fd974075c8ce1d179d6635fae76d50beaa67e4952aff  irg-n2878r3-gcp-Regular.ttf
df1401f4b2037ad061c152c6eb2df9c7c253e5b8a6227ad5dd1243f81e1dee69  irg-n2878r3-hcp-Regular.ttf
63525ef45cf565cb42672921f28b61876ac022e785163d55d163dce4e9c21bd7  irg-n2878r3-tcp-Regular.ttf
c13eef75f7dca3b010f5dbcdb60e040581dd38d73cda2f18d83c3d463bd9b1cf  irg-n2878r3-ucp-Regular.ttf
b70656bec7bdb71c69b4d864140013f89eee1d55438ae917b15784260614c647  irg-n2878r3-vcp-Regular.ttf
```

## npm publication status

The package metadata, public-registry configuration, asset allowlist, and CSS
entry point are prepared for npm. However, the package intentionally remains
marked `"private": true` and `"license": "UNLICENSED"` because the proposal
does not provide a public redistribution license for the attached fonts.

Before publishing:

1. Obtain standalone redistribution permission from the relevant font owners
   or proposal submitters.
2. Add the supplied license text and set the matching SPDX license identifier
   in `package.json`.
3. Remove `"private": true`.
4. Run `npm run check`.
5. Run `npm publish --access public`.

## Source

The source assets come from the seven attachments to
[IRG N2878R3](https://www.unicode.org/irg/docs/n2878r3-CJKComponents.pdf),
*Final proposal to encode CJK Unified Ideographs Components*, dated
2026-03-11. The PDF explicitly describes the six fonts and the
Unihan-compatible `component.txt` file in section 3, "Attached Data". The
packaged fonts are generated derivatives with package-specific OpenType names.

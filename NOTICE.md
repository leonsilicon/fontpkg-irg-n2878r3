# Source and licensing notice

The source PDF stored at `data/n2878r3-CJKComponents.pdf` is an unchanged copy
of:

- IRG N2878R3, *Final proposal to encode CJK Unified Ideographs Components*
- <https://www.unicode.org/irg/docs/n2878r3-CJKComponents.pdf>
- Document date: 2026-03-11
- Retrieved: 2026-07-27
- Source PDF SHA-256:
  `71d6a7d794e2edec70dc32788c5c8a4ca2f70c965a6f3b803fc7e7c3bc180fa5`

`component.txt` is extracted unchanged. The six packaged TrueType fonts are
generated derivatives of the PDF attachments. `_generate.ts` adds the
`irg-n2878r3-` filename prefix and rewrites the OpenType family, full,
preferred-family, unique, and PostScript name records to identify IRG N2878R3.
The generated font checksums therefore differ from the attachment checksums.
The generator validates that every non-name font table remains byte-for-byte
unchanged, apart from the required `head.checkSumAdjustment`, and separately
checks that glyph counts and Unicode cmaps do not change.

The source proposal does not state a public redistribution license for these
font files. Five source fonts have no copyright or license entry in their
OpenType name tables. The TCP source font contains the notice
"Copyright © CMEX, 2025", but no license entry; that notice is preserved in
the generated font.

The Unicode Terms of Use prohibit copying, extracting, or publicly
redistributing fonts from Unicode products unless a broader permission or
license applies:

<https://www.unicode.org/copyright.html>

For that reason this package is marked `private` and `UNLICENSED`. It is
intended only to organize a local copy obtained from the official proposal.
Do not publish or redistribute this package until the relevant font owners or
submitters provide permission that covers standalone redistribution.

No ownership of the fonts or glyph designs is claimed by this package's
maintainer. The package metadata, stylesheet, and documentation do not add a
license to the underlying font files.

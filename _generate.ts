import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Font } from "fonteditor-core";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
const PDF_PATH = resolve(ROOT_DIR, "data/n2878r3-CJKComponents.pdf");
const PDF_SHA256 =
  "71d6a7d794e2edec70dc32788c5c8a4ca2f70c965a6f3b803fc7e7c3bc180fa5";

type FontSpec = Readonly<{
  attachmentName: string;
  attachmentSha256: string;
  outputName: string;
  sourceFamily: string;
  family: string;
  postScriptName: string;
}>;

const FONT_SPECS: readonly FontSpec[] = [
  {
    attachmentName: "gca-Regular.ttf",
    attachmentSha256:
      "be01beafaa55f86c74f398d82e8c17643ae3293985a3ebab3309633057c6157e",
    outputName: "irg-n2878r3-gca-Regular.ttf",
    sourceFamily: "gca",
    family: "IRG N2878R3 GCA",
    postScriptName: "IRG-N2878R3-GCA-Regular",
  },
  {
    attachmentName: "gcp-Regular.ttf",
    attachmentSha256:
      "ec4c85144a993e4a9621bc140eda46f17283bd56610e33c0f616e1019a82a465",
    outputName: "irg-n2878r3-gcp-Regular.ttf",
    sourceFamily: "gcp",
    family: "IRG N2878R3 GCP",
    postScriptName: "IRG-N2878R3-GCP-Regular",
  },
  {
    attachmentName: "hcp-Regular.ttf",
    attachmentSha256:
      "5645348704c418739c8331477804baaf19f665af4b5d675f58efc2da8716223d",
    outputName: "irg-n2878r3-hcp-Regular.ttf",
    sourceFamily: "hcp",
    family: "IRG N2878R3 HCP",
    postScriptName: "IRG-N2878R3-HCP-Regular",
  },
  {
    attachmentName: "tcp-Regular.ttf",
    attachmentSha256:
      "45bd636018cd55741d81b34a83231909693f83fca06989d874e93cf50f42cc55",
    outputName: "irg-n2878r3-tcp-Regular.ttf",
    sourceFamily: "IRGN2878R2a_TCP",
    family: "IRG N2878R3 TCP",
    postScriptName: "IRG-N2878R3-TCP-Regular",
  },
  {
    attachmentName: "ucp-Regular.ttf",
    attachmentSha256:
      "6563b189ffee975b5c775bdbbada66262674de392005103de521b9e5d0ab6982",
    outputName: "irg-n2878r3-ucp-Regular.ttf",
    sourceFamily: "ucp",
    family: "IRG N2878R3 UCP",
    postScriptName: "IRG-N2878R3-UCP-Regular",
  },
  {
    attachmentName: "vcp-Regular.ttf",
    attachmentSha256:
      "2d2c41d5da05644598fa69857b7b145e94e24cd696a50db547ab3bd61cb0f63e",
    outputName: "irg-n2878r3-vcp-Regular.ttf",
    sourceFamily: "vcp",
    family: "IRG N2878R3 VCP",
    postScriptName: "IRG-N2878R3-VCP-Regular",
  },
];

const COMPONENT_ATTACHMENT = {
  attachmentName: "component.txt",
  attachmentSha256:
    "e63a77e5a56bff59f7c687ea2845a93b152599bdf2578ac993948a5968f6b023",
  outputName: "component.txt",
} as const;

const EXPECTED_ATTACHMENT_NAMES = new Set([
  COMPONENT_ATTACHMENT.attachmentName,
  ...FONT_SPECS.map(({ attachmentName }) => attachmentName),
]);

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function requireAttachment(
  attachments: ReadonlyMap<string, Uint8Array>,
  name: string,
  expectedSha256: string,
): Uint8Array {
  const content = attachments.get(name);
  if (!content) {
    throw new Error(`Missing PDF attachment: ${name}`);
  }

  const actualSha256 = sha256(content);
  if (actualSha256 !== expectedSha256) {
    throw new Error(
      `Unexpected SHA-256 for ${name}: expected ${expectedSha256}, got ${actualSha256}`,
    );
  }

  return content;
}

function codePoints(font: ReturnType<typeof Font.create>): string[] {
  return Object.keys(font.get().cmap).sort((left, right) => +left - +right);
}

type SfntTable = Readonly<{
  tag: string;
  data: Buffer;
}>;

type NameRecord = Readonly<{
  platformId: number;
  encodingId: number;
  languageId: number;
  nameId: number;
  value: Buffer;
}>;

function uint32Checksum(data: Uint8Array): number {
  const paddedLength = Math.ceil(data.length / 4) * 4;
  const padded = Buffer.alloc(paddedLength);
  Buffer.from(data).copy(padded);

  let sum = 0;
  for (let offset = 0; offset < padded.length; offset += 4) {
    sum = (sum + padded.readUInt32BE(offset)) >>> 0;
  }
  return sum;
}

function parseSfntTables(source: Uint8Array): {
  sfntHeader: Buffer;
  tables: SfntTable[];
} {
  const buffer = Buffer.from(source);
  if (buffer.length < 12) {
    throw new Error("Invalid sfnt: missing offset table");
  }

  const numTables = buffer.readUInt16BE(4);
  const directoryEnd = 12 + numTables * 16;
  if (directoryEnd > buffer.length) {
    throw new Error("Invalid sfnt: truncated table directory");
  }

  const tables: SfntTable[] = [];
  for (let index = 0; index < numTables; index += 1) {
    const recordOffset = 12 + index * 16;
    const tag = buffer.toString("ascii", recordOffset, recordOffset + 4);
    const offset = buffer.readUInt32BE(recordOffset + 8);
    const length = buffer.readUInt32BE(recordOffset + 12);
    if (offset + length > buffer.length) {
      throw new Error(`Invalid sfnt table bounds for ${JSON.stringify(tag)}`);
    }
    tables.push({ tag, data: Buffer.from(buffer.subarray(offset, offset + length)) });
  }

  return { sfntHeader: Buffer.from(buffer.subarray(0, 12)), tables };
}

function encodeName(value: string, platformId: number): Buffer {
  if (platformId === 1) {
    if (!/^[\x20-\x7e]*$/u.test(value)) {
      throw new Error(`Cannot safely encode non-ASCII Macintosh name: ${value}`);
    }
    return Buffer.from(value, "ascii");
  }

  const utf16 = Buffer.from(value, "utf16le");
  utf16.swap16();
  return utf16;
}

function buildNameTable(source: Uint8Array, spec: FontSpec): Buffer {
  const buffer = Buffer.from(source);
  if (buffer.length < 6) {
    throw new Error(`Invalid name table in ${spec.attachmentName}`);
  }

  const format = buffer.readUInt16BE(0);
  const count = buffer.readUInt16BE(2);
  const stringOffset = buffer.readUInt16BE(4);
  if (format !== 0) {
    throw new Error(
      `Unsupported name-table format ${format} in ${spec.attachmentName}`,
    );
  }
  if (6 + count * 12 > buffer.length || stringOffset > buffer.length) {
    throw new Error(`Truncated name table in ${spec.attachmentName}`);
  }

  const fullName = `${spec.family} Regular`;
  const replacements = new Map<number, string>([
    [1, spec.family],
    [2, "Regular"],
    [3, `${fullName}:Version 1.000`],
    [4, fullName],
    [6, spec.postScriptName],
    [16, spec.family],
    [17, "Regular"],
  ]);
  const records: NameRecord[] = [];

  for (let index = 0; index < count; index += 1) {
    const recordOffset = 6 + index * 12;
    const platformId = buffer.readUInt16BE(recordOffset);
    const encodingId = buffer.readUInt16BE(recordOffset + 2);
    const languageId = buffer.readUInt16BE(recordOffset + 4);
    const nameId = buffer.readUInt16BE(recordOffset + 6);
    const length = buffer.readUInt16BE(recordOffset + 8);
    const offset = buffer.readUInt16BE(recordOffset + 10);
    const valueStart = stringOffset + offset;
    const valueEnd = valueStart + length;
    if (valueEnd > buffer.length) {
      throw new Error(`Invalid name record in ${spec.attachmentName}`);
    }

    const replacement = replacements.get(nameId);
    records.push({
      platformId,
      encodingId,
      languageId,
      nameId,
      value:
        replacement === undefined
          ? Buffer.from(buffer.subarray(valueStart, valueEnd))
          : encodeName(replacement, platformId),
    });
  }

  for (const [preferredId, sourceId] of [
    [16, 1],
    [17, 2],
  ] as const) {
    if (records.some(({ nameId }) => nameId === preferredId)) {
      continue;
    }
    const templates = records.filter(({ nameId }) => nameId === sourceId);
    for (const template of templates) {
      records.push({
        ...template,
        nameId: preferredId,
        value: encodeName(replacements.get(preferredId)!, template.platformId),
      });
    }
  }

  records.sort(
    (left, right) =>
      left.platformId - right.platformId ||
      left.encodingId - right.encodingId ||
      left.languageId - right.languageId ||
      left.nameId - right.nameId,
  );

  const generatedStringOffset = 6 + records.length * 12;
  const outputLength =
    generatedStringOffset +
    records.reduce((total, { value }) => total + value.length, 0);
  const output = Buffer.alloc(outputLength);
  output.writeUInt16BE(0, 0);
  output.writeUInt16BE(records.length, 2);
  output.writeUInt16BE(generatedStringOffset, 4);

  let valueOffset = 0;
  records.forEach((record, index) => {
    const recordOffset = 6 + index * 12;
    output.writeUInt16BE(record.platformId, recordOffset);
    output.writeUInt16BE(record.encodingId, recordOffset + 2);
    output.writeUInt16BE(record.languageId, recordOffset + 4);
    output.writeUInt16BE(record.nameId, recordOffset + 6);
    output.writeUInt16BE(record.value.length, recordOffset + 8);
    output.writeUInt16BE(valueOffset, recordOffset + 10);
    record.value.copy(output, generatedStringOffset + valueOffset);
    valueOffset += record.value.length;
  });

  return output;
}

function buildSfnt(sfntHeader: Buffer, tables: readonly SfntTable[]): Buffer {
  const directoryLength = 12 + tables.length * 16;
  const outputLength = tables.reduce(
    (total, { data }) => total + Math.ceil(data.length / 4) * 4,
    directoryLength,
  );
  const output = Buffer.alloc(outputLength);
  sfntHeader.copy(output, 0);

  let tableOffset = directoryLength;
  let headOffset: number | undefined;
  tables.forEach(({ tag, data }, index) => {
    const tableData = Buffer.from(data);
    if (tag === "head") {
      if (tableData.length < 12) {
        throw new Error("Invalid head table");
      }
      tableData.writeUInt32BE(0, 8);
      headOffset = tableOffset;
    }

    const recordOffset = 12 + index * 16;
    output.write(tag, recordOffset, 4, "ascii");
    output.writeUInt32BE(uint32Checksum(tableData), recordOffset + 4);
    output.writeUInt32BE(tableOffset, recordOffset + 8);
    output.writeUInt32BE(tableData.length, recordOffset + 12);
    tableData.copy(output, tableOffset);
    tableOffset += Math.ceil(tableData.length / 4) * 4;
  });

  if (headOffset === undefined) {
    throw new Error("Font has no head table");
  }
  const checkSumAdjustment = (0xb1b0afba - uint32Checksum(output)) >>> 0;
  output.writeUInt32BE(checkSumAdjustment, headOffset + 8);
  return output;
}

function rewriteNames(source: Uint8Array, spec: FontSpec): Buffer {
  const { sfntHeader, tables } = parseSfntTables(source);
  if (tables.filter(({ tag }) => tag === "name").length !== 1) {
    throw new Error(`${spec.attachmentName} must contain exactly one name table`);
  }

  const rewrittenTables = tables.map((table) =>
    table.tag === "name"
      ? { ...table, data: buildNameTable(table.data, spec) }
      : table,
  );
  return buildSfnt(sfntHeader, rewrittenTables);
}

function validateUnchangedTables(source: Uint8Array, generated: Uint8Array): void {
  const sourceTables = parseSfntTables(source).tables;
  const generatedTables = new Map(
    parseSfntTables(generated).tables.map((table) => [table.tag, table.data]),
  );

  if (sourceTables.length !== generatedTables.size) {
    throw new Error("The generated font has a different table count");
  }

  for (const sourceTable of sourceTables) {
    const generatedTable = generatedTables.get(sourceTable.tag);
    if (!generatedTable) {
      throw new Error(`The generated font is missing table ${sourceTable.tag}`);
    }
    if (sourceTable.tag === "name") {
      continue;
    }

    const expected = Buffer.from(sourceTable.data);
    const actual = Buffer.from(generatedTable);
    if (sourceTable.tag === "head") {
      expected.writeUInt32BE(0, 8);
      actual.writeUInt32BE(0, 8);
    }
    if (!expected.equals(actual)) {
      throw new Error(
        `Non-name table ${sourceTable.tag} changed during generation`,
      );
    }
  }
}

function generateFont(source: Uint8Array, spec: FontSpec): Buffer {
  const sourceFont = Font.create(Buffer.from(source), {
    type: "ttf",
    hinting: true,
    compound2simple: false,
  });
  const sourceData = sourceFont.get();

  if (sourceData.name.fontFamily !== spec.sourceFamily) {
    throw new Error(
      `${spec.attachmentName} has family ${JSON.stringify(sourceData.name.fontFamily)}; ` +
        `expected ${JSON.stringify(spec.sourceFamily)}`,
    );
  }

  const sourceGlyphCount = sourceData.glyf.length;
  const sourceCodePoints = codePoints(sourceFont);
  const fullName = `${spec.family} Regular`;
  const output = rewriteNames(source, spec);
  validateUnchangedTables(source, output);
  const generated = Font.create(output, {
    type: "ttf",
    hinting: true,
    compound2simple: false,
  });
  const generatedData = generated.get();

  if (
    generatedData.name.fontFamily !== spec.family ||
    generatedData.name.fullName !== fullName ||
    generatedData.name.postScriptName !== spec.postScriptName
  ) {
    throw new Error(`Generated name-table validation failed for ${spec.outputName}`);
  }

  if (generatedData.glyf.length !== sourceGlyphCount) {
    throw new Error(`Glyph count changed while generating ${spec.outputName}`);
  }

  const generatedCodePoints = codePoints(generated);
  if (generatedCodePoints.join(",") !== sourceCodePoints.join(",")) {
    throw new Error(`Unicode cmap changed while generating ${spec.outputName}`);
  }

  return output;
}

async function readAttachments(
  pdfBytes: Uint8Array,
): Promise<Map<string, Uint8Array>> {
  const loadingTask = getDocument({ data: pdfBytes });

  try {
    const pdf = await loadingTask.promise;
    const catalogAttachments = await pdf.getAttachments();
    if (!catalogAttachments) {
      throw new Error("The source PDF has no attachments");
    }

    const attachments = new Map<string, Uint8Array>();
    for (const [id, attachment] of catalogAttachments) {
      if (attachments.has(attachment.filename)) {
        throw new Error(`Duplicate PDF attachment: ${attachment.filename}`);
      }

      const content =
        attachment.content ?? (await pdf.getAttachmentContent(id));
      if (!content) {
        throw new Error(`Unable to read PDF attachment: ${attachment.filename}`);
      }

      attachments.set(attachment.filename, content);
    }

    const actualNames = new Set(attachments.keys());
    const unexpectedNames = [...actualNames].filter(
      (name) => !EXPECTED_ATTACHMENT_NAMES.has(name),
    );
    const missingNames = [...EXPECTED_ATTACHMENT_NAMES].filter(
      (name) => !actualNames.has(name),
    );
    if (unexpectedNames.length > 0 || missingNames.length > 0) {
      throw new Error(
        `Unexpected attachment set; missing=${JSON.stringify(missingNames)}, ` +
          `extra=${JSON.stringify(unexpectedNames)}`,
      );
    }

    return attachments;
  } finally {
    await loadingTask.destroy();
  }
}

async function main(): Promise<void> {
  const pdfBuffer = await readFile(PDF_PATH);
  if (sha256(pdfBuffer) !== PDF_SHA256) {
    throw new Error(
      `Source PDF checksum mismatch. Expected ${PDF_SHA256} for ${PDF_PATH}`,
    );
  }

  const attachments = await readAttachments(new Uint8Array(pdfBuffer));
  const generatedFonts = FONT_SPECS.map((spec) => {
    const source = requireAttachment(
      attachments,
      spec.attachmentName,
      spec.attachmentSha256,
    );
    return { spec, output: generateFont(source, spec) };
  });
  const component = requireAttachment(
    attachments,
    COMPONENT_ATTACHMENT.attachmentName,
    COMPONENT_ATTACHMENT.attachmentSha256,
  );

  await Promise.all([
    ...generatedFonts.map(({ spec, output }) =>
      writeFile(resolve(ROOT_DIR, spec.outputName), output),
    ),
    writeFile(resolve(ROOT_DIR, COMPONENT_ATTACHMENT.outputName), component),
  ]);

  console.log(`Read 7 attachments from ${PDF_PATH}`);
  for (const { spec, output } of generatedFonts) {
    console.log(
      `Generated ${spec.outputName} (${output.length} bytes, ${sha256(output)})`,
    );
  }
  console.log(
    `Generated ${COMPONENT_ATTACHMENT.outputName} (${component.length} bytes)`,
  );
}

await main();

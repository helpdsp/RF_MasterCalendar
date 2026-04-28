import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

async function run() {
  try {
    const buf = readFileSync('refdocs/SWUK_Prepayment_SOW_V2.pdf');
    const parser = new PDFParse({ data: buf });
    const result = await parser.getText();
    console.log(result.text.substring(0, 9000));
    await parser.destroy();
  } catch (e) {
    console.error('ERR', e.message);
  }
}

run();

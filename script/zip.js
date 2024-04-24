/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { build } from 'esbuild';
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const AdmZip = require("adm-zip");

function createZipArchive(target) {
  const zip = new AdmZip();
  const outputFile = `build/${target}.zip`;
  zip.addLocalFolder(`build/${target}`);
  zip.writeZip(outputFile);
}

module.exports = {
	createZipArchive,
};


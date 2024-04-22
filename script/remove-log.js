/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { build } from 'esbuild';
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const esbuild = require('esbuild');
const { glob } = require('glob');
const AdmZip = require("adm-zip");
const yargs = require('yargs/yargs');  
const { hideBin } = require('yargs/helpers');  
const argv = yargs(hideBin(process.argv)).argv;  
  
const { target , zip } = argv;


async function done() {
	const jsfiles = await glob(`build/${target || ''}/*/*.js`);
	jsfiles.forEach(async (file) => {
		await esbuild.build({
			entryPoints: [file],
			drop: ['console'],
			allowOverwrite: true,
			outfile: file,
		});
	});
	if (zip && target) {
		createZipArchive();
	}
}
done();


async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = `build/${target}.zip`;
  zip.addLocalFolder(`build/${target}`);
  zip.writeZip(outputFile);
  console.log(`Created ${outputFile} successfully`);
}



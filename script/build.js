/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require('yargs/yargs');  
const { hideBin } = require('yargs/helpers');
const { createZipArchive } = require('./zip');
const { transcode } = require('./transcode');
const argv = yargs(hideBin(process.argv)).argv;  
const { target , zip, mv2, rl } = argv;

async function run() {
	if (!target) return;
	await transcode(target, { mv2, rl });
	if (zip) {
		createZipArchive(target);
	}
}

run();
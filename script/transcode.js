/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const { glob } = require('glob');
const fse = require('fs-extra');
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const types = require('@babel/types');
const generate = require('@babel/generator');
const { getMutliLevelProperty } = require('./utils');
const MV2_APIS = ['chrome.runtime.sendMessage', 'chrome.management.getAll'];
async function removeLogByEsbuild(target) {
	const jsfiles = await glob(`build/${target || ''}/*/*.js`);
	jsfiles.forEach(async (file) => {
		await esbuild.build({
			entryPoints: [file],
			drop: ['console'],
			allowOverwrite: true,
			outfile: file,
		});
	});
}
/**
 * 
 * @param {*} target 
 * @param {*} config  rl 删除console
 */
async function transcode(target, config = {}) {
	const { rl, mv2 } = config;
	const jsfiles = await glob(`build/${target || ''}/**/*.js`);
	jsfiles.forEach(async (file) => {
		// 读取文件  
		const content = await fse.readFile(file, 'utf8');
		const ast = parser.parse(content, {});
		await traverse.default(ast, {
			CallExpression(p){
				// 删除 console
				if (rl && types.isMemberExpression(p.node.callee) 
					&& p.node.callee.object.name === 'console'
					&& ['log', 'info', 'warn', 'error'].includes(p.node.callee.property.name)) { 
						p.replaceWith(types.blockStatement([]));
				}

				// 转换 .then 回调函数
				if (mv2 ) {
					MV2_APIS.forEach(apistr => {
						const [isThen, apiExp ] = checkTransThen(p, apistr);
						if (isThen  && apiExp) {
							const isCatch = getMutliLevelProperty(p, 'parent.property.name', '') === 'catch';
							if (isCatch) {
								const parentNd = p.find(parent => {
									const isCatch = getMutliLevelProperty(parent, 'node.callee.property.name', '') === 'catch';
									return isCatch;
								});
								if (parentNd) {
									apiExp.arguments = [...apiExp.arguments, ...p.node.arguments];
									parentNd.replaceWith(apiExp);
								} 
							} else {
								apiExp.arguments = [...apiExp.arguments, ...p.node.arguments];
								p.replaceWith(apiExp);
							}
							p.skip();
						}
					});
				}
			}
		});
		const { code } = await generate.default(ast, {
			jsescOption: {
				minimal: true, // 避免中文乱码
			},
		},);
		await fse.writeFile(file, code,  "utf-8");
	});
}

function checkTransThen(pNd, apistr) {
	if(!pNd) return [false];
	const isThen = getMutliLevelProperty(pNd.node, 'callee.property.name', '') === 'then';
	if (!isThen) return [false];
	if (types.isCallExpression(pNd.node.callee.object)) { 
		const t = getMutliLevelProperty(pNd.node.callee.object, 'callee.property.name', '');
		const s = getMutliLevelProperty(pNd.node.callee.object, 'callee.object.property.name', '');
		const o = getMutliLevelProperty(pNd.node.callee.object, 'callee.object.object.name', '');
		return [apistr === `${o}.${s}.${t}`, pNd.node.callee.object];
	}
	return [false];
}

module.exports = {
	removeLogByEsbuild,
	transcode,
};
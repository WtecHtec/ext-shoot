/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');

// 获取命令行参数中的路径
const dirPath = path.resolve("./build/" + argv.path || './build/chrome-mv3-prod');
const manifestPath = path.join(dirPath, 'manifest.json');

// 读取manifest.json文件
const manifest = require(manifestPath);

// 获取所有声明的权限
const permissions = manifest.permissions || [];

console.log('插件申请的权限:');
console.log(permissions);
// 递归遍历文件夹并读取文件内容
function readFiles(dir) {
    const results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results.push(...readFiles(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}

// 创建正则表达式来匹配权限使用情况
function createPermissionRegex(permission) {
    return new RegExp(`\\bchrome\\.${permission}\\b`, 'g');
}

// 搜索权限使用情况
function checkPermissionsUsage(files) {
    const unusedPermissions = [...permissions];
    const permissionRegexes = permissions.map(createPermissionRegex);

    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        permissionRegexes.forEach((regex, index) => {
            if (regex.test(content)) {
                const permission = permissions[index];
                const unusedIndex = unusedPermissions.indexOf(permission);
                if (unusedIndex !== -1) {
                    unusedPermissions.splice(unusedIndex, 1);
                }
            }
        });
    });

    return unusedPermissions;
}

// 获取项目中的所有JavaScript文件
const files = readFiles(dirPath);

// 检查未使用的权限
const unusedPermissions = checkPermissionsUsage(files);

if (unusedPermissions.length) {
    console.error('\x1b[31m以下权限未使用:');
    unusedPermissions.forEach(permission => console.error(`\x1b[31m${permission}`));
    process.exit(1); // 报错退出
} else {
    console.log('\x1b[32m所有权限均被使用。');
}

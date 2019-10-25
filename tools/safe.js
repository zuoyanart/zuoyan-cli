const shell = require('shelljs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Nunjucks = require('./nunjucks');
const fs = require('fs-extra');
const path = require('path');
const logSymbols = require('log-symbols');
const os = require('os');

module.exports = class {
  static thinkjs() {
    // 更改think-loader方法
    const exePath = process.cwd();
    const thinkLoaderPath = path.join(exePath, '/node_modules/think-loader/loader/common.js');
    let thinkLoader = fs.readFileSync(thinkLoaderPath).toString();
    thinkLoader = thinkLoader.replace(/\/\\\.js\$\//g, '/\\.(js|jsc)$/');
    fs.writeFileSync(thinkLoaderPath, thinkLoader);
    const srcPath = path.join(exePath, '/src');
    const srcModel = fs.readdirSync(srcPath);
    for (let i = 0, len = srcModel.length; i < len; i++) {
      if (srcModel[i] !== 'common') {
        // 编译js文件
        shell.exec('bytenode -c  ./src/' + srcModel[i] + '/**/*.js');
        // 删除js文件，只保留编译后的文件
        shell.exec('rm -if ./src/' + srcModel[i] + '/**/*.js|egrep -v base.js');
      }
    }
    // console.log(a);
    // shell.exec();
  }
};

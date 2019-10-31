const shelljs = require('shelljs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const logSymbols = require('log-symbols');
const os = require('os');
const bytenode = require('bytenode');
// const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = class {
  /**
   * 格式化thinkjs 项目
   */
  thinkjsFormat() {
    // 更改think-loader方法
    const exePath = process.cwd();
    // 更新loader可以加载jsc文件
    const thinkLoaderPath = path.join(exePath, '/node_modules/think-loader/loader/common.js');
    let thinkLoader = fs.readFileSync(thinkLoaderPath).toString();
    thinkLoader = thinkLoader.replace(/\/\\\.js\$\//g, '/\\.(js|jsc)$/');
    fs.writeFileSync(thinkLoaderPath, thinkLoader);
    // 更新router loader，可以加载router.jsc
    const thinkLoaderRouterPath = path.join(exePath, '/node_modules/think-loader/loader/router.js');
    thinkLoader = fs.readFileSync(thinkLoaderRouterPath).toString();
    if (thinkLoader.indexOf('.jsc') === -1) {
      thinkLoader = thinkLoader.replace(/router\.js/g, 'router.jsc');
      fs.writeFileSync(thinkLoaderRouterPath, thinkLoader);
    }
    // 更新devlopment.js
    const thinkDevPath = path.join(exePath, '/development.js');
    thinkLoader = fs.readFileSync(thinkDevPath).toString();
    if (thinkLoader.indexOf('bytenode') === -1) {
      thinkLoader = "require('bytenode');" + thinkLoader;
      fs.writeFileSync(thinkDevPath, thinkLoader);
    }
    // 更新production.js
    const thinkProPath = path.join(exePath, '/production.js');
    thinkLoader = fs.readFileSync(thinkProPath).toString();
    if (thinkLoader.indexOf('bytenode') === -1) {
      thinkLoader = "require('bytenode');" + thinkLoader;
      fs.writeFileSync(thinkProPath, thinkLoader);
    }
  }
  /**
   * thinkjs 项目加密
   */
  thinkjs() {
    console.log(logSymbols.error, chalk.red('nodejs版本必须为10.15.x，现测试12.x和13.x存在undefined问题'));
    shelljs.exec('npm i bytenode');
    // 更改think-loader方法
    const exePath = process.cwd();
    // 更新loader可以加载jsc文件
    const thinkLoaderPath = path.join(exePath, '/node_modules/think-loader/loader/common.js');
    let thinkLoader = fs.readFileSync(thinkLoaderPath).toString();
    thinkLoader = thinkLoader.replace(/\/\\\.js\$\//g, '/\\.(js|jsc)$/');
    fs.writeFileSync(thinkLoaderPath, thinkLoader);
    // 更新router loader，可以加载router.jsc
    const thinkLoaderRouterPath = path.join(exePath, '/node_modules/think-loader/loader/router.js');
    thinkLoader = fs.readFileSync(thinkLoaderRouterPath).toString();
    if (thinkLoader.indexOf('.jsc') === -1) {
      thinkLoader = thinkLoader.replace(/router\.js/g, 'router.jsc');
      fs.writeFileSync(thinkLoaderRouterPath, thinkLoader);
    }
    // 更新devlopment.js
    const thinkDevPath = path.join(exePath, '/development.js');
    thinkLoader = fs.readFileSync(thinkDevPath).toString();
    if (thinkLoader.indexOf('bytenode') === -1) {
      thinkLoader = "require('bytenode');" + thinkLoader;
      fs.writeFileSync(thinkDevPath, thinkLoader);
    }
    // 更新production.js
    const thinkProPath = path.join(exePath, '/production.js');
    thinkLoader = fs.readFileSync(thinkProPath).toString();
    if (thinkLoader.indexOf('bytenode') === -1) {
      thinkLoader = "require('bytenode');" + thinkLoader;
      fs.writeFileSync(thinkProPath, thinkLoader);
    }

    const srcPath = path.join(exePath, '/src');
    const srcModel = fs.readdirSync(srcPath);

    for (let i = 0, len = srcModel.length; i < len; i++) {
      console.log(chalk.green('开始编译：' + srcModel[i]));
      if (srcModel[i] !== 'common11') {
        const fileList = this._findAllFile(path.join(srcPath, '/' + srcModel[i]));
        for (let j = 0, jlen = fileList.length; j < jlen; j++) {
          let content = fs.readFileSync(fileList[j]).toString();
          // match正则：/require\(\'.*\.js\'\)/
          const matchs = content.match(/require\(\'\..*\'\)/g);
          if (matchs) {
            for (let m = 0, mlen = matchs.length; m < mlen; m++) {
              const matchItem = matchs[m];
              if (matchItem.indexOf('.jsc\')') > -1) {
                continue;
              }
              if (matchItem.indexOf('.js\')') > -1) {
                content = content.replace(matchItem, matchItem.replace(/\.js/g, '.jsc'));
              } else if (matchItem.endsWith('/\')')) {
                content = content.replace(matchItem, matchItem.replace('/\')', '/index.jsc\')'));
              } else {
                content = content.replace(matchItem, matchItem.replace('\')', '.jsc\')'));
              }
            }
          }
          fs.writeFileSync(fileList[j], content);
          if (fileList[j].indexOf('master.js') === -1 && fileList[j].indexOf('worker.js') === -1) {
            // const obfuscationResult = JavaScriptObfuscator.obfuscate(fs.readFileSync(fileList[j]).toString());
            // fs.writeFileSync(fileList[j], obfuscationResult.getObfuscatedCode());
            bytenode.compileFile({
              filename: fileList[j]
            });
          }
        }
        // // 删除js文件，只保留编译后的文件
        console.log('开始删除js文件');
        for (let j = 0, jlen = fileList.length; j < jlen; j++) {
          if (fileList[j].indexOf('master.js') === -1 && fileList[j].indexOf('worker.js') === -1) {
            fs.unlinkSync(fileList[j]);
          }
        }
      }
    }
  }
  /**
   * 遍历获取所有js文件
   * @param {*} dir
   */
  _findAllFile(dir = '') {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = dir + '/' + file;
      var stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(this._findAllFile(file));
      } else if (file.endsWith('.js') && file.indexOf('config/config.') === -1 && file.indexOf('config/adapter.') === -1 && file.indexOf('config/extend') === -1 && file.indexOf('middleware.js') === -1 && file.indexOf('validator.js') === -1 && file.indexOf('common/extend') === -1) {
        results.push(file);
      }
    });
    return results;
  }
};

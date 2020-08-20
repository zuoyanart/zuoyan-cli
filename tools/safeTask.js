const shelljs = require('shelljs');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const bytenode = require('bytenode');
// const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = class {
  /**
   * 格式化task 项目
   */
  taskFormat() {
    // 更改think-loader方法
    const exePath = process.cwd();
    // 更新devlopment.js
    const thinkDevPath = path.join(exePath, '/development.js');
    let thinkLoader = fs.readFileSync(thinkDevPath).toString();
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
   * task 项目加密
   */
  task() {
    shelljs.exec('npm i bytenode');
    // 更改think-loader方法
    const exePath = process.cwd();
    // 更新devlopment.js
    const thinkDevPath = path.join(exePath, '/development.js');
    let thinkLoader = fs.readFileSync(thinkDevPath).toString();
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
      const fileList = this._findAllFile(path.join(srcPath, '/' + srcModel[i]));
      for (let j = 0, jlen = fileList.length; j < jlen; j++) {
        let content = fs.readFileSync(fileList[j]).toString();
        // match正则：/require\(\'.*\.js\'\)/
        const matchs = content.match(/require\(\'\..*\'\)/g);
        if (matchs) {
          for (let m = 0, mlen = matchs.length; m < mlen; m++) {
            const matchItem = matchs[m];
            if (matchItem.indexOf('.jsc\')') > -1 || matchItem.indexOf('config/') > -1) {
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
        bytenode.compileFile({
          filename: fileList[j]
        });
      }
      // // 删除js文件，只保留编译后的文件
      console.log('开始删除js文件');
      for (let j = 0, jlen = fileList.length; j < jlen; j++) {
        fs.unlinkSync(fileList[j]);
      }
    }
  }
  /**
   * 遍历获取所有js文件
   * @param {*} dir
   */
  _findAllFile(dir = '') {
    let results = [];
    const stat = fs.statSync(dir);
    if (stat && stat.isFile()) {
      if (dir.endsWith('.js')) {
        results.push(dir);
        return results;
      }
      return results;
    }
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(this._findAllFile(file));
      } else if (file.endsWith('.js') && file.indexOf('config/') === -1) {
        results.push(file);
      }
    });
    return results;
  }
};
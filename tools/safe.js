const shell = require('shelljs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Nunjucks = require('./nunjucks');
const fs = require('fs-extra');
const path = require('path');
const logSymbols = require('log-symbols');
const os = require('os');

module.exports = class {
  thinkjs() {
    // 更改think-loader方法
    const exePath = process.cwd();
    // console.log(path.resolve(__dirname, '../node_modules/bytenode/cli.js').toString() + ' -c ' + srcPath + '/' + srcModel[i] + '/**/*.js');
    // return;
    const thinkLoaderPath = path.join(exePath, '/node_modules/think-loader/loader/common.js');
    let thinkLoader = fs.readFileSync(thinkLoaderPath).toString();
    thinkLoader = thinkLoader.replace(/\/\\\.js\$\//g, '/\\.(js|jsc)$/');
    fs.writeFileSync(thinkLoaderPath, thinkLoader);
    const srcPath = path.join(exePath, '/src');
    const srcModel = fs.readdirSync(srcPath);

    for (let i = 0, len = srcModel.length; i < len; i++) {
      if (srcModel[i] !== 'common1') {
        const fileList = this._findAllFile(path.join(srcPath, '/' + srcModel[i]));
        for (let j = 0, jlen = fileList.length; j < jlen; j++) {
          let content = fs.readFileSync(fileList[j]).toString();
          //match正则：/require\(\'.*\.js\'\)/
          let matchs = content.match(/require\(\'\..*\'\)/g);
          if (matchs) {
            console.log(fileList[j]);
            for (let m = 0, mlen = matchs.length; m < mlen; m++) {
              const matchItem = matchs[m];
              console.log(matchs[m]);
              console.log(matchItem.indexOf('.js)'));
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
        }
        // 编译js文件
        console.log('开始编译js文件');
        shell.exec('node ' + path.resolve(__dirname, '../node_modules/bytenode/cli.js').toString() + ' -c ' + srcPath + '/' + srcModel[i] + '/**/*.js');
        // // 删除js文件，只保留编译后的文件
        console.log('开始删除js文件');
        for (let j = 0, jlen = fileList.length; j < jlen; j++) {
          // fs.unlinkSync(fileList[j]);
        }
      }
    }
  }
  /**
   * 遍历获取所有js文件
   * @param {*} dir 
   */
  _findAllFile(dir = '') {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach((file) => {
      file = dir + '/' + file
      var stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        results = results.concat(this._findAllFile(file));
      } else if (file.endsWith('.js') && file.indexOf('config.') === -1 && file.indexOf('adapter.') === -1) {
        results.push(file);
      }
    })
    return results
  }
}
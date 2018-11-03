const nunjucks = require('nunjucks');
const fs = require('fs-extra');

module.exports = class {
  /**
   *  解析
   * @param {*} tplFilePath
   * @param {*} data
   * @param {*} topath
   */
  async render(tplFilePath, data, topath) {
    const env = nunjucks.configure('/', {
      noCache: true,
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true,
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    });
    env.addFilter('toBigCamelCase', this.toBigCamelCase);
    const renderer = () => {
      return new Promise((resolve, reject) => {
        nunjucks.render(tplFilePath, data, (err, doc) => {
          if (err) {
            return reject(err);
          }
          resolve(doc);
        });
      });
    };
    const info = await renderer();
    this.toFile(topath, info);
  }
  /**
   *  _转换为大驼峰
   * @param {*} str
   */
  toBigCamelCase(str) {
    if (str === '' || !str) {
      return 'a899';
    }
    var a = str.split('_');
    str = str.substring(a[0].length + 1, str.length);
    var re = /_(\w)/g;
    return str.replace(re, function($0, $1) {
      return $1.toUpperCase();
    });
  }
  /**
   * 生成文件
   * @param {*} path
   * @param {*} info
   */
  toFile(topath, info) {
    fs.outputFileSync(topath, info);
  }
};

#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');

program.version('1.0.18', '-v, --version')
  .command('template <name>')
  .action((name) => {
    cmd.templateApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('templatecms <name>')
  .action((name) => {
    cmd.templateCmsApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('depolyapp <name>')
  .action((name) => {
    cmd.depoly(name);
  });
/**
 * 部署git协议的项目
 */
program.command('depolyh5 <name>')
  .action((name) => {
    cmd.depolyH5(name);
  });
/**
 * 重新生成ssl证书
 */
program.command('ressl')
  .action((name) => {
    cmd.ressl(name);
  });
/**
 * 配置服务器环境
 */
program.command('install <name>')
  .action((name) => {
    cmd.install(name);
  });


program.parse(process.argv);
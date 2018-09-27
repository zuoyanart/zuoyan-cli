#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');

program.version('1.0.0', '-v, --version')
  .command('template <name>')
  .action((name) => {
    cmd.templateApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('depoly <name>')
  .action((name) => {
    cmd.depoly(name);
  });
/**
 * 配置服务器环境
 */
program.command('install <name>')
  .action((name) => {
    cmd.install(name);
  });


program.parse(process.argv);
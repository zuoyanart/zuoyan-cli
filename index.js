#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');

program.version('1.0.0', '-v, --version')
  .command('template <name>', 'create project by template[api,cms,vue].')
  .action((name) => {
    cmd.templateApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('depoly <name>', 'depoly web app')
  .action((name) => {
    cmd.depoly(name);
  });
/**
 * 配置服务器环境
 */
program.command('install <name>', 'install server compent')
  .action((name) => {
    cmd.install(name);
  });


program.parse(process.argv);
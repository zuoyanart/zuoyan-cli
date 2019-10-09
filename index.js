#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');

program.version('1.1.3', '-v, --version')
  .command('template <name>')
  .description('generate api template')
  .action((name) => {
    cmd.templateApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('templateManage <name>')
  .description('generate front end template')
  .action((name) => {
    cmd.templateManage(name);
  });

/**
 * 部署git协议的项目
 */
program.command('templateTask <name>')
  .description('generate task template')
  .action((name) => {
    cmd.templateTask(name);
  });

/**
 * 部署git协议的项目
 */
program.command('depolyapp <name>')
  .description('depoly server program')
  .action((name) => {
    cmd.depoly(name);
  });
/**
 * 部署git协议的项目
 */
program.command('depolyh5 <name>')
  .description('depoly front end program')
  .action((name) => {
    cmd.depolyH5(name);
  });
/**
 * 重新生成ssl证书
 */
program.command('ressl')
  .description('重新生成ssl证书')
  .action(() => {
    cmd.ressl();
  });
/**
 * 配置服务器环境
 */
program.command('install <name>')
  .description('在centos上安装组件')
  .action((name) => {
    cmd.install(name);
  });
/**
 * 配置服务器环境
 */
program.command('push')
  .description('git的push命令封装，add,commit,push')
  .action(name => {
    cmd.gitcmd('push');
  });

program.parse(process.argv);

#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');

program.version('1.1.5', '-v, --version')
  .command('template <name>')
  .alias('t')
  .description('generate api template')
  .action((name) => {
    cmd.templateApi(name);
  });

/**
 * 部署git协议的项目
 */
program.command('templateManage <name>')
  .alias('tm')
  .description('generate front end template')
  .action((name) => {
    cmd.templateManage(name);
  });

/**
 * 部署git协议的项目
 */
program.command('templateTask <name>')
  .alias('tt')
  .description('generate task template')
  .action((name) => {
    cmd.templateTask(name);
  });

/**
 * 部署git协议的项目
 */
program.command('depolyapp <name>')
  .alias('d')
  .description('depoly server program')
  .action((name) => {
    cmd.depoly(name);
  });
/**
 * 部署git协议的项目
 */
program.command('depolyh5 <name>')
  .alias('df')
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
  .alias('i')
  .description('在centos上安装组件,ssl,mysql,nginx,git,mongodb,redis,basic(ssl,mysql,nginx,git,other),other')
  .action((name) => {
    cmd.install(name);
  });
/**
 * 配置服务器环境
 */
program.command('push')
  .alias('p')
  .description('git的push命令封装，add,commit,push')
  .action(name => {
    cmd.gitcmd('push');
  });

program.parse(process.argv);

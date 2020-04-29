#!/usr/bin/env node

const program = require('commander');
const cmd = require('./tools/cmd');
const Safe = require('./tools/safe.js');
const SafeTask = require('./tools/safeTask.js');

program.version('1.2.0', '-v, --version')
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

/**
 * thinkjs项目加密
 */
program.command('safeServer')
  .alias('ss')
  .description('加密thinkjs项目代码')
  .action(name => {
    const s = new Safe();
    s.thinkjs();
  });

/**
 * 配置服务器环境
 */
program.command('safeFormatServer')
  .alias('ssf')
  .description('格式化加密的thinkjs项目代码')
  .action(name => {
    const s = new Safe();
    s.thinkjsFormat();
  });

/**
 * task项目加密
 */
program.command('safeTask')
  .alias('st')
  .description('加密task项目代码')
  .action(name => {
    const s = new SafeTask();
    s.task();
  });

program.parse(process.argv);

const shell = require('shelljs');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const nunjucks = require('./nunjucks');
const fs = require('fs-extra');
const path = require('path');
const logSymbols = require('log-symbols');

module.exports = class {
  static exec(cmdstr) {
    return new Promise((resolve, reject) => {
      shell.exec(cmdstr, function (code, stdout, stderr) {
        // console.log('stderr', stderr);
        // console.log('stdout', stdout);
        if (stderr && false) {
          return reject(new Error(stderr));
        }
        // console.log('asd', stdout);
        resolve(stdout);
        // console.log('Exit code:', code);
        // console.log('Program output:', stdout);
        // console.log('Program stderr:', stderr);
      });
    });
  }
  /**
   *  初始化api项目
   * @param {*} objName 
   */
  static async templateApi(objName) {
    if (fs.existsSync(objName)) {
      console.log(logSymbols.error, chalk.red('The project directory already exists!'));
      return;
    }
    console.log(chalk.green('Start creating projects...'));
    // const spinner = ora('downloading...\n');
    // spinner.start();
    try {
      const cmd = `git clone https://git.zuoyanit.com/zuoyanit/template-api.git ${objName} && cd ./${objName} &&  rm -ifr .git`;
      await this.exec(cmd);
      // spinner.succeed();
      console.log(logSymbols.success, chalk.green('Create project success. please run <npm i> in project directory.'));
    } catch (e) {
      // spinner.fail();
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
  /**
   *  初始化api项目
   * @param {*} objName 
   */
  static async templateCmsApi(objName) {
    if (fs.existsSync(objName)) {
      console.log(logSymbols.error, chalk.red('The project directory already exists!'));
      return;
    }
    console.log(chalk.green('Start creating projects...'));
    // const spinner = ora('downloading...\n');
    // spinner.start();
    try {
      const cmd = `git clone https://git.zuoyanit.com/zuoyanit/template-cms.git ${objName} && cd ./${objName} &&  rm -ifr .git`;
      await this.exec(cmd);
      // spinner.succeed();
      console.log(logSymbols.success, chalk.green('Create project success. please run <npm i> in project directory.'));
    } catch (e) {
      // spinner.fail();
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
  /**
   * 部署
   */
  static async depoly(objName) {
    try {
      inquirer.prompt([{
        name: 'gitrepo',
        message: '请输入git地址'
      }, {
        name: 'domain',
        message: '请输入域名'
      }, {
        name: 'https',
        message: '是否支持https(y/n/x)：'
      }, {
        name: 'port',
        message: '服务端口号：'
      }]).then(async (answers) => {

        let cmdStr = `git clone ${answers.gitrepo} ${objName} && cd ./${objName} && npm i && pm2 startOrReload pm2.json && pm2 save && pm2 startup`;
        await this.exec(cmdStr);
        const nks = new nunjucks();
        if (answers.https.toLowerCase() === 'n') { //不需要https
          let domainWww = false;
          if (answers.domain.indexOf('www.') > -1) {
            domainWww = 'www.' + answers.domain.split('www.')[1].split(' ')[0];
          }
          await nks.render(path.resolve(__dirname, '../template/nginx/http.conf'), {
            domain: answers.domain,
            port: answers.port,
            root: path.resolve('./' + objName),
            domainWww
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          let cmdStr = `nginx -s reload`;
          await this.exec(cmdStr);
        } else if (answers.https.toLowerCase() === 'y') {
          //生成证书
          await nks.render(path.resolve(__dirname, '../template/nginx/https-config.conf'), {
            domain: answers.domain,
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          fs.outputFileSync(path.resolve('/home/ssl/' + answers.domain + '/des.t'), '生成时间：' + new Date().getTime());
          fs.outputFileSync(path.resolve('/home/autossl/test.t'), '生成时间：' + new Date().getTime());
          let cmdStr = `nginx -s reload&&~/.acme.sh/acme.sh  --issue  -d ${answers.domain} --webroot  /home/autossl/ --nginx&&~/.acme.sh/acme.sh --installcert -d ${answers.domain} --keypath /home/ssl/${answers.domain}/${answers.domain}.key --fullchain-file /home/ssl/${answers.domain}/${answers.domain}-ca-bundle.cer`;
          await this.exec(cmdStr);
          //https 配置 
          await nks.render(path.resolve(__dirname, '../template/nginx/https.conf'), {
            domain: answers.domain,
            port: answers.port,
            root: path.resolve('./' + objName),
            sslpath: '/home/ssl/' + answers.domain + '/' + answers.domain
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          cmdStr = `nginx -s reload`;
          await this.exec(cmdStr);
        }
      });
    } catch (e) {
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
  /**
   * 部署
   */
  static async depolyH5(objName) {
    try {
      inquirer.prompt([{
        name: 'gitrepo',
        message: '请输入git地址'
      }, {
        name: 'domain',
        message: '请输入域名'
      }, {
        name: 'https',
        message: '是否支持https(y/n/x)：'
      }]).then(async (answers) => {
        let cmdStr = `git clone ${answers.gitrepo} ${objName} && cd ./${objName}`;
        await this.exec(cmdStr);
        const nks = new nunjucks();
        if (answers.https.toLowerCase() === 'n') { //不需要https
          let domainWww = false;
          if (answers.domain.indexOf('www.') > -1) {
            domainWww = 'www.' + answers.domain.split('www.')[1].split(' ')[0];
          }
          await nks.render(path.resolve(__dirname, '../template/nginx-h5/http.conf'), {
            domain: answers.domain,
            root: path.resolve('./' + objName),
            domainWww
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          let cmdStr = `nginx -s reload`;
          await this.exec(cmdStr);
        } else if (answers.https.toLowerCase() === 'y') {
          //生成证书
          await nks.render(path.resolve(__dirname, '../template/nginx-h5/https-config.conf'), {
            domain: answers.domain,
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          fs.outputFileSync(path.resolve('/home/ssl/' + answers.domain + '/des.t'), '生成时间：' + new Date().getTime());
          fs.outputFileSync(path.resolve('/home/autossl/test.t'), '生成时间：' + new Date().getTime());
          let cmdStr = `nginx -s reload&&~/.acme.sh/acme.sh  --issue  -d ${answers.domain} --webroot  /home/autossl/ --nginx&&~/.acme.sh/acme.sh --installcert -d ${answers.domain} --keypath /home/ssl/${answers.domain}/${answers.domain}.key --fullchain-file /home/ssl/${answers.domain}/${answers.domain}-ca-bundle.cer`;
          await this.exec(cmdStr);
          //https 配置 
          await nks.render(path.resolve(__dirname, '../template/nginx-h5/https.conf'), {
            domain: answers.domain,
            root: path.resolve('./' + objName),
            sslpath: '/home/ssl/' + answers.domain + '/' + answers.domain
          }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
          cmdStr = `nginx -s reload`;
          await this.exec(cmdStr);
        }
      });
    } catch (e) {
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
  /**
   * 重新生成ssl证书
   */
  static async ressl() {
    try {
      inquirer.prompt([{
        name: 'domain',
        message: '请输入域名'
      }]).then(async (answers) => {
        const objName = 'ssl-' + new Date().getTime();
        const nks = new nunjucks();
        //生成证书
        await nks.render(path.resolve(__dirname, '../template/nginx-h5/https-config.conf'), {
          domain: answers.domain,
        }, path.resolve('/etc/nginx/conf.d/' + objName + '.conf'));
        fs.outputFileSync(path.resolve('/home/ssl/' + answers.domain + '/des.t'), '生成时间：' + new Date().getTime());
        fs.outputFileSync(path.resolve('/home/autossl/test.t'), '生成时间：' + new Date().getTime());

        let cmdStr = `rm -rf /root/.acme.sh/${answers.domain} && nginx -s reload&&~/.acme.sh/acme.sh  --issue  -d ${answers.domain} --webroot  /home/autossl/ --nginx&&~/.acme.sh/acme.sh --installcert -d ${answers.domain} --keypath /home/ssl/${answers.domain}/${answers.domain}.key --fullchain-file /home/ssl/${answers.domain}/${answers.domain}-ca-bundle.cer`;
        await this.exec(cmdStr);
        console.log(logSymbols.success, chalk.green('ssl directory:/home/ssl/' + answers.domain + '/'));
        cmdStr = `rm -if /etc/nginx/conf.d/${objName}.conf && nginx -s reload`;
        await this.exec(cmdStr);
      });
    } catch (e) {
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
  /**
   * 配置服务器环境
   */
  static async install(type = 'basic') {
    try {
      const sslStr = `curl  https://get.acme.sh | sh && alias acme.sh=~/.acme.sh/acme.sh && acme.sh  --upgrade  --auto-upgrade`; //生成ssl
      const mysqlStr = `rpm -Uvh http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm && yum -y install mysql-community-server && systemctl enable mysqld && systemctl start mysqld && mysql_secure_installation && mysql -V`;
      const nginxStr = `yum -y install nginx && sudo systemctl enable nginx && sudo systemctl start nginx && nginx -v`;
      const gitStr = `yum -y install git && git --version`;
      const mongodbStr = `sudo yum makecache && sudo yum -y install mongodb-org &&sudo service mongod start &&sudo chkconfig mongod on`;
      const redisStr = `yum -y install redis && service redis start && redis-cli --version`;
      const otherStr = `yum -y update gcc&&yum -y install gcc+ gcc-c++`; //c++
      switch (type) {
        case 'ssl':
          await this.exec(sslStr);
          break;
        case 'mysql':
          await this.exec(mysqlStr);
          break;
        case 'nginx':
          await this.exec(nginxStr);
          break;
        case 'git':
          await this.exec(gitStr);
          break;
        case 'mongodb':
          await nks.render(path.resolve('./template/mongodb'), {}, path.resolve('/etc/yum.repos.d/mongodb.repo'));
          await this.exec(mongodbStr);
          break;
        case 'redis':
          await this.exec(redisStr);
          break;
        case 'basic':
          await this.exec(otherStr);
          await this.exec(sslStr);
          await this.exec(mysqlStr);
          await this.exec(nginxStr);
          await this.exec(gitStr);
          break;
        case 'other':
          await this.exec(otherStr);
          break;
      }
    } catch (e) {
      console.log(logSymbols.error, chalk.red(e.message));
    }
  }
};
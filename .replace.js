const sh = require('./.sh');
const shell = require("shelljs");

// shell.cd('');//进入根目录
shell.cd('dist');//进入`lib`目录
shell.mkdir('memberGame');

//替换游戏目录进去
sh.replace({
  file: '/dist/memberGame',
  newfile: '/memberGame/dist'
});

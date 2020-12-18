const consoleRemovePlugins = []
// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  const tempArr = [];
  const tempObj = { exclude: ['error', 'warn'] };
  tempArr.push('transform-remove-console');
  tempArr.push(tempObj);
  consoleRemovePlugins.push(tempArr)
}

// console.log('consoleRemovePlugins :>> ', consoleRemovePlugins);

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: consoleRemovePlugins
};

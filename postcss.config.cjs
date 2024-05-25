/*
 * @Author: HuWJ
 * @Date: 2024-05-25 20:51:57
 * @LastEditors: HuWJ
 * @LastEditTime: 2024-05-25 20:52:04
 * @FilePath: \Github\Wannaer-element\postcss.config.cjs
 * @Description: 
 */
/* eslint-env node */
module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-each-variables"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
  ],
};
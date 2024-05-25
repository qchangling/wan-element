/*
 * @Author: HuWJ
 * @Date: 2024-05-25 20:58:02
 * @LastEditors: HuWJ
 * @LastEditTime: 2024-05-25 21:49:17
 * @FilePath: \Github\Wannaer-element\packages\utils\install.ts
 * @Description: 执行vue plugin安装的一系列操作
 */
import type { App, Plugin } from "vue";
import { each } from "lodash-es";

type SFCWithInstall<T> = T & Plugin;

export function makeInstaller(components: Plugin[]) {
  const install = (app: App) =>
    each(components, (c) => {
      app.use(c);
    });

  return install;
}

export const withInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any)?.name || "UnnamedComponent";
    app.component(name, component as SFCWithInstall<T>);
  };
  return component as SFCWithInstall<T>;
};

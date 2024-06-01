/*
 * @Author: HuWJ
 * @Date: 2024-05-25 19:18:02
 * @LastEditors: HuWJ
 * @LastEditTime: 2024-06-01 13:56:11
 * @FilePath: \Wannaer-element\packages\play\src\main.ts
 * @Description:
 */
import { createApp } from "vue";
import App from "./App.vue";
import WElement from "Wannaer-element";
import "@Wannaer-element/theme";

createApp(App).use(WElement).mount("#app");

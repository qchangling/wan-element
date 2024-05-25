import { makeInstaller } from "@Wannaer-element/utils";
import components from "./components";
import "@Wannaer-element/theme/index.css";

const installer = makeInstaller(components);

export * from "@Wannaer-element/components";
export default installer;

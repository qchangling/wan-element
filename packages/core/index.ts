import { makeInstaller } from "@Wannaer-element/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import components from "./components";
import "@Wannaer-element/theme/index.css";
library.add(fas);
const installer = makeInstaller(components);

export * from "@Wannaer-element/components";
export default installer;

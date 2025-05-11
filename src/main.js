import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as echarts from "echarts";

const app = createApp(App);

// 全局提供echarts
app.provide("echarts", echarts);

app.use(router);
app.mount("#app");
/*  */

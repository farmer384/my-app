import { createRouter, createWebHistory } from "vue-router";

// 使用懒加载优化路由性能
const Overview = () => import("../views/Overview.vue");
const Detail = () => import("../views/Detail.vue");

const routes = [
  {
    path: "/",
    name: "Overview",
    component: Overview,
    meta: { title: "能耗总览" },
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
    props: true,
    meta: { title: "能耗详情" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title + " - 学校能耗监测系统";
  next();
});

export default router;
/*  */

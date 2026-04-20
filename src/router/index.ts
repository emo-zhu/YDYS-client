import { RouteRecordRaw } from "vue-router";
import { LoginView } from "junegoo-ui";
import { IndexView } from "junegoo-ui";
import { AppRouter } from "junegoo-ui";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/index",
    component: IndexView,
    props: {
      appCode: "medical",
    },
    redirect: "/corporateConduct/organizational",
    children: [
      // 组织体系
      {
        path: "/corporateConduct/organizational",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/organizational/List.vue"),
      },
      // 规章制度
      {
        path: "/corporateConduct/regulations",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/regulations/List.vue"),
      },
      // 规章制度（兼容旧路由）
      {
        path: "/corporateConduct/list",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/regulations/List.vue"),
      },
      // 管理用户列表
      {
        path: "/userRole/management",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/management/List.vue"),
      },
      // 审核用户列表
      {
        path: "/userRole/audit",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/audit/List.vue"),
      },
    ],
  },
];

const router = new AppRouter(routes).create(import.meta.env.BASE_URL);

export default router;

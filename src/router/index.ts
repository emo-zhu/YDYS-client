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
        component: () =>
          import("@/views/corporateConduct/organizational/List.vue"),
      },
      // 规章制度
      {
        path: "/corporateConduct/regulations",
        meta: {
          forceReload: true,
        },
        component: () =>
          import("@/views/corporateConduct/regulations/List.vue"),
      },
      // 开展活动
      {
        path: "/conductActivity/activity",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/conductActivity/activity/List.vue"),
      },
      // 自查自纠
      {
        path: "/conductActivity/commitment",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/conductActivity/commitment/List.vue"),
      },
      // 自查自纠报告
      {
        path: "/conductActivity/selfCheck",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/conductActivity/selfCheck/List.vue"),
      },
      // 个人承诺书
      {
        path: "/conductActivity/personalCommitment",
        meta: {
          forceReload: true,
        },
        component: () =>
          import("@/views/conductActivity/personalCommitment/List.vue"),
      },
      // 月度工作会议
      {
        path: "/workMeeting/monthly",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/workMeeting/monthly/List.vue"),
      },
      // 季度工作会议
      {
        path: "/workMeeting/quarterly",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/workMeeting/quarterly/List.vue"),
      },
      // 半年度工作会议
      {
        path: "/workMeeting/semiAnnual",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/workMeeting/semiAnnual/List.vue"),
      },
      // 年度工作会议
      {
        path: "/workMeeting/annual",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/workMeeting/annual/List.vue"),
      },
      // 我的医德档案
      {
        path: "/ethicsArchive/my",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/ethicsArchive/my/List.vue"),
      },
      // 全员医德档案
      {
        path: "/ethicsArchive/all",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/ethicsArchive/all/List.vue"),
      },
      // 科室考评表
      {
        path: "/departmentAssessment/table",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/departmentAssessment/table/List.vue"),
      },
      // 科室考评范围
      {
        path: "/departmentAssessment/scope",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/departmentAssessment/scope/List.vue"),
      },
      // 科室考评项目
      {
        path: "/departmentAssessment/item",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/departmentAssessment/item/List.vue"),
      },
      // 管理用户列表
      {
        path: "/userRole/management",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/userRole/management/List.vue"),
      },
      // 审核用户列表
      {
        path: "/userRole/audit",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/userRole/audit/List.vue"),
      },
    ],
  },
];

const router = new AppRouter(routes).create(import.meta.env.BASE_URL);

export default router;

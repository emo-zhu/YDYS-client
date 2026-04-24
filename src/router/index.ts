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
      // 行风工作会议
      {
        path: "/workMeeting",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/workMeeting/List.vue"),
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
      // 年度考评
      {
        path: "/ethicsAssessment",
        redirect: "/ethicsAssessment/rule",
      },
      // 年度考评规则
      {
        path: "/ethicsAssessment/rule",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/annualAssessment/rule/List.vue"),
      },
      // 医德考评项目
      {
        path: "/ethicsAssessment/item",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/annualAssessment/item/List.vue"),
      },
      // 个人医德自评
      {
        path: "/ethicsAssessment/personalSelfEvaluation",
        meta: {
          forceReload: true,
        },
        component: () =>
          import("@/views/annualAssessment/personalSelfEvaluation/List.vue"),
      },
      // 科室医德考评
      {
        path: "/ethicsAssessment/departmentAssessment",
        meta: {
          forceReload: true,
        },
        component: () =>
          import("@/views/annualAssessment/departmentAssessment/List.vue"),
      },
      // 医院医德评价
      {
        path: "/ethicsAssessment/hospitalEvaluation",
        meta: {
          forceReload: true,
        },
        component: () =>
          import("@/views/annualAssessment/hospitalEvaluation/List.vue"),
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
      // 结果应用审查
      {
        path: "/resultReview",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/resultReview/List.vue"),
      },
      // 行风分析监控
      {
        path: "/analysisMonitoring",
        redirect: "/analysisMonitoring/chart",
      },
      // 分析图
      {
        path: "/analysisMonitoring/chart",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/analysisMonitoring/chart/List.vue"),
      },
      // 分析表
      {
        path: "/analysisMonitoring/table",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/analysisMonitoring/table/List.vue"),
      },
      // 日常加减分规则
      {
        path: "/behaviorSupervision/rules",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/behaviorSupervision/rules/List.vue"),
      },
      // 个人加分申报
      {
        path: "/behaviorSupervision/personalApply",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/behaviorSupervision/personalApply/List.vue"),
      },
      // 日常加减分审核
      {
        path: "/behaviorSupervision/scoreAudit",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/behaviorSupervision/scoreAudit/List.vue"),
      },
      // 日常加减分录入
      {
        path: "/behaviorSupervision/scoreEntry",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/behaviorSupervision/scoreEntry/List.vue"),
      },
      // 日常加减分查询
      {
        path: "/behaviorSupervision/scoreQuery",
        meta: {
          forceReload: true,
        },
        component: () => import("@/views/behaviorSupervision/scoreQuery/List.vue"),
      },
    ],
  },
];

const router = new AppRouter(routes).create(import.meta.env.BASE_URL);

export default router;

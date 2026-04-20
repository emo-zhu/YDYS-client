import type { MenuOption } from "naive-ui";

export const menuOptions: MenuOption[] = [
  {
    label: "医德医风",
    key: "1",
    children: [
      {
        label: "组织体系",
        key: "11",
        iconClass: "icon-biaoqian1",
        href: "/corporateConduct/organizational",
        openMode: "FRAME_INNER",
      },
      {
        label: "规章制度",
        key: "12",
        iconClass: "icon-biaoqian1",
        href: "/corporateConduct/regulations",
        openMode: "FRAME_INNER",
      },
      {
        label: "开展活动",
        key: "15",
        iconClass: "icon-biaoqian1",
        href: "/conductActivity/activity",
        openMode: "FRAME_INNER",
      },
      {
        label: "自查自纠",
        key: "16",
        iconClass: "icon-biaoqian1",
        href: "/conductActivity/commitment",
        openMode: "FRAME_INNER",
      },
      {
        label: "自查自纠报告",
        key: "17",
        iconClass: "icon-biaoqian1",
        href: "/conductActivity/selfCheck",
        openMode: "FRAME_INNER",
      },
      {
        label: "个人承诺书",
        key: "18",
        iconClass: "icon-biaoqian1",
        href: "/conductActivity/personalCommitment",
        openMode: "FRAME_INNER",
      },
      {
        label: "管理用户列表",
        key: "13",
        iconClass: "icon-biaoqian1",
        href: "/userRole/management",
        openMode: "FRAME_INNER",
      },
      {
        label: "审核用户列表",
        key: "14",
        iconClass: "icon-biaoqian1",
        href: "/userRole/audit",
        openMode: "FRAME_INNER",
      },
    ],
  },
];

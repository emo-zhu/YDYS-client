import type {
  WorkMeetingItem,
  WorkMeetingModuleConfig,
  WorkMeetingOption,
  WorkMeetingStatus,
  WorkMeetingType,
} from "./types";

const assessmentYearOptions: WorkMeetingOption[] = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
];

const departmentOptions: WorkMeetingOption[] = [
  { label: "党委办公室", value: "党委办公室" },
  { label: "医务处", value: "医务处" },
  { label: "护理部", value: "护理部" },
  { label: "纪检监察室", value: "纪检监察室" },
];

const monthOptions: WorkMeetingOption[] = Array.from(
  { length: 12 },
  (_, index) => ({
    label: `${index + 1}月`,
    value: `${index + 1}月`,
  }),
);

const quarterOptions: WorkMeetingOption[] = [
  { label: "第一季度", value: "第一季度" },
  { label: "第二季度", value: "第二季度" },
  { label: "第三季度", value: "第三季度" },
  { label: "第四季度", value: "第四季度" },
];

const semiAnnualOptions: WorkMeetingOption[] = [
  { label: "上半年", value: "上半年" },
  { label: "下半年", value: "下半年" },
];

const annualOptions: WorkMeetingOption[] = [{ label: "全年", value: "全年" }];

export const workMeetingConfigMap: Record<
  WorkMeetingType,
  WorkMeetingModuleConfig
> = {
  monthly: {
    type: "monthly",
    title: "月度工作会议",
    routePath: "/workMeeting/monthly",
    defaultReporterName: "张雅婷",
    defaultReporterJobNo: "6420",
    periodLabel: "考核月度",
    periodOptions: monthOptions,
  },
  quarterly: {
    type: "quarterly",
    title: "季度工作会议",
    routePath: "/workMeeting/quarterly",
    defaultReporterName: "周小兵",
    defaultReporterJobNo: "6361",
    periodLabel: "考核季度",
    periodOptions: quarterOptions,
  },
  semiAnnual: {
    type: "semiAnnual",
    title: "半年度工作会议",
    routePath: "/workMeeting/semiAnnual",
    defaultReporterName: "尹颖超",
    defaultReporterJobNo: "6376",
    periodLabel: "考核周期",
    periodOptions: semiAnnualOptions,
  },
  annual: {
    type: "annual",
    title: "年度工作会议",
    routePath: "/workMeeting/annual",
    defaultReporterName: "王雪梅",
    defaultReporterJobNo: "6418",
    periodLabel: "考核周期",
    periodOptions: annualOptions,
  },
};

export const workMeetingStatusOptions = [
  { label: "完成", value: "完成" },
  { label: "待填报", value: "待填报" },
];

export const workMeetingAssessmentYearOptions = assessmentYearOptions;
export const workMeetingDepartmentOptions = departmentOptions;

const createRow = (
  config: WorkMeetingModuleConfig,
  item: {
    id: number;
    status: WorkMeetingStatus;
    assessmentYear: string;
    assessmentPeriod: string;
    departmentName: string;
    reportTime: string;
    attachmentName: string;
    remarks: string;
  },
): WorkMeetingItem => ({
  ...item,
  reporterName: config.defaultReporterName,
  reporterJobNo: config.defaultReporterJobNo,
  attachmentUrl: item.attachmentName,
});

const buildMeetingRows = (
  type: WorkMeetingType,
  records: Array<{
    status: WorkMeetingStatus;
    assessmentYear: string;
    assessmentPeriod: string;
    departmentName: string;
    reportTime: string;
    attachmentName: string;
    remarks: string;
  }>,
) => {
  const config = workMeetingConfigMap[type];

  return records.map((item, index) =>
    createRow(config, {
      id: index + 1,
      ...item,
    }),
  );
};

export const createInitialMeetingStore = (
  type: WorkMeetingType,
): WorkMeetingItem[] => {
  if (type === "monthly") {
    return buildMeetingRows(type, [
      {
        status: "完成",
        assessmentYear: "2026",
        assessmentPeriod: "1月",
        departmentName: "党委办公室",
        reportTime: "2026-01-28",
        attachmentName: "monthly-meeting-202601.pdf",
        remarks: "完成1月行风工作会议纪要、签到表与整改任务清单上传。",
      },
      {
        status: "完成",
        assessmentYear: "2026",
        assessmentPeriod: "2月",
        departmentName: "医务处",
        reportTime: "2026-02-26",
        attachmentName: "monthly-meeting-202602.pdf",
        remarks: "已完成2月会议材料填报，重点记录投诉处置改进情况。",
      },
      {
        status: "待填报",
        assessmentYear: "2026",
        assessmentPeriod: "3月",
        departmentName: "护理部",
        reportTime: "2026-03-25",
        attachmentName: "monthly-meeting-202603.docx",
        remarks: "待补充护理单元月度会议纪要附件。",
      },
      {
        status: "完成",
        assessmentYear: "2026",
        assessmentPeriod: "4月",
        departmentName: "纪检监察室",
        reportTime: "2026-04-22",
        attachmentName: "monthly-meeting-202604.zip",
        remarks: "已补充4月廉洁教育专题会议材料。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "12月",
        departmentName: "党委办公室",
        reportTime: "2025-12-29",
        attachmentName: "monthly-meeting-202512.pdf",
        remarks: "年度收尾会议材料齐全，含年度整改跟踪表。",
      },
      {
        status: "待填报",
        assessmentYear: "2025",
        assessmentPeriod: "11月",
        departmentName: "医务处",
        reportTime: "2025-11-27",
        attachmentName: "monthly-meeting-202511.doc",
        remarks: "待补充会议图片与附件扫描件。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "10月",
        departmentName: "护理部",
        reportTime: "2025-10-24",
        attachmentName: "monthly-meeting-202510.pdf",
        remarks: "已完成10月窗口服务专项会议材料上传。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "9月",
        departmentName: "纪检监察室",
        reportTime: "2025-09-26",
        attachmentName: "monthly-meeting-202509.pdf",
        remarks: "已完成9月行风风险排查会议附件上传。",
      },
      {
        status: "待填报",
        assessmentYear: "2025",
        assessmentPeriod: "8月",
        departmentName: "党委办公室",
        reportTime: "2025-08-28",
        attachmentName: "monthly-meeting-202508.xlsx",
        remarks: "待补充整改责任人落实情况。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "7月",
        departmentName: "医务处",
        reportTime: "2025-07-30",
        attachmentName: "monthly-meeting-202507.pdf",
        remarks: "已完成7月医疗质量与医德医风联席会议纪要。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "6月",
        departmentName: "护理部",
        reportTime: "2025-06-27",
        attachmentName: "monthly-meeting-202506.pdf",
        remarks: "已完成6月护理服务改进专题会议材料。",
      },
      {
        status: "待填报",
        assessmentYear: "2025",
        assessmentPeriod: "5月",
        departmentName: "纪检监察室",
        reportTime: "2025-05-29",
        attachmentName: "monthly-meeting-202505.docx",
        remarks: "待补充会议纪要正文。",
      },
    ]);
  }

  if (type === "quarterly") {
    return buildMeetingRows(type, [
      {
        status: "完成",
        assessmentYear: "2026",
        assessmentPeriod: "第一季度",
        departmentName: "医务处",
        reportTime: "2026-03-31",
        attachmentName: "quarterly-meeting-2026-q1.pdf",
        remarks: "已完成一季度行业作风分析会议资料归档。",
      },
      {
        status: "待填报",
        assessmentYear: "2026",
        assessmentPeriod: "第一季度",
        departmentName: "纪检监察室",
        reportTime: "2026-03-30",
        attachmentName: "quarterly-meeting-2026-q1.docx",
        remarks: "待补充季度警示教育会议纪要。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "第四季度",
        departmentName: "党委办公室",
        reportTime: "2025-12-25",
        attachmentName: "quarterly-meeting-2025-q4.pdf",
        remarks: "已完成四季度重点问题整改推进会材料上传。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "第三季度",
        departmentName: "护理部",
        reportTime: "2025-09-29",
        attachmentName: "quarterly-meeting-2025-q3.pdf",
        remarks: "已完成三季度服务礼仪与投诉分析会议归档。",
      },
      {
        status: "待填报",
        assessmentYear: "2025",
        assessmentPeriod: "第二季度",
        departmentName: "医务处",
        reportTime: "2025-06-30",
        attachmentName: "quarterly-meeting-2025-q2.xlsx",
        remarks: "待补充季度分析报表。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "第一季度",
        departmentName: "纪检监察室",
        reportTime: "2025-03-28",
        attachmentName: "quarterly-meeting-2025-q1.pdf",
        remarks: "已完成一季度廉政风险专题会材料。",
      },
      {
        status: "完成",
        assessmentYear: "2024",
        assessmentPeriod: "第四季度",
        departmentName: "党委办公室",
        reportTime: "2024-12-27",
        attachmentName: "quarterly-meeting-2024-q4.pdf",
        remarks: "已完成年度末季度总结会议附件上传。",
      },
      {
        status: "待填报",
        assessmentYear: "2024",
        assessmentPeriod: "第三季度",
        departmentName: "护理部",
        reportTime: "2024-09-26",
        attachmentName: "quarterly-meeting-2024-q3.doc",
        remarks: "待补充护理部三季度专题会议纪要。",
      },
    ]);
  }

  if (type === "semiAnnual") {
    return buildMeetingRows(type, [
      {
        status: "完成",
        assessmentYear: "2026",
        assessmentPeriod: "上半年",
        departmentName: "医务处",
        reportTime: "2026-06-30",
        attachmentName: "semiannual-meeting-2026-h1.pdf",
        remarks: "上半年行业作风重点工作推进会资料已归档。",
      },
      {
        status: "待填报",
        assessmentYear: "2025",
        assessmentPeriod: "下半年",
        departmentName: "纪检监察室",
        reportTime: "2025-12-30",
        attachmentName: "semiannual-meeting-2025-h2.docx",
        remarks: "待补充下半年专项整治会议附件。",
      },
      {
        status: "完成",
        assessmentYear: "2025",
        assessmentPeriod: "上半年",
        departmentName: "党委办公室",
        reportTime: "2025-06-27",
        attachmentName: "semiannual-meeting-2025-h1.pdf",
        remarks: "已完成上半年重点问题通报会材料归档。",
      },
      {
        status: "完成",
        assessmentYear: "2024",
        assessmentPeriod: "下半年",
        departmentName: "护理部",
        reportTime: "2024-12-26",
        attachmentName: "semiannual-meeting-2024-h2.pdf",
        remarks: "已完成下半年护理行风专题会议材料上传。",
      },
      {
        status: "待填报",
        assessmentYear: "2024",
        assessmentPeriod: "上半年",
        departmentName: "医务处",
        reportTime: "2024-06-28",
        attachmentName: "semiannual-meeting-2024-h1.xlsx",
        remarks: "待补充半年考核附件汇总表。",
      },
      {
        status: "完成",
        assessmentYear: "2023",
        assessmentPeriod: "下半年",
        departmentName: "纪检监察室",
        reportTime: "2023-12-29",
        attachmentName: "semiannual-meeting-2023-h2.pdf",
        remarks: "已归档警示教育与作风整治专题会议纪要。",
      },
    ]);
  }

  return buildMeetingRows(type, [
    {
      status: "完成",
      assessmentYear: "2026",
      assessmentPeriod: "全年",
      departmentName: "党委办公室",
      reportTime: "2026-12-30",
      attachmentName: "annual-meeting-2026.pdf",
      remarks: "已完成2026年度行风工作会议总结资料归档。",
    },
    {
      status: "待填报",
      assessmentYear: "2025",
      assessmentPeriod: "全年",
      departmentName: "医务处",
      reportTime: "2025-12-29",
      attachmentName: "annual-meeting-2025.docx",
      remarks: "待补充年度整改落实成效分析。",
    },
    {
      status: "完成",
      assessmentYear: "2024",
      assessmentPeriod: "全年",
      departmentName: "护理部",
      reportTime: "2024-12-27",
      attachmentName: "annual-meeting-2024.pdf",
      remarks: "已完成年度患者服务提升专题会材料上传。",
    },
    {
      status: "完成",
      assessmentYear: "2023",
      assessmentPeriod: "全年",
      departmentName: "纪检监察室",
      reportTime: "2023-12-28",
      attachmentName: "annual-meeting-2023.pdf",
      remarks: "已归档年度廉洁行医专题工作会议材料。",
    },
    {
      status: "待填报",
      assessmentYear: "2022",
      assessmentPeriod: "全年",
      departmentName: "党委办公室",
      reportTime: "2022-12-30",
      attachmentName: "annual-meeting-2022.xls",
      remarks: "待补传年度会议照片与签字页。",
    },
  ]);
};

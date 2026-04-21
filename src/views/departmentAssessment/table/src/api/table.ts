import type {
  DepartmentAssessmentRuleTableDetail,
  DepartmentAssessmentTableForm,
  DepartmentAssessmentTableItem,
  DepartmentAssessmentTablePageData,
  DepartmentAssessmentTablePageQuery,
  DepartmentAssessmentTableRuleItem,
} from "../types/table";

const cloneRuleItem = (
  item: DepartmentAssessmentTableRuleItem,
): DepartmentAssessmentTableRuleItem => ({ ...item });

const cloneTableItem = (
  item: DepartmentAssessmentTableItem,
): DepartmentAssessmentTableItem => ({
  ...item,
  items: item.items.map(cloneRuleItem),
  itemCount: item.items.length,
});

let tableStore: DepartmentAssessmentTableItem[] = [
  {
    id: 1,
    tableName: "临床科室行风考评表",
    updatedAt: "2026-04-18 15:30:22",
    itemCount: 3,
    items: [
      {
        id: 101,
        sort: 1,
        itemName: "文明服务落实情况",
        itemType: "0",
        itemTypeName: "固定分",
        fixedScore: 10,
        description: "检查门诊、病区文明用语、首问负责及服务态度落实情况。",
      },
      {
        id: 102,
        sort: 2,
        itemName: "投诉整改完成率",
        itemType: "2",
        itemTypeName: "区间分",
        minScore: 0,
        maxScore: 15,
        description: "根据投诉整改闭环及时率和整改效果综合计分。",
      },
      {
        id: 103,
        sort: 3,
        itemName: "加减分综合项",
        itemType: "3",
        itemTypeName: "公式分",
        description: "按加减分条款、专项检查与通报结果综合核算。",
        formula: "[投诉整改完成率]+[文明服务落实情况]*0.5",
      },
    ],
  },
  {
    id: 2,
    tableName: "医技科室行风考评表",
    updatedAt: "2026-04-12 09:16:45",
    itemCount: 2,
    items: [
      {
        id: 201,
        sort: 1,
        itemName: "检查报告及时率",
        itemType: "1-1",
        itemTypeName: "加减分",
        minScore: 0,
        maxScore: 20,
        description: "按报告超时率与及时反馈情况计算。",
      },
      {
        id: 202,
        sort: 2,
        itemName: "患者隐私保护",
        itemType: "0",
        itemTypeName: "固定分",
        fixedScore: 8,
        description: "检查检查区域隐私隔离、信息保密和规范告知。",
      },
    ],
  },
];

const formatDateTime = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const createDefaultTableForm = (): DepartmentAssessmentTableForm => ({
  tableName: "",
});

export namespace DepartmentAssessmentTableApi {
  export const getPage = async (
    query: DepartmentAssessmentTablePageQuery,
  ): Promise<DepartmentAssessmentTablePageData> => {
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 20;
    const keywords = query.keywords.trim();
    const filtered = tableStore.filter(
      (item) => !keywords || item.tableName.includes(keywords),
    );
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = filtered.slice(start, end).map(cloneTableItem);
    const total = filtered.length;

    return {
      records,
      total,
      pageNum,
      pageSize,
      current: pageNum,
      size: pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    };
  };

  export const getDetails = async ({
    id,
  }: {
    id?: number | null;
  }): Promise<DepartmentAssessmentRuleTableDetail | undefined> => {
    const target = tableStore.find((item) => item.id === id);
    return target ? cloneTableItem(target) : undefined;
  };

  export const addOne = async (form: DepartmentAssessmentTableForm) => {
    const nextId = tableStore.length
      ? Math.max(...tableStore.map((item) => item.id)) + 1
      : 1;
    const nextItem: DepartmentAssessmentTableItem = {
      id: nextId,
      tableName: form.tableName?.trim() || "",
      updatedAt: formatDateTime(),
      itemCount: 0,
      items: [],
    };
    tableStore = [nextItem, ...tableStore];
    return nextId;
  };

  export const editOne = async (form: DepartmentAssessmentTableForm) => {
    const index = tableStore.findIndex((item) => item.id === form.id);
    if (index === -1) {
      return;
    }
    tableStore[index] = {
      ...tableStore[index],
      tableName: form.tableName?.trim() || "",
      updatedAt: formatDateTime(),
      itemCount: tableStore[index].items.length,
    };
  };

  export const deleteOne = async ({ id }: { id: number }) => {
    tableStore = tableStore.filter((item) => item.id !== id);
  };

  export const validateDuplicateName = async ({
    id,
    tableName,
  }: {
    id?: number;
    tableName: string;
  }) => {
    return tableStore.some(
      (item) => item.tableName === tableName && item.id !== id,
    );
  };
}

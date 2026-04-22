import { computed, reactive, ref } from "vue";
import { createDefaultArchiveForm, StaffArchiveApi } from "../api/archive";
import {
  addModal,
  currentEditId,
  currentViewId,
  editModal,
  viewModal,
} from "../service/archive";
import type {
  StaffArchiveDetail,
  StaffArchiveForm,
  StaffArchiveItem,
  StaffArchiveLevel,
  StaffArchivePageData,
  StaffArchivePageQuery,
  StaffArchiveStatus,
} from "../types/archive";

export const staffStatusOptions = [
  { label: "在职人员", value: "在职人员" },
  { label: "离职人员", value: "离职人员" },
];

export const archiveYearOptions = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
];

export const archiveStatusOptions = [
  { label: "已归档", value: "已归档" },
  { label: "待完善", value: "待完善" },
  { label: "审核中", value: "审核中" },
];

export const assessmentLevelOptions = [
  { label: "优秀", value: "优秀" },
  { label: "良好", value: "良好" },
  { label: "合格", value: "合格" },
];

export const departmentOptions = [
  { label: "心血管内科", value: "心血管内科" },
  { label: "感染科", value: "感染科" },
  { label: "胃肠外科", value: "胃肠外科" },
];

const query = reactive<StaffArchivePageQuery>({
  keywords: "",
  staffStatus: null,
  pageNum: 1,
  pageSize: 20,
});

const pageData = ref<StaffArchivePageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1,
});
const pageLoading = ref(false);

const form = reactive<StaffArchiveForm>(createDefaultArchiveForm());
const saveLoading = ref(false);
const detailInfo = ref<StaffArchiveDetail>();

const rowKey = (row: StaffArchiveItem) => row.id;

const resetForm = () => {
  Object.assign(form, createDefaultArchiveForm());
};

const getPage = async () => {
  pageLoading.value = true;
  try {
    pageData.value = await StaffArchiveApi.getPage(query);
  } finally {
    pageLoading.value = false;
  }
};

const loadPage = async () => {
  const pageSize = query.pageSize || 20;
  const total = pageData.value.total || 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages;
  }
  await getPage();
};

const onSearch = async () => {
  query.pageNum = 1;
  await getPage();
};

const onReset = async () => {
  query.keywords = "";
  query.staffStatus = null;
  query.pageNum = 1;
  query.pageSize = 20;
  await getPage();
};

const openAdd = () => {
  currentEditId.value = null;
  resetForm();
  addModal.open();
};

const openEdit = async (_id: number) => {
  editModal.open();
};

const openView = async (id: number) => {
  currentViewId.value = id;
  detailInfo.value = await StaffArchiveApi.getDetails({ id });
  viewModal.open();
};

const saveOne = async () => {
  saveLoading.value = true;
  try {
    window.$message?.success("保存成功");
    return true;
  } finally {
    saveLoading.value = false;
  }
};

const closeAdd = () => {
  addModal.close();
  resetForm();
};

const closeEdit = () => {
  editModal.close();
  resetForm();
  currentEditId.value = null;
};

const closeView = () => {
  viewModal.close();
  detailInfo.value = undefined;
  currentViewId.value = null;
};

const onDelete = (_id: number) => {};

const onExport = () => {
  window.$message?.success("导出成功");
};

const onActionClick = (row: StaffArchiveItem, label: string) => {
  window.$message?.success(`打开${row.name}的${label}`);
};

const editorTitle = computed(() =>
  form.id ? "编辑全员医德档案" : "新增全员医德档案",
);

export const getStatusClass = (status?: string | StaffArchiveStatus) => {
  if (status === "已归档") {
    return "status-tag--done";
  }
  if (status === "审核中") {
    return "status-tag--progress";
  }
  return "status-tag--pending";
};

export const getLevelClass = (level?: StaffArchiveLevel | string) => {
  if (level === "优秀") {
    return "level-tag--excellent";
  }
  if (level === "良好") {
    return "level-tag--good";
  }
  return "level-tag--pass";
};

export function useStaffArchiveModule() {
  return {
    archivePage: {
      query,
      pageData,
      loading: pageLoading,
      rowKey,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onDelete,
      onExport,
      onActionClick,
    },
    archiveSave: {
      form,
      loading: saveLoading,
      editorTitle,
      closeAdd,
      closeEdit,
      saveOne,
    },
    archiveDetail: {
      info: detailInfo,
      closeView,
    },
  };
}

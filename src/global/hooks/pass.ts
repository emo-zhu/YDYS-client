import { reactive, ref } from "vue";
import { PassApi } from "../api/pass";
import { useProgress } from "junegoo-ui";

export function usePassList() {
    const loading = ref(false);
    const query: PassListQuery = reactive({})
    const listData = ref<Array<PassItem>>()

    const getList = async () => {
        loading.value = true;
        try {
            const res = await PassApi.getList(query);
            listData.value = res.data;
        } finally {
            loading.value = false;
        }
    };

    return {
        query,
        listData,
        loading,
        getList,
    };
}

export function usePassRemindProcessing() {
    const loading = ref(false);

    const onRemind = async (processId: string, callBack?: Function) => {
        loading.value = true;
        try {
            const res = await PassApi.remindProcessing({ processId });
            window.$message.success("操作成功")
            callBack && callBack()
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        onRemind,
    };
}

export function usePassExportFormData() {
    const loading = ref<boolean>(false);;
    const query: ExportFormDataQuery = reactive({})
    const fileData: any = ref();

    const onExportFormData = async (name: string) => {
        loading.value = true;
        try {
            const res = await PassApi.exportFormData(query);
            const link = document.createElement('a');
            const blob = new Blob([res.data]);
            link.href = window.URL.createObjectURL(blob)
            link.download = `${name}_数据_${new Date().toLocaleDateString()}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
            fileData.value = res.data;
            loading.value = false;
        } catch {
            loading.value = false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        query,
        fileData,
        onExportFormData,
    };
}

export function usePassImportFormData() {
    const loading = ref(false);
    const query: ImportFormDataQuery = reactive({})

    const onImportFormData = async () => {
        loading.value = true;
        try {
            const res = await PassApi.importFormData(query);
        } finally {
            loading.value = false;
        }
    };

    return {
        query,
        loading,
        onImportFormData,
    };
}

export function useFlowNodeList() {
    const loading = ref(false);
    const listData = ref<Array<any>>([])

    const getList = async (id: string) => {
        loading.value = true;
        try {
            const res = await PassApi.getNodeList(id);
            listData.value = res.data.map((item: any) => ({
                ...item,
                ...item.nodeCountMap || {}
            }));
        } finally {
            loading.value = false;
        }
    };

    return {
        getList,
        listData,
        loading
    };
}

export function usePassModule() {
    return {
        passExportFormData: usePassExportFormData(),
        passImportFormData: usePassImportFormData(),
        flowNodeList: useFlowNodeList()
    }
}

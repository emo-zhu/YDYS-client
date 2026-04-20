import { Ajax } from "junegoo-ui";
const server = '/hrssc-paas/flowable/flowModel'

const flowTask = '/hrssc-paas/flowTask'

const flowNodeForm = '/hrssc-paas/flowable/flowNodeForm'

export namespace PassApi {
    export const getList = Ajax.createApiCall<PassListQuery>('getList', server)
    // 催办
    export const remindProcessing = Ajax.createApiCall<{ processId?: string }>('remindProcessing', flowTask)

    //根据模型id和流程id，导出 Excel 表单数据
    export const exportFormData = (query: ExportFormDataQuery) => {
        return Ajax.post('/hrssc-paas/flowable/flowNodeForm/exportFormData', query, { responseType: 'blob' })
    }

    //导入 Excel 表单数据（multipart-form-data： file + flowModelId + processId）
    export const importFormData = (query: ImportFormDataQuery) => {
        return Ajax.post('/hrssc-paas/flowable/flowNodeForm/importFormData', query, { headers: { 'Content-Type': 'multipart/form-data' } })
    }

    //获取流程节点列表
    export const getNodeList = (id: string) => {
        return Ajax.post('/hrssc-paas/flowable/flowNode/getList', { id: id })
    }
}
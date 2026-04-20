interface PassListQuery {
    categoryId?: string,
    code?: string,
    dataStatus?: 'DISABLE' | 'DRAFT' | 'ENABLE',
    visibleType?: 'MOBILE' | 'PC'
}

interface PassItem {
    categoryId: string,
    dataStatus: string,
    flowBytes: string,
    flowKey: string,
    flowProcessId: string,
    icon: string,
    id: string,
    isSystem: string,
    mobileVisible: true,
    name: string,
    pcVisible: true,
    queryGroup: any,
    remark: string,
    seq: string,
    version: string
}

interface ExportFormDataQuery {
    flowModelId?: string,
    processIds?: string[]
}

interface ImportFormDataQuery {
    flowModelId?: string,
    processId?: string,
    file?:any
}

interface FlowNodeItem{
    code:string;
    id:string;
    name:string;
    processId:string;
    remake:string;
}


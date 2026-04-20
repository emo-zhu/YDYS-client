import { EnumBaseHandle } from 'junegoo-ui';

/**
 * 考核状态,可用值:COMPLETED,INVALID,NOT_START,NOT_SUBMITTED,RETURNED,REVIEWING
 */
export namespace AssessmentStatusEnums {
    export const ALL = {
        label: '全部',
        value: '',
    }
    export const NOT_START = {
        label: '未发起',
        value: 'NOT_START',
        type: 'default'
    }
    export const NOT_SUBMITTED = {
        label: '未提交',
        value: 'NOT_SUBMITTED',
        type: 'default'
    }
    export const REVIEWING = {
        label: '审核中',
        value: 'REVIEWING',
        type: 'info'
    }
    export const RETURNED = {
        label: '已退回',
        value: 'RETURNED',
        type: 'error'
    }
    export const INVALID = {
        label: '已作废',
        value: 'INVALID',
        type: 'error'
    }
    export const COMPLETED = {
        label: '已办结',
        value: 'COMPLETED',
        type: 'success'
    }

    export function getText(enumName: any) {
        return EnumBaseHandle.getText(AssessmentStatusEnums, enumName);
    }
    export function getList() {
        return EnumBaseHandle.getList(AssessmentStatusEnums);
    }
    export function getType(enumName: any) {
        return EnumBaseHandle.getType(AssessmentStatusEnums, enumName);
    }
}
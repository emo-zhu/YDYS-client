import { EnumBaseHandle } from "junegoo-ui";

/**
 * 行风建设体系 DRAFT,ENABLE,FINISH
 */
export namespace PlanStatusEnums {
  export const ALL = {
    label: "全部",
    value: "",
  };
  export const DRAFT = {
    label: "起草中",
    value: "DRAFT",
    type: "default",
  };
  export const ENABLE = {
    label: "进行中",
    value: "ENABLE",
    type: "info",
  };
  export const FINISH = {
    label: "已完成",
    value: "FINISH",
    type: "success",
  };

  export function getText(enumName: any) {
    return EnumBaseHandle.getText(PlanStatusEnums, enumName);
  }
  export function getList() {
    return EnumBaseHandle.getList(PlanStatusEnums);
  }
  export function getType(enumName: any) {
    return EnumBaseHandle.getType(PlanStatusEnums, enumName);
  }
}

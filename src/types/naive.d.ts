import type { MessageApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { NotificationApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";

declare global {
    interface Window {
        $message: MessageApiInjection
        $dialog: DialogApiInjection,
        $notification:NotificationApiInjection,
        $loadingBar:LoadingBarInst,
        unmount: Function,
        mount: Function,
        __MICRO_APP_BASE_ROUTE__: string,
        __MICRO_APP_ENVIRONMENT__: boolean
    }
}
import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";

export type ColumnHandlerResponse = {
    containerEl: HTMLElement,
    view: DatabaseView,
    column: TableColumn,
}

export interface ColumnHandler {
    setNext(handler: ColumnHandler): ColumnHandler;
    handle(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse;
}

export abstract class AbstractColumnHandler implements ColumnHandler {
    abstract settingTitle: string;
    protected nextHandler: ColumnHandler;


    public goNext(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingHandlerResponse);
        }
        return settingHandlerResponse;
    }

    public setNext(handler: ColumnHandler): ColumnHandler {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse;
}
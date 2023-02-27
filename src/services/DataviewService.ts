import { Notice } from "obsidian";
import { DataArray, DataviewApi, getAPI, isPluginEnabled, STask } from "obsidian-dataview";
import { Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
import { LOGGER } from "./Logger";
class DataviewProxy {

    private static instance: DataviewProxy;

    /**
     * Check if dataview plugin is installed
     * @returns true if installed, false otherwise
     * @throws Error if plugin is not installed
     */
    getDataviewAPI(): DataviewApi {
        if (!this.isDataviewEnabled()) {
            new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
            throw new Error('Dataview plugin is not installed');
        }
        return getAPI(app);
    }

    wrapLiteral(literal: Literal): WrappedLiteral {
        return this.getDataviewAPI().value.wrapValue(literal);
    }

    isTruthy(literal: Literal): boolean {
        return this.getDataviewAPI().value.isTruthy(literal?.toString());
    }

    isDataviewEnabled(): boolean {
        return isPluginEnabled(app);
    }

    isStasks(value: Literal): value is STask {
        return (value as STask).task;
    }

    isSTaskArray(value: Literal): value is STask[] {
        return (value as STask[]).every(v => this.isStasks(v));
    }

    isDataArray(value: Literal): value is DataArray<unknown> {
        try {
            return this.getDataviewAPI().isDataArray(value);
        } catch (e) {
            LOGGER.error(`Error while checking if value is DataArray: ${e.message}`)
            return false;
        }
    }
    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): DataviewProxy {
        if (!this.instance) {
            this.instance = new DataviewProxy();
        }
        return this.instance;
    }
}

export const DataviewService = DataviewProxy.getInstance();
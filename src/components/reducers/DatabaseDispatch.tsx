import React, { useEffect, useReducer } from 'react';
import update from 'immutability-helper';
import { ActionTypes } from 'helpers/Constants';
import { DatabaseColumn, TableDataType } from 'cdm/FolderModel';
import { LOGGER } from 'services/Logger';
import { ActionType } from 'react-table';

function databaseReducer(state:any, action:ActionType) {
    LOGGER.debug(`<=>databaseReducer: ${action.type}`);
    switch (action.type) {
        /**
         * Add new row into table
         */
        case ActionTypes.ADD_ROW:
            let row = {};
            state.columns.forEach((column:DatabaseColumn) => {
                row = {
                    ...row,
                    [column.Header]: ''
                 };
            });
            return update(state, {
            skipReset: { $set: true },
            data: { $push: [row] },
            });
        /**
         * Enable reset
         */
        case ActionTypes.ENABLE_RESET:
            return update(state, { skipReset: { $set: true } });
        default:
            return state;
    }
}

export function getDispatch(initialState:TableDataType) {
    const [state, dataDispatch] = useReducer(databaseReducer, initialState);

    useEffect(() => {
        dataDispatch({ type: ActionTypes.ENABLE_RESET });
    }, [state.data, state.columns]);

    return {state, dataDispatch};
}
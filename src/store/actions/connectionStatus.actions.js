import { CONNECTION_STATUS } from '../action.types';

export const updateConnectionStatus = (status) => ({
    type: CONNECTION_STATUS,
    status
});


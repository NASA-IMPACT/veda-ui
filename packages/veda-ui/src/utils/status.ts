export const S_IDLE = 'idle';
export const S_LOADING = 'loading';
export const S_SUCCEEDED = 'success';
export const S_FAILED = 'error';

export type ActionStatus = typeof S_IDLE | typeof S_LOADING | typeof S_SUCCEEDED | typeof S_FAILED;

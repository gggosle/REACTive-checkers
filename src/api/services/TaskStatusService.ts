/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskStatusService {
    /**
     * @param taskId
     * @returns any
     * @throws ApiError
     */
    public static taskStatusRetrieve(
        taskId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/task-status/{task_id}/',
            path: {
                'task_id': taskId,
            },
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameState } from '../models/GameState';
import type { MovePayload } from '../models/MovePayload';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * @returns GameState
     * @throws ApiError
     */
    public static apiGamesCreate(): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/games/',
        });
    }
    /**
     * @param id A UUID string identifying this game.
     * @returns GameState
     * @throws ApiError
     */
    public static apiGamesRetrieve(
        id: string,
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/games/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A UUID string identifying this game.
     * @param requestBody
     * @returns GameState
     * @throws ApiError
     */
    public static apiGamesMoveCreate(
        id: string,
        requestBody: MovePayload,
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/games/{id}/move/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A UUID string identifying this game.
     * @returns GameState
     * @throws ApiError
     */
    public static apiGamesUndoCreate(
        id: string,
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/games/{id}/undo/',
            path: {
                'id': id,
            },
        });
    }
}

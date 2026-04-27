/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameState } from '../models/GameState';
import type { MovePayload } from '../models/MovePayload';
import type { TaskResponse } from '../models/TaskResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GamesService {
    /**
     * @returns GameState
     * @throws ApiError
     */
    public static gamesCreate(): CancelablePromise<GameState> {
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
    public static gamesRetrieve(
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
     * @returns TaskResponse
     * @throws ApiError
     */
    public static gamesMoveCreate(
        id: string,
        requestBody: MovePayload,
    ): CancelablePromise<GameState | TaskResponse> {
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
    public static gamesUndoCreate(
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

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Position } from './Position';
export type AllowedMove = {
    row: number;
    col: number;
    type: string;
    captured: Position | null;
};

export type AllowedMovesEntry = {
    fromPos: Position;
    moves: AllowedMove[];
};
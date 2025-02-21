import type {Context, TypedResponse} from "hono";

export type DynamicResponse<State> = {
    type: 'dynamic';
    handler: (c: Context, state: State, logger: (message: string, ...rest: string[]) => void) => TypedResponse;
}

export type StaticResponse = {
    status: number;
    headers?: Record<string, string>;
    type: 'static'
    body: unknown;
}

export type Response = StaticResponse | DynamicResponse<any>;
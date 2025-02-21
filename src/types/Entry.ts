import type { DynamicResponse, Response } from "@/types/Response.ts";
import type {StateHandler} from "@/types/StateHandler.ts";

export const HttpMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export type Entry<State, RESP extends Response = Response> = {
    path: string;
    method: typeof HttpMethods[number];
    response: RESP,
    state?: StateHandler<State>;
}

export type FileModule = Entry<any> | Entry<any>[] | FileModule[]

export type EntryId = [typeof HttpMethods[number], string];

function replacePath(obj: Entry<any>, ...prePath: string[]): Entry<any> {
    obj.path = prePath.filter(c => c !== 'default').concat(obj.path).join('/');
    if (obj.path.endsWith('/')) {
        obj.path = obj.path.slice(0, -1);
    }
    return obj;
}

export function parseEntry(obj: FileModule, ...prePath: string[]): Entry<any>[] {
    if (Array.isArray(obj)) {
        return obj.flatMap(entry => parseEntry(entry, ...prePath));
    } else {
        return [replacePath(obj, ...prePath)];
    }
}

export function isEntry(obj: any): obj is Entry<any> {
    const basicCheck = obj.path !== undefined && obj.method !== undefined && obj.response !== undefined;
    if (!basicCheck) return false;

    if (obj.response.type === 'static') {
        if (obj.response.status === undefined || obj.response.body === undefined) return false;
    }

    if (obj.response.type === 'dynamic') {
        if (obj.response.handler === undefined) return false
        if (typeof obj.response.handler !== 'function') return false
    }

    return [...HttpMethods, ...HttpMethods.map(s => s.toLowerCase())].includes(obj.method);
}

export function isDynamicResponse(resp: Response): resp is DynamicResponse<any> {
    return resp.type === 'dynamic';
}
import {type Entry, type EntryId, isDynamicResponse, parseEntry} from "@/types/Entry.ts";
import fs from "node:fs";
import path from "node:path";
import type {Context, Hono} from "hono";
import {customLogger} from "@/server/Logger.ts";

export function importCurrentFiles(): Promise<Entry<any>[]> {
    const pwd = Bun.env.PWD;
    if (pwd === undefined) {
        throw new Error('PWD is not defined');
    }

    const files = fs
        .readdirSync(path.resolve(pwd))
        .filter(filename => {
            return !['package.json', 'tsconfig.json'].some((ext) => filename === ext);
        })
        .filter(filename => {
            return ['.js', '.json', '.ts'].some((ext) => filename.endsWith(ext));
        });

    return new Promise((resolve) => {
        const proms: Array<Promise<Entry<any>[]>> = files.map(async (file) => {
            const module = await import(path.resolve(pwd, file));
            const keys = Object.keys(module).filter(key => !['__esModule'].includes(key));

            const entries: Entry<any>[][] = [];

            for (const key of keys) {
                const entity = parseEntry(module[key], key);
                entries.push(entity);
            }

            return entries.flat();
        });

        Promise.all(proms).then(c => {
            resolve(c.flat())
        });
    });
}

export function handleResponse(app: Hono, entry: Entry<any>) {
    const method = entry.method.toLowerCase();
    const stateHandler = entry.state;

    app[ method as 'get'|'put'|'delete'|'post' ](entry.path, (c: Context) => {

        if (!isDynamicResponse(entry.response)) {
            const { status, headers } = entry.response;
            return Response.json(entry.response.body, { status, headers} );
        }

        return entry.response.handler(c, stateHandler, customLogger)
    })
}
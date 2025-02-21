import {cloneDeep} from "lodash";
import type {StateHandler} from "@/types/StateHandler.ts";

export function createState<T>(id: string, init: () => T): StateHandler<T> {
    let state = cloneDeep(init());

    return {
        reset: () => state = cloneDeep(init()),
        getState: (): T => state,
        getId: () => id
    }

}

const stateHandlerSet: Set<StateHandler<any>> = new Set();

export function getStateHandlers() {
    return [...stateHandlerSet.values()];
}

export function handleReset(stateHandler?: StateHandler<any>): void {
    if (stateHandler === undefined) return;
    stateHandlerSet.add(stateHandler);
}

export function reset(id: string): boolean {
    const handler = stateHandlerSet.values().find(handler => handler.getId() === id)
    if (handler === undefined)
        return false;
    handler.reset();
    return true;
}

export function resetAll() {
    Object.values(stateHandlerSet).forEach(handler => {
        handler.reset();
    });
}

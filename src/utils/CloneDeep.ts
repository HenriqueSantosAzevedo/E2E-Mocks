export function cloneDeep<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const arrCopy = [] as any[];
        for (const item of obj) {
            arrCopy.push(cloneDeep(item));
        }
        return arrCopy as unknown as T;
    }

    const objCopy = {} as { [key: string]: any };
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = cloneDeep((obj as { [key: string]: any })[key]);
        }
    }
    return objCopy as T;
}
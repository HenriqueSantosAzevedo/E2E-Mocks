export type StateHandler<T> = {
    getState(): T;
    reset(): void;
    getId(): string;
};
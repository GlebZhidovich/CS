export interface Cache<T> {
  capacity: number;
  get(key: string): T | undefined;
  put(key: string, value: T): void;
}

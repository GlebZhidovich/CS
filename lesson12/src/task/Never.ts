import { Cache } from "./types";

export class Never<T> implements Cache<T> {
  queue = new Map();
  capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: string) {
    return this.queue.get(key);
  }

  put(key: string, value: T) {
    if (this.queue.has(key)) {
      this.queue.delete(key);
    } else if (this.queue.size === this.capacity) {
      const firstKey = this.queue.keys().next().value;
      this.queue.delete(firstKey);
    }

    this.queue.set(key, value);
  }
}

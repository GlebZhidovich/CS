// 2. Реализовать декораторы ttl (время жизни записи в кеше) и persistent (сохранять ключи в офлайн хранилище)
// для классов кеширования информации из лекции 12.

interface ICache<T> {
  capacity: number;
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

interface ICacheWithTTL<T> {
  cache: ICache<[T, number]>;
  ttl: number;

  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

class LRUCache<T> implements ICache<T> {
  queue = new Map();
  capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: string) {
    return this.queue.get(key);
  }

  set(key: string, value: T) {
    if (this.queue.has(key)) {
      this.queue.delete(key);
    } else if (this.queue.size === this.capacity) {
      const firstKey = this.queue.keys().next().value;
      this.queue.delete(firstKey);
    }

    this.queue.set(key, value);
  }
}

const lruCache = ttl(new LRUCache(10), 1000);

// // Через 1000 мс данные из кеша удаляться
lruCache.set("key", "value");

function ttl<T>(cache: ICache<T>, ms: number): ICacheWithTTL<T> {
  class CacheWithTTL<T> implements ICacheWithTTL<T> {
    constructor(public cache: ICache<[T, number]>, public ttl: number) {}
    get(key: string): T | undefined {
      const data = this.cache.get(key);
      if (data !== undefined) {
        const [value, timestamp] = data;

        if (Date.now() - timestamp <= this.ttl) {
          return value;
        }
      }
    }

    set(key: string, value: T): void {
      this.cache.set(key, [value, Date.now()]);
    }
  }

  return new CacheWithTTL(cache as ICache<[T, number]>, ms);
}

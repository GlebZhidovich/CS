// 3. Реализовать классы Request и Response для создания запросов по заданным параметрам и обработки ответов. При создании запроса можно указать движок запроса и стратегию кеширования.
import { RequestFunctionType, fetchEngine } from "../task2";
import { Cache, LRUCache } from "../task";

class RequestEngine {
  cacheEngine?: Cache<any>;
  params: RequestInit = {};

  constructor(private fetchEngine: RequestFunctionType) {}

  get post() {
    this.params.method = "POST";
    return this;
  }

  get json() {
    this.params.headers ?? new Headers();
    (this.params.headers as Headers).append("Content-Type", "application/json");
    return this;
  }

  body(data: RequestInit["body"]) {
    this.params.body = data;
    return this;
  }

  cache(engine: Cache<any>) {
    this.cacheEngine = engine;
    return this;
  }

  async create(url: string) {
    let data = this.cacheEngine?.get(url);

    if (data === undefined) {
      data = await this.fetchEngine(url, this.params);
      this.cacheEngine?.put(url, data);
    }

    return data;
  }

  static using(engine: RequestFunctionType) {
    return new RequestEngine(engine);
  }
}

RequestEngine.using(fetchEngine)
  .cache(new LRUCache(15))
  .post.json.body(null)
  .create("")
  .then((res) => res.json())
  .then(console.log);

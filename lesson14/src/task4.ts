// 4. Реализовать "строитель" для fetch запросов.

class Fetch {
  input: string | URL | globalThis.Request = "";
  init: RequestInit = {};
  queryParams = new URLSearchParams();

  header(key: string, value: string) {
    this.init.headers ??= [];
    (this.init.headers as [string, string][]).push([key, value]);
    return this;
  }

  query(key: string, value: string | number) {
    this.queryParams.append(key, `${value}`);
    return this;
  }

  url(value: string | URL | globalThis.Request) {
    this.input = value;
    return this;
  }

  method(value: RequestInit["method"]) {
    this.init.method = value;
    return this;
  }

  send() {
    return fetch(this.input, this.init);
  }

  static create() {
    return new Fetch();
  }
}

const myUrlReq = Fetch.create().method("POST").url("//my-url");

myUrlReq
  .query("a", 1)
  .query("b", 2)
  .header("application/json", "{ myData: 42 }")
  .send()
  .then(console.log);

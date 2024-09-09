// Описать базовый интерфейс и реализацию для источника данных.

interface DataProvider<T> {
  get(query: Record<string, string | number>): Promise<T>;
  create(data: T): Promise<void>;
  put(data: T): Promise<void>;
  delete(id: string): Promise<void>;
}

function request<D>(
  path: RequestInit | string,
  init?: RequestInit
): Promise<D> | typeof request {
  if (typeof path === "string") {
    return fetch(path, init).then((response) => response.json());
  }

  const defOpts = path;

  return (path, init) => {
    if (typeof path === "string") {
      return request(path, { ...defOpts, ...init });
    } else {
      return request({ ...defOpts, ...path });
    }
  };
}

interface ProviderParams {
  getURL: string;
  createURL: string;
  getMethod: string;
  createMethod: string;
}

export abstract class Provider<T> implements DataProvider<T>, ProviderParams {
  static requestInit = {};

  get requestInit(): RequestInit {
    return (<typeof Provider>this.constructor).requestInit;
  }

  getURL: string = "";
  createURL: string = "";
  getMethod = "GET";
  createMethod = "POST";

  async get(query: Record<string, string>): Promise<T> {
    const queryStr = new URLSearchParams(query);
    return this.request(this.getURL + queryStr, { method: this.getMethod });
  }
  async create(data: T): Promise<void> {
    this.request(this.getURL, {
      method: this.createMethod,
      body: JSON.stringify(data),
    });
  }
  async put(data: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async request(path: string, init?: RequestInit): Promise<T> {
    return fetch(path, { ...init, ...this.requestInit }).then((response) =>
      response.json()
    );
  }
}

export class UserProvider<T> extends Provider<T> {
  static requestInit = {
    ...Provider.requestInit,
    headers: {
      contentType: "json",
      responseType: "json",
    },
  };

  getURL = "/get/user/:id";
  getMethod = "GET";

  addURL = "/get/user";
  addMethod = "PUT";
}

new UserProvider().get({ id: "42" }).then(console.log);

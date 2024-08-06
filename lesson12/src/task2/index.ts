// 2. Реализовать стратегии для отправки данных через XMLHttpRequest и fetch в виде функций, который возвращают Promise.

type ParamsType = RequestInit;

export type RequestFunctionType = (
  url: string,
  params: ParamsType
) => Promise<any>;

export const xhr: RequestFunctionType = (url, params) => {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", resolve);
    req.open(params.method ?? "", url);
    req.send();
  });
};

export const fetchEngine: RequestFunctionType = (url, params) => {
  return fetch(url, params);
};

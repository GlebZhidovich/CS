// 1 Необходимо написать функцию sleep, которая бы принимала заданное количество миллисекунд и возвращала Promise.

// sleep(100).then(() => {
//   console.log(`I'am awake!`);
// });

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// 2 Необходимо написать функцию timeout, которая бы принимала Promise и заданное количество миллисекунд и возвращала Promise.

// Через 200 мс Promise будет зареджекчен
// timeout(fetch("http://my-dat.com"), 200).then(console.log).catch(console.error);

function timeout(promise, ms) {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      ms,
      promise
      //   new Promise((resolve, reject) => {
      //     promise.then(resolve, reject);
      //   })
    );
  });
}

// 4 Необходимо написать функцию promisify, которая бы принимала функцию, где последний аргумент thunk-callback и возвращала бы новую функцию. Новая функция вместо thunk-callback будет возвращать Promise.
function readFile(file, cb) {
  cb(null, "fileContent");
}

const readFilePromise = promisify(readFile);
readFilePromise("my-file.txt").then(console.log).catch(console.error);

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err !== null) {
          reject(err);
        }
        resolve(data);
      });
    });
}

// 5 Необходимо написать класс SyncPromise, аналогичный нативному, но работающий синхронно, если это возможно.

class SyncPromise {
  status = "pending";
  value;
  index = 0;

  constructor(fn) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    fn(this.resolve, this.reject);
  }

  setValue(val) {
    this.value = val;
  }

  resolve(val) {
    this.status = "fulfilled";
    this.setValue(val);
  }

  reject(err) {
    this.status = "rejected";
    this.setValue(err);
  }

  run(type, cb) {
    if (type === this.status) {
      this.value = cb(this.value);
    }
  }

  then(cb) {
    this.run("fulfilled", cb);
    return this;
  }

  catch(cb) {
    this.run("rejected", cb);
    return this;
  }

  static resolve(val) {
    return new SyncPromise((resolve) => {
      resolve(val);
    });
  }

  static all(arr) {
    return new SyncPromise((resolve, reject) => {
      const result = [];
      for (const elem of arr) {
        elem
          .then((val) => {
            result.push(val);
            if (result.length === arr.length) {
              resolve(result);
            }
          })
          .catch(reject);
      }
    });
  }

  static allLimit(arr, limit) {
    return new SyncPromise((resolve, reject) => {
      const result = [];
      let index = 0;
      let active = 0;

      function addToResult(val) {
        result.push(val);
        if (result.length === arr.length) {
          resolve(result);
        } else {
          active--;
          next();
        }
      }

      function next() {
        if (active < limit) {
          active++;
          arr[index].then(addToResult).catch(reject);
          index++;
        }
      }

      next();
    });
  }
}

SyncPromise.resolve(1).then(console.log).then(console.log); // 1
console.log(2); // 2

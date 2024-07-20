// 1. Необходимо создать контейнер Result с двумя состояниями Error и Ok. Контейнер должен обладать характеристиками монады и функтора.
class Result {
  constructor(val, status = "Ok") {
    this.val = val;
    this.status = status;
  }

  get value() {
    return this.val;
  }

  map(fn) {
    if (typeof this.val !== "undefined" && typeof fn === "function") {
      this.val = fn(this.val);
    }

    return this;
  }

  flatMap(fn) {
    if (typeof this.val !== "undefined" && typeof fn === "function") {
      return fn(this.val);
    }

    return this;
  }

  catch(fn) {
    if (this.status === "Error" && typeof fn === "function") {
      fn(this.val);
    }

    return this;
  }

  static error(val) {
    return new Result(val, "Error");
  }
}

// const result = new Result(10);
// result
//   .map((el) => el * 2)
//   .flatMap((el) => Result.error(el))
//   .catch((err) => console.log(err));

// 2. Необходимо используя генераторы создать аналог async/await для контейнера Result.

exec(function* main() {
  const result = new Result(10);
  console.log(yield result.map((el) => el * 2));
  console.log(yield result.map((el) => el * 3));
  console.log(yield Promise.resolve(10));
  console.log(yield Promise.resolve(20));
  console.log(
    yield new Promise((res) => {
      setTimeout(res, 500, 500);
    })
  );
});

function exec(fnGen) {
  gen = fnGen();

  function nextStep(gen, value) {
    if (value instanceof Result) {
      const data = gen.next(value.value);

      if (!data.done) {
        nextStep(gen, data.value);
      }
    }

    if (value instanceof Promise) {
      value.then((n) => {
        const data = gen.next(n);

        if (!data.done) {
          nextStep(gen, data.value);
        }
      });
    }
  }

  const { value } = gen.next();

  nextStep(gen, value);
}

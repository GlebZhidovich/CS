// 1. Необходимо написать итератор для генерации случайных чисел по заданным параметрам

function random(min, max) {
  return {
    min,
    max,
    next() {
      return {
        done: false,
        value: Math.floor(Math.random() * (this.max - this.min) + this.min),
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}
const randomInt = random(0, 100);

// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());

// 2. Необходимо написать функцию take, которая принимает любой
// Iterable объект и возвращает итератор по заданному количеству его элементов

function take(iter, limit) {
  return {
    index: 0,
    iter,
    limit,
    next() {
      if (this.index < this.limit) {
        this.index++;
        return this.iter.next();
      }
      return {
        done: true,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

// console.log("🚀 ~ iterator:", [...take(randomInt, 15)].length);

// 3. Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат.
// И возвращает итератор по элементам которые удовлетворяют предикату.

function filter(iter, cb) {
  return {
    iter,
    cb,
    next() {
      for (const value of this.iter) {
        if (cb(value)) {
          return {
            done: false,
            value,
          };
        }
      }
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

// console.log([
//   ...take(
//     filter(randomInt, (el) => el > 30),
//     15
//   ),
// ]);

// 4. Необходимо написать функцию enumerate, которая принимает любой Iterable объект и
// возвращает итератор по парам (номер итерации, элемент)

function enumerate(iter) {
  return {
    index: 0,
    iter,
    next() {
      const result = {
        done: false,
        value: [this.index, this.iter.next().value],
      };

      this.index++;

      return result;
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

// console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]

// 5. Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов,
// а также позволял обходить элементы Range с любого конца

const symbolRange = new Range("a", "f");

console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]

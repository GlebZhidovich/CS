// 1. Реализовать функцию mixin, которая делает "глубокое" расширение объекта заданными миксинами.

// {a: {b: {b: 42, c: 2, e: 7}, c: 2, e: 7}, j: 2}
const result = mixin(
  {
    a: {
      b: {
        b: 1,
        c: 2,
        e: {
          b: {
            b: 1,
            c: 2,
          },
          c: 2,
        },
      },
      c: 2,
    },
  },
  {
    a: {
      b: {
        b: 42,
        e: {
          b: {
            b: 42,
            e: 7,
          },
          e: 7,
        },
      },
      e: 7,
    },
  },
  { j: 2 }
);

function isObject(val) {
  return val !== null && typeof val === "object";
}

function mixin(base, ...args) {
  for (const arg of args) {
    if (isObject(arg)) {
      Object.keys(arg).forEach((key) => {
        if (isObject(base[key]) && isObject(arg[key])) {
          base[key] = mixin(base[key], arg[key]);
        } else {
          base[key] = arg[key];
        }
      });
    }
  }

  return base;
}

console.log(JSON.stringify(result, null, 2));

// 1. Необходимо написать функции on/once, которая бы принимала любой источник событий и событие и возвращала асинхронный итератор.

// (async () => {
//   for await (const e of on(document.body, "click")) {
//     console.log(e);
//   }
//   console.log("end");
// })();

function on(elem, event) {
  function* generator() {
    let resolveFn;

    elem.addEventListener(event, (e) => {
      resolveFn(e);
    });

    while (true) {
      yield new Promise((resolve) => {
        resolveFn = resolve;
      });
    }
  }

  return generator();
}

function once(elem, event) {
  function* generator() {
    let resolveFn;

    function fn(e) {
      resolveFn(e);
    }

    elem.addEventListener(event, fn);

    yield new Promise((resolve) => {
      resolveFn = resolve;
    });

    removeEventListener(event, fn);
  }

  return generator();
}

// 2.  Необходимо написать функции filter/map/seq/take из заданий по итераторам, чтобы они работали и с асинхронными итераторами.

// (async () => {
//   for await (const e of seq(
//     once(document.body, "mousedown"),
//     take(on(document.body, "mousedown"), 3),
//     take(on(document.body, "mouseup"), 3)
//   )) {
//     console.log(e);
//   }
// })();

function seq(...args) {
  async function* generator() {
    for (const arg of args) {
      for await (const iterator of arg) {
        yield iterator;
      }
    }
  }

  return generator();
}

function take(iter, limit) {
  function* generator() {
    let count = 0;

    while (count < limit) {
      count++;
      yield iter.next().value;
    }
  }

  return generator();
}

function parallel(...args) {
  function* generator() {
    while (args.length !== 0) {
      const remove = new Set();

      if (remove.size !== 0) {
        args = args.filter((_, i) => !remove.has(i));
        remove.clear();
      }

      yield new Promise((resolve) => {
        args.forEach((gen) => {
          const { value, done } = gen.next();
          if (done) {
            remove.add(gen);
          } else {
            value.then(resolve);
          }
        });
      });
    }
  }

  return generator();
}

function every(iter, cb) {
  async function* generator() {
    for await (const value of iter) {
      const isValid = cb(value);

      if (isValid) {
        yield value;
      } else {
        return;
      }
    }
  }

  return generator();
}

function filter(iter, cb) {
  async function* generator() {
    for await (const value of iter) {
      const isValid = cb(value);
      if (isValid) {
        yield value;
      }
    }
  }

  return generator();
}

function onlyEvent(name) {
  return (event) => event.type === name;
}

function onlyEvents(...names) {
  names = new Set(names);
  return (event) => names.has(event.type);
}

function repeat(cb) {
  async function* generator() {
    while (cb) {
      const object = cb();

      for await (const iterator of object) {
        yield iterator;
      }
    }
  }

  return generator();
}

async function forEach(object, cb) {
  for await (const iterator of object) {
    cb(iterator);
  }
}

// 3. Реализовать Drag&Drop логику как композицию асинхронных итераторов.

const box = document.getElementById("my-box");
let { x, y } = box.getBoundingClientRect();

let prevOffsetX;
let prevOffsetY;

const dnd = repeat(() =>
  filter(
    seq(
      once(box, "mousedown"),

      every(
        parallel(on(document.body, "mousemove"), on(box, "mouseup")),

        onlyEvent("mousemove")
      )
    ),

    onlyEvents("mousedown", "mousemove")
  )
);

forEach(dnd, (e) => {
  // Тут логика перемещения элемента

  const { offsetX, offsetY } = e;

  if (e.type === "mousedown") {
    prevOffsetX = offsetX;
    prevOffsetY = offsetY;
  } else {
    x += offsetX - prevOffsetX;
    y += offsetY - prevOffsetY;

    box.style.left = x + "px";
    box.style.top = y + "px";
  }
});


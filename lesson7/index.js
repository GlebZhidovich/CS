// 1. Необходимо доработать функцию forEach, чтобы несколько таких вызовов гарантировано не вызывали фризов

let total = 0;

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

const queue = [];
let status = "stop";

async function iterArr(arr, cb) {
  const TIME_SLEEP = 4;
  const TIME_TASK = 8;

  let timeStart = Date.now();
  for (const elem of arr) {
    let curTime = Date.now();

    if (curTime - timeStart > TIME_TASK) {
      await sleep(TIME_SLEEP);
      timeStart = Date.now();
    }

    cb(elem);
  }
}

async function iterQueue() {
  if (status !== "start") {
    status = "start";

    for (const [arr, cb] of queue) {
      await iterArr(arr, cb);
      total = 0;
    }

    status = "stop";
  }
}

function forEach(arr, cb) {
  queue.push([arr, cb]);
  iterQueue();
}

const div = document.getElementById("list");

// new Array(5).fill().forEach(() => {
//   forEach(new Array(1e7), () => {
//     total++;
//     div.textContent = total;
//   });
// });

// 2. Необходимо написать потоковый парсер чисел на основе генератора
function* numberParser() {
  const arr = [];

  try {
    while (true) {
      const str = yield;
      arr.push(str);
    }
  } finally {
    return arr.join("");
  }
}

const parser = numberParser();

parser.next("-"); // {value: '-', done: false}
parser.next("14"); // {value: 14, done: false}
parser.next("."); // {value: '.', done: false}
parser.next("53"); // {value: 53, done: false}
parser.next("e-"); // {value: 'e-', done: false}
parser.next("454"); // {value: 454, done: false}
const res = parser.return(); // {value: -14.53e-454, done: true}
console.log("🚀 ~ res:", res);

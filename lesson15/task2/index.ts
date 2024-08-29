import { EventEmitter } from "../task1";

// 2. Расширить класс EventEmitter для возможности создания иерархии и делегирования событий.
const parentEE = new EventEmitter();
const ee = new EventEmitter(parentEE);

parentEE.on("someEvent", (e) => {
  console.log(e.data);

  // Ссылки на объект, на котором изначально произошло событие
  console.log(e.target);
});

ee.emit("someEvent", 42);

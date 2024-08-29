// 3. Расширить класс EventEmitter для возможности отмены дальнейшего всплытия события.
import { EventEmitter } from "../task1";

const parentEE = new EventEmitter();
const ee = new EventEmitter(parentEE);

parentEE.on("someEvent", (e) => {
  console.log("parentEE", e.data);
});

ee.on("someEvent", (e) => {
  e.stopPropagation();
  console.log("ee", e.data);
});

ee.emit("someEvent", 42);

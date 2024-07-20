// 1. Необходимо написать регулярное выражение, которое при вызове test на строке будет давать false,
// если в строке есть символы отличные от латинских, цифр, подчеркивания и знака $
/^[\d_$]$/.test("привет");

// 2. Необходимо создать массив на основе строки, где раздилителем будут символы . , ; или пробелы
// (подряд идущие пробелы считаются за один)
"foo    bla.bar,gd;4".split(/[\s.,;]+/); // ['foo', 'bla', 'bar', 'gd', '4']

// 3. Необходимо написать функцию, которая принимает строковый шаблон и объект параметров,
// и возвращает результат применения данных к этому шаблону
// Hello, Bob! Your age is 10.
const format = (str, obj) => {
  const keys = Object.keys(obj);
  const re = /\${[a-z]+}/g;
  return str.replace(re, (key) => {
    return obj[key.slice(2, key.length - 1)];
  });
};
const res = format("Hello, ${user}! Your age is ${age}.", {
  user: "Bob",
  age: 10,
});
// console.log("🚀 ~ res:", res);
// 4. Необходимо написать регулярное выражение, которое бы удаляла из строки любые дублирования подстрок из
// 1-го, 2-х или 3-х символов, которые идут подряд

// const myRegExp = /(\w+?)\1/g;
const myRegExp = /(\w+?)\1+/g;
const replaceVal = "$1";
// console.log(
//   "aaaabbbbczzzz".replace(myRegExp, replaceVal) == "abcz",
//   "abababbbabcabc".replace(myRegExp, replaceVal) == "abbabc",
//   "foofoobabaaaazze".replace(myRegExp, replaceVal) == "foobaaze"
// );
// 5. Нахождение арифметических операций в строке и замена на результат

function calc(str) {
  const re = / [()\d+-/** ]{2,}/gm;

  console.log("🚀 ~ calc ~ re.exec(str);:", re.exec(str));

  return str.replace(re, (key) => {
    console.log("🚀 ~ returnstr.replace ~ key:", key);
    return "";
  });
}

console.log(
  "calc",
  calc(`
  Какой-то текст (10 + 15 - 24) ** 2
  Еще какой то текст 2 * 10
  `)
);

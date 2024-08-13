import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { BaseComponent } from "./components/BaseComponent";
// 2. Реализовать стандартные посетитель для компонента React, который интегрирует IntersectionObserver.
const inView =
  ({
    delay,
    entered,
    leaved,
  }: {
    delay: number;
    entered: () => void;
    leaved: () => void;
  }) =>
  (elem: HTMLElement) => {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entered();
        } else {
          leaved();
        }
      });
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(elem);
  };

function App() {
  const [count, setCount] = useState(0);

  const onEntered = () => {
    console.log("onEntered");
  };

  const onLeaved = () => {
    console.log("onLeaved");
  };

  return (
    <>
      <BaseComponent
        accept={[
          inView({
            delay: 1_000,
            entered: onEntered,
            leaved: onLeaved,
          }),
          (elem: HTMLElement) => {
            elem.addEventListener("click", (e) => {
              console.log("BaseComponent click", e);
            });
          },
          (elem: HTMLElement) => {
            elem.addEventListener(
              "click",
              (e) => {
                console.log("BaseComponent click once", e);
              },
              {
                once: true,
              }
            );
          },
        ]}
      />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

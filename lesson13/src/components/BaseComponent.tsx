// 1. Реализовать базовый компонент React с поддержкой посетителей. Реализовать стандартные посетители для добавления обработчиков событий.

import { useEffect, useRef } from "react";

type BaseComponentProps = {
  accept: Array<(elem: HTMLElement) => void>;
};

export const BaseComponent = ({ accept }: BaseComponentProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (root !== null) {
      accept.forEach((visitor) => visitor(root));
    }
  }, []);

  return (
    <div ref={rootRef}>
      <h1>BaseComponent</h1>
    </div>
  );
};

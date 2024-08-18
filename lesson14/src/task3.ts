// 3. Реализовать поддержку дефолтных реализаций для интерфейсов классов.
abstract class Duckable {
  abstract name: string;
  abstract fly(): void;

  getQuack(size: number): string {
    throw "Unimplemented!";
  }

  static getQuack: AddSelf<Duckable["getQuack"], Duckable> = (self, size) => {
    if (size < 10) {
      return "quac!";
    }

    if (size < 20) {
      return "quack!!!";
    }

    return "QUACK!!!";
  };
}

type AddSelf<F extends Function, C extends object> = (
  self: C,
  ...args: F extends (...args: infer A) => any ? A : never
) => F extends (...args: any) => infer R ? R : never;

type Trait<F extends Function, P extends F["prototype"] = F["prototype"]> = {
  [K in Extract<keyof F, keyof P>]: P[K];
};

interface DuckLike extends Trait<typeof Duckable> {}

function derive<F extends Function>(fn: F) {
  return function (target: Function) {
    const keys = Object.keys(fn.prototype);
    for (const key of keys) {
      if (key in fn) {
        target.prototype[key] = fn[key as keyof F];
      }
    }
  };
}

@derive(Duckable)
class DuckLike implements Duckable {
  name: string = "Bob";

  fly(): void {
    // Do some logic to fly
  }
}

// 'QUACK!!!'
console.log(new DuckLike().getQuack(1));

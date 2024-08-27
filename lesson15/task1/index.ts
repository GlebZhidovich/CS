// 1. Реализовать класс EventEmitter с добавлением перегрузок для асинхронных итераторов.

class AsyncEvent {
  private queue: Array<unknown> = [];
  private resolve?: (value: unknown) => void;
  private reject?: (reason?: any) => void;
  private cancel = Symbol("cancel");

  add(value: unknown) {
    if (this.resolve === undefined) {
      this.queue.push(value);
    } else {
      this.resolve(value);
      this.resolve = undefined;
      this.reject = undefined;
    }
  }

  stop() {
    if (this.reject === undefined) {
      this.queue.push(this.cancel);
    } else {
      this.reject();
      this.resolve = undefined;
      this.reject = undefined;
    }
  }

  async *start() {
    try {
      while (true) {
        const result = await new Promise((resolve, reject) => {
          if (this.queue.length !== 0) {
            const value = this.queue.shift();
            if (value === this.cancel) {
              reject();
            }
            resolve(value);
          } else {
            this.resolve = resolve;
            this.reject = reject;
          }
        });

        yield result;
      }
    } catch {}
  }
}

type EventStore = {
  cb: Set<(e: unknown) => void>;
  async: AsyncEvent[];
};

type EventsStore = {
  on: EventStore;
  once: EventStore;
};

type KeyStore = keyof Required<EventsStore>;

class EventEmitter {
  events = new Map<string, EventsStore>();
  keys: Array<KeyStore> = ["on", "once"];

  addEvent(key: KeyStore, name: string): AsyncGenerator<unknown, void, unknown>;
  addEvent(key: KeyStore, name: string, cb: (e: unknown) => void): void;
  addEvent(key: KeyStore, name: string, cb?: (e: unknown) => void) {
    const store: EventsStore = this.events.get(name) ?? {
      on: {
        cb: new Set(),
        async: [],
      },
      once: {
        cb: new Set(),
        async: [],
      },
    };

    if (cb) {
      store[key].cb.add(cb);
      this.events.set(name, store);
      return;
    }

    const event = new AsyncEvent();

    store[key].async.push(event);
    this.events.set(name, store);

    return event.start.call(event);
  }

  once(name: string): AsyncGenerator<unknown, void, unknown>;
  once(name: string, cb: (e: unknown) => void): void;
  once(name: string, cb?: (e: unknown) => void) {
    const type = "once";

    if (cb) {
      return this.addEvent(type, name, cb);
    }

    return this.addEvent(type, name);
  }

  on(name: string): AsyncGenerator<unknown, void, unknown>;
  on(name: string, cb: (e: unknown) => void): void;
  on(name: string, cb?: (e: unknown) => void) {
    const type = "on";

    if (cb) {
      return this.addEvent(type, name, cb);
    }

    return this.addEvent(type, name);
  }

  emit(name: string, value: unknown) {
    const store = this.events.get(name);

    if (!store) {
      return;
    }

    this.keys.forEach((key) => {
      store[key]?.cb.forEach((cb) => {
        cb(value);
      });
      store[key]?.async.forEach((event) => {
        event.add(value);
      });
    });

    store.once.cb.clear();
    store.once.async.forEach((event) => {
      event.stop();
    });
    store.once.async = [];
  }

  off(name: string) {
    const store = this.events.get(name);

    if (!store) {
      return;
    }

    this.keys.forEach((key) => {
      store[key].cb.clear();
      store[key].async.forEach((event) => {
        event.stop();
      });
      store[key].async = [];
    });
  }
}

const ee = new EventEmitter();

ee.once("someEvent", (e) => {
  console.log(e);
});

(async () => {
  for await (const e of ee.on("myEvent")) {
    console.log("myEvent", e);
  }
})();

(async () => {
  for await (const e of ee.once("myEvent")) {
    console.log("myEvent once", e);
  }
})();

ee.emit("someEvent", 42);
ee.emit("myEvent", 22);
ee.emit("myEvent", 12);
ee.emit("myEvent", 32);
ee.emit("someEvent", 55);

ee.off("myEvent");
ee.off("someEvent");

ee.emit("myEvent", 112);

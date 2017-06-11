import "mocha";

import * as chai from "chai";
import { assert } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as Rx from "rxjs";
import { IScheduler } from "rxjs/Scheduler";

import * as index from "../src/index";

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe("slidingWindow", () => {
  let scheduler: Rx.TestScheduler;

  const subject = (in$: Rx.Observable<string>) =>
    in$.let(index.windowLet(30, scheduler));

  beforeEach(() => {
    scheduler = new Rx.TestScheduler(assert.deepEqual);
  });

  it("terminates immediately is there's no items in the buffer", () => {
    //           0         1         2         3
    //           0123456789012345678901234567890123456789
    const IN  = "---|";
    const OUT = "---|";

    const in$ = scheduler.createHotObservable(IN);
    scheduler
      .expectObservable(subject(in$))
      .toBe(OUT);
    scheduler.flush();
  });

  it("emits window contents twice for a single input event", () => {
    //           0         1         2         3
    //           0123456789012345678901234567890123456789
    const IN  = "a|";
    const OUT = "p--(q|)";

    const in$ = scheduler.createHotObservable(IN);
    scheduler
      .expectObservable(subject(in$))
      .toBe(OUT, {
        p: ["a"],
        q: []
      });
    scheduler.flush();
  });

  it("handles events separated by more than one window size", () => {
    //           0         1         2         3
    //           0123456789012345678901234567890123456789
    const IN  = "a----b|";
    const OUT = "p--q-r--(s|)";

    const in$ = scheduler.createHotObservable(IN);
    scheduler
      .expectObservable(subject(in$))
      .toBe(OUT, {
        p: ["a"],
        q: [],
        r: ["b"],
        s: []
      });
    scheduler.flush();
  });

  it("handles windows containing more than one event", () => {
    //           0         1         2         3
    //           0123456789012345678901234567890123456789
    const IN  = "abc|";
    const OUT = "pqrst(u|)";

    const in$ = scheduler.createHotObservable(IN);
    scheduler
      .expectObservable(subject(in$))
      .toBe(OUT, {
        p: ["a"],
        q: ["a", "b"],
        r: ["a", "b", "c"],
        s: ["b", "c"],
        t: ["c"],
        u: []
      });
    scheduler.flush();
  });
});

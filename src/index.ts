import { Observable, Scheduler, Subscription } from "rxjs";
import { IScheduler } from "rxjs/Scheduler";

function windowOp<T>(
  size: number,
  scheduler: IScheduler
) {
  scheduler = scheduler || Scheduler.async;

  return new Observable((observer) => {
    let done: boolean = false;
    let buffer: T[] = [];

    const group = new Subscription();

    group.add(this.subscribe(
      (value: T) => {
        buffer = buffer.concat(value);
        observer.next(buffer);

        scheduler.schedule(
          () => {
            buffer = buffer.slice(1);
            observer.next(buffer);

            if (done && buffer.length === 0) {
              observer.complete();
            }
          },
          size
        );
      },
      observer.error.bind(observer),
      () => {
        done = true;
        if (buffer.length === 0) {
          observer.complete();
        }
      }
    ));

    return group;
  });
}

const windowLet = <T>(
  size: number,
  scheduler: IScheduler
) => (
  source: Observable<T>
): Observable<T> => {
  return windowOp.call(source, size, scheduler);
};

export { windowOp, windowLet };

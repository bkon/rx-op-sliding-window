# Description

"Smooth" sliding window operator for RxJS.

```
slidingWindow(windowSize, scheduler)
```

Unlike standard `buffer` and `window` operators, single input event
may be included in several output buffers (see example below).

Think "moving average" if you want a real-life use case.

# Marble diagram

```
IN:  ---|
OUT: ---|
```

```
IN:  a|
OUT: p--(q|)
p = [a]
q = []
```

```
IN:  a----b|
OUT: p--q-r--(s|)
p = [a]
q = []
r = [b]
s = []
```

```
IN:  abc|
OUT: pqrst(u|)

p = [a]
q = [a,b]
r = [a,b,c]
s = [b,c]
t = [c]
u = []
```

# Installation

Use `npm` or `yarn`

```
npm install --save rx-op-sliding-window
yarn add rx-op-sliding-window
```

# Usage

```
import { windowLet, windowOp } from "rx-op-sliding-window";

out$ = in$.let(windowLet(100));
out$ = in$::windowOp(100);
```

or, if you're feeling lucky:

```
Observable.prototype.slidingWindow = windowOp;
out$ = in$.slidingWindow(100);
```

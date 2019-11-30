import { h } from "../../h";
import { ExtendedAsyncIterable, source, asyncExtendedIterable } from "iterable";
import { defer } from "../defer";

const randomAngle = () => (Math.random() * 360);

interface CubeOptions {
  x: number;
  y: number;
  z: number;
  delta: ExtendedAsyncIterable<number>;
  signal(): void;
}

async function *Cube({ delta, x, y, z, signal }: CubeOptions) {

  let element: HTMLElement;

  yield (
    <div class="cube" onBeforeRender={(value: HTMLElement) => { element = value; }} style={`transform: ${transform()}`}>
      <div class="cube-face-top" />
      <div class="cube-face-bottom" />
      <div class="cube-face-left" />
      <div class="cube-face-right" />
      <div class="cube-face-front" />
      <div class="cube-face-back" />
    </div>
  );

  signal();

  await delta.forEach(
    delta => {
      element.style.transform = transform(delta);
    }
  );

  function transform(delta: number = 0) {
    return `rotateX(${x + delta}deg) rotateY(${y + delta}deg) rotateZ(${z + delta}deg)`;
  }
}

interface SurfaceOptions {
  delta: ExtendedAsyncIterable<number>;
  count?: number;
  signal(): void;
}

function Surface({ delta, count: length = 1, signal }: SurfaceOptions) {

  let signalled: number = 0;

  function childSignal() {
    signalled += 1;
    if (signalled === length) {
      signal();
    }
  }

  return (
    <div class="cubes">
      {
        Array.from({ length }).map(() => {
          return (
            <Cube
              delta={delta}
              x={randomAngle()}
              y={randomAngle()}
              z={randomAngle()}
              signal={childSignal}
            />
          );
        })
      }
    </div>
  );
}

export default function () {
  const delta = source<number>();
  const fps = source<string>();
  const { resolve: signal, promise: onSignal } = defer<void>();

  return (
    <fragment>
      <p>
        FPS: <FPS />
      </p>
      <Surface delta={asyncExtendedIterable(delta)} count={200} signal={signal} />
      <Controller />
    </fragment>
  );

  async function *FPS() {
    for await (const value of fps) {
      yield <fragment>{value}</fragment>;
    }
  }

  async function Controller() {
    await onSignal;
    let currentDelta: number = 0;
    let lastCalledTime: number = 0;
    do {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const timeDelta = Date.now() - lastCalledTime;
      fps.push((1 / (timeDelta / 1000)).toFixed());
      currentDelta += 0.1;
      lastCalledTime = Date.now();
      delta.push(currentDelta);
      // continue for 15 seconds
    } while (currentDelta < 360);
    console.log("Done");
    delta.close();
  }
}

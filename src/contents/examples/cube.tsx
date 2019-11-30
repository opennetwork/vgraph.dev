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
      <div class="cube-face cube-face-top" />
      <div class="cube-face cube-face-bottom" />
      <div class="cube-face cube-face-left" />
      <div class="cube-face cube-face-right" />
      <div class="cube-face cube-face-front" />
      <div class="cube-face cube-face-back" />
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
  const domNodesPerCube = 7;
  const count = 100;
  const surfaces = 1;
  const totalCount = count * surfaces;
  const frameDelta = 0.25;
  const maxDelta = 360;
  const delta = source<number>();
  const fps = source<number>();
  const remainingDelta = source<number>();
  const { resolve: signal, promise: onSignal } = defer<void>();

  let signalled: number = 0;

  function childSignal() {
    signalled += 1;
    if (signalled === surfaces) {
      signal();
    }
  }

  return (
    <fragment>
      <p>
        Rendering {totalCount} cubes across {surfaces} surfaces ({count} cubes each) at <FPS /> frames per second
      </p>
      <p>
        Each cube renders a total of {domNodesPerCube} DOM elements, 1 being the cube parent, and {domNodesPerCube - 1} being each face of the cube<br />
        Each cube will rotate {frameDelta} degrees in each direction (X, Y, & Z) on each frame, rotating a total of {maxDelta} degrees throughout this demo (<RemainingDelta /> degrees remaining)
      </p>
      {
        Array.from({ length: surfaces }).map(
          () => <Surface delta={asyncExtendedIterable(delta)} signal={childSignal} count={count} />
        )
      }
      <Controller />
    </fragment>
  );

  async function *FPS() {
    for await (const value of fps) {
      yield <fragment>{value.toFixed()}</fragment>;
    }
  }

  async function *DOMNodesPS() {
    for await (const value of fps) {
      yield <fragment>{(value * totalCount * domNodesPerCube).toFixed()}</fragment>;
    }
  }

  async function *RemainingDelta() {
    for await (const value of remainingDelta) {
      yield <fragment>{value.toFixed()} degrees</fragment>;
    }
  }

  async function Controller() {
    await onSignal;
    let currentDelta: number = 0;
    let lastCalledTime: number = 0;
    do {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const timeDelta = Date.now() - lastCalledTime;
      fps.push(1 / (timeDelta / 1000));
      currentDelta += frameDelta;
      lastCalledTime = Date.now();
      delta.push(currentDelta);
      remainingDelta.push(maxDelta - currentDelta);
    } while (currentDelta < maxDelta);
    console.log("Done");
    delta.close();
    fps.close();
    remainingDelta.close();
  }
}

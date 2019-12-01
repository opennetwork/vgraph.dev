import { h } from "../../h";
import { ExtendedAsyncIterable, source, asyncExtendedIterable } from "iterable";
import { defer } from "../defer";
import { isChrome, isSafari } from "./is";

function randomAngle() {
  return Math.random() * 360;
}

function signals(count: number): [() => void, Promise<void>] {
  let signalled = 0;
  const { resolve: complete, promise } = defer<void>();
  return [signal, promise];

  function signal () {
    signalled += 1;
    if (signalled === count) {
      complete();
    }
  }
}

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

  const [childSignal, onSignalled] = signals(length);
  onSignalled.then(signal);

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

interface CubeRendererOptions {
  count?: number;
}

function CubeRenderer({ count: requestedCount }: CubeRendererOptions) {
  const domNodesPerCube = 7;
  // WebKit (used in Safari) treats a transform change as a layout change, so is a bit slower!
  const count = isSafari() ? 5 : (requestedCount || (isChrome() ? 1000 : 100));
  const surfaces = 1;
  const totalCount = count * surfaces;
  const frameDelta = 0.2;
  const maxDelta = 45;
  // Chrome can reach max FPS no problem, other browsers drag at max (60-70 fps)
  // so we have to limit them
  const maxFPS = isSafari() ? 30 : 100;

  const delta = source<number>();
  const fps = source<number>();
  const remainingDelta = asyncExtendedIterable(delta).map(delta => maxDelta - delta);

  const [childSignal, onSignalled] = signals(surfaces);

  return (
    <fragment>
      {
        surfaces === 1 ? (
          <p>
            Rendering {totalCount} cubes at <FPS/> frames per second{maxFPS === Number.POSITIVE_INFINITY ? "" : ` (limited to ${maxFPS} frames per second)`}, utilising <TPF />ms per frame
          </p>
        ) : (
          <p>
            Rendering {totalCount} cubes across {surfaces} surfaces ({count} cubes each) at <FPS /> frames per second
          </p>
        )
      }
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

  async function *TPF() {
    for await (const value of fps) {
      yield <fragment>{(1000 / value).toFixed()}</fragment>;
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
    await onSignalled;
    let currentDelta: number = 0;
    let lastCalledTime: number = 0;
    do {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const timeDelta = Date.now() - lastCalledTime;
      const currentFPS = 1 / (timeDelta / 1000);
      if (currentFPS > maxFPS) {
        // To quick!
        continue;
      }
      fps.push(currentFPS);
      currentDelta += frameDelta;
      lastCalledTime = Date.now();
      delta.push(currentDelta);
    } while (currentDelta < maxDelta);
    delta.close();
    fps.close();
  }
}

export default function CubeExample() {
  if (isSafari()) {
    // Safari/WebKit is limited to the default cubes
    return <CubeRenderer />;
  }

  return (
    <div class="cube-example">
      <Run />
    </div>
  );

  async function *Run() {
    const { resolve: count, promise: onCount } = defer<number>();
    const options = [
      10, 100, 200, 500, 1000, 2000, 4000
    ];

    yield (
      <fragment>
        {
          options.map(option => (
            <button onBeforeRender={element => element.addEventListener("click", () => count(option), { once: true })}>
              Render {option} Cubes
            </button>
          ))
        }
      </fragment>
    );

    yield <CubeRenderer count={await onCount} />;

    // Restart
    yield <Run />;
  }
}

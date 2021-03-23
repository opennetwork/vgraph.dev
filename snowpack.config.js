// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  root: "./src",
  mount: {
    // Same behavior as the "src" example above:
    "src": {url: "/dist"},
    // Mount "public" to the root URL path ("/*") and serve files with zero transformations:
    "public": {url: "/", static: true, resolve: false}
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    source: "remote",
    types: true,
    cache: ".snowpack",
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    out: "build",
    jsxFactory: "h",
    clean: true
  },
};

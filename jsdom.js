import JSDOM from "jsdom";

const dom = new JSDOM.JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head></head>
<body></body>
</html>
`.trim());

// https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
// Don't do this
global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;

export default dom;

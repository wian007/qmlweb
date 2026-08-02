const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

function include(file, window) {
  // Evaluate inside the jsdom window's own realm, so the library's bare
  // references to window/document/navigator resolve against it.
  // eslint-disable-next-line no-eval
  window.eval(fs.readFileSync(path.join(__dirname, file), "utf-8"));
}

const { window } = new JSDOM("", { runScripts: "dangerously" });
include("../lib/qmlweb.js", window);
include("../lib/qmlweb.parser.js", window);

const document = window.document;
const file = process.argv[process.argv.length - 1];
const div = document.createElement("div");
document.body.appendChild(div);
const engine = new window.QmlWeb.QMLEngine(div, {});
window.QmlWeb.urlContentCache[file] = fs.readFileSync(file, "utf-8");
engine.loadFile(file);
engine.start();

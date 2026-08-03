// Renders <script type="text/qml"> blocks found in the page.
//
// By default each block gets its own wrapper <div>, inserted right before
// the script tag. Set data-qml-target="#selector" on the script tag to
// render into an existing element instead.
function loadInlineQML() {
  const scripts = document.querySelectorAll("script[type=\"text/qml\"]");
  for (let i = 0; i < scripts.length; ++i) {
    const script = scripts[i];
    const targetSelector = script.getAttribute("data-qml-target");
    let target = targetSelector && document.querySelector(targetSelector);
    const isAutoCreated = !target;
    if (!target) {
      target = document.createElement("div");
      script.parentNode.insertBefore(target, script);
    }

    const engine = new QmlWeb.QMLEngine(target);
    QmlWeb.qmlEngines = QmlWeb.qmlEngines || [];
    QmlWeb.qmlEngines.push(engine);
    engine.loadQML(script.textContent);
    engine.start();
    // An explicit data-qml-target is assumed to carry its own CSS sizing
    // (see examples/embed.html); only size targets we created ourselves.
    if (isAutoCreated) {
      engine.autoSizeTarget();
    }
  }
}

window.addEventListener("load", loadInlineQML);

QmlWeb.loadInlineQML = loadInlineQML;

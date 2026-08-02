describe("QMLEngine.InlineLoader", function() {
  afterEach(function() {
    QmlWeb.qmlEngines = [];
    var scripts = document.querySelectorAll("script[type=\"text/qml\"]");
    for (var i = 0; i < scripts.length; i++) {
      scripts[i].remove();
    }
    var wrapper = document.getElementById("inlineLoaderWrapper");
    if (wrapper) {
      wrapper.remove();
    }
  });

  it("renders into an auto-created wrapper div", function() {
    var script = document.createElement("script");
    script.type = "text/qml";
    script.textContent = "import QtQuick 2.0\nRectangle { color: \"red\" }";
    document.body.appendChild(script);

    QmlWeb.loadInlineQML();

    expect(QmlWeb.qmlEngines.length).toBe(1);
    var target = script.previousSibling;
    expect(target.tagName).toBe("DIV");
    expect(target.children[0].className).toBe("Rectangle");
  });

  it("renders into an explicit data-qml-target", function() {
    var wrapper = document.createElement("div");
    wrapper.id = "inlineLoaderWrapper";
    document.body.appendChild(wrapper);

    var script = document.createElement("script");
    script.type = "text/qml";
    script.setAttribute("data-qml-target", "#inlineLoaderWrapper");
    script.textContent = "import QtQuick 2.0\nRectangle { color: \"blue\" }";
    document.body.appendChild(script);

    QmlWeb.loadInlineQML();

    expect(wrapper.children[0].className).toBe("Rectangle");
  });
});

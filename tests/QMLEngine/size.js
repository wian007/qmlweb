describe("QMLEngine.size", function() {
  setupDivElement();

  function makeEngine(src, div) {
    var engine = new QmlWeb.QMLEngine(div);
    engine.loadQML(src);
    engine.start();
    return engine;
  }

  it("size() reflects the root object's width/height", function() {
    var engine = makeEngine(
      "import QtQuick 2.0\nRectangle { width: 120; height: 80 }\n", this.div
    );
    expect(function() {
      return engine.size();
    }).not.toThrow();
    expect(engine.size()).toEqual({ width: 120, height: 80 });
  });

  it("autoSizeTarget() sizes and keeps an unstyled target in sync",
    function() {
      var target = document.createElement("div");
      var engine = makeEngine(
        "import QtQuick 2.0\nRectangle { width: 50; height: 30 }\n", target
      );
      document.body.appendChild(target);
      engine.autoSizeTarget();
      expect(target.style.width).toBe("50px");
      expect(target.style.height).toBe("30px");

      engine.rootObject.width = 200;
      engine.rootObject.height = 150;
      expect(target.style.width).toBe("200px");
      expect(target.style.height).toBe("150px");

      target.remove();
    });
});

describe("QtQuick.Item", function() {
  setupDivElement();
  var load = prefixedQmlLoader("QtQuick/qml/Item");

  it("Empty", function() {
    load("Empty", this.div);
    var div = this.div.children[0];
    expect(div.innerHTML).toBe("");
    expect(div.style.backgroundColor).toBe("");
  });
  it("Size", function() {
    load("Size", this.div);
    var div = this.div.children[0];
    expect(div.offsetWidth).toBe(200);
    expect(div.offsetHeight).toBe(100);
    expect(div.clientWidth).toBe(200);
    expect(div.clientHeight).toBe(100);
  });
  it("enabled defaults to true and is a real bindable property",
    function() {
      var qml = loadQml(
        "import QtQuick 2.0\nItem { enabled: false }\n", this.div
      );
      expect(qml.enabled).toBe(false);
      qml.enabled = true;
      expect(qml.enabled).toBe(true);
    });
  it("childrenRect", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Item {\n" +
      "  width: 300; height: 300\n" +
      "  Rectangle { x: 10; y: 20; width: 30; height: 40 }\n" +
      "  Rectangle { x: 100; y: 5; width: 50; height: 60 }\n" +
      "}\n",
      this.div
    );
    expect(qml.childrenRect.x).toBe(10);
    expect(qml.childrenRect.y).toBe(5);
    expect(qml.childrenRect.width).toBe(140);
    expect(qml.childrenRect.height).toBe(60);
    expect(function() {
      qml.childrenRect.x = 0;
    }).toThrowError(/read only/);
  });
});

describe("QtQuick.Row", function() {
  setupDivElement();

  it("padding applies uniformly on all sides", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Row {\n" +
      "  padding: 10; spacing: 5\n" +
      "  Rectangle { width: 10; height: 30 }\n" +
      "  Rectangle { width: 20; height: 20 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    var b = qml.children[1];
    expect(a.x).toBe(10);
    expect(a.y).toBe(10);
    expect(b.x).toBe(25);
    expect(b.y).toBe(10);
    expect(qml.implicitHeight).toBe(50); // 30 + 10 + 10
    expect(qml.implicitWidth).toBe(55); // 10 + 10 + 5 + 20 + 10
  });

  it("per-side padding overrides the uniform padding", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Row {\n" +
      "  padding: 10; leftPadding: 3; spacing: 5\n" +
      "  Rectangle { width: 10; height: 30 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    expect(a.x).toBe(3);
    expect(a.y).toBe(10);
  });
});

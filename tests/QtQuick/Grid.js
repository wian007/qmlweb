describe("QtQuick.Grid", function() {
  setupDivElement();

  it("padding offsets the whole grid and implicit size", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Grid {\n" +
      "  columns: 2; padding: 10; spacing: 5\n" +
      "  Rectangle { width: 10; height: 10 }\n" +
      "  Rectangle { width: 10; height: 10 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    var b = qml.children[1];
    expect(a.x).toBe(10);
    expect(a.y).toBe(10);
    expect(b.x).toBe(25);
    expect(b.y).toBe(10);
    expect(qml.implicitWidth).toBe(45);
    expect(qml.implicitHeight).toBe(30);
  });

  it("per-side padding overrides the uniform padding", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Grid {\n" +
      "  columns: 2; padding: 10; leftPadding: 3; spacing: 5\n" +
      "  Rectangle { width: 10; height: 10 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    expect(a.x).toBe(3);
    expect(a.y).toBe(10);
  });
});

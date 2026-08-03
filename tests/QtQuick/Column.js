describe("QtQuick.Column", function() {
  setupDivElement();

  it("padding applies uniformly on all sides", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Column {\n" +
      "  padding: 10; spacing: 5\n" +
      "  Rectangle { width: 30; height: 10 }\n" +
      "  Rectangle { width: 20; height: 20 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    var b = qml.children[1];
    expect(a.x).toBe(10);
    expect(a.y).toBe(10);
    expect(b.x).toBe(10);
    expect(b.y).toBe(25);
    expect(qml.implicitWidth).toBe(50); // 30 + 10 + 10
    expect(qml.implicitHeight).toBe(55); // 10 + 10 + 5 + 20 + 10
  });

  it("per-side padding overrides the uniform padding", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Column {\n" +
      "  padding: 10; topPadding: 3; spacing: 5\n" +
      "  Rectangle { width: 30; height: 10 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    expect(a.y).toBe(3);
    expect(a.x).toBe(10);
  });
});

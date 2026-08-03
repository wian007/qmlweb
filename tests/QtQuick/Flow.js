describe("QtQuick.Flow", function() {
  setupDivElement();

  it("padding offsets children and implicit size", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Flow {\n" +
      "  width: 200; padding: 10; spacing: 5\n" +
      "  Rectangle { width: 30; height: 10 }\n" +
      "  Rectangle { width: 20; height: 20 }\n" +
      "}\n",
      this.div
    );
    var a = qml.children[0];
    var b = qml.children[1];
    expect(a.x).toBe(10);
    expect(a.y).toBe(10);
    expect(b.x).toBe(45); // 10 + 30 + 5
    expect(b.y).toBe(10);
    // 10 (top) + 20 (rowSize) + 10 (bottom)
    expect(qml.implicitHeight).toBe(40);
  });

  it("wrapping accounts for right padding", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Flow {\n" +
      "  width: 50; padding: 10; spacing: 5\n" +
      "  Rectangle { width: 20; height: 10 }\n" +
      "  Rectangle { width: 20; height: 10 }\n" +
      "}\n",
      this.div
    );
    // Available width is 50 - 10 - 10 = 30; the first item takes 20,
    // leaving 10, so the second (20 wide) doesn't fit and wraps.
    var a = qml.children[0];
    var b = qml.children[1];
    expect(a.y).toBe(10);
    expect(b.x).toBe(10);
    expect(b.y).toBe(25); // 10 + 10 (rowSize) + 5 (spacing)
  });
});

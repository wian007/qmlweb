describe("QtQml.Import without version (Qt 6 style)", function() {
  setupDivElement();

  it("resolves a plain module import to its default version", function() {
    var qml = loadQml("import QtQuick\nItem { width: 10; height: 20 }\n",
      this.div);
    expect(qml.width).toBe(10);
    expect(qml.height).toBe(20);
  });

  it("resolves a versionless import to the highest-versioned type " +
      "when duplicate names exist across QtQuick.Controls and " +
      "QtQuick.Controls 2", function() {
    var qml = loadQml(
      "import QtQuick.Controls\nApplicationWindow { }\n", this.div
    );
    // Only declared on QtQuick.Controls 2's ApplicationWindow.
    expect(qml.headerChanged).toBeDefined();
    // Only declared on QtQuick.Controls 1's ApplicationWindow.
    expect(qml.menuBarChanged).toBeUndefined();
  });

  it("still resolves an explicitly versioned import to that version",
    function() {
      var qml = loadQml(
        "import QtQuick.Controls 1.4\nApplicationWindow { }\n", this.div
      );
      expect(qml.menuBarChanged).toBeDefined();
      expect(qml.headerChanged).toBeUndefined();
    });
});

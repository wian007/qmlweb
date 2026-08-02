describe("QtQuick.TextEdit", function() {
  setupDivElement();
  var load = prefixedQmlLoader("QtQuick/qml/TextEdit");

  it("insert", function() {
    var qml = load("Basic", this.div);
    qml.insert(5, ",");
    expect(qml.text).toBe("Hello, world");
  });

  it("remove", function() {
    var qml = load("Basic", this.div);
    qml.remove(0, 6);
    expect(qml.text).toBe("world");
  });

  it("selectAll / selectedText", function() {
    var qml = load("Basic", this.div);
    qml.selectAll();
    expect(qml.selectedText).toBe("Hello world");
    expect(qml.selectionStart).toBe(0);
    expect(qml.selectionEnd).toBe(11);
  });

  it("select", function() {
    var qml = load("Basic", this.div);
    qml.select(0, 5);
    expect(qml.selectedText).toBe("Hello");
    expect(qml.selectionStart).toBe(0);
    expect(qml.selectionEnd).toBe(5);
  });

  it("deselect", function() {
    var qml = load("Basic", this.div);
    qml.select(0, 5);
    qml.deselect();
    expect(qml.selectedText).toBe("");
    expect(qml.selectionStart).toBe(qml.selectionEnd);
  });

  it("selectWord", function() {
    var qml = load("Basic", this.div);
    qml.select(7, 7); // collapse cursor inside "world"
    qml.selectWord();
    expect(qml.selectedText).toBe("world");
  });

  it("remove is undoable/redoable", function() {
    var qml = load("Basic", this.div);
    expect(qml.canUndo).toBe(false);
    qml.remove(0, 6);
    expect(qml.text).toBe("world");
    expect(qml.canUndo).toBe(true);
    qml.undo();
    expect(qml.text).toBe("Hello world");
    expect(qml.canUndo).toBe(false);
    expect(qml.canRedo).toBe(true);
    qml.redo();
    expect(qml.text).toBe("world");
  });

  it("undo/redo are no-ops on an empty stack", function() {
    var qml = load("Basic", this.div);
    expect(function() {
      qml.undo();
    }).not.toThrow();
    expect(qml.text).toBe("Hello world");
    expect(function() {
      qml.redo();
    }).not.toThrow();
    expect(qml.text).toBe("Hello world");
  });

  it("cut removes the selection and pushes undo state", function() {
    var qml = load("Basic", this.div);
    qml.select(0, 6);
    expect(function() {
      qml.cut();
    }).not.toThrow();
    expect(qml.text).toBe("world");
    qml.undo();
    expect(qml.text).toBe("Hello world");
  });

  it("copy does not throw", function() {
    var qml = load("Basic", this.div);
    qml.selectAll();
    expect(function() {
      qml.copy();
    }).not.toThrow();
  });
});

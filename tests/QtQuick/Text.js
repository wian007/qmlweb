describe("QtQuick.Text", function() {
  setupDivElement();

  var load = prefixedQmlLoader("QtQuick/qml/Text");
  it("implicit size", function() {
    var qml = load("ImplicitSize", this.div);
    expect(qml.text_item.width).toBeGreaterThan(0);
  });

  it("default wrap mode", function() {
    var qml = load("WrapMode", this.div);
    expect(qml.dom.children[0].style.whiteSpace).toBe("pre");
  });

  it("padding applies uniformly to all four sides", function() {
    var qml = loadQml(
      "import QtQuick 2.0\nText { text: \"hi\"; padding: 5 }\n", this.div
    );
    var style = qml.impl.style;
    expect(style.paddingTop).toBe("5px");
    expect(style.paddingBottom).toBe("5px");
    expect(style.paddingLeft).toBe("5px");
    expect(style.paddingRight).toBe("5px");
  });

  it("per-side padding overrides the uniform padding", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Text { text: \"hi\"; padding: 5; leftPadding: 20 }\n",
      this.div
    );
    var style = qml.impl.style;
    expect(style.paddingLeft).toBe("20px");
    expect(style.paddingTop).toBe("5px");
    expect(style.paddingBottom).toBe("5px");
    expect(style.paddingRight).toBe("5px");

    qml.leftPadding = 8;
    expect(qml.impl.style.paddingLeft).toBe("8px");
  });
});


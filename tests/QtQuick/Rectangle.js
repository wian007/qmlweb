describe("QtQuick.Rectangle", function() {
  setupDivElement();
  var load = prefixedQmlLoader("QtQuick/qml/Rectangle");

  it("White", function() {
    load("White", this.div);
    var div = this.div.children[0];
    expect(div.children[0].innerHTML).toBe("");
    expect(div.children[0].style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(div.offsetWidth).toBe(200);
    expect(div.offsetHeight).toBe(100);
    expect(div.clientWidth).toBe(200);
    expect(div.clientHeight).toBe(100);
  });
  it("Color", function() {
    load("Color", this.div);
    var div = this.div.children[0];
    expect(div.children[0].style.backgroundColor).toBe("rgb(255, 0, 0)");
  });
  it("Transparent", function() {
    load("Transparent", this.div);
    var div = this.div.children[0];
    expect(div.children[0].style.backgroundColor).toBe("transparent");
  });
  it("radius applies uniformly to all four corners", function() {
    var qml = loadQml(
      "import QtQuick 2.0\nRectangle { radius: 5 }\n", this.div
    );
    var style = qml.impl.style;
    expect(style.borderTopLeftRadius).toBe("5px");
    expect(style.borderTopRightRadius).toBe("5px");
    expect(style.borderBottomLeftRadius).toBe("5px");
    expect(style.borderBottomRightRadius).toBe("5px");
  });
  it("per-corner radius overrides the uniform radius", function() {
    var qml = loadQml(
      "import QtQuick 2.0\n" +
      "Rectangle { radius: 5; topLeftRadius: 20 }\n",
      this.div
    );
    var style = qml.impl.style;
    expect(style.borderTopLeftRadius).toBe("20px");
    expect(style.borderTopRightRadius).toBe("5px");
    expect(style.borderBottomLeftRadius).toBe("5px");
    expect(style.borderBottomRightRadius).toBe("5px");

    qml.topLeftRadius = 8;
    expect(qml.impl.style.borderTopLeftRadius).toBe("8px");
  });
});

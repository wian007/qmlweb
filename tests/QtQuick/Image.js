describe("QtQuick.Image", function() {
  setupDivElement();

  function load(extra, div) {
    return loadQml(
      "import QtQuick 2.0\n" +
      "Image {\n" +
      "  source: \"/base/tests/Render/Async/bg.png\"\n" +
      "  width: 40; height: 40\n" +
      extra +
      "}\n",
      div
    );
  }

  function whenReady(qml, callback) {
    if (qml.status === qml.Image.Ready) {
      callback();
      return;
    }
    qml.statusChanged.connect(function onChange() {
      if (qml.status === qml.Image.Ready) {
        qml.statusChanged.disconnect(onChange);
        callback();
      }
    });
  }

  it("paintedWidth/paintedHeight fill the item under Stretch",
    function(done) {
      var qml = load("fillMode: Image.Stretch\n", this.div);
      whenReady(qml, function() {
        expect(qml.paintedWidth).toBe(40);
        expect(qml.paintedHeight).toBe(40);
        done();
      });
    });

  it("paintedWidth/paintedHeight preserve aspect ratio under " +
      "PreserveAspectFit", function(done) {
    var qml = load("fillMode: Image.PreserveAspectFit\n", this.div);
    whenReady(qml, function() {
      // bg.png is 4x10; fit inside 40x40 keeps that 2:5 ratio.
      expect(qml.paintedWidth).toBe(16);
      expect(qml.paintedHeight).toBe(40);
      done();
    });
  });

  it("paintedWidth/paintedHeight can exceed the item under " +
      "PreserveAspectCrop", function(done) {
    var qml = load("fillMode: Image.PreserveAspectCrop\n", this.div);
    whenReady(qml, function() {
      expect(qml.paintedWidth).toBe(40);
      expect(qml.paintedHeight).toBe(100);
      done();
    });
  });
});

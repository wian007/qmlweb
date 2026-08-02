describe("QtMultimedia.Video", function() {
  setupDivElement();

  function load(div) {
    return loadQml(
      "import QtQuick 2.0\nimport QtMultimedia 5.0\nVideo {}\n", div
    );
  }

  it("exposes a Buffered status distinct from Buffering", function() {
    var qml = load(this.div);
    expect(qml.MediaPlayer.Buffered).toBeDefined();
    expect(qml.MediaPlayer.Buffered).not.toBe(qml.MediaPlayer.Buffering);
  });

  it("mutes and restores the previous volume", function() {
    var qml = load(this.div);
    qml.volume = 0.75;
    qml.muted = true;
    expect(qml.volume).toBe(0);
    qml.muted = false;
    expect(qml.volume).toBe(0.75);
  });

  it("stop pauses and resets position", function() {
    var qml = load(this.div);
    expect(function() {
      qml.play();
      qml.stop();
    }).not.toThrow();
    expect(qml.impl.paused).toBe(true);
    expect(qml.impl.currentTime).toBe(0);
  });

  it("seek and play/pause do not throw", function() {
    var qml = load(this.div);
    expect(function() {
      qml.seek(1000);
      qml.play();
      qml.pause();
    }).not.toThrow();
  });
});

describe("QtMultimedia.Audio", function() {
  setupDivElement();

  function load(div) {
    return loadQml(
      "import QtQuick 2.0\nimport QtMultimedia 5.0\nAudio {}\n", div
    );
  }

  it("exposes a Buffered status distinct from Buffering", function() {
    var qml = load(this.div);
    expect(qml.Audio.Buffered).toBeDefined();
    expect(qml.Audio.Buffered).not.toBe(qml.Audio.Buffering);
  });

  it("mutes and restores the previous volume", function() {
    var qml = load(this.div);
    qml.volume = 0.75;
    qml.muted = true;
    expect(qml.volume).toBe(0);
    qml.muted = false;
    expect(qml.volume).toBe(0.75);
  });

  it("reflects autoPlay onto the underlying element", function() {
    var qml = load(this.div);
    qml.autoPlay = true;
    expect(qml.impl.autoplay).toBe(true);
  });

  it("play/pause/stop/seek do not throw", function() {
    var qml = load(this.div);
    expect(function() {
      qml.play();
      qml.pause();
      qml.seek(1000);
      qml.stop();
    }).not.toThrow();
  });
});

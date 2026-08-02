// eslint-disable-next-line no-undef
class QtMultimedia_Audio extends QtQml_QtObject {
  static versions = /^5\./;
  static enums = {
    Audio: {
      Available: 0, Busy: 2, Unavailable: 1, ResourceMissing: 3,

      NoError: 0, ResourceError: 1, FormatError: 2, NetworkError: 4,
      AccessDenied: 8, ServiceMissing: 16,

      StoppedState: 0, PlayingState: 1, PausedState: 2,

      NoMedia: 0, Loading: 1, Loaded: 2, Buffering: 4, Buffered: 128,
      Stalled: 8, EndOfMedia: 16, InvalidMedia: 32, UnknownStatus: 64
    }
  };
  static properties = {
    audioRole: "enum", // TODO
    autoLoad: { type: "bool", initialValue: true },
    autoPlay: "bool",
    availability: "enum", // Audio.Available
    duration: "int",
    error: "enum", // Audio.NoError
    errorString: "string",
    hasAudio: "bool",
    hasVideo: "bool",
    loops: { type: "int", initialValue: 1 },
    mediaObject: "var",
    // TODO: metaData
    muted: "bool",
    playbackRate: { type: "real", initialValue: 1 },
    playbackState: "enum", // Audio.StoppedState
    playlinst: "Playlist",
    position: "int",
    seekable: "bool",
    source: "url",
    status: "enum", // Audio.NoMedia
    volume: { type: "real", initialValue: 1 }
  };
  static signals = {
    error: [
      { type: "enum", name: "error" },
      { type: "string", name: "errorString" }
    ],
    paused: [],
    playing: [],
    stopped: []
  };

  constructor(meta) {
    super(meta);

    this.$runningEventListener = 0;

    this.impl = document.createElement("audio");
    this.volume = this.impl.volume;
    this.duration = this.impl.duration * 1000;

    this.impl.addEventListener("play", () => {
      this.playing();
      this.playbackState = this.Audio.PlayingState;
    });

    this.impl.addEventListener("pause", () => {
      this.paused();
      this.playbackState = this.Audio.PausedState;
    });

    this.impl.addEventListener("timeupdate", () => {
      this.$runningEventListener++;
      this.position = this.impl.currentTime * 1000;
      this.$runningEventListener--;
    });

    this.impl.addEventListener("ended", () => {
      this.stopped();
      this.playbackState = this.Audio.StoppedState;
    });

    this.impl.addEventListener("durationchange", () => {
      this.duration = this.impl.duration * 1000;
    });

    this.impl.addEventListener("volumechange", () => {
      this.$runningEventListener++;
      this.volume = this.impl.volume;
      this.$runningEventListener--;
    });

    this.impl.addEventListener("error", () => {
      this.error |= this.Audio.ResourceError;
    });

    this.impl.addEventListener("ratechange", () => {
      this.$runningEventListener++;
      this.playbackRate = this.impl.playbackRate;
      this.$runningEventListener--;
    });

    this.autoPlayChanged.connect(this, this.$onAutoPlayChanged);
    this.sourceChanged.connect(this, this.$onSourceChanged);
    this.positionChanged.connect(this, this.$onPositionChanged);
    this.volumeChanged.connect(this, this.$onVolumeChanged);
    this.playbackRateChanged.connect(this, this.$onPlaybackRateChanged);
    this.mutedChanged.connect(this, this.$onMutedChanged);
  }
  $onAutoPlayChanged(newVal) {
    this.impl.autoplay = newVal;
  }
  $onSourceChanged(source) {
    this.impl.src = source;
  }
  $onPositionChanged(currentTime) {
    if (this.$runningEventListener > 0) return;
    this.impl.currentTime = currentTime / 1000;
  }
  $onVolumeChanged(volume) {
    if (this.$runningEventListener > 0) return;
    this.impl.volume = volume;
  }
  $onPlaybackRateChanged(playbackRate) {
    if (this.$runningEventListener > 0) return;
    this.impl.playbackRate = playbackRate;
  }
  $onMutedChanged(newValue) {
    if (newValue) {
      this.$volumeBackup = this.impl.volume;
      this.volume = 0;
    } else {
      this.volume = this.$volumeBackup;
    }
  }
  pause() {
    this.impl.pause();
  }
  play() {
    this.impl.play();
  }
  seek(offset) {
    this.impl.currentTime = offset / 1000;
  }
  stop() {
    this.impl.pause();
    this.impl.currentTime = 0;
  }
  supportedAudioRoles() {
    return [];
  }
}

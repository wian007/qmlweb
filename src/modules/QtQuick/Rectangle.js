// eslint-disable-next-line no-undef
class QtQuick_Rectangle extends QtQuick_Item {
  static properties = {
    color: { type: "color", initialValue: "white" },
    radius: "real",
    // Fall back to `radius` when left unset. A plain "real" property
    // defaults to 0, indistinguishable from an explicit 0, so these use
    // NaN as the "unset" sentinel instead.
    topLeftRadius: { type: "real", initialValue: NaN },
    topRightRadius: { type: "real", initialValue: NaN },
    bottomLeftRadius: { type: "real", initialValue: NaN },
    bottomRightRadius: { type: "real", initialValue: NaN },
    gradient: "gradient"
  };

  constructor(meta) {
    super(meta);

    this.border = new QmlWeb.QObject(this);
    QmlWeb.createProperties(this.border, {
      color: { type: "color", initialValue: "black" },
      width: { type: "int", initialValue: 1 }
    });
    this.$borderActive = false;

    const bg = this.impl = document.createElement("div");
    bg.style.pointerEvents = "none";
    bg.style.position = "absolute";
    bg.style.left = bg.style.right = bg.style.top = bg.style.bottom = "0px";
    bg.style.borderWidth = "0px";
    bg.style.borderStyle = "solid";
    bg.style.borderColor = this.border.color.$css;
    bg.style.backgroundColor = this.color.$css;
    this.dom.appendChild(bg);

    this.colorChanged.connect(this, this.$onColorChanged);
    this.radiusChanged.connect(this, this.$updateRadius);
    this.topLeftRadiusChanged.connect(this, this.$updateRadius);
    this.topRightRadiusChanged.connect(this, this.$updateRadius);
    this.bottomLeftRadiusChanged.connect(this, this.$updateRadius);
    this.bottomRightRadiusChanged.connect(this, this.$updateRadius);
    this.border.colorChanged.connect(this, this.border$onColorChanged);
    this.border.widthChanged.connect(this, this.border$onWidthChanged);
    this.widthChanged.connect(this, this.$updateBorder);
    this.heightChanged.connect(this, this.$updateBorder);
  }
  $onColorChanged(newVal) {
    this.impl.style.backgroundColor = newVal.$css;
  }
  border$onColorChanged(newVal) {
    this.$borderActive = true;
    this.impl.style.borderColor = newVal.$css;
    this.$updateBorder();
  }
  border$onWidthChanged() {
    this.$borderActive = true;
    this.$updateBorder();
  }
  $updateRadius() {
    const radius = this.radius;
    function corner(val) {
      return isNaN(val) ? radius : val;
    }
    const style = this.impl.style;
    style.borderTopLeftRadius = `${corner(this.topLeftRadius)}px`;
    style.borderTopRightRadius = `${corner(this.topRightRadius)}px`;
    style.borderBottomLeftRadius = `${corner(this.bottomLeftRadius)}px`;
    style.borderBottomRightRadius = `${corner(this.bottomRightRadius)}px`;
  }
  $updateBorder() {
    const border = this.$borderActive ? Math.max(0, this.border.width) : 0;
    const style = this.impl.style;
    if (border * 2 > this.width || border * 2 > this.height) {
      // Border is covering the whole background
      style.borderWidth = "0px";
      style.borderTopWidth = `${this.height}px`;
    } else {
      style.borderWidth = `${border}px`;
    }
  }
}

// eslint-disable-next-line no-undef
class QtQuick_Positioner extends QtQuick_Item {
  static properties = {
    spacing: "int",
    padding: { type: "int", initialValue: 0 },
    // Fall back to `padding` when left unset. NaN is used as the
    // "unset" sentinel since a plain "int"/"real" property defaults to
    // 0, indistinguishable from an explicit 0.
    topPadding: { type: "real", initialValue: NaN },
    bottomPadding: { type: "real", initialValue: NaN },
    leftPadding: { type: "real", initialValue: NaN },
    rightPadding: { type: "real", initialValue: NaN }
  };

  constructor(meta) {
    super(meta);

    this.childrenChanged.connect(this, this.$onChildrenChanged);
    this.spacingChanged.connect(this, this.layoutChildren);
    this.childrenChanged.connect(this, this.layoutChildren);
    this.paddingChanged.connect(this, this.layoutChildren);
    this.topPaddingChanged.connect(this, this.layoutChildren);
    this.bottomPaddingChanged.connect(this, this.layoutChildren);
    this.leftPaddingChanged.connect(this, this.layoutChildren);
    this.rightPaddingChanged.connect(this, this.layoutChildren);
    this.layoutChildren();
  }
  $paddingTop() {
    return isNaN(this.topPadding) ? this.padding : this.topPadding;
  }
  $paddingBottom() {
    return isNaN(this.bottomPadding) ? this.padding : this.bottomPadding;
  }
  $paddingLeft() {
    return isNaN(this.leftPadding) ? this.padding : this.leftPadding;
  }
  $paddingRight() {
    return isNaN(this.rightPadding) ? this.padding : this.rightPadding;
  }
  $onChildrenChanged() {
    const flags = QmlWeb.Signal.UniqueConnection;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.widthChanged.connect(this, this.layoutChildren, flags);
      child.heightChanged.connect(this, this.layoutChildren, flags);
      child.visibleChanged.connect(this, this.layoutChildren, flags);
    }
  }
  layoutChildren() {
    // noop, defined in individual positioners
  }
}

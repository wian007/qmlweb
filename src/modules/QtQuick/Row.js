// eslint-disable-next-line no-undef
class QtQuick_Row extends QtQuick_Positioner {
  static properties = {
    layoutDirection: "enum"
  };

  constructor(meta) {
    super(meta);

    this.layoutDirectionChanged.connect(this, this.layoutChildren);
    this.layoutChildren();
  }
  layoutChildren() {
    const top = this.$paddingTop();
    let curPos = this.$paddingLeft();
    let maxHeight = 0;
    // When layoutDirection is RightToLeft we need oposite order
    let i = this.layoutDirection === 1 ? this.children.length - 1 : 0;
    const endPoint = this.layoutDirection === 1 ? -1 : this.children.length;
    const step = this.layoutDirection === 1 ? -1 : 1;
    for (; i !== endPoint; i += step) {
      const child = this.children[i];
      if (!(child.visible && child.width && child.height)) {
        continue;
      }
      maxHeight = child.height > maxHeight ? child.height : maxHeight;

      child.x = curPos;
      child.y = top;

      curPos += child.width + this.spacing;
    }
    this.implicitHeight = maxHeight + top + this.$paddingBottom();
    // We want no spacing at the right side
    this.implicitWidth = curPos - this.spacing + this.$paddingRight();
  }
}

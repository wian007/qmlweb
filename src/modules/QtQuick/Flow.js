// eslint-disable-next-line no-undef
class QtQuick_Flow extends QtQuick_Positioner {
  static enums = {
    Flow: { LeftToRight: 0, TopToBottom: 1 }
  };
  static properties = {
    flow: "enum", // Flow.LeftToRight
    layoutDirection: "enum" // Flow.LeftToRight
  };

  constructor(meta) {
    super(meta);

    this.flowChanged.connect(this, this.layoutChildren);
    this.layoutDirectionChanged.connect(this, this.layoutChildren);
    this.widthChanged.connect(this, this.layoutChildren);
    this.heightChanged.connect(this, this.layoutChildren);
    this.layoutChildren();
  }

  layoutChildren() {
    if (this.flow === undefined) {
      // Flow has not been fully initialized yet
      return;
    }

    const top = this.$paddingTop();
    const left = this.$paddingLeft();
    const right = this.$paddingRight();
    const bottom = this.$paddingBottom();

    let curHPos = left;
    let curVPos = top;
    let rowSize = 0;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (!child.visible || !child.width || !child.height) {
        continue;
      }

      if (this.flow === this.Flow.LeftToRight) {
        if (!this.$isUsingImplicitWidth &&
            curHPos + child.width > this.width - right) {
          curHPos = left;
          curVPos += rowSize + this.spacing;
          rowSize = 0;
        }
        rowSize = child.height > rowSize ? child.height : rowSize;
        child.x = this.layoutDirection === this.Flow.TopToBottom
                ? this.width - right - (curHPos - left) - child.width
                : curHPos;
        child.y = curVPos;
        curHPos += child.width + this.spacing;
      } else { // Flow.TopToBottom
        if (!this.$isUsingImplicitHeight
            && curVPos + child.height > this.height - bottom) {
          curVPos = top;
          curHPos += rowSize + this.spacing;
          rowSize = 0;
        }
        rowSize = child.width > rowSize ? child.width : rowSize;
        child.x = this.layoutDirection === this.Flow.TopToBottom
                ? this.width - right - (curHPos - left) - child.width
                : curHPos;
        child.y = curVPos;
        curVPos += child.height + this.spacing;
      }
    }

    if (this.flow === this.Flow.LeftToRight) {
      this.implicitWidth = curHPos - this.spacing + right;
      this.implicitHeight = curVPos + rowSize + bottom;
    } else { // Flow.TopToBottom
      this.implicitWidth = curHPos + rowSize + right;
      this.implicitHeight = curVPos - this.spacing + bottom;
    }
  }
}

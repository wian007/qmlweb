// eslint-disable-next-line no-undef
class QtQuick_Column extends QtQuick_Positioner {
  layoutChildren() {
    const left = this.$paddingLeft();
    let curPos = this.$paddingTop();
    let maxWidth = 0;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (!child.visible || !child.width || !child.height) {
        continue;
      }
      maxWidth = child.width > maxWidth ? child.width : maxWidth;
      child.y = curPos;
      child.x = left;
      curPos += child.height + this.spacing;
    }
    this.implicitWidth = maxWidth + left + this.$paddingRight();
    this.implicitHeight = curPos - this.spacing + this.$paddingBottom();
    // We want no spacing at the bottom side
  }
}

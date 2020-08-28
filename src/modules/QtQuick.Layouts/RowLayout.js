// eslint-disable-next-line no-undef
class QtQuick_Layouts_RowLayout extends QtQuick_Item {
  static versions = /^1\./;
  static properties = {
    layoutDirection: "enum",
    spacing: "real"
  };

  constructor(meta) {
    super(meta);

    this.childrenChanged.connect(this, this.$onChildrenChanged);

    this.css.display = "flex";
    this.css.flexDirection = "row";
  }

  $onChildrenChanged() {
    this.children.forEach((child) => {
      child.css.position = "";
      child.css.top = "";
      child.css.bottom = "";
      child.css.right = "";
      child.css.float = "";

      child.css.display = "flex";
      child.css.flex = "1 1 1";

    })
  }
}

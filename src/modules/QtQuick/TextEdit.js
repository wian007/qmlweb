// eslint-disable-next-line no-undef
class QtQuick_TextEdit extends QtQuick_Item {
  static properties = {
    activeFocusOnPress: { type: "bool", initialValue: true },
    baseUrl: "url",
    canPaste: "bool",
    canRedo: "bool",
    canUndo: "bool",
    color: { type: "color", initialValue: "white" },
    contentHeight: "real",
    contentWidth: "real",
    cursorDelegate: "Component",
    cursorPosition: "int",
    cursorRectangle: "rect",
    cursorVisible: { type: "bool", initialValue: true },
    effectiveHorizontalAlignment: "enum",
    font: "font",
    horizontalAlignment: "enum",
    hoveredLink: "string",
    inputMethodComposing: "bool",
    inputMethodHints: "enum",
    length: "int",
    lineCount: "int",
    mouseSelectionMode: "enum",
    persistentSelection: "bool",
    readOnly: "bool",
    renderType: "enum",
    selectByKeyboard: { type: "bool", initialValue: true },
    selectByMouse: "bool",
    selectedText: "string",
    selectedTextColor: { type: "color", initialValue: "yellow" },
    selectionColor: { type: "color", initialValue: "pink" },
    selectionEnd: "int",
    selectionStart: "int",
    text: "string",
    textDocument: "TextDocument",
    textFormat: "enum",
    textMargin: "real",
    verticalAlignment: "enum",
    wrapMode: "enum"
  };
  static signals = {
    linkActivated: [{ type: "string", name: "link" }],
    linkHovered: [{ type: "string", name: "link" }]
  };

  constructor(meta) {
    super(meta);

    // Undo / Redo stacks; each entry is a previous value of `text`.
    this.$undoStack = [];
    this.$redoStack = [];

    const textarea = this.impl = document.createElement("textarea");
    textarea.style.pointerEvents = "auto";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.boxSizing = "border-box";
    textarea.style.borderWidth = "0";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.padding = "0"; // TODO: padding/*Padding props from Qt 5.6
    // In some browsers text-areas have a margin by default, which distorts
    // the positioning, so we need to manually set it to 0.
    textarea.style.margin = "0";
    textarea.disabled = false;
    this.dom.appendChild(textarea);

    this.Component.completed.connect(this, this.Component$onCompleted);
    this.textChanged.connect(this, this.$onTextChanged);
    this.colorChanged.connect(this, this.$onColorChanged);

    this.impl.addEventListener("input", () => this.$updateValue());
    this.impl.addEventListener("select", () => this.$updateSelection());
    this.impl.addEventListener("click", () => this.$updateSelection());
    this.impl.addEventListener("keyup", () => this.$updateSelection());
  }
  append(text) {
    this.text += text;
  }
  copy() {
    this.impl.focus();
    this.impl.setSelectionRange(this.selectionStart, this.selectionEnd);
    document.execCommand("copy");
  }
  cut() {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.impl.focus();
    this.impl.setSelectionRange(start, end);
    // Copying to the system clipboard is best-effort: some environments
    // (headless browsers, missing user activation) silently ignore it.
    // The text removal below doesn't depend on it succeeding.
    document.execCommand("copy");
    this.$replaceText(this.text.slice(0, start) + this.text.slice(end));
    this.impl.setSelectionRange(start, start);
    this.$updateSelection();
  }
  deselect() {
    const pos = this.impl.selectionStart;
    this.impl.setSelectionRange(pos, pos);
    this.$updateSelection();
  }
  getFormattedText(start, end) {
    // Rich text rendering isn't implemented, so formatted and plain text
    // are the same here.
    return this.text.slice(start, end);
  }
  getText(start, end) {
    return this.text.slice(start, end);
  }
  insert(position, text) {
    this.$replaceText(
      this.text.slice(0, position) + text + this.text.slice(position)
    );
  }
  isRightToLeft(/*start, end*/) {
    // TODO
  }
  linkAt(/*x, y*/) {
    // TODO: requires rich text rendering, which isn't implemented
  }
  moveCursorSelection(/*x, y*/) {
    // TODO: requires mapping pixel coordinates to a text offset, which
    // <textarea> has no native API for
  }
  paste() {
    // Reading the clipboard requires the async, permission-gated
    // Clipboard API; not implemented.
  }
  positionAt(/*x, y*/) {
    // TODO: requires mapping pixel coordinates to a text offset, which
    // <textarea> has no native API for
  }
  positionToRectangle(/*position*/) {
    // TODO
  }
  redo() {
    if (!this.$redoStack.length) return;
    this.$undoStack.push(this.text);
    this.text = this.$redoStack.pop();
    this.canRedo = this.$redoStack.length > 0;
    this.canUndo = true;
  }
  remove(start, end) {
    this.$replaceText(this.text.slice(0, start) + this.text.slice(end));
  }
  select(start, end) {
    this.impl.setSelectionRange(start, end);
    this.$updateSelection();
  }
  selectAll() {
    this.impl.select();
    this.$updateSelection();
  }
  selectWord() {
    const pos = this.impl.selectionStart;
    const text = this.text;
    const isWordChar = c => /\w/.test(c);
    let start = pos;
    while (start > 0 && isWordChar(text[start - 1])) start--;
    let end = pos;
    while (end < text.length && isWordChar(text[end])) end++;
    this.select(start, end);
  }
  undo() {
    if (!this.$undoStack.length) return;
    this.$redoStack.push(this.text);
    this.text = this.$undoStack.pop();
    this.canUndo = this.$undoStack.length > 0;
    this.canRedo = true;
  }
  Component$onCompleted() {
    this.selectByKeyboard = !this.readOnly;
    this.impl.readOnly = this.readOnly;
    this.$updateValue();
    this.implicitWidth = this.offsetWidth;
    this.implicitHeight = this.offsetHeight;
  }
  $onTextChanged(newVal) {
    this.impl.value = newVal;
  }
  $onColorChanged(newVal) {
    this.impl.style.color = newVal.$css;
  }
  $updateValue() {
    if (this.text !== this.impl.value) {
      this.$pushUndoState();
      this.text = this.impl.value;
    }
    this.length = this.text.length;
    this.lineCount = this.$getLineCount();
    this.$updateCss();
    this.$updateSelection();
  }
  $updateSelection() {
    this.selectionStart = this.impl.selectionStart;
    this.selectionEnd = this.impl.selectionEnd;
    this.selectedText = this.text.slice(
      this.impl.selectionStart, this.impl.selectionEnd
    );
    this.cursorPosition = this.impl.selectionEnd;
  }
  $pushUndoState() {
    this.$undoStack.push(this.text);
    this.$redoStack.length = 0;
    this.canUndo = true;
    this.canRedo = false;
  }
  $replaceText(newText) {
    if (newText === this.text) return;
    this.$pushUndoState();
    this.text = newText;
  }
  // Transfer dom style to firstChild,
  // then clear corresponding dom style
  $updateCss() {
    const supported = [
      "border",
      "borderRadius",
      "borderWidth",
      "borderColor",
      "backgroundColor",
    ];
    const style = this.impl.style;
    for (let n = 0; n < supported.length; n++) {
      const o = supported[n];
      const v = this.css[o];
      if (v) {
        style[o] = v;
        this.css[o] = null;
      }
    }
  }
  $getLineCount() {
    return this.text.split(/\n/).length;
  }
}

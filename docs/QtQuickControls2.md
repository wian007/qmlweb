# QtQuick.Controls 2

Types under `src/modules/QtQuick.Controls.2/`, loaded via:

```qml
import QtQuick.Controls 2.0
```

They register under the `QtQuick.Controls` module name (see
`ModuleSystem.md` for why the directory is suffixed `.2`), gated to
QML imports whose version starts with `2` (`static versions = /^2\./`),
so `QtQuick.Controls 1.4` still resolves to the separate, more mature
`QtQuick.Controls` (1.x) module.

This module is a much thinner layer than `QtQuick.Controls` (1.x): most
types are property declarations mirroring real Qt's API surface, useful
for parsing and binding against QML that uses them, without full
rendering or interaction behavior. Where real behavior does exist, it's
noted below.

## Inheritance

```text
QtQuick.Item
`-- Control
    |-- AbstractButton
    |   `-- TabButton
    |-- Container
    |   |-- SwipeView
    |   `-- TabBar
    `-- Page
QtQuick.Text
`-- Label
QtQuick.Window.Window
`-- ApplicationWindow
```

## Control

Base type for the other controls. Declares padding (`padding`,
`leftPadding`, `topPadding`, ...), `background`/`contentItem`,
`hoverEnabled`/`hovered`, `font`, `locale`, `palette` and
`focusPolicy`/`focusReason`. No behavior beyond property storage.

## AbstractButton

Adds `text`, `checkable`/`checked`, `pressed`, `down`, `autoExclusive`,
`display`, `indicator` and an `icon` attached object (`name`, `source`,
`width`, `height`, `color`). Click handling and checked-state toggling
are not implemented yet.

## TabButton

`AbstractButton` with no additional properties or behavior.

## Container

Adds `count`, `currentIndex`, `currentItem`, `contentChildren`,
`contentData`, `contentModel`. Tracks its children and re-runs
`layoutChildren()` whenever its own size or a child's size/visibility
changes; `layoutChildren()` itself is a no-op here, overridden by
`SwipeView` (lays out children left to right, sized to fill the
container) and by `TabBar` (declares layout-relevant properties only,
no positioning yet).

## Page

`Control` with `title`, `header`/`footer` and `contentWidth`/
`contentHeight`/`contentChildren`/`contentData`. Property declarations
only.

## Label

`QtQuick.Text` with `background` and `palette` added. Property
declarations only; text rendering comes from `QtQuick.Text`.

## ApplicationWindow

`QtQuick.Window.Window` with `header`/`footer`/`overlay`/`background`,
`font`, `contentData` and `activeFocusControl`. Property declarations
only.

## Known gaps

* No visual styling (real Qt Quick Controls 2 ships a default style with
  actual button/indicator rendering).
* No keyboard/mouse interaction beyond what `QtQuick.Item` already
  provides (hover, click and checked-state handling called out above
  are unimplemented).
* `TabBar` doesn't lay out its `TabButton` children.

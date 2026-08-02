# Module system

This describes how the built-in QML types under `src/modules/` are laid
out and turned into the `lib/qmlweb.js` bundle. If you're adding your own
component from application code at runtime instead, see `Extending.md`.

## Directory layout

Each subdirectory of `src/modules/` is a QML module (`QtQuick`,
`QtMultimedia`, `QtQuick.Controls.2`, and so on), and each `.js` file in
it defines one QML type, named after the file. `src/modules/QtQuick/
Rectangle.js` implements the `Rectangle` type of the `QtQuick` module,
loaded in QML via:

```qml
import QtQuick 2.0

Rectangle { }
```

A directory name may end in a bare number, like `QtQuick.Controls.2`
next to `QtQuick.Controls`, to keep same-named types for different
major versions in separate files. That trailing number is stripped back
off when the real module name is derived, so both directories still
register under the module name Qt itself uses (`QtQuick.Controls`),
distinguished only by the `versions` regexp each type declares (see
below).

## Class naming

Each type is a class named `<Module>_<Type>`, with dots in the module
name replaced by underscores, e.g. `QtQuick_Controls_2_Button` for
`src/modules/QtQuick.Controls.2/Button.js`. Extend the base type's class
directly to inherit its properties and behavior:

```javascript
// eslint-disable-next-line no-undef
class QtQuick_Controls_2_TabButton extends QtQuick_Controls_2_AbstractButton {
  static versions = /^2\./;
}
```

The build step reads this `extends` clause with a regexp (see
`builder/shaker.js`), so it must be a direct
`extends SomeModule_SomeType` on the `class` line, not a dynamically
computed base class.

## Declaring the type

A class body may set these static fields, matching the object you'd pass
to `QmlWeb.registerQmlType()` by hand (see `Extending.md`):

* `static versions` -- a regexp tested against the imported version
  string, e.g. `/^2\./` for `import QtQuick.Controls 2.x`. Defaults to
  matching any version.
* `static properties` -- QML properties, either a bare type name
  (`"bool"`) or `{ type, initialValue }`.
* `static signals` -- signals, as `name: [{ type, name }, ...]`
  argument lists.
* `static enums` -- enums exposed as attached objects, e.g.
  `{ TabBar: { Header: 0, Footer: 1 } }`.

The class itself is the constructor; override `constructor(meta)` and
call `super(meta)` when the type needs custom setup (creating DOM
elements, wiring signal handlers) beyond property declarations.

## Automatic registration and build order

You do not need to call `QmlWeb.registerQmlType()` yourself. During the
build, `builder/shaker.js`:

1. Walks every file under `src/modules/`, deriving each type's dotted
   name and module from its path.
2. Appends `QmlWeb.registerQmlType(ClassName);` to files that don't
   already call it explicitly.
3. Topologically sorts files by their `extends` base class, so a type's
   file is concatenated after its base type's file in the final bundle
   -- required since there are no real ES modules here, only
   concatenation into one script.

A base class that can't be found anywhere under `src/modules/` makes the
build fail with `Broken dependency tree`.

## Adding a new type

1. Create `src/modules/<Module>/<Type>.js`.
2. Declare `class <Module>_<Type> extends <Module>_<BaseType> { ... }`
   with the `static` fields above.
3. Add a matching entry to `tests/Initialize/runner.js` and a
   `tests/<Module>/<Type>.js` spec file covering its behavior.
4. Run `npm test` to build and verify.

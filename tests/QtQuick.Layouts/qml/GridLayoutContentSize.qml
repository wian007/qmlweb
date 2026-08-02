import QtQuick 2.0
import QtQuick.Layouts 1.0

GridLayout {
  flow: GridLayout.LeftToRight
  columns: 2
  rowSpacing: 5
  columnSpacing: 5

  Rectangle { implicitWidth: 100; implicitHeight: 20 }
  Rectangle { implicitWidth: 50; implicitHeight: 20 }
  Rectangle { implicitWidth: 100; implicitHeight: 20 }
  Rectangle { implicitWidth: 50; implicitHeight: 20 }
  Rectangle { implicitWidth: 300; implicitHeight: 20 }
}

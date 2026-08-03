import QtQuick 2.7
import QtTest 1.1

TestCase {
  name: "FindChild"

  Item {
    id: root
    objectName: "root"

    Item {
      objectName: "middle"

      Item {
        objectName: "leaf"
      }
    }
  }

  function test_findsDirectChild() {
    var found = findChild(root, "middle");
    verify(found !== undefined, "middle should be found");
    compare(found.objectName, "middle");
  }

  function test_findsNestedDescendant() {
    var found = findChild(root, "leaf");
    verify(found !== undefined, "leaf should be found");
    compare(found.objectName, "leaf");
  }

  function test_doesNotMatchParentItself() {
    var found = findChild(root, "root");
    verify(found === undefined, "findChild should not match parent itself");
  }

  function test_missingNameReturnsUndefined() {
    var found = findChild(root, "nope");
    verify(found === undefined, "unknown name should not be found");
  }
}

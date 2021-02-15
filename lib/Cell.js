'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

var Cell = function Cell(_ref) {
  var cell = _ref.cell,
    row = _ref.row,
    col = _ref.col,
    attributesRenderer = _ref.attributesRenderer,
    className = _ref.className,
    style = _ref.style,
    onMouseDown = _ref.onMouseDown,
    onMouseOver = _ref.onMouseOver,
    onDoubleClick = _ref.onDoubleClick,
    onContextMenu = _ref.onContextMenu,
    children = _ref.children;
  var colSpan = cell.colSpan,
    rowSpan = cell.rowSpan;
  var attributes = attributesRenderer ? attributesRenderer(cell, row, col) : {};
  return /*#__PURE__*/ _react['default'].createElement(
    'td',
    _extends(
      {
        className: className,
        onMouseDown: onMouseDown,
        onMouseOver: onMouseOver,
        onDoubleClick: onDoubleClick,
        onTouchEnd: onDoubleClick,
        onContextMenu: onContextMenu,
        colSpan: colSpan,
        rowSpan: rowSpan,
        style: style,
      },
      attributes,
    ),
    children,
  );
};

var _default = Cell;
exports['default'] = _default;

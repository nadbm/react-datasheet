'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Row = function Row(props) {
  return /*#__PURE__*/ _react['default'].createElement(
    'tr',
    null,
    props.children,
  );
};

var _default = Row;
exports['default'] = _default;

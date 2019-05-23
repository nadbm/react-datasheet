'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CellShape = require('./CellShape');

var _CellShape2 = _interopRequireDefault(_CellShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = function (_PureComponent) {
  _inherits(Cell, _PureComponent);

  function Cell() {
    _classCallCheck(this, Cell);

    return _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).apply(this, arguments));
  }

  _createClass(Cell, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          cell = _props.cell,
          row = _props.row,
          col = _props.col,
          attributesRenderer = _props.attributesRenderer,
          className = _props.className,
          style = _props.style,
          onMouseDown = _props.onMouseDown,
          onMouseOver = _props.onMouseOver,
          onDoubleClick = _props.onDoubleClick,
          onContextMenu = _props.onContextMenu;
      var colSpan = cell.colSpan,
          rowSpan = cell.rowSpan;

      var attributes = attributesRenderer ? attributesRenderer(cell, row, col) : {};

      return _react2.default.createElement(
        'td',
        _extends({
          className: className,
          onMouseDown: onMouseDown,
          onMouseOver: onMouseOver,
          onDoubleClick: onDoubleClick,
          onTouchEnd: onDoubleClick,
          onContextMenu: onContextMenu,
          colSpan: colSpan,
          rowSpan: rowSpan,
          style: style
        }, attributes),
        this.props.children
      );
    }
  }]);

  return Cell;
}(_react.PureComponent);

exports.default = Cell;


Cell.propTypes = {
  row: _propTypes2.default.number.isRequired,
  col: _propTypes2.default.number.isRequired,
  cell: _propTypes2.default.shape(_CellShape2.default).isRequired,
  selected: _propTypes2.default.bool,
  editing: _propTypes2.default.bool,
  updated: _propTypes2.default.bool,
  attributesRenderer: _propTypes2.default.func,
  onMouseDown: _propTypes2.default.func.isRequired,
  onMouseOver: _propTypes2.default.func.isRequired,
  onDoubleClick: _propTypes2.default.func.isRequired,
  onContextMenu: _propTypes2.default.func.isRequired,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object
};

Cell.defaultProps = {
  selected: false,
  editing: false,
  updated: false,
  attributesRenderer: function attributesRenderer() {}
};
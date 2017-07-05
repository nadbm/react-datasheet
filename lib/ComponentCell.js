'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentCell = function (_PureComponent) {
  _inherits(ComponentCell, _PureComponent);

  function ComponentCell(props) {
    _classCallCheck(this, ComponentCell);

    var _this = _possibleConstructorReturn(this, (ComponentCell.__proto__ || Object.getPrototypeOf(ComponentCell)).call(this, props));

    _this.state = { updated: false };
    return _this;
  }

  _createClass(ComponentCell, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      var _this2 = this;

      if (nextProps.value !== this.props.value) {
        this.setState({ updated: true });
        this.timeout = setTimeout(function () {
          _this2.setState({ updated: false });
        }, 700);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          row = _props.row,
          col = _props.col,
          readOnly = _props.readOnly,
          forceComponent = _props.forceComponent,
          rowSpan = _props.rowSpan,
          colSpan = _props.colSpan,
          width = _props.width,
          overflow = _props.overflow,
          value = _props.value,
          className = _props.className,
          editing = _props.editing,
          selected = _props.selected,
          _onMouseDown = _props.onMouseDown,
          _onMouseOver = _props.onMouseOver,
          _onDoubleClick = _props.onDoubleClick,
          _onContextMenu = _props.onContextMenu;

      var style = { width: width };

      return _react2.default.createElement(
        'td',
        {
          className: [className, 'cell', overflow, editing && 'editing', selected && 'selected', this.state.updated && 'updated'].filter(function (a) {
            return a;
          }).join(' '),
          onMouseDown: function onMouseDown() {
            return _onMouseDown(row, col);
          },
          onDoubleClick: function onDoubleClick() {
            return _onDoubleClick(row, col);
          },
          onMouseOver: function onMouseOver() {
            return _onMouseOver(row, col);
          },
          onContextMenu: function onContextMenu(e) {
            return _onContextMenu(e, row, col);
          }, colSpan: colSpan || 1,
          rowSpan: rowSpan || 1,
          style: style
        },
        editing && !readOnly || forceComponent ? this.props.component : value
      );
    }
  }]);

  return ComponentCell;
}(_react.PureComponent);

exports.default = ComponentCell;


ComponentCell.propTypes = {
  row: _propTypes2.default.number.isRequired,
  col: _propTypes2.default.number.isRequired,
  colSpan: _propTypes2.default.number,
  rowSpan: _propTypes2.default.number,
  width: _propTypes2.default.string,
  overflow: _propTypes2.default.oneOf(['wrap', 'nowrap', 'clip']),
  className: _propTypes2.default.string,
  selected: _propTypes2.default.bool.isRequired,
  editing: _propTypes2.default.bool.isRequired,
  onMouseDown: _propTypes2.default.func.isRequired,
  onDoubleClick: _propTypes2.default.func.isRequired,
  onMouseOver: _propTypes2.default.func.isRequired,
  onContextMenu: _propTypes2.default.func.isRequired,
  updated: _propTypes2.default.bool,
  forceComponent: _propTypes2.default.bool
};
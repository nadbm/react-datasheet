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

var DataCell = function (_PureComponent) {
  _inherits(DataCell, _PureComponent);

  function DataCell(props) {
    _classCallCheck(this, DataCell);

    var _this = _possibleConstructorReturn(this, (DataCell.__proto__ || Object.getPrototypeOf(DataCell)).call(this, props));

    _this.state = { updated: false };
    return _this;
  }

  _createClass(DataCell, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      var _this2 = this;

      if (nextProps.value !== this.props.value) {
        this.setState({ updated: true });
        this.timeout = setTimeout(function () {
          return _this2.setState({ updated: false });
        }, 700);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.editing === true && this.props.editing === false && this.props.reverting === false) {
        this.onChange(this._input.value);
      }
      if (prevProps.editing === false && this.props.editing === true) {
        if (this.props.clear) {
          this._input.value = '';
        } else {
          this._input.value = this.props.data === null ? this.props.value : this.props.data;
        }
        this._input.focus();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
    }
  }, {
    key: 'onChange',
    value: function onChange(value) {
      var initialData = this.props.data === null ? this.props.value : this.props.data;
      (value === '' || initialData !== value) && this.props.onChange(this.props.row, this.props.col, value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          row = _props.row,
          col = _props.col,
          rowSpan = _props.rowSpan,
          readOnly = _props.readOnly,
          colSpan = _props.colSpan,
          value = _props.value,
          className = _props.className,
          editing = _props.editing,
          selected = _props.selected,
          _onMouseDown = _props.onMouseDown,
          _onMouseOver = _props.onMouseOver,
          _onDoubleClick = _props.onDoubleClick,
          _onContextMenu = _props.onContextMenu;

      return _react2.default.createElement(
        'td',
        {
          className: [className, 'cell', selected && 'selected', editing && 'editing', readOnly && 'read-only', this.state.updated && 'updated'].filter(function (a) {
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
          },
          colSpan: colSpan || 1,
          rowSpan: rowSpan || 1
        },
        _react2.default.createElement(
          'span',
          { style: { display: editing && selected ? 'none' : 'block' } },
          value
        ),
        _react2.default.createElement('input', { style: { display: editing && selected ? 'block' : 'none' }, ref: function ref(input) {
            return _this3._input = input;
          } })
      );
    }
  }]);

  return DataCell;
}(_react.PureComponent);

exports.default = DataCell;


DataCell.propTypes = {
  row: _propTypes2.default.number.isRequired,
  col: _propTypes2.default.number.isRequired,
  colSpan: _propTypes2.default.number,
  rowSpan: _propTypes2.default.number,
  selected: _propTypes2.default.bool.isRequired,
  editing: _propTypes2.default.bool.isRequired,
  onMouseDown: _propTypes2.default.func.isRequired,
  onDoubleClick: _propTypes2.default.func.isRequired,
  onMouseOver: _propTypes2.default.func.isRequired,
  onContextMenu: _propTypes2.default.func.isRequired,
  updated: _propTypes2.default.bool
};
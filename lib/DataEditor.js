'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var DataEditor = function (_PureComponent) {
  _inherits(DataEditor, _PureComponent);

  function DataEditor(props) {
    _classCallCheck(this, DataEditor);

    var _this = _possibleConstructorReturn(this, (DataEditor.__proto__ || Object.getPrototypeOf(DataEditor)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(DataEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._input.focus();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          value = _props.value,
          onKeyDown = _props.onKeyDown;

      return _react2.default.createElement('input', {
        ref: function ref(input) {
          _this2._input = input;
        },
        className: 'data-editor',
        value: value,
        onChange: this.handleChange,
        onKeyDown: onKeyDown
      });
    }
  }]);

  return DataEditor;
}(_react.PureComponent);

exports.default = DataEditor;


DataEditor.propTypes = {
  value: _propTypes2.default.node.isRequired,
  row: _propTypes2.default.number.isRequired,
  col: _propTypes2.default.number.isRequired,
  cell: _propTypes2.default.shape(_CellShape2.default),
  onChange: _propTypes2.default.func.isRequired,
  onCommit: _propTypes2.default.func.isRequired,
  onRevert: _propTypes2.default.func.isRequired,
  onKeyDown: _propTypes2.default.func.isRequired
};
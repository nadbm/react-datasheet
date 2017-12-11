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

var _DataCell = require('./DataCell');

var _DataCell2 = _interopRequireDefault(_DataCell);

var _ComponentCell = require('./ComponentCell');

var _ComponentCell2 = _interopRequireDefault(_ComponentCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TAB_KEY = 9;
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var DELETE_KEY = 46;
var BACKSPACE_KEY = 8;

var isEmpty = function isEmpty(obj) {
  return Object.keys(obj).length === 0;
};

var range = function range(start, end) {
  var array = [];
  var inc = end - start > 0;
  for (var i = start; inc ? i <= end : i >= end; inc ? i++ : i--) {
    inc ? array.push(i) : array.unshift(i);
  }
  return array;
};

var nullFtn = function nullFtn(obj) {};

var defaultParsePaste = function defaultParsePaste(str) {
  return str.split(/\r\n|\n|\r/).map(function (row) {
    return row.split('\t');
  });
};

var DataSheet = function (_PureComponent) {
  _inherits(DataSheet, _PureComponent);

  function DataSheet(props) {
    _classCallCheck(this, DataSheet);

    var _this = _possibleConstructorReturn(this, (DataSheet.__proto__ || Object.getPrototypeOf(DataSheet)).call(this, props));

    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onMouseOver = _this.onMouseOver.bind(_this);
    _this.onDoubleClick = _this.onDoubleClick.bind(_this);
    _this.onContextMenu = _this.onContextMenu.bind(_this);
    _this.handleKey = _this.handleKey.bind(_this);
    _this.handleCopy = _this.handleCopy.bind(_this);
    _this.handlePaste = _this.handlePaste.bind(_this);
    _this.pageClick = _this.pageClick.bind(_this);
    _this.onChange = _this.onChange.bind(_this);

    _this.defaultState = {
      start: {},
      end: {},
      selecting: false,
      forceEdit: false,
      editing: {},
      reverting: {},
      clear: {}
    };
    _this.state = _this.defaultState;

    _this.removeAllListeners = _this.removeAllListeners.bind(_this);
    return _this;
  }

  _createClass(DataSheet, [{
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      document.removeEventListener('keydown', this.handleKey);
      document.removeEventListener('mousedown', this.pageClick);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('copy', this.handleCopy);
      document.removeEventListener('paste', this.handlePaste);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeAllListeners();
    }
  }, {
    key: 'pageClick',
    value: function pageClick(e) {
      if (!this.dgDom.contains(e.target)) {
        this.setState(this.defaultState);
        this.removeAllListeners();
      }
    }
  }, {
    key: 'handleCopy',
    value: function handleCopy(e) {
      if (isEmpty(this.state.editing)) {
        e.preventDefault();
        var _props = this.props,
            dataRenderer = _props.dataRenderer,
            valueRenderer = _props.valueRenderer,
            data = _props.data;
        var _state = this.state,
            start = _state.start,
            end = _state.end;


        var text = range(start.i, end.i).map(function (i) {
          return range(start.j, end.j).map(function (j) {
            var cell = data[i][j];
            var value = dataRenderer ? dataRenderer(cell, i, j) : null;
            if (value === '' || value === null || typeof value === 'undefined') {
              return valueRenderer(cell, i, j);
            }
            return value;
          }).join('\t');
        }).join('\n');
        e.clipboardData.setData('text/plain', text);
      }
    }
  }, {
    key: 'handlePaste',
    value: function handlePaste(e) {
      var _this2 = this;

      if (isEmpty(this.state.editing)) {
        var start = this.state.start;

        var parse = this.props.parsePaste || defaultParsePaste;
        var pastedMap = [];
        var pasteData = parse(e.clipboardData.getData('text/plain'));

        var end = {};

        pasteData.map(function (row, i) {
          var rowData = [];
          row.map(function (pastedData, j) {
            var cell = _this2.props.data[start.i + i] && _this2.props.data[start.i + i][start.j + j];
            rowData.push({ cell: cell, data: pastedData });
            if (cell && !cell.readOnly && !_this2.props.onPaste) {
              _this2.onChange(start.i + i, start.j + j, pastedData);
              end = { i: start.i + i, j: start.j + j };
            }
          });
          pastedMap.push(rowData);
        });
        this.props.onPaste && this.props.onPaste(pastedMap);
        this.setState({ end: end });
      }
    }
  }, {
    key: 'handleKeyboardCellMovement',
    value: function handleKeyboardCellMovement(e) {
      var _state2 = this.state,
          start = _state2.start,
          editing = _state2.editing;
      var data = this.props.data;

      var currentCell = data[start.i][start.j];
      var newLocation = null;

      if ((this.state.forceEdit || currentCell.component !== undefined) && !isEmpty(this.state.editing) && e.keyCode !== TAB_KEY) {
        // If editing and enter key pressed then go to the next row.
        if (e.keyCode === ENTER_KEY) {
          newLocation = { i: start.i + 1, j: start.j };
        } else {
          return false;
        }
      } else if (e.keyCode === TAB_KEY && !e.shiftKey) {
        newLocation = { i: start.i, j: start.j + 1 };
        newLocation = typeof data[newLocation.i][newLocation.j] !== 'undefined' ? newLocation : { i: start.i + 1, j: 0 };
      } else if (e.keyCode === RIGHT_KEY) {
        newLocation = { i: start.i, j: start.j + 1 };
      } else if (e.keyCode === LEFT_KEY || e.keyCode === TAB_KEY && e.shiftKey) {
        newLocation = { i: start.i, j: start.j - 1 };
      } else if (e.keyCode === UP_KEY) {
        newLocation = { i: start.i - 1, j: start.j };
      } else if (e.keyCode === DOWN_KEY) {
        newLocation = { i: start.i + 1, j: start.j };
      }

      if (newLocation && data[newLocation.i] && typeof data[newLocation.i][newLocation.j] !== 'undefined') {
        this.setState({ start: newLocation, end: newLocation, editing: {} });
      }
      if (newLocation) {
        e.preventDefault();
        return true;
      }
      return false;
    }
  }, {
    key: 'getSelectedCells',
    value: function getSelectedCells(data, start, end) {
      var selected = [];
      range(start.i, end.i).map(function (i) {
        range(start.j, end.j).map(function (j) {
          selected.push({ cell: data[i][j], i: i, j: j });
        });
      });
      return selected;
    }
  }, {
    key: 'handleKey',
    value: function handleKey(e) {
      var _this3 = this;

      var _state3 = this.state,
          start = _state3.start,
          end = _state3.end,
          editing = _state3.editing;

      var data = this.props.data;
      var isEditing = !isEmpty(editing);
      var noCellsSelected = isEmpty(start);
      var ctrlKeyPressed = e.ctrlKey || e.metaKey;
      var deleteKeysPressed = e.keyCode === DELETE_KEY || e.keyCode === BACKSPACE_KEY;
      var enterKeyPressed = e.keyCode === ENTER_KEY;
      var escapeKeyPressed = e.keyCode === ESCAPE_KEY;
      var numbersPressed = e.keyCode >= 48 && e.keyCode <= 57;
      var lettersPressed = e.keyCode >= 65 && e.keyCode <= 90;
      var numPadKeysPressed = e.keyCode >= 96 && e.keyCode <= 105;
      var cell = data[start.i][start.j];
      var equationKeysPressed = [187, /* equal */
      189, /* substract */
      190, /* period */
      107, /* add */
      109, /* decimal point */
      110].indexOf(e.keyCode) > -1;

      if (noCellsSelected || ctrlKeyPressed || this.handleKeyboardCellMovement(e)) {
        return true;
      }

      if (deleteKeysPressed && !isEditing) {
        this.getSelectedCells(data, start, end).map(function (_ref) {
          var cell = _ref.cell,
              i = _ref.i,
              j = _ref.j;
          return !cell.readOnly ? _this3.onChange(i, j, '') : null;
        });
        e.preventDefault();
      } else if (enterKeyPressed && isEditing) {
        this.setState({ editing: {}, reverting: {} });
      } else if (escapeKeyPressed && isEditing) {
        this.setState({ editing: {}, reverting: editing });
      } else if (enterKeyPressed && !isEditing && !cell.readOnly) {
        this.setState({ editing: start, clear: {}, reverting: {}, forceEdit: true });
      } else if (numbersPressed || numPadKeysPressed || lettersPressed || equationKeysPressed || enterKeyPressed) {
        //empty out cell if user starts typing without pressing enter
        if (!isEditing && !cell.readOnly) {
          this.setState({
            editing: start,
            clear: start,
            reverting: {},
            forceEdit: false
          });
        }
      }
    }
  }, {
    key: 'onContextMenu',
    value: function onContextMenu(evt, i, j) {
      var cell = this.props.data[i][j];
      if (this.props.onContextMenu) {
        this.props.onContextMenu(evt, cell, i, j);
      }
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(i, j) {
      var cell = this.props.data[i][j];
      !cell.readOnly ? this.setState({ editing: { i: i, j: j }, forceEdit: true, clear: {} }) : null;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(i, j) {
      var editing = isEmpty(this.state.editing) || this.state.editing.i !== i || this.state.editing.j !== j ? {} : this.state.editing;
      this.setState({ selecting: true, start: { i: i, j: j }, end: { i: i, j: j }, editing: editing, forceEdit: false });

      //Keep listening to mouse if user releases the mouse (dragging outside)
      document.addEventListener('mouseup', this.onMouseUp);
      //Listen for any keyboard presses (there is no input so must attach to document)
      document.addEventListener('keydown', this.handleKey);
      //Listen for any outside mouse clicks
      document.addEventListener('mousedown', this.pageClick);

      //Copy paste event handler
      document.addEventListener('copy', this.handleCopy);
      document.addEventListener('paste', this.handlePaste);
    }
  }, {
    key: 'onMouseOver',
    value: function onMouseOver(i, j) {
      this.state.selecting && isEmpty(this.state.editing) ? this.setState({ end: { i: i, j: j } }) : null;
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      this.setState({ selecting: false });
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: 'onChange',
    value: function onChange(i, j, val) {
      this.props.onChange(this.props.data[i][j], i, j, val);
      this.setState({ editing: {} });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var prevEnd = prevState.end;
      if (!isEmpty(this.state.end) && !(this.state.end.i === prevEnd.i && this.state.end.j === prevEnd.j)) {
        this.props.onSelect && this.props.onSelect(this.props.data[this.state.end.i][this.state.end.j]);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          dataRenderer = _props2.dataRenderer,
          valueRenderer = _props2.valueRenderer,
          attributesRenderer = _props2.attributesRenderer,
          className = _props2.className,
          overflow = _props2.overflow;


      var isSelected = function isSelected(i, j) {
        var start = _this4.state.start;
        var end = _this4.state.end;
        var posX = j >= start.j && j <= end.j;
        var negX = j <= start.j && j >= end.j;
        var posY = i >= start.i && i <= end.i;
        var negY = i <= start.i && i >= end.i;

        return posX && posY || negX && posY || negX && negY || posX && negY;
      };

      var isEditing = function isEditing(i, j) {
        return _this4.state.editing.i === i && _this4.state.editing.j === j;
      };
      var isReverting = function isReverting(i, j) {
        return _this4.state.reverting.i === i && _this4.state.reverting.j === j;
      };
      var shouldClear = function shouldClear(i, j) {
        return _this4.state.clear.i === i && _this4.state.clear.j === j;
      };

      return _react2.default.createElement(
        'table',
        { ref: function ref(r) {
            return _this4.dgDom = r;
          }, className: ['data-grid', className, overflow].filter(function (a) {
            return a;
          }).join(' ') },
        _react2.default.createElement(
          'tbody',
          null,
          this.props.data.map(function (row, i) {
            return _react2.default.createElement(
              'tr',
              { key: _this4.props.keyFn ? _this4.props.keyFn(i) : i },
              row.map(function (cell, j) {
                var props = {
                  key: cell.key ? cell.key : j,
                  className: cell.className ? cell.className : '',
                  row: i,
                  col: j,
                  selected: isSelected(i, j),
                  onMouseDown: cell.disableEvents ? nullFtn : _this4.onMouseDown,
                  onDoubleClick: cell.disableEvents ? nullFtn : _this4.onDoubleClick,
                  onMouseOver: cell.disableEvents ? nullFtn : _this4.onMouseOver,
                  onContextMenu: cell.disableEvents ? nullFtn : _this4.onContextMenu,
                  editing: isEditing(i, j),
                  reverting: isReverting(i, j),
                  colSpan: cell.colSpan,
                  width: typeof cell.width === 'number' ? cell.width + 'px' : cell.width,
                  overflow: cell.overflow,
                  value: valueRenderer(cell, i, j),
                  attributes: attributesRenderer ? attributesRenderer(cell, i, j) : {}
                };

                if (cell.component) {
                  return _react2.default.createElement(_ComponentCell2.default, _extends({}, props, {
                    forceComponent: cell.forceComponent || false,
                    component: cell.component
                  }));
                }

                return _react2.default.createElement(_DataCell2.default, _extends({}, props, {
                  data: dataRenderer ? dataRenderer(cell, i, j) : null,
                  clear: shouldClear(i, j),
                  rowSpan: cell.rowSpan,
                  onChange: _this4.onChange,
                  readOnly: cell.readOnly
                }));
              })
            );
          })
        )
      );
    }
  }]);

  return DataSheet;
}(_react.PureComponent);

exports.default = DataSheet;


DataSheet.propTypes = {
  data: _propTypes2.default.array.isRequired,
  className: _propTypes2.default.string,
  overflow: _propTypes2.default.oneOf(['wrap', 'nowrap', 'clip']),
  onChange: _propTypes2.default.func,
  onContextMenu: _propTypes2.default.func,
  valueRenderer: _propTypes2.default.func.isRequired,
  dataRenderer: _propTypes2.default.func,
  parsePaste: _propTypes2.default.func,
  attributesRenderer: _propTypes2.default.func
};
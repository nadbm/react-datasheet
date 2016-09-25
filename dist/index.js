(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.index = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var TAB_KEY = 9;
  var ENTER_KEY = 13;
  var LEFT_KEY = 37;
  var UP_KEY = 38;
  var RIGHT_KEY = 39;
  var DOWN_KEY = 40;
  var DELETE_KEY = 46;
  var BACKSPACE_KEY = 8;
  var CMD_KEY = 91;
  var CTRL_KEY = 17;

  var isEmpty = function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  };
  var range = function range(start, end) {
    var array = [];
    var inc = end - start > 0;
    for (var i = start; inc ? i < end : i > end; inc ? i++ : i--) {
      array.push(i);
    }
    return array;
  };

  var DataCell = function (_Component) {
    _inherits(DataCell, _Component);

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

        var prevProps = this.props;
        if (nextProps.value !== this.props.value) {
          this.setState({ updated: true });
          setTimeout(function () {
            _this2.setState({ updated: false });
          }, 700);
        }
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (prevProps.editing === true && this.props.editing === false) {
          this.onChange(this._input.value);
        }
        if (prevProps.editing === false && this.props.editing === true) {
          this._input.focus();
          this._input.value = this.props.data;
        }
      }
    }, {
      key: 'onChange',
      value: function onChange(value) {
        this.props.data !== value ? this.props.onChange(this.props.row, this.props.col, value) : null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props = this.props;
        var row = _props.row;
        var col = _props.col;
        var rowSpan = _props.rowSpan;
        var colSpan = _props.colSpan;
        var value = _props.value;
        var className = _props.className;
        var editing = _props.editing;
        var selected = _props.selected;
        var _onMouseDown = _props.onMouseDown;
        var _onMouseOver = _props.onMouseOver;
        var _onDoubleClick = _props.onDoubleClick;


        return _react2.default.createElement(
          'td',
          {
            className: className + ' cell ' + (selected ? 'selected' : '') + ' ' + (this.state.updated ? 'updated' : ''),
            onMouseDown: function onMouseDown() {
              return _onMouseDown(row, col);
            },
            onDoubleClick: function onDoubleClick() {
              return _onDoubleClick(row, col);
            },
            onMouseOver: function onMouseOver() {
              return _onMouseOver(row, col);
            },
            colSpan: colSpan || 1,
            rowSpan: rowSpan || 1,
            style: this.cellStyle, ref: function ref(r) {
              _this3.domObject = r;
            }
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
  }(_react.Component);

  DataCell.propTypes = {
    row: _react.PropTypes.number.isRequired,
    col: _react.PropTypes.number.isRequired,
    colSpan: _react.PropTypes.number,
    rowSpan: _react.PropTypes.number,
    selected: _react.PropTypes.bool.isRequired,
    editing: _react.PropTypes.bool.isRequired,
    onMouseDown: _react.PropTypes.func.isRequired,
    onDoubleClick: _react.PropTypes.func.isRequired,
    onMouseOver: _react.PropTypes.func.isRequired,
    updated: _react.PropTypes.bool
  };

  var ReactDataSheet = function (_Component2) {
    _inherits(ReactDataSheet, _Component2);

    function ReactDataSheet(props, context) {
      _classCallCheck(this, ReactDataSheet);

      var _this4 = _possibleConstructorReturn(this, (ReactDataSheet.__proto__ || Object.getPrototypeOf(ReactDataSheet)).call(this, props, context));

      _this4.onMouseDown = _this4.onMouseDown.bind(_this4);
      _this4.onMouseUp = _this4.onMouseUp.bind(_this4);
      _this4.onMouseOver = _this4.onMouseOver.bind(_this4);
      _this4.onDoubleClick = _this4.onDoubleClick.bind(_this4);
      _this4.handleKey = _this4.handleKey.bind(_this4);
      _this4.handleKeyUp = _this4.handleKeyUp.bind(_this4);
      _this4.handleCopy = _this4.handleCopy.bind(_this4);
      _this4.handlePaste = _this4.handlePaste.bind(_this4);
      _this4.pageClick = _this4.pageClick.bind(_this4);
      _this4.onChange = _this4.onChange.bind(_this4);

      _this4.defaultState = {
        start: {},
        end: {},
        selecting: false,
        editing: {},
        cmdDown: false
      };
      _this4.state = _this4.defaultState;

      _this4.removeAllListeners = _this4.removeAllListeners.bind(_this4);
      return _this4;
    }

    _createClass(ReactDataSheet, [{
      key: 'removeAllListeners',
      value: function removeAllListeners() {
        document.removeEventListener('keydown', this.handleKey);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('mousedown', this.pageClick);
        document.removeEventListener('copy', this.handleCopy);
        document.removeEventListener('mouseup', this.onMouseUp);
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
        if (!this.area.contains(e.target)) {
          this.setState(this.defaultState);
          this.removeAllListeners();
        }
      }
    }, {
      key: 'handleCopy',
      value: function handleCopy(e) {
        var _this5 = this;

        var cellConverter = this.props.dataRenderer ? this.props.dataRenderer : this.props.valueRenderer;
        if (!isEmpty(this.state.start)) {
          var text = range(this.state.start.i, this.state.end.i + 1).map(function (j) {
            return _this5.props.data.slice(0)[j].slice(_this5.state.start.j, _this5.state.end.j + 1).map(function (cell) {
              return cellConverter(cell);
            }).join('\t');
          }).join('\n');
          e.preventDefault();
          e.clipboardData.setData('text/plain', text);
        }
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(e) {
        var _this6 = this;

        var pasteData = e.clipboardData.getData('text/plain').split('\n').map(function (row) {
          return row.split('\t');
        });
        var map = new Map();
        this.props.data.map(function (row, i) {
          return row.map(function (cell, j) {
            var start = _this6.state.start;
            var cellData = pasteData[i - start.i] && pasteData[i - start.i][j - start.j];

            if (!cell.readOnly && typeof cellData !== "undefined") {
              _this6.props.onPaste ? map.set(cell, cellData) : _this6.onChange(i, j, cellData);
            }
          });
        });
        if (this.props.onPaste) {
          this.props.onPaste(map);
        };
        this.setState(this.defaultState);
        document.removeEventListener('paste', this.handlePaste);
      }
    }, {
      key: 'handleKeyboardCellMovement',
      value: function handleKeyboardCellMovement(e) {
        var newLocation = null;
        var _state = this.state;
        var start = _state.start;
        var editing = _state.editing;
        var data = this.props.data;


        if (!isEmpty(this.state.editing) && e.keyCode !== TAB_KEY) {
          return false;
        } else if (e.keyCode === TAB_KEY) {
          newLocation = { i: start.i, j: start.j + 1 };
          newLocation = typeof data[newLocation.i][newLocation.j] !== "undefined" ? newLocation : { i: start.i + 1, j: 0 };
        } else if (e.keyCode === RIGHT_KEY) {
          newLocation = { i: start.i, j: start.j + 1 };
        } else if (e.keyCode === LEFT_KEY) {
          newLocation = { i: start.i, j: start.j - 1 };
        } else if (e.keyCode === UP_KEY) {
          newLocation = { i: start.i - 1, j: start.j };
        } else if (e.keyCode === DOWN_KEY) {
          newLocation = { i: start.i + 1, j: start.j };
        }

        if (newLocation && data[newLocation.i] && typeof data[newLocation.i][newLocation.j] !== "undefined") {
          this.setState({ end: newLocation, start: newLocation, editing: {} });
        }
        if (newLocation) {
          e.preventDefault();return true;
        } else {
          return false;
        }
      }
    }, {
      key: 'getSelectedCells',
      value: function getSelectedCells(data, start, end) {
        var selected = [];
        range(start.i, end.i + 1).map(function (i) {
          range(start.j, end.j + 1).map(function (j) {
            selected.push({ cell: data[i][j], i: i, j: j });
          });
        });
        return selected;
      }
    }, {
      key: 'handleKeyUp',
      value: function handleKeyUp(e) {
        if (e.keyCode == CTRL_KEY || e.keyCode == CMD_KEY) {
          this.setState({ cmdDown: false });
        }
      }
    }, {
      key: 'handleKey',
      value: function handleKey(e) {
        var _this7 = this;

        if (isEmpty(this.state.start) || this.state.cmdDown) {
          return true;
        };
        if (e.keyCode == CTRL_KEY || e.keyCode == CMD_KEY) {
          this.setState({ cmdDown: true });
          return true;
        }
        if (this.handleKeyboardCellMovement(e)) {
          return true;
        };

        var _state2 = this.state;
        var start = _state2.start;
        var end = _state2.end;

        var data = this.props.data;
        var isEditing = !isEmpty(this.state.editing);

        if ((e.keyCode === DELETE_KEY || e.keyCode === BACKSPACE_KEY) && !isEditing) {
          //CASE when user presses delete
          console.log(this.getSelectedCells(data, start, end));
          this.getSelectedCells(data, start, end).map(function (_ref) {
            var cell = _ref.cell;
            var i = _ref.i;
            var j = _ref.j;

            _this7.onChange(i, j, "");
          });
          e.preventDefault();
        } else if (e.keyCode === ENTER_KEY && isEditing) {
          //CASE when user is editing a field, then presses enter (validate)
          this.setState({ editing: {} });
        } else if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105 || [186, 187, 189, 190, 107, 109, 110, ENTER_KEY].indexOf(e.keyCode) > -1) {

          var startCell = data[start.i][start.j];
          //empty out cell if user starts typing without pressing enter
          if (e.keyCode !== ENTER_KEY && !isEditing) this.onChange(start.i, start.j, "");
          if (typeof startCell !== "undefined" && !startCell.readOnly) this.setState({ editing: start });
        }
      }
    }, {
      key: 'onDoubleClick',
      value: function onDoubleClick(i, j) {
        var cell = this.props.data[i][j];
        !cell.readOnly ? this.setState({ editing: { i: i, j: j } }) : null;
      }
    }, {
      key: 'onMouseDown',
      value: function onMouseDown(i, j) {
        var editing = isEmpty(this.state.editing) || this.state.editing.i !== i || this.state.editing.j == j ? {} : this.state.editing;

        this.setState({ selecting: true, start: { i: i, j: j }, end: { i: i, j: j }, editing: editing });

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousedown', this.pageClick);
        document.addEventListener('copy', this.handleCopy);
        document.addEventListener('paste', this.handlePaste);
        document.addEventListener('keydown', this.handleKey);
        document.addEventListener('keyup', this.handleKeyUp);
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
        var cell = this.props.data[i][j];
        this.props.onChange(cell, i, j, val);
        this.setState({ editing: {} });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this8 = this;

        var _props2 = this.props;
        var keyFunction = _props2.keyFunction;
        var dataRenderer = _props2.dataRenderer;
        var valueRenderer = _props2.valueRenderer;
        var className = _props2.className;


        var isSelected = function isSelected(i, j) {
          var start = _this8.state.start;
          var end = _this8.state.end;
          var pos_x = j >= start.j && j <= end.j;
          var neg_x = j <= start.j && j >= end.j;
          var pos_y = i >= start.i && i <= end.i;
          var neg_y = i <= start.i && i >= end.i;

          return pos_x && pos_y || neg_x && pos_y || neg_x && neg_y || pos_x && neg_y;
        };

        var isEditing = function isEditing(i, j) {
          return _this8.state.editing.i === i && _this8.state.editing.j == j;
        };

        return _react2.default.createElement(
          'table',
          { ref: function ref(r) {
              return _this8.area = r;
            }, className: 'data-grid ' + (className ? className : '') },
          _react2.default.createElement(
            'tbody',
            null,
            this.props.data.map(function (row, i) {
              return _react2.default.createElement(
                'tr',
                { key: i },
                row.map(function (cell, j) {
                  return _react2.default.createElement(DataCell, {
                    key: cell.key ? cell.key : j,
                    className: cell.className ? cell.className : '',
                    row: i,
                    col: j,
                    onMouseDown: _this8.onMouseDown,
                    onDoubleClick: _this8.onDoubleClick,
                    onMouseOver: _this8.onMouseOver,

                    value: valueRenderer(cell),
                    data: dataRenderer ? dataRenderer(cell) : valueRenderer(cell),
                    selected: isSelected(i, j),
                    editing: isEditing(i, j),
                    colSpan: cell.colSpan,
                    rowSpan: cell.rowSpan,
                    onChange: _this8.onChange
                  });
                })
              );
            })
          )
        );
      }
    }]);

    return ReactDataSheet;
  }(_react.Component);

  exports.default = ReactDataSheet;


  //Each cell object can have the following:
  //>readOnly  : cells can be selected/copied but cannot be edited
  //>className : cells will have these className added to them, use this to override cells with your own style
  //>colSpan   : Adds the colspan attribute to the cell <td> element
  //>rowSpan   : Adds the rowspan attribute to the cell <td> element
  ReactDataSheet.propTypes = {
    data: _react.PropTypes.array.isRequired, // Array of objects, number
    onChange: _react.PropTypes.func, // Fn to handle any change
    valueRenderer: _react.PropTypes.func.isRequired, // Fn to render data from provided data celss
    dataRenderer: _react.PropTypes.func };
});

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _keys = require('./keys');

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _CellShape = require('./CellShape');

var _CellShape2 = _interopRequireDefault(_CellShape);

var _DataEditor = require('./DataEditor');

var _DataEditor2 = _interopRequireDefault(_DataEditor);

var _ValueViewer = require('./ValueViewer');

var _ValueViewer2 = _interopRequireDefault(_ValueViewer);

var _renderHelpers = require('./renderHelpers');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

function initialData(_ref) {
  var cell = _ref.cell,
    row = _ref.row,
    col = _ref.col,
    valueRenderer = _ref.valueRenderer,
    dataRenderer = _ref.dataRenderer;

  return (0, _renderHelpers.renderData)(
    cell,
    row,
    col,
    valueRenderer,
    dataRenderer,
  );
}

function initialValue(_ref2) {
  var cell = _ref2.cell,
    row = _ref2.row,
    col = _ref2.col,
    valueRenderer = _ref2.valueRenderer;

  return (0, _renderHelpers.renderValue)(cell, row, col, valueRenderer);
}

function widthStyle(cell) {
  var width = typeof cell.width === 'number' ? cell.width + 'px' : cell.width;
  return width ? { width: width } : null;
}

var DataCell = (function (_PureComponent) {
  _inherits(DataCell, _PureComponent);

  function DataCell(props) {
    _classCallCheck(this, DataCell);

    var _this = _possibleConstructorReturn(
      this,
      (DataCell.__proto__ || Object.getPrototypeOf(DataCell)).call(this, props),
    );

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleCommit = _this.handleCommit.bind(_this);
    _this.handleRevert = _this.handleRevert.bind(_this);

    _this.handleKey = _this.handleKey.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseOver = _this.handleMouseOver.bind(_this);
    _this.handleContextMenu = _this.handleContextMenu.bind(_this);
    _this.handleDoubleClick = _this.handleDoubleClick.bind(_this);

    _this.state = {
      updated: false,
      reverting: false,
      committing: false,
      value: '',
    };
    return _this;
  }

  _createClass(DataCell, [
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        var _this2 = this;

        if (
          !this.props.cell.disableUpdatedFlag &&
          initialValue(prevProps) !== initialValue(this.props)
        ) {
          this.setState({ updated: true });
          this.timeout = setTimeout(function () {
            return _this2.setState({ updated: false });
          }, 700);
        }
        if (this.props.editing === true && prevProps.editing === false) {
          var value = this.props.clearing ? '' : initialData(this.props);
          this.setState({ value: value, reverting: false });
        }

        if (
          prevProps.editing === true &&
          this.props.editing === false &&
          !this.state.reverting &&
          !this.state.committing &&
          this.state.value !== initialData(this.props)
        ) {
          this.props.onChange(this.props.row, this.props.col, this.state.value);
        }
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        clearTimeout(this.timeout);
      },
    },
    {
      key: 'handleChange',
      value: function handleChange(value) {
        this.setState({ value: value, committing: false });
      },
    },
    {
      key: 'handleCommit',
      value: function handleCommit(value, e) {
        var _props = this.props,
          onChange = _props.onChange,
          onNavigate = _props.onNavigate;

        if (value !== initialData(this.props)) {
          this.setState({ value: value, committing: true });
          onChange(this.props.row, this.props.col, value);
        } else {
          this.handleRevert();
        }
        if (e) {
          e.preventDefault();
          onNavigate(e, true);
        }
      },
    },
    {
      key: 'handleRevert',
      value: function handleRevert() {
        this.setState({ reverting: true });
        this.props.onRevert();
      },
    },
    {
      key: 'handleMouseDown',
      value: function handleMouseDown(e) {
        var _props2 = this.props,
          row = _props2.row,
          col = _props2.col,
          onMouseDown = _props2.onMouseDown,
          cell = _props2.cell;

        if (!cell.disableEvents) {
          onMouseDown(row, col, e);
        }
      },
    },
    {
      key: 'handleMouseOver',
      value: function handleMouseOver(e) {
        var _props3 = this.props,
          row = _props3.row,
          col = _props3.col,
          onMouseOver = _props3.onMouseOver,
          cell = _props3.cell;

        if (!cell.disableEvents) {
          onMouseOver(row, col);
        }
      },
    },
    {
      key: 'handleDoubleClick',
      value: function handleDoubleClick(e) {
        var _props4 = this.props,
          row = _props4.row,
          col = _props4.col,
          onDoubleClick = _props4.onDoubleClick,
          cell = _props4.cell;

        if (!cell.disableEvents) {
          onDoubleClick(row, col);
        }
      },
    },
    {
      key: 'handleContextMenu',
      value: function handleContextMenu(e) {
        var _props5 = this.props,
          row = _props5.row,
          col = _props5.col,
          onContextMenu = _props5.onContextMenu,
          cell = _props5.cell;

        if (!cell.disableEvents) {
          onContextMenu(e, row, col);
        }
      },
    },
    {
      key: 'handleKey',
      value: function handleKey(e) {
        var keyCode = e.which || e.keyCode;
        if (keyCode === _keys.ESCAPE_KEY) {
          return this.handleRevert();
        }
        var _props6 = this.props,
          component = _props6.cell.component,
          forceEdit = _props6.forceEdit;

        var eatKeys = forceEdit || !!component;
        var commit =
          keyCode === _keys.ENTER_KEY ||
          keyCode === _keys.TAB_KEY ||
          (!eatKeys &&
            [
              _keys.LEFT_KEY,
              _keys.RIGHT_KEY,
              _keys.UP_KEY,
              _keys.DOWN_KEY,
            ].includes(keyCode));

        if (commit) {
          this.handleCommit(this.state.value, e);
        }
      },
    },
    {
      key: 'renderComponent',
      value: function renderComponent(editing, cell) {
        var component = cell.component,
          readOnly = cell.readOnly,
          forceComponent = cell.forceComponent;

        if ((editing && !readOnly) || forceComponent) {
          return component;
        }
      },
    },
    {
      key: 'renderEditor',
      value: function renderEditor(editing, cell, row, col, dataEditor) {
        if (editing) {
          var Editor = cell.dataEditor || dataEditor || _DataEditor2.default;
          return _react2.default.createElement(Editor, {
            cell: cell,
            row: row,
            col: col,
            value: this.state.value,
            onChange: this.handleChange,
            onCommit: this.handleCommit,
            onRevert: this.handleRevert,
            onKeyDown: this.handleKey,
          });
        }
      },
    },
    {
      key: 'renderViewer',
      value: function renderViewer(cell, row, col, valueRenderer, valueViewer) {
        var Viewer = cell.valueViewer || valueViewer || _ValueViewer2.default;
        var value = (0, _renderHelpers.renderValue)(
          cell,
          row,
          col,
          valueRenderer,
        );
        return _react2.default.createElement(Viewer, {
          cell: cell,
          row: row,
          col: col,
          value: value,
        });
      },
    },
    {
      key: 'render',
      value: function render() {
        var _props7 = this.props,
          row = _props7.row,
          col = _props7.col,
          cell = _props7.cell,
          CellRenderer = _props7.cellRenderer,
          valueRenderer = _props7.valueRenderer,
          dataEditor = _props7.dataEditor,
          valueViewer = _props7.valueViewer,
          attributesRenderer = _props7.attributesRenderer,
          selected = _props7.selected,
          editing = _props7.editing,
          onKeyUp = _props7.onKeyUp;
        var updated = this.state.updated;

        var content =
          this.renderComponent(editing, cell) ||
          this.renderEditor(editing, cell, row, col, dataEditor) ||
          this.renderViewer(cell, row, col, valueRenderer, valueViewer);

        var className = [
          cell.className,
          'cell',
          cell.overflow,
          selected && 'selected',
          editing && 'editing',
          cell.readOnly && 'read-only',
          updated && 'updated',
        ]
          .filter(function (a) {
            return a;
          })
          .join(' ');

        return _react2.default.createElement(
          CellRenderer,
          {
            row: row,
            col: col,
            cell: cell,
            selected: selected,
            editing: editing,
            updated: updated,
            attributesRenderer: attributesRenderer,
            className: className,
            style: widthStyle(cell),
            onMouseDown: this.handleMouseDown,
            onMouseOver: this.handleMouseOver,
            onDoubleClick: this.handleDoubleClick,
            onContextMenu: this.handleContextMenu,
            onKeyUp: onKeyUp,
          },
          content,
        );
      },
    },
  ]);

  return DataCell;
})(_react.PureComponent);

exports.default = DataCell;

DataCell.propTypes = {
  row: _propTypes2.default.number.isRequired,
  col: _propTypes2.default.number.isRequired,
  cell: _propTypes2.default.shape(_CellShape2.default).isRequired,
  forceEdit: _propTypes2.default.bool,
  selected: _propTypes2.default.bool,
  editing: _propTypes2.default.bool,
  editValue: _propTypes2.default.any,
  clearing: _propTypes2.default.bool,
  cellRenderer: _propTypes2.default.func,
  valueRenderer: _propTypes2.default.func.isRequired,
  dataRenderer: _propTypes2.default.func,
  valueViewer: _propTypes2.default.func,
  dataEditor: _propTypes2.default.func,
  attributesRenderer: _propTypes2.default.func,
  onNavigate: _propTypes2.default.func.isRequired,
  onMouseDown: _propTypes2.default.func.isRequired,
  onMouseOver: _propTypes2.default.func.isRequired,
  onDoubleClick: _propTypes2.default.func.isRequired,
  onContextMenu: _propTypes2.default.func.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  onRevert: _propTypes2.default.func.isRequired,
  onEdit: _propTypes2.default.func,
};

DataCell.defaultProps = {
  forceEdit: false,
  selected: false,
  editing: false,
  clearing: false,
  cellRenderer: _Cell2.default,
};

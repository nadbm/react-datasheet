'use strict';

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _react = _interopRequireWildcard(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _CellShape = _interopRequireDefault(require('./CellShape'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== 'function') return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== 'object' && typeof obj !== 'function')
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj['default'] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

var Cell = /*#__PURE__*/ (function (_PureComponent) {
  _inherits(Cell, _PureComponent);

  var _super = _createSuper(Cell);

  function Cell() {
    _classCallCheck(this, Cell);

    return _super.apply(this, arguments);
  }

  _createClass(Cell, [
    {
      key: 'render',
      value: function render() {
        var _this$props = this.props,
          cell = _this$props.cell,
          row = _this$props.row,
          col = _this$props.col,
          attributesRenderer = _this$props.attributesRenderer,
          className = _this$props.className,
          style = _this$props.style,
          onMouseDown = _this$props.onMouseDown,
          onMouseOver = _this$props.onMouseOver,
          onDoubleClick = _this$props.onDoubleClick,
          onContextMenu = _this$props.onContextMenu;
        var colSpan = cell.colSpan,
          rowSpan = cell.rowSpan;
        var attributes = attributesRenderer
          ? attributesRenderer(cell, row, col)
          : {};
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
          this.props.children,
        );
      },
    },
  ]);

  return Cell;
})(_react.PureComponent);

exports['default'] = Cell;
Cell.propTypes = {
  row: _propTypes['default'].number.isRequired,
  col: _propTypes['default'].number.isRequired,
  cell: _propTypes['default'].shape(_CellShape['default']).isRequired,
  selected: _propTypes['default'].bool,
  editing: _propTypes['default'].bool,
  updated: _propTypes['default'].bool,
  attributesRenderer: _propTypes['default'].func,
  onMouseDown: _propTypes['default'].func.isRequired,
  onMouseOver: _propTypes['default'].func.isRequired,
  onDoubleClick: _propTypes['default'].func.isRequired,
  onContextMenu: _propTypes['default'].func.isRequired,
  className: _propTypes['default'].string,
  style: _propTypes['default'].object,
};
Cell.defaultProps = {
  selected: false,
  editing: false,
  updated: false,
  attributesRenderer: function attributesRenderer() {},
};

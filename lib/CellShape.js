'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
readOnly    Bool    false   Cell will never go in edit mode
key String  undefined   By default, each cell is given the key of col number and row number. This would override that key
className   String  undefined   Additional class names for cells.
component   ReactElement    undefined   Insert a react element or JSX to this field. This will render on edit mode
forceComponent  bool    false   Renders what's in component at all times, even when not in edit mode
disableEvents   bool    false   Makes cell unselectable and read only
colSpan number  1   The colSpan of the cell's td element
rowSpan number  1   The rowSpan of the cell's td element
width   number or String    undefined   Sets the cell's td width using a style attribute. Number is interpreted as pixels, strings are used as-is. Note: This will only work if the table does not have a set width.
overflow    'wrap'|'nowrap'| 'clip' undefined   How to render overflow text. Overrides grid-level overflow option.
editor func  undefined A component used to render the cell's value when being edited
viewer func  undefined A component used to render the cell's value when not being edited
*/
var CellShape = {
  readOnly: _propTypes2.default.bool,
  key: _propTypes2.default.string,
  className: _propTypes2.default.string,
  component: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  forceComponent: _propTypes2.default.bool,
  disableEvents: _propTypes2.default.bool,
  colSpan: _propTypes2.default.number,
  rowSpan: _propTypes2.default.number,
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  overflow: _propTypes2.default.oneOf(['wrap', 'nowrap', 'clip']),
  dataEditor: _propTypes2.default.func,
  valueViewer: _propTypes2.default.func
};

exports.default = CellShape;
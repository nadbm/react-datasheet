'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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
  readOnly: _propTypes['default'].bool,
  key: _propTypes['default'].string,
  className: _propTypes['default'].string,
  component: _propTypes['default'].oneOfType([
    _propTypes['default'].element,
    _propTypes['default'].func,
  ]),
  forceComponent: _propTypes['default'].bool,
  disableEvents: _propTypes['default'].bool,
  disableUpdatedFlag: _propTypes['default'].bool,
  colSpan: _propTypes['default'].number,
  rowSpan: _propTypes['default'].number,
  width: _propTypes['default'].oneOfType([
    _propTypes['default'].number,
    _propTypes['default'].string,
  ]),
  overflow: _propTypes['default'].oneOf(['wrap', 'nowrap', 'clip']),
  dataEditor: _propTypes['default'].func,
  valueViewer: _propTypes['default'].func,
};
var _default = CellShape;
exports['default'] = _default;

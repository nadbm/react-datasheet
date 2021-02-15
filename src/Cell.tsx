import React, { MouseEventHandler, ReactNode } from 'react';

export interface CellShape {
  /** Optional function or React Component to render a custom editor. Overrides grid-level dataEditor option. Default: undefined. */
  dataEditor?: any;
  /** Additional class names for cells. Default: undefined. */
  className?: string | undefined;
  /** Insert a react element or JSX to this field. This will render on edit mode. Default: undefined. */
  component?: JSX.Element;
  /** The colSpan of the cell's td element. Default: 1 */
  colSpan?: number;
  /** If true, renders what's in component at all times, even when not in edit mode. Default: false. */
  forceComponent?: boolean;
  /** By default, each cell is given the key of col number and row number. This would override that key. Default: undefined. */
  key?: string | undefined;
  /** Makes cell unselectable and read only. Default: false. */
  disableEvents?: boolean;
  /** How to render overflow text. Overrides grid-level overflow option. Default: undefined. */
  overflow?: 'wrap' | 'nowrap' | 'clip';
  /** If true, the cell will never go in edit mode. Default: false. */
  readOnly?: boolean;
  /** The rowSpan of the cell's td element. Default: 1. */
  rowSpan?: number;
  /** Optional function or React Component to customize the way the value for this cell is displayed. Overrides grid-level valueViewer option. Default: undefined. */
  valueViewer?: any;
  /** Sets the cell's td width using a style attribute. Number is interpreted as pixels, strings are used as-is. Note: This will only work if the table does not have a set width. Default: undefined. */
  width?: number | string;
}

interface CellRendererProps {
  /** The current row index */
  row: number;
  /** The current column index */
  col: number;
  /** The cell's raw data structure */
  cell: CellShape;
  /** Classes to apply to your cell element. You can add to these, but your should not overwrite or omit them unless you want to implement your own CSS also. */
  className: string;
  /** Generated styles that you should apply to your cell element. This may be null or undefined. */
  style: object | null | undefined;
  /** Is the cell currently selected */
  selected: boolean;
  /** Is the cell currently being edited */
  editing: boolean;
  /** Was the cell recently updated */
  updated: boolean;
  /** As for the main ReactDataSheet component */
  attributesRenderer: any;
  /** Event handler: important for cell selection behavior */
  onMouseDown: MouseEventHandler<HTMLElement>;
  /** Event handler: important for cell selection behavior */
  onMouseOver: MouseEventHandler<HTMLElement>;
  /** Event handler: important for editing */
  onDoubleClick: MouseEventHandler<HTMLElement>;
  /** Event handler: to launch default content-menu handling. You can safely ignore this handler if you want to provide your own content menu handling. */
  onContextMenu: MouseEventHandler<HTMLElement>;
  /** The regular react props.children. You must render {props.children} within your custom renderer or you won't your cell's data. */
  children: ReactNode;
}
const Cell = function ({
  cell,
  row,
  col,
  attributesRenderer,
  className,
  style,
  onMouseDown,
  onMouseOver,
  onDoubleClick,
  onContextMenu,
  children,
}: CellRendererProps) {
  const { colSpan, rowSpan } = cell;
  const attributes = attributesRenderer
    ? attributesRenderer(cell, row, col)
    : {};

  console.log('test?');
  return (
    <td
      className={className}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onDoubleClick={onDoubleClick}
      onTouchEnd={onDoubleClick}
      onContextMenu={onContextMenu}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={style}
      {...attributes}
    >
      {children}
    </td>
  );
};

export default Cell;

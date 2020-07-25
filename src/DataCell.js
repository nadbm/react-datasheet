import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  ENTER_KEY,
  ESCAPE_KEY,
  TAB_KEY,
  RIGHT_KEY,
  LEFT_KEY,
  UP_KEY,
  DOWN_KEY,
} from './keys';

import Cell from './Cell';
import CellShape from './CellShape';
import DataEditor from './DataEditor';
import ValueViewer from './ValueViewer';
import { renderValue, renderData } from './renderHelpers';

function initialData({ cell, row, col, valueRenderer, dataRenderer }) {
  return renderData(cell, row, col, valueRenderer, dataRenderer);
}

function initialValue({ cell, row, col, valueRenderer }) {
  return renderValue(cell, row, col, valueRenderer);
}

function widthStyle(cell) {
  const width = typeof cell.width === 'number' ? cell.width + 'px' : cell.width;
  return width ? { width } : null;
}

export default class DataCell extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleRevert = this.handleRevert.bind(this);

    this.handleKey = this.handleKey.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.state = {
      updated: false,
      reverting: false,
      committing: false,
      value: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.cell.disableUpdatedFlag &&
      initialValue(prevProps) !== initialValue(this.props)
    ) {
      this.setState({ updated: true });
      this.timeout = setTimeout(() => this.setState({ updated: false }), 700);
    }
    if (this.props.editing === true && prevProps.editing === false) {
      const value = this.props.clearing ? '' : initialData(this.props);
      this.setState({ value, reverting: false });
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
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleChange(value) {
    this.setState({ value, committing: false });
  }

  handleCommit(value, e) {
    const { onChange, onNavigate } = this.props;
    if (value !== initialData(this.props)) {
      this.setState({ value, committing: true });
      onChange(this.props.row, this.props.col, value);
    } else {
      this.handleRevert();
    }
    if (e) {
      e.preventDefault();
      onNavigate(e, true);
    }
  }

  handleRevert() {
    this.setState({ reverting: true });
    this.props.onRevert();
  }

  handleMouseDown(e) {
    const { row, col, onMouseDown, cell } = this.props;
    if (!cell.disableEvents) {
      onMouseDown(row, col, e);
    }
  }

  handleMouseOver(e) {
    const { row, col, onMouseOver, cell } = this.props;
    if (!cell.disableEvents) {
      onMouseOver(row, col);
    }
  }

  handleDoubleClick(e) {
    const { row, col, onDoubleClick, cell } = this.props;
    if (!cell.disableEvents) {
      onDoubleClick(row, col);
    }
  }

  handleContextMenu(e) {
    const { row, col, onContextMenu, cell } = this.props;
    if (!cell.disableEvents) {
      onContextMenu(e, row, col);
    }
  }

  handleKey(e) {
    const keyCode = e.which || e.keyCode;
    if (keyCode === ESCAPE_KEY) {
      return this.handleRevert();
    }
    const {
      cell: { component },
      forceEdit,
    } = this.props;
    const eatKeys = forceEdit || !!component;
    const commit =
      keyCode === ENTER_KEY ||
      keyCode === TAB_KEY ||
      (!eatKeys && [LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].includes(keyCode));

    if (commit) {
      this.handleCommit(this.state.value, e);
    }
  }

  renderComponent(editing, cell) {
    const { component, readOnly, forceComponent } = cell;
    if ((editing && !readOnly) || forceComponent) {
      return component;
    }
  }

  renderEditor(editing, cell, row, col, dataEditor) {
    if (editing) {
      const Editor = cell.dataEditor || dataEditor || DataEditor;
      return (
        <Editor
          cell={cell}
          row={row}
          col={col}
          value={this.state.value}
          onChange={this.handleChange}
          onCommit={this.handleCommit}
          onRevert={this.handleRevert}
          onKeyDown={this.handleKey}
        />
      );
    }
  }

  renderViewer(cell, row, col, valueRenderer, valueViewer) {
    const Viewer = cell.valueViewer || valueViewer || ValueViewer;
    const value = renderValue(cell, row, col, valueRenderer);
    return <Viewer cell={cell} row={row} col={col} value={value} />;
  }

  render() {
    const {
      row,
      col,
      cell,
      cellRenderer: CellRenderer,
      valueRenderer,
      dataEditor,
      valueViewer,
      attributesRenderer,
      selected,
      editing,
      onKeyUp,
    } = this.props;
    const { updated } = this.state;

    const content =
      this.renderComponent(editing, cell) ||
      this.renderEditor(editing, cell, row, col, dataEditor) ||
      this.renderViewer(cell, row, col, valueRenderer, valueViewer);

    const className = [
      cell.className,
      'cell',
      cell.overflow,
      selected && 'selected',
      editing && 'editing',
      cell.readOnly && 'read-only',
      updated && 'updated',
    ]
      .filter(a => a)
      .join(' ');

    return (
      <CellRenderer
        row={row}
        col={col}
        cell={cell}
        selected={selected}
        editing={editing}
        updated={updated}
        attributesRenderer={attributesRenderer}
        className={className}
        style={widthStyle(cell)}
        onMouseDown={this.handleMouseDown}
        onMouseOver={this.handleMouseOver}
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleContextMenu}
        onKeyUp={onKeyUp}
      >
        {content}
      </CellRenderer>
    );
  }
}

DataCell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  cell: PropTypes.shape(CellShape).isRequired,
  forceEdit: PropTypes.bool,
  selected: PropTypes.bool,
  editing: PropTypes.bool,
  editValue: PropTypes.any,
  clearing: PropTypes.bool,
  cellRenderer: PropTypes.func,
  valueRenderer: PropTypes.func.isRequired,
  dataRenderer: PropTypes.func,
  valueViewer: PropTypes.func,
  dataEditor: PropTypes.func,
  attributesRenderer: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRevert: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};

DataCell.defaultProps = {
  forceEdit: false,
  selected: false,
  editing: false,
  clearing: false,
  cellRenderer: Cell,
};

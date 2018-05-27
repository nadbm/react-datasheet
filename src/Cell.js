import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import CellShape from './CellShape'

export default class Cell extends PureComponent {

  scrollToSelected = () => {
    if (this.props.selected) {
      this.cellItem.scrollIntoView();
    }
  };

  componentDidMount = () => {
    document.addEventListener('click', this.scrollToSelected);
    document.addEventListener('keydown', this.scrollToSelected);
  };

  componentWillUnmount = () => {
    document.removeEventListener('click', this.scrollToSelected);
    document.removeEventListener('keydown', this.scrollToSelected);
  };

  render () {
    const {
          cell, row, col, attributesRenderer,
          className, style, onMouseDown, onMouseOver, onDoubleClick, onContextMenu
        } = this.props

    const {colSpan, rowSpan} = cell
    const attributes = attributesRenderer ? attributesRenderer(cell, row, col) : {}

    return (
      <td
        ref={node => (this.cellItem = node)}
        className={className}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        colSpan={colSpan}
        rowSpan={rowSpan}
        style={style}
        {...attributes}
      >
        {this.props.children}
      </td>
    )
  }
}

Cell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  cell: PropTypes.shape(CellShape).isRequired,
  selected: PropTypes.bool,
  editing: PropTypes.bool,
  updated: PropTypes.bool,
  attributesRenderer: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
}

Cell.defaultProps = {
  selected: false,
  editing: false,
  updated: false,
  attributesRenderer: () => {}
}

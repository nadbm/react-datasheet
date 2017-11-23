import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { filterCellExtraAttributes } from './utils/utils';

export default class ComponentCell extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { updated: false };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ updated: true });
      this.timeout = setTimeout(() => {
        this.setState({ updated: false });
      }, 700);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    let {
      row, col, readOnly, forceComponent, rowSpan, colSpan, width, overflow, value, className, editing, selected,
      onMouseDown, onMouseOver, onDoubleClick, onContextMenu, extraAttributes
    } = this.props;
    const style = { width };
    const filteredExtraAttribs = filterCellExtraAttributes(extraAttributes);

    return (
      <td
        className={[
          className, 'cell', overflow,
          editing && 'editing', selected && 'selected',
          this.state.updated && 'updated'
        ].filter(a => a).join(' ')}
        onMouseDown={() => onMouseDown(row, col)}
        onDoubleClick={() => onDoubleClick(row, col)}
        onMouseOver={() => onMouseOver(row, col)}
        onContextMenu={(e) => onContextMenu(e, row, col)} colSpan={colSpan || 1}
        rowSpan={rowSpan || 1}
        style={style}
        { ...filteredExtraAttribs }
      >
        { ((editing && !readOnly) || forceComponent) ? this.props.component : value }
      </td>
    );
  }
}

ComponentCell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
  rowSpan: PropTypes.number,
  width: PropTypes.string,
  overflow: PropTypes.oneOf(['wrap', 'nowrap', 'clip']),
  className: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  updated: PropTypes.bool,
  forceComponent: PropTypes.bool,
  extraAttributes: PropTypes.object
};

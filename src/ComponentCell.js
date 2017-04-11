import React, {PureComponent, PropTypes} from 'react'

export default class ComponentCell extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {updated: false};
  }

  componentWillUpdate(nextProps) {
    let prevProps = this.props;
    if (nextProps.value !== this.props.value) {
      this.setState({updated: true});
      this.timeout = setTimeout(() => {
        this.setState({updated: false});
      }, 700);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    let {row, col, readOnly, forceComponent, rowSpan, colSpan, value, className, editing, selected, onMouseDown, onMouseOver, onDoubleClick, onContextMenu} = this.props;
    
    return (
      <td 
        className={[
          className, 
          'cell',
          editing && 'editing',
          selected && 'selected',
          this.state.updated && 'updated'
        ].filter(a => a).join(' ')}
        onMouseDown={()=> onMouseDown(row,col)}
        onDoubleClick={()=> onDoubleClick(row,col)}
        onMouseOver={()=> onMouseOver(row,col)}
        onContextMenu={(e) => onContextMenu(e,row,col)}
        colSpan={colSpan || 1}
        rowSpan={rowSpan || 1}>
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
  className: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  updated: PropTypes.bool,
  forceComponent: PropTypes.bool
}

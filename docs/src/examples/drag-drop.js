import { DragSource, DropTarget } from 'react-dnd'

/**
 * Specifies which props to inject into your component.
 */
function rowSourceCollect (connect, _monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  }
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const rowSourceSpec = {
  beginDrag (props) {
    console.log('beginDrag', props.rowIndex, props)
    return {
      rowIndex: props.rowIndex
    }
  }
}

function rowTargetCollect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver() && monitor.canDrop()
  }
}

const rowTargetSpec = {
  canDrop (props, monitor) {
    const item = monitor.getItem()
    return props.rowIndex !== item.rowIndex
  },

  drop (props, monitor, component) {
    if (monitor.didDrop()) {
      return
    }
    // Obtain the dragged item
    const { rowIndex: fromIndex } = monitor.getItem()
    const { rowIndex: toIndex, onRowDrop } = props
    onRowDrop(fromIndex, toIndex)
  }
}

function colSourceCollect (connect, _monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource()
  }
}

const colSourceSpec = {
  beginDrag (props) {
    return {
      columnIndex: props.columnIndex
    }
  }
}

function colTargetCollect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver() && monitor.canDrop()
  }
}

const colTargetSpec = {
  canDrop (props, monitor) {
    const item = monitor.getItem()
    // return item.row !== props.row
    return props.columnIndex !== item.columnIndex
  },

  drop (props, monitor, component) {
    if (monitor.didDrop()) {
      return
    }

    // Obtain the dragged item
    const { columnIndex: fromIndex } = monitor.getItem()
    const { columnIndex: toIndex, onColumnDrop } = props
    onColumnDrop(fromIndex, toIndex)
  }
}

export const colDragSource = DragSource('col', colSourceSpec, colSourceCollect)
export const colDropTarget = DropTarget('col', colTargetSpec, colTargetCollect)
export const rowDragSource = DragSource('row', rowSourceSpec, rowSourceCollect)
export const rowDropTarget = DropTarget('row', rowTargetSpec, rowTargetCollect)

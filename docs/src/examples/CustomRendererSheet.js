import React, { PureComponent } from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Select from 'react-select'

import DataSheet from '../lib'
import {ENTER_KEY, TAB_KEY} from '../lib/keys'

import {
  colDragSource, colDropTarget,
  rowDragSource, rowDropTarget
} from './drag-drop.js'

const Header = colDropTarget(colDragSource((props) => {
  const { col, connectDragSource, connectDropTarget, isOver } = props
  const className = isOver ? 'cell read-only drop-target' : 'cell read-only'
  return connectDropTarget(
    connectDragSource(
      <th className={className} style={{ width: col.width }}>{col.label}</th>
    ))
}))

class SheetRenderer extends PureComponent {
  render () {
    const { className, columns, onColumnDrop } = this.props
    return (
      <table className={className}>
        <thead>
          <tr>
            <th className='cell read-only row-handle' key='$$actionCell' />
            {
              columns.map((col, index) => (
                <Header key={col.label} col={col} columnIndex={index} onColumnDrop={onColumnDrop} />
              ))
            }
          </tr>
        </thead>
        <tbody>
          {this.props.children}
        </tbody>
      </table>
    )
  }
}

const RowRenderer = rowDropTarget(rowDragSource((props) => {
  const { isOver, children, connectDropTarget, connectDragPreview, connectDragSource } = props
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      { connectDragSource(<td className='cell read-only row-handle' key='$$actionCell' />)}
      { children }
    </tr>
  ))
}))

class SelectEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.state = {}
  }

  handleChange (opt) {
    const {onCommit, onRevert} = this.props
    if (!opt) {
      return onRevert()
    }
    const { e } = this.state
    onCommit(opt.value, e)
    console.log('COMMITTED', opt.value)
  }

  handleKeyDown (e) {
    // record last key pressed so we can handle enter
    if (e.which === ENTER_KEY || e.which === TAB_KEY) {
      e.persist()
      this.setState({ e })
    } else {
      this.setState({ e: null })
    }
  }

  render () {
    return (
      <Select
        autoFocus
        openOnFocus
        closeOnSelect
        value={this.props.value}
        onChange={this.handleChange}
        onInputKeyDown={this.handleKeyDown}
        options={[
          {label: '1', value: 1},
          {label: '2', value: 2},
          {label: '3', value: 3},
          {label: '4', value: 4},
          {label: '5', value: 5}
        ]}
      />
    )
  }
}

class RangeEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    this._input.focus()
  }

  handleChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    const {value, onKeyDown} = this.props
    return (
      <input
        ref={input => { this._input = input }}
        type='range'
        className='data-editor'
        value={value}
        min='1'
        max='5'
        onChange={this.handleChange}
        onKeyDown={onKeyDown}
      />
    )
  }
}

const FillViewer = props => {
  const { value } = props
  return (
    <div style={{width: '100%'}}>
      {[1, 2, 3, 4, 5].map(v => {
        const backgroundColor = v > value ? 'transparent' : '#007eff'
        return (
          <div key={v} style={{float: 'left', width: '20%', height: '17px', backgroundColor}} />
        )
      })}
    </div>
  )
}

class CustomRendererSheet extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { label: 'Style', width: '40%' },
        { label: 'IBUs', width: '20%' },
        { label: 'Color (SRM)', width: '20%' },
        { label: 'Rating', width: '20%' }
      ],
      grid: [
        [{ value: 'Ordinary Bitter'}, { value: '20 - 35'}, { value: '5 - 12'}, { value: 4, dataEditor: RangeEditor }],
        [{ value: 'Special Bitter'}, { value: '28 - 40'}, { value: '6 - 14'}, { value: 4, dataEditor: RangeEditor }],
        [{ value: 'ESB'}, { value: '30 - 45'}, { value: '6 - 14'}, { value: 5, dataEditor: RangeEditor, valueViewer: FillViewer }],
        [{ value: 'Scottish Light'}, { value: '9 - 20'}, { value: '6 - 15'}, { value: 3, dataEditor: SelectEditor, valueViewer: FillViewer }],
        [{ value: 'Scottish Heavy'}, { value: '12 - 20'}, { value: '8 - 30'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'Scottish Export'}, { value: '15 - 25'}, { value: '9 - 19'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'English Summer Ale'}, { value: '20 - 30'}, { value: '3 - 7'}, { value: 3, dataEditor: SelectEditor }],
        [{ value: 'English Pale Ale'}, { value: '20 - 40'}, { value: '5 - 12'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'English IPA'}, { value: '35 - 63'}, { value: '6 - 14'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'Strong Ale'}, { value: '30 - 65'}, { value: '8 - 21'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'Old Ale'}, { value: '30 -65'}, { value: '12 - 30'}, { value: 4, dataEditor: SelectEditor }],
        [{ value: 'Pale Mild Ale'}, { value: '10 - 20'}, { value: '6 - 9'}, { value: 3, dataEditor: SelectEditor }],
        [{ value: 'Dark Mild Ale'}, { value: '10 - 24'}, { value: '17 - 34'}, { value: 3, dataEditor: SelectEditor }],
        [{ value: 'Brown Ale'}, { value: '12 - 25'}, { value: '12 - 17'}, { value: 3, dataEditor: SelectEditor }]
      ].map((a, i) => a.map((cell, j) => Object.assign(cell, {key: `${i}-${j}`})))
    }

    this.handleColumnDrop = this.handleColumnDrop.bind(this)
    this.handleRowDrop = this.handleRowDrop.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
    this.renderSheet = this.renderSheet.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  handleColumnDrop (from, to) {
    const columns = [...this.state.columns]
    columns.splice(to, 0, ...columns.splice(from, 1))
    const grid = this.state.grid.map(r => {
      const row = [...r]
      row.splice(to, 0, ...row.splice(from, 1))
      return row
    })
    this.setState({ columns, grid })
  }

  handleRowDrop (from, to) {
    const grid = [ ...this.state.grid ]
    grid.splice(to, 0, ...grid.splice(from, 1))
    this.setState({ grid })
  }

  handleChanges (changes) {
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      if (grid[row] && grid[row][col]) {
        grid[row][col] = {...grid[row][col], value}
      }
    })
    this.setState({grid})
  }

  renderSheet (props) {
    return <SheetRenderer columns={this.state.columns} onColumnDrop={this.handleColumnDrop} {...props} />
  }

  renderRow (props) {
    const {row, cells, ...rest} = props
    return <RowRenderer rowIndex={row} onRowDrop={this.handleRowDrop} {...rest} />
  }

  render () {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <DataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          sheetRenderer={this.renderSheet}
          rowRenderer={this.renderRow}
          onCellsChanged={this.handleChanges}
        />
      </DragDropContextProvider>
    )
  }
}

export default CustomRendererSheet

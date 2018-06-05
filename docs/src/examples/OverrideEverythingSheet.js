import React, { PureComponent } from 'react'
import DataSheet from '../lib'

import './override-everything.css'

const SheetRenderer = props => {
  const {as: Tag, headerAs: Header, bodyAs: Body, rowAs: Row, cellAs: Cell,
    className, columns, selections, onSelectAllChanged} = props
  return (
    <Tag className={className}>
      <Header className='data-header'>
        <Row>
          <Cell className='action-cell cell'>
            <input
              type='checkbox'
              checked={selections.every(s => s)}
              onChange={e => onSelectAllChanged(e.target.checked)}
            />
          </Cell>
          {columns.map(column => <Cell className='cell' style={{ width: column.width }} key={column.label}>{column.label}</Cell>)}
        </Row>
      </Header>
      <Body className='data-body'>
        {props.children}
      </Body>
    </Tag>
  )
}

const RowRenderer = props => {
  const {as: Tag, cellAs: Cell, className, row, selected, onSelectChanged} = props
  return (
    <Tag className={className}>
      <Cell className='action-cell cell'>
        <input
          type='checkbox'
          checked={selected}
          onChange={e => onSelectChanged(row, e.target.checked)}
        />
      </Cell>
      {props.children}
    </Tag>
  )
}

const CellRenderer = props => {
  const {
    as: Tag, cell, row, col, columns, attributesRenderer,
    selected, editing, updated, style,
    ...rest
  } = props

  // hey, how about some custom attributes on our cell?
  const attributes = cell.attributes || {}
  // ignore default style handed to us by the component and roll our own
  attributes.style = { width: columns[col].width }
  if (col === 0) {
    attributes.title = cell.label
  }

  return (
    <Tag {...rest} {...attributes}>
      {props.children}
    </Tag>
  )
}

export default class OverrideEverythingSheet extends PureComponent {
  constructor (props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleSelectAllChanged = this.handleSelectAllChanged.bind(this)
    this.handleSelectChanged = this.handleSelectChanged.bind(this)
    this.handleCellsChanged = this.handleCellsChanged.bind(this)

    this.sheetRenderer = this.sheetRenderer.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.cellRenderer = this.cellRenderer.bind(this)

    this.state = {
      as: 'table',
      columns: [
        { label: 'Style', width: '30%' },
        { label: 'IBUs', width: '20%' },
        { label: 'Color (SRM)', width: '20%' },
        { label: 'Rating', width: '20%' }
      ],
      grid: [
        [{ value: 'Ordinary Bitter' }, { value: '20 - 35' }, { value: '5 - 12' }, { value: 4, attributes: {'data-foo': 'bar' } }],
        [{ value: 'Special Bitter' }, { value: '28 - 40' }, { value: '6 - 14' }, { value: 4 }],
        [{ value: 'ESB' }, { value: '30 - 45' }, { value: '6 - 14' }, { value: 5 }],
        [{ value: 'Scottish Light' }, { value: '9 - 20' }, { value: '6 - 15' }, { value: 3 }],
        [{ value: 'Scottish Heavy' }, { value: '12 - 20' }, { value: '8 - 30' }, { value: 4 }],
        [{ value: 'Scottish Export' }, { value: '15 - 25' }, { value: '9 - 19' }, { value: 4 }],
        [{ value: 'English Summer Ale' }, { value: '20 - 30' }, { value: '3 - 7' }, { value: 3 }],
        [{ value: 'English Pale Ale' }, { value: '20 - 40' }, { value: '5 - 12' }, { value: 4 }],
        [{ value: 'English IPA' }, { value: '35 - 63' }, { value: '6 - 14' }, { value: 4 }],
        [{ value: 'Strong Ale' }, { value: '30 - 65' }, { value: '8 - 21' }, { value: 4 }],
        [{ value: 'Old Ale' }, { value: '30 -65' }, { value: '12 - 30' }, { value: 4 }],
        [{ value: 'Pale Mild Ale' }, { value: '10 - 20' }, { value: '6 - 9' }, { value: 3 }],
        [{ value: 'Dark Mild Ale' }, { value: '10 - 24' }, { value: '17 - 34' }, { value: 3 }],
        [{ value: 'Brown Ale' }, { value: '12 - 25' }, { value: '12 - 17' }, { value: 3 }]
      ],
      selections: [false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    }
  }

  handleSelect (e) {
    this.setState({as: e.target.value})
  }

  handleSelectAllChanged (selected) {
    const selections = this.state.selections.map(s => selected)
    this.setState({selections})
  }

  handleSelectChanged (index, selected) {
    const selections = [...this.state.selections]
    selections[index] = selected
    this.setState({selections})
  }

  handleCellsChanged (changes, additions) {
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      grid[row][col] = {...grid[row][col], value}
    })
    // paste extended beyond end, so add a new row
    additions && additions.forEach(({cell, row, col, value}) => {
      if (!grid[row]) {
        grid[row] = [{value: ''}, {value: ''}, {value: ''}, {value: 0}]
      }
      if (grid[row][col]) {
        grid[row][col] = {...grid[row][col], value}
      }
    })
    this.setState({grid})
  }

  sheetRenderer (props) {
    const {columns, selections} = this.state
    switch (this.state.as) {
      case 'list':
        return <SheetRenderer columns={columns} selections={selections} onSelectAllChanged={this.handleSelectAllChanged} as='segment' headerAs='div' bodyAs='ul' rowAs='div' cellAs='div' {...props} />
      case 'div':
        return <SheetRenderer columns={columns} selections={selections} onSelectAllChanged={this.handleSelectAllChanged} as='div' headerAs='div' bodyAs='div' rowAs='div' cellAs='div' {...props} />
      default:
        return <SheetRenderer columns={columns} selections={selections} onSelectAllChanged={this.handleSelectAllChanged} as='table' headerAs='thead' bodyAs='tbody' rowAs='tr' cellAs='th' {...props} />
    }
  }

  rowRenderer (props) {
    const {selections} = this.state
    switch (this.state.as) {
      case 'list':
        return <RowRenderer as='li' cellAs='div' selected={selections[props.row]} onSelectChanged={this.handleSelectChanged} className='data-row' {...props} />
      case 'div':
        return <RowRenderer as='div' cellAs='div' selected={selections[props.row]} onSelectChanged={this.handleSelectChanged} className='data-row' {...props} />
      default:
        return <RowRenderer as='tr' cellAs='td' selected={selections[props.row]} onSelectChanged={this.handleSelectChanged} className='data-row' {...props} />
    }
  }

  cellRenderer (props) {
    switch (this.state.as) {
      case 'list':
        return <CellRenderer as='div' columns={this.state.columns} {...props} />
      case 'div':
        return <CellRenderer as='div' columns={this.state.columns} {...props} />
      default:
        return <CellRenderer as='td' columns={this.state.columns} {...props} />
    }
  }

  render () {
    return (
      <div>
        <div>
          <label>
            Render with:&nbsp;
            <select value={this.state.as} onChange={this.handleSelect}>
              <option value='table'>Table</option>
              <option value='list'>List</option>
              <option value='div'>Div</option>
            </select>
          </label>
        </div>

        <DataSheet
          data={this.state.grid}
          className='custom-sheet'
          sheetRenderer={this.sheetRenderer}
          headerRenderer={this.headerRenderer}
          bodyRenderer={this.bodyRenderer}
          rowRenderer={this.rowRenderer}
          cellRenderer={this.cellRenderer}
          onCellsChanged={this.handleCellsChanged}
          valueRenderer={(cell) => cell.value}
        />
      </div>
    )
  }
}

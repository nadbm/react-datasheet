import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Sheet from './Sheet'
import Row from './Row'
import Cell from './Cell'
import DataCell from './DataCell'
import DataEditor from './DataEditor'
import ValueViewer from './ValueViewer'
import { TAB_KEY, ENTER_KEY, DELETE_KEY, ESCAPE_KEY, BACKSPACE_KEY,
  LEFT_KEY, UP_KEY, DOWN_KEY, RIGHT_KEY } from './keys'

const isEmpty = (obj) => Object.keys(obj).length === 0

const range = (start, end) => {
  const array = []
  const inc = (end - start > 0)
  for (let i = start; inc ? (i <= end) : (i >= end); inc ? i++ : i--) {
    inc ? array.push(i) : array.unshift(i)
  }
  return array
}

const defaultParsePaste = (str) => {
  return str.split(/\r\n|\n|\r/)
    .map((row) => row.split('\t'))
}

export default class DataSheet extends PureComponent {
  constructor (props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
    this.onContextMenu = this.onContextMenu.bind(this)
    this.handleNavigate = this.handleNavigate.bind(this)
    this.handleKey = this.handleKey.bind(this).bind(this)
    this.handleComponentKey = this.handleComponentKey.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onRevert = this.onRevert.bind(this)
    this.isSelected = this.isSelected.bind(this)
    this.isEditing = this.isEditing.bind(this)
    this.isClearing = this.isClearing.bind(this)

    this.defaultState = {
      start: {},
      end: {},
      selecting: false,
      forceEdit: false,
      editing: {},
      clear: {}
    }
    this.state = this.defaultState

    this.removeAllListeners = this.removeAllListeners.bind(this)
  }

  removeAllListeners () {
    document.removeEventListener('mousedown', this.pageClick)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('copy', this.handleCopy)
    document.removeEventListener('paste', this.handlePaste)
  }

  componentDidMount () {
    // Add listener scoped to the DataSheet that catches otherwise unhandled
    // keyboard events when displaying components
    this.dgDom && this.dgDom.addEventListener('keydown', this.handleComponentKey)
  }

  componentWillUnmount () {
    this.dgDom && this.dgDom.removeEventListener('keydown', this.handleComponentKey)
    this.removeAllListeners()
  }

  pageClick (e) {
    const element = this.dgDom
    if (!element.contains(e.target)) {
      this.setState(this.defaultState)
      this.removeAllListeners()
    }
  }

  handleCopy (e) {
    if (isEmpty(this.state.editing)) {
      e.preventDefault()
      const {dataRenderer, valueRenderer, data} = this.props
      const {start, end} = this.state

      const text = range(start.i, end.i).map((i) =>
        range(start.j, end.j).map(j => {
          const cell = data[i][j]
          const value = dataRenderer ? dataRenderer(cell, i, j) : null
          if (value === '' || value === null || typeof (value) === 'undefined') {
            return valueRenderer(cell, i, j)
          }
          return value
        }).join('\t')
      ).join('\n')
      e.clipboardData.setData('text/plain', text)
    }
  }

  handlePaste (e) {
    if (isEmpty(this.state.editing)) {
      const start = this.state.start

      const parse = this.props.parsePaste || defaultParsePaste
      const pastedMap = []
      const pasteData = parse(e.clipboardData.getData('text/plain'))

      let end = {}

      pasteData.map((row, i) => {
        const rowData = []
        row.map((pastedData, j) => {
          const cell = this.props.data[start.i + i] && this.props.data[start.i + i][start.j + j]
          rowData.push({cell: cell, data: pastedData})
          if (cell && !cell.readOnly && !this.props.onPaste) {
            this.props.onChange(cell, start.i + i, start.j + j, pastedData)
            end = {i: start.i + i, j: start.j + j}
          }
        })
        pastedMap.push(rowData)
      })
      this.props.onPaste && this.props.onPaste(pastedMap)
      this.setState({end: end})
    }
  }

  handleKeyboardCellMovement (e, {data, start, isEditing, currentCell}) {
    if (isEditing) {
      return false
    }
    const hasComponent = currentCell && currentCell.component
    const forceComponent = currentCell && currentCell.forceComponent

    if (hasComponent && (isEditing || forceComponent)) {
      return false
    }

    const keyCode = e.which || e.keyCode
    let newLocation = null

    if (keyCode === TAB_KEY && !e.shiftKey) {
      newLocation = {i: start.i, j: start.j + 1}
      newLocation = typeof (data[newLocation.i][newLocation.j]) !== 'undefined' ? newLocation : {i: start.i + 1, j: 0}
    } else if (keyCode === RIGHT_KEY) {
      newLocation = {i: start.i, j: start.j + 1}
    } else if (keyCode === LEFT_KEY || ((keyCode === TAB_KEY) && e.shiftKey)) {
      newLocation = {i: start.i, j: start.j - 1}
    } else if (keyCode === UP_KEY) {
      newLocation = {i: start.i - 1, j: start.j}
    } else if (keyCode === DOWN_KEY) {
      newLocation = {i: start.i + 1, j: start.j}
    }

    if (newLocation && data[newLocation.i] && typeof (data[newLocation.i][newLocation.j]) !== 'undefined') {
      this.setState({start: newLocation, end: newLocation, editing: {}})
    }
    if (newLocation) {
      e.preventDefault()
      return true
    }
    return false
  }

  getSelectedCells (data, start, end) {
    let selected = []
    range(start.i, end.i).map(i => {
      range(start.j, end.j).map(j => {
        selected.push({cell: data[i][j], i, j})
      })
    })
    return selected
  }

  handleKey (e) {
    if (e.isPropagationStopped && e.isPropagationStopped()) {
      return
    }
    const keyCode = e.which || e.keyCode
    const {start, end, editing} = this.state
    const data = this.props.data
    const isEditing = editing && !isEmpty(editing)
    const noCellsSelected = !start || isEmpty(start)
    const ctrlKeyPressed = e.ctrlKey || e.metaKey
    const deleteKeysPressed = (keyCode === DELETE_KEY || keyCode === BACKSPACE_KEY)
    const enterKeyPressed = keyCode === ENTER_KEY
    const numbersPressed = (keyCode >= 48 && keyCode <= 57)
    const lettersPressed = (keyCode >= 65 && keyCode <= 90)
    const numPadKeysPressed = (keyCode >= 96 && keyCode <= 105)
    const currentCell = !noCellsSelected && data[start.i][start.j]
    const equationKeysPressed = [
      187, /* equal */
      189, /* substract */
      190, /* period */
      107, /* add */
      109, /* decimal point */
      110
    ].indexOf(keyCode) > -1

    if (noCellsSelected || ctrlKeyPressed || this.handleKeyboardCellMovement(e, {data, start, isEditing, currentCell})) {
      return true
    }

    if (!isEditing) {
      if (deleteKeysPressed) {
        // ugly solution brought to you by https://reactjs.org/docs/react-component.html#setstate
        // setState in a loop is unreliable
        setTimeout(() => {
          this.getSelectedCells(data, start, end).map(({cell, i, j}) =>
            (!cell.readOnly) ? this.onChange(i, j, '') : null
          )
        }, 0)
        e.preventDefault()
      } else if (currentCell && !currentCell.readOnly) {
        if (enterKeyPressed) {
          this.setState({editing: start, clear: {}, forceEdit: true})
          e.preventDefault()
        } else if (numbersPressed ||
            numPadKeysPressed ||
            lettersPressed ||
            equationKeysPressed) {
          // empty out cell if user starts typing without pressing enter
          this.setState({editing: start, clear: start, forceEdit: false})
        }
      }
    }
  }

  handleComponentKey (e) {
    // handles keyboard events when editing components
    const keyCode = e.which || e.keyCode
    if ([ENTER_KEY, ESCAPE_KEY, TAB_KEY].includes(keyCode)) {
      const {editing} = this.state
      if (!isEmpty(editing)) {
        const {data} = this.props
        const currentCell = data[editing.i][editing.j]
        const offset = e.shiftKey ? -1 : 1
        if (currentCell && currentCell.component) {
          let func = this.onRevert // ESCAPE_KEY
          if (keyCode === ENTER_KEY) {
            func = () => this.handleNavigate({i: offset, j: 0})
          } else if (keyCode === TAB_KEY) {
            func = () => this.handleNavigate({i: 0, j: offset})
          }
          // setTimeout makes sure that component is done handling the event before we take over
          setTimeout(func, 1)
        }
      }
    }
  }

  handleNavigate (offsets) {
    if (offsets && (offsets.i || offsets.j)) {
      const {start} = this.state
      const {data} = this.props
      const newLocation = {i: start.i + offsets.i, j: start.j + offsets.j}
      if (data[newLocation.i] && typeof (data[newLocation.i][newLocation.j]) !== 'undefined') {
        this.setState({start: newLocation, end: newLocation, editing: {}})
      }
    }
    this.dgDom && this.dgDom.focus()
  }

  onContextMenu (evt, i, j) {
    let cell = this.props.data[i][j]
    if (this.props.onContextMenu) {
      this.props.onContextMenu(evt, cell, i, j)
    }
  }

  onDoubleClick (i, j) {
    let cell = this.props.data[i][j]
    if (!cell.readOnly) {
      this.setState({editing: {i: i, j: j}, forceEdit: true, clear: {}})
    }
  }

  onMouseDown (i, j) {
    let editing = (isEmpty(this.state.editing) || this.state.editing.i !== i || this.state.editing.j !== j)
      ? {} : this.state.editing
    this.setState({selecting: true, start: {i, j}, end: {i, j}, editing: editing, forceEdit: false})

    // Keep listening to mouse if user releases the mouse (dragging outside)
    document.addEventListener('mouseup', this.onMouseUp)
    // Listen for any outside mouse clicks
    document.addEventListener('mousedown', this.pageClick)

    // Copy paste event handler
    document.addEventListener('copy', this.handleCopy)
    document.addEventListener('paste', this.handlePaste)
  }

  onMouseOver (i, j) {
    if (this.state.selecting && isEmpty(this.state.editing)) {
      this.setState({end: {i, j}})
    }
  }

  onMouseUp () {
    this.setState({selecting: false})
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onChange (i, j, val) {
    this.props.onChange(this.props.data[i][j], i, j, val)
    this.onRevert()
  }

  onRevert () {
    this.setState({ editing: {} })
    this.dgDom && this.dgDom.focus()
  }

  componentDidUpdate (prevProps, prevState) {
    let prevEnd = prevState.end
    if (!isEmpty(this.state.end) && !(this.state.end.i === prevEnd.i && this.state.end.j === prevEnd.j)) {
      this.props.onSelect && this.props.onSelect(this.props.data[this.state.end.i][this.state.end.j])
    }
  }

  isSelected (i, j) {
    const start = this.state.start
    const end = this.state.end
    const posX = (j >= start.j && j <= end.j)
    const negX = (j <= start.j && j >= end.j)
    const posY = (i >= start.i && i <= end.i)
    const negY = (i <= start.i && i >= end.i)

    return (posX && posY) ||
        (negX && posY) ||
        (negX && negY) ||
        (posX && negY)
  }

  isEditing (i, j) {
    return this.state.editing.i === i && this.state.editing.j === j
  }

  isClearing (i, j) {
    return this.state.clear.i === i && this.state.clear.j === j
  }

  render () {
    const {sheetRenderer: SheetRenderer, rowRenderer: RowRenderer, cellRenderer,
      dataRenderer, valueRenderer, dataEditor, valueViewer, attributesRenderer,
      className, overflow, data, keyFn} = this.props
    const {forceEdit} = this.state

    return (
      <span ref={r => { this.dgDom = r }} tabIndex='0' className='data-grid-container' onKeyDown={this.handleKey}>
        <SheetRenderer data={data} className={['data-grid', className, overflow].filter(a => a).join(' ')}>
          {data.map((row, i) =>
            <RowRenderer key={keyFn ? keyFn(i) : i} row={i} cells={row}>
              {
                row.map((cell, j) => {
                  return (
                    <DataCell
                      key={cell.key ? cell.key : `${i}-${j}`}
                      row={i}
                      col={j}
                      cell={cell}
                      forceEdit={forceEdit}
                      onMouseDown={this.onMouseDown}
                      onMouseOver={this.onMouseOver}
                      onDoubleClick={this.onDoubleClick}
                      onContextMenu={this.onContextMenu}
                      onChange={this.onChange}
                      onRevert={this.onRevert}
                      onNavigate={this.handleNavigate}
                      onKey={this.handleKey}
                      selected={this.isSelected(i, j)}
                      editing={this.isEditing(i, j)}
                      clearing={this.isClearing(i, j)}
                      attributesRenderer={attributesRenderer}
                      cellRenderer={cellRenderer}
                      valueRenderer={valueRenderer}
                      dataRenderer={dataRenderer}
                      valueViewer={valueViewer}
                      dataEditor={dataEditor}
                    />
                  )
                })
              }
            </RowRenderer>)
          }
        </SheetRenderer>
      </span>
    )
  }
}

DataSheet.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  overflow: PropTypes.oneOf(['wrap', 'nowrap', 'clip']),
  onChange: PropTypes.func,
  onContextMenu: PropTypes.func,
  valueRenderer: PropTypes.func.isRequired,
  dataRenderer: PropTypes.func,
  sheetRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  cellRenderer: PropTypes.func.isRequired,
  valueViewer: PropTypes.func,
  dataEditor: PropTypes.func,
  parsePaste: PropTypes.func,
  attributesRenderer: PropTypes.func
}

DataSheet.defaultProps = {
  sheetRenderer: Sheet,
  rowRenderer: Row,
  cellRenderer: Cell,
  valueViewer: ValueViewer,
  dataEditor: DataEditor
}

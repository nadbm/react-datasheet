import React, { Component, PropTypes } from 'react';

const TAB_KEY           = 9;
const ENTER_KEY         = 13;
const LEFT_KEY          = 37;
const UP_KEY            = 38;
const RIGHT_KEY         = 39;
const DOWN_KEY          = 40;
const DELETE_KEY        = 46;
const BACKSPACE_KEY     = 8;
const CMD_KEY = 91;
const CTRL_KEY= 17;

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
const range = (start, end) => {
    let array = [];
    let inc = (end-start > 0);
    for(let i = start; inc ? (i < end) : (i>end); inc ? i++ : i--) {
      array.push(i);
    }
    return array;
}   

class DataCell extends Component {
  constructor(props) {
    super(props);
    this.state = {updated: false}
  }
  componentWillUpdate(nextProps) {
    let prevProps = this.props;
    if(nextProps.value !== this.props.value) {
      this.setState({updated:true});
      setTimeout(() => {this.setState({updated:false}); }, 700); 
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.editing === true && this.props.editing === false) {
      this.onChange(this._input.value);
    }
    if(prevProps.editing === false && this.props.editing === true) {
      this._input.focus();
      this._input.value = this.props.data;
    }
  }

  onChange(value) {
    (this.props.data !== value) ? this.props.onChange(this.props.row, this.props.col, value) : null;
  }

  render() {
    let {row, col, rowSpan, colSpan, value, className, editing, selected, onMouseDown, onMouseOver, onDoubleClick} = this.props;

    return <td 
              className={`${className} cell ${selected ? 'selected': ''} ${this.state.updated ? 'updated': ''}`}
              onMouseDown={()=> onMouseDown(row,col)}
              onDoubleClick={()=> onDoubleClick(row,col)}
              onMouseOver={()=> onMouseOver(row,col)}
              colSpan={colSpan || 1}
              rowSpan={rowSpan || 1}
              style={this.cellStyle}  ref={(r) => {this.domObject = r}} 
            > 
              <span  style={{display: (editing && selected) ? 'none':'block'}}>{value}</span>
              <input style={{display: (editing && selected) ? 'block':'none'}} ref={(input) => this._input = input} />
    </td>   
  }
}
DataCell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
  rowSpan: PropTypes.number,
  selected: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onDoubleClick:PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  updated: PropTypes.bool
}


export default class ReactDataSheet extends Component {

  constructor(props, context) {
    super(props, context);
    this.onMouseDown   = this.onMouseDown.bind(this);
    this.onMouseUp     = this.onMouseUp.bind(this);
    this.onMouseOver   = this.onMouseOver.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.handleKey     = this.handleKey.bind(this);
    this.handleKeyUp   = this.handleKeyUp.bind(this);
    this.handleCopy    = this.handleCopy.bind(this);
    this.handlePaste   = this.handlePaste.bind(this);
    this.pageClick     = this.pageClick.bind(this);
    this.onChange      = this.onChange.bind(this);

    this.defaultState = {
      start: {}, 
      end : {}, 
      selecting: false,
      editing: {},
      cmdDown: false
    };
    this.state = this.defaultState;

    this.removeAllListeners = this.removeAllListeners.bind(this);
  }
  removeAllListeners() {
    document.removeEventListener('keydown',   this.handleKey);
    document.removeEventListener('keyup',     this.handleKeyUp);
    document.removeEventListener('mousedown', this.pageClick);
    document.removeEventListener('copy',      this.handleCopy);
    document.removeEventListener('mouseup',   this.onMouseUp);
    document.removeEventListener('paste',     this.handlePaste);
  }
  componentWillUnmount() {
    this.removeAllListeners();
  }

  pageClick(e) {
    if(!this.area.contains(e.target)) {
      this.setState(this.defaultState);
      this.removeAllListeners();
    }
  }

  handleCopy(e) {
    let cellConverter = this.props.dataRenderer ? this.props.dataRenderer : this.props.valueRenderer;
    if(!isEmpty(this.state.start)) {
      let text = range(this.state.start.i, this.state.end.i + 1).map((j) => 
        this.props.data.slice(0)[j].slice(this.state.start.j, this.state.end.j + 1)
          .map(cell=> cellConverter(cell)).join('\t')
      ).join('\n');
      e.preventDefault();
      e.clipboardData.setData('text/plain', text);
    }
  }

  handlePaste(e) {
    let pasteData = e.clipboardData.getData('text/plain').split('\n').map((row) => row.split('\t'));
    let map = new Map();
    this.props.data.map((row, i) => 
        row.map((cell,j) => 
          {
            let start = this.state.start;
            let cellData = pasteData[i - start.i] && pasteData[i - start.i][j - start.j];

            if(!cell.readOnly &&  typeof cellData !== "undefined") {
              (this.props.onPaste) ?  map.set(cell, cellData) : this.onChange(i, j, cellData)
            }
          }
        )
    );
    if(this.props.onPaste) {this.props.onPaste(map)};
    this.setState(this.defaultState);
    document.removeEventListener('paste', this.handlePaste);
  }
  
  handleKeyboardCellMovement(e) {
    let newLocation = null;
    let {start, editing} = this.state;
    let {data} = this.props;

    if(!isEmpty(this.state.editing) && e.keyCode !== TAB_KEY) {
      return false;
    }
    else if (e.keyCode === TAB_KEY) {
      newLocation = { i : start.i, j: start.j + 1}
      newLocation = data[newLocation.i][newLocation.j] ? newLocation : { i : start.i + 1, j: 0}
    }
    else if (e.keyCode === RIGHT_KEY) {
      newLocation = { i : start.i, j: start.j + 1}
    }
    else if (e.keyCode === LEFT_KEY) {
      newLocation = { i : start.i, j: start.j - 1}
    }
    else if (e.keyCode === UP_KEY) {
      newLocation = { i : start.i  - 1 , j: start.j}
    }
    else if (e.keyCode === DOWN_KEY) {
      newLocation = { i : start.i  + 1, j: start.j}
    }
    
    if(newLocation && data[newLocation.i] && data[newLocation.i][newLocation.j]) {
      this.setState({end:newLocation, start: newLocation, editing: {}});
    }
    if(newLocation) { 
      e.preventDefault(); return true;
    }
    else {
      return false;
    }
  }

  getSelectedCells(data, start, end) {
    let selected = [];
    range(start.i, end.i+1).map(i => {
      range(start.j, end.j+1).map(j => {
        selected.push({cell:data[i][j], i, j});
      })
    });
    return selected;
  }

  handleKeyUp(e) {
    if(e.keyCode == CTRL_KEY || e.keyCode == CMD_KEY) {
      this.setState({cmdDown:false});
    }
  }
  handleKey(e) {
    if(isEmpty(this.state.start) || this.state.cmdDown) { return true };
    if(e.keyCode == CTRL_KEY || e.keyCode == CMD_KEY) {
      this.setState({cmdDown:true});
      return true;
    }
    if(this.handleKeyboardCellMovement(e)) { return true };


    let {start, end} = this.state;
    let data = this.props.data;
    let isEditing = !isEmpty(this.state.editing);

    if ((e.keyCode === DELETE_KEY || e.keyCode === BACKSPACE_KEY) && !isEditing){
      //CASE when user presses delete
      console.log(this.getSelectedCells(data, start, end));
      this.getSelectedCells(data, start, end).map(({cell,i,j}) => {
        this.onChange(i,j,"");
      });
      e.preventDefault();
    }
    else if (e.keyCode === ENTER_KEY && isEditing) {
      //CASE when user is editing a field, then presses enter (validate)
      this.setState({editing: {}});
    }
    else if( (e.keyCode >= 48 && e.keyCode <= 57)  ||
             (e.keyCode >= 65 && e.keyCode <= 90)  ||
             (e.keyCode >= 96 && e.keyCode <= 105) || 
             [186,187,189, 190, 107,109, 110, ENTER_KEY].indexOf(e.keyCode) > -1) {
      
      let startCell = data[start.i][start.j];
      //empty out cell if user starts typing without pressing enter
      if(e.keyCode !== ENTER_KEY && !isEditing) this.onChange(start.i, start.j, "");
      if(startCell && !startCell.readOnly) this.setState({editing: start});
    }
  }

  onDoubleClick(i, j) {
    let cell = this.props.data[i][j];
    (!cell.readOnly) ? this.setState({editing: {i:i, j:j}}) : null;
  }
  onMouseDown(i, j) {
    let editing = (isEmpty(this.state.editing) || this.state.editing.i !== i || this.state.editing.j == j) ? {} : this.state.editing;
   
    this.setState({selecting: true, start:{i, j}, end:{i, j}, editing:editing});


    document.addEventListener('mouseup',   this.onMouseUp);
    document.addEventListener('mousedown', this.pageClick);
    document.addEventListener('copy',      this.handleCopy);
    document.addEventListener('paste',     this.handlePaste);
    document.addEventListener('keydown',   this.handleKey);
    document.addEventListener('keyup',     this.handleKeyUp);
  }

  onMouseOver(i, j) {
    (this.state.selecting && isEmpty(this.state.editing)) ? this.setState({end:{i,j}}) : null;
  }
    
  onMouseUp() {
    this.setState({selecting:false});
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  
  onChange(i,j, val) {
    let cell = this.props.data[i][j];
    this.props.onChange(cell,i,j,val); 
    this.setState({editing:{}})
  } 

  render() {
    let {keyFunction, dataRenderer, valueRenderer, className} = this.props;

    const isSelected = (i, j) => {
      let start = this.state.start;
      let end   = this.state.end;
      let pos_x = (j >= start.j && j<= end.j)
      let neg_x = (j <= start.j && j>= end.j)
      let pos_y = (i >= start.i && i <= end.i);
      let neg_y = (i <= start.i && i >= end.i);

      return  (pos_x && pos_y) || 
              (neg_x && pos_y) || 
              (neg_x && neg_y) ||
              (pos_x && neg_y);
    }

    const isEditing = (i, j) => {
      return this.state.editing.i === i && this.state.editing.j == j;
    }

    return <table ref={(r) => this.area = r} className={'data-grid ' + (className ?  className : '')}>
      <tbody>
      {this.props.data.map((row, i) => 
        <tr key={i}>
        {
          row.map((cell, j) => 
            <DataCell 
              key={cell.key ? cell.key : j} 
              className={cell.className ? cell.className : ''}
              row = {i}
              col = {j}
              onMouseDown   = {this.onMouseDown}
              onDoubleClick = {this.onDoubleClick}
              onMouseOver   = {this.onMouseOver}

              value    = {valueRenderer(cell)} 
              data     = {dataRenderer ? dataRenderer(cell) : valueRenderer(cell)}
              selected = {isSelected(i,j)} 
              editing  = {isEditing(i,j)}
              colSpan  = {cell.colSpan} 
              rowSpan  = {cell.rowSpan}
              onChange = {this.onChange}
             /> 
          )
        }
      </tr>)}
      </tbody>
    </table>
  }
}

//Each cell object can have the following:
//>readOnly  : cells can be selected/copied but cannot be edited
//>className : cells will have these className added to them, use this to override cells with your own style
//>colSpan   : Adds the colspan attribute to the cell <td> element
//>rowSpan   : Adds the rowspan attribute to the cell <td> element
ReactDataSheet.propTypes = {
  data: PropTypes.array.isRequired,           // Array of objects, number
  onChange: PropTypes.func,                   // Fn to handle any change
  valueRenderer: PropTypes.func.isRequired,   // Fn to render data from provided data celss
  dataRenderer: PropTypes.func,               // (Optional) Fn to provide data underneath visible data (like a formula) 
}


# React-Select
A simple react component to create a spreadsheet. 
https://nadbm.github.io/react-datasheet/

Current features

* Select cells, copy-paste cells
* Navigation using keyboard keys
* Deletion using keyboard keys
* Callbacks for onChange, valueRenderer(visible data)
* dataRenderer(underlying data in the input, takes the value by default)


## Installation

Install from npm: 
```javascript
$ npm install react-datasheet --save
```
Import in your project

```javascript
import Datasheet from 'react-select';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/dist/react-datasheet.css';
```

## Usage

React-Datasheet generates a table with the cells. Double-clicking or typing edits the value and if changed, initiates an onChange callback. 

The data provided should be an array of rows, and each row should include the cells.

###Basic Usage
```javascript
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ]
    }
  }
  render () {
    return (
      <ReactDataSheet 
        data={this.state.grid}
        valueRenderer={(cell) => cell.value}
        onChange={(cell, colI, rowJ, value) => 
          this.setState({
            grid: this.state.grid.map((col, i) => 
              (i !== colI)
              ? col
              : col.map((row, j) => 
                (j !== rowJ) ? row : ({value: value})
              )
            )
          }) 
        }
      />
    )
  }
}
```

###Cells with underlying data (think formulas under cells)
```javascript 

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ]
    }
  }
  render () {
    return (
      <ReactDataSheet 
        data={this.state.grid}
        valueRenderer={(cell) => cell}
        dataRenderer={}
        onChange={(cell, colI, rowJ, value) => 
          this.setState({
            grid: this.state.grid.map((col, i) => 
              (i !== colI)
              ? col
              : col.map((row, j) => 
                (j !== rowJ) ? row : ({value: value})
              )
            )
          }) 
        }
      />
    )
  }
}
```

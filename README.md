
[![Build Status](https://travis-ci.org/nadbm/react-datasheet.svg?branch=master)](https://travis-ci.org/nadbm/react-datasheet)
[![Coverage Status](https://coveralls.io/repos/github/nadbm/react-datasheet/badge.svg)](https://coveralls.io/github/nadbm/react-datasheet) 
# React-Datasheet
A simple react component to create a spreadsheet. 
Demo here: https://nadbm.github.io/react-datasheet/
Examples are located in https://github.com/nadbm/react-datasheet/tree/master/docs/src/examples


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
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
```

## Usage

React-Datasheet generates a table with the cells. Double-clicking or typing edits the value and if changed, initiates an onChange callback. 

The data provided should be an array of rows, and each row should include the cells.

### Basic Usage
```jsx
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
            grid: this.state.grid.map((col) => 
              col.map((rowCell) => 
                (rowCell == cell) ? ({value: value}) : rowCell
              )
            )
          }) 
        }
      />
    )
  }
}
```

### Cells with underlying data

There are two values that each cell shows. The first is via ```valueRenderer``` and the second is via ```dataRenderer```. When a cell is in *edit mode*, it will show the value returned from ```dataRenderer```. It needs to return a string as this value is set in an input field.

```jsx 
  const grid = [
     [{value:  5, expr: '1 + 4'}, {value:  6, expr: '6'}],
     [{value:  5, expr: '1 + 4'}, {value:  5, expr: '1 + 4'}]
  ]
  const onChange = (cell, i, j, newValue) => console.log("New expression :" + newValue)
  <ReactDataSheet 
    data={grid}
    valueRenderer={(cell) => cell.value}
    dataRenderer={(cell) => cell.expr}
    onChange={} 
  />
    )
  }
}
```

### Cells with underlying component

```jsx 
  const grid = [
     [{
      value:  5, 
        component: ( 
          <button onClick={() => console.log("clicked")}}>
            Rendered
          </button>
        )
      }]
  ]
  <ReactDataSheet 
    data={grid}
    valueRenderer={(cell) => cell.value}
  />
```
This renders a single cell with the value 5. Once in edit mode, the button will appear.

## Options

Option | Type | Description
:--- | :---: | :--- 
data | Array | Array of rows and each row should contain the cell objects to display
valueRenderer | func | Method to render the value of the cell `function(cell)`. This is visible by default
dataRenderer | func | Method to render the underlying value of the cell `function(cell)`. This data is visible once in edit mode.
onChange | func | onChange handler: `function(cell, i, j, newValue) {}`

## Cell Options

The cell object is what gets passed back to the onChange callback. They can contain the following options as well

Option | Type | Default |  Description
:--- | :--- | :--- | :--
readOnly | Bool | false | Cell will never go in edit mode
key | String | undefined | By default, each cell is given the key of col number and row number. This would override that key
className | String | undefined | Additional class names for cells. 
component | ReactElement | undefined | Insert a react element or JSX to this field. This will render on edit mode
forceComponent | bool | false | Renders whats in component at all times, even when not in edit mode
colSpan | number | 1 | The colSpan of the cell's td element
rowSpan | number | 1 | The rowSpan of the cell's td element

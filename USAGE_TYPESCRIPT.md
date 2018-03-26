### Usage with TypeScript

The library comes with built-in type definitions, so there is no need to download anything separately from `@types`. Most of the defined types accept two generic parameters. The first (which is required) allows you to define the shape of the data in your `cell` objects. The second one allows you to define the type of the `value` property that is used by custom `dataEditor` components and `onCellsChanged` callbacks (this is not required, and it defaults to `string`) Basic usage looks like this:


```tsx
import * as React from 'react';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
    value: number | null;
}

class MyReactDataSheet extends ReactDataSheet<GridElement, number> { }

interface AppState {
    grid: GridElement[][];
}

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
let cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
    const backgroundStyle = props.cell.value && props.cell.value < 0 ? {color: 'red'} : undefined;
    return (
        <td style={backgroundStyle} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver} onDoubleClick={props.onDoubleClick}  className="cell">
            {props.children}
        </td>
    )
}

export class App extends React.Component<{}, AppState> {
    constructor (props: {}) {
      super(props)
      this.state = {
        grid: [
          [{value:  1}, {value:  -3}],
          [{value:  -2}, {value:  4}]
        ]
      }
    }
    render () {
      return (
        <MyReactDataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row])
            changes.forEach(({cell, row, col, value}) => {
              grid[row][col] = {...grid[row][col], value}
            })
            this.setState({grid})
          }}
          cellRenderer={cellRenderer}
        />
      )
    }
  }
```
import _ from 'lodash';
import React from 'react';
import Datasheet from '../lib/DataSheet';

export default class BasicSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [
          { readOnly: true, value: '' },
          { value: 'A', readOnly: true },
          { value: 'B', readOnly: true },
          { value: 'C', readOnly: true },
          { value: 'D', readOnly: true },
        ],
        [
          { readOnly: true, value: 1 },
          { value: 1 },
          { value: 3 },
          { value: 3 },
          { value: 3 },
        ],
        [
          { readOnly: true, value: 2 },
          { value: 2 },
          { value: 4 },
          { value: 4 },
          { value: 4 },
        ],
        [
          { readOnly: true, value: 3 },
          { value: 1 },
          { value: 3 },
          { value: 3 },
          { value: 3 },
        ],
        [
          { readOnly: true, value: 4 },
          { value: 2 },
          { value: 4 },
          { value: 4 },
          { value: 4 },
        ],
      ],
    };
  }
  valueRenderer = cell => cell.value;
  onCellsChanged = changes => {
    const grid = this.state.grid;
    changes.forEach(({ cell, row, col, value }) => {
      grid[row][col] = { ...grid[row][col], value };
    });
    this.setState({ grid });
  };
  onContextMenu = (e, cell, i, j) =>
    cell.readOnly ? e.preventDefault() : null;

  render() {
    return (
      <Datasheet
        data={this.state.grid}
        valueRenderer={this.valueRenderer}
        onContextMenu={this.onContextMenu}
        onCellsChanged={this.onCellsChanged}
      />
    );
  }
}

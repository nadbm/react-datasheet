import React from 'react';
import _ from 'lodash';
import * as mathjs from 'mathjs';
import Datasheet from '../lib/DataSheet'

export default class MathSheet extends React.Component {
  constructor(props) {
    super(props)
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.state = {
      'A1': {key: 'A1', value: '200', expr: '200'},
      'A2': {key: 'A2', value: '200', expr: '=A1', className:'equation'},
      'A3': {key: 'A3', value: '', expr: ''},
      'A4': {key: 'A4', value: '', expr: ''},
      'B1': {key: 'B1', value: '', expr: ''},
      'B2': {key: 'B2', value: '', expr: ''},
      'B3': {key: 'B3', value: '', expr: ''},
      'B4': {key: 'B4', value: '', expr: ''},
      'C1': {key: 'C1', value: '', expr: ''},
      'C2': {key: 'C2', value: '', expr: ''},
      'C3': {key: 'C3', value: '', expr: ''},
      'C4': {key: 'C4', value: '', expr: ''},
      'D1': {key: 'D1', value: '', expr: ''},
      'D2': {key: 'D2', value: '', expr: ''},
      'D3': {key: 'D3', value: '', expr: ''},
      'D4': {key: 'D4', value: '', expr: ''}
    }
  }


  generateGrid() {
    return [0, 1,2,3,4].map((row, i) => 
      ['', 'A', 'B', 'C', 'D'].map((col, j) => {
        if(i == 0 && j == 0) {
          return {readOnly: true, value: ''}
        }
        if(row === 0) {
          return {readOnly: true, value: col}
        } 
        if(j === 0) {
          return {readOnly: true, value: row}
        }
        return this.state[col + row]
      })
    )
  }

  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if(trailKeys.indexOf(match) > -1) {
        valid = false
      } else {
        valid = this.validateExp([...trailKeys, match], this.state[match].expr)
      }
    })
    return valid
  }

  computeExpr(key, expr, scope) {
    let value = null;
    if(expr.charAt(0) !== '=') {
      return {className: '', value: expr, expr: expr};
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope)
      } catch(e) {
        value = null
      }

      if(value !== null && this.validateExp([key], expr)) {
        return {className: 'equation', value, expr}
      } else {
        return {className: 'error', value: 'error', expr: ''}
      }
    }
  }

  cellUpdate(state, changeCell, expr) {
    const scope = _.mapValues(state, (val) => isNaN(val.value) ? 0 : parseFloat(val.value))
    const updatedCell = _.assign({}, changeCell, this.computeExpr(changeCell.key, expr, scope))
    state[changeCell.key] = updatedCell

    _.each(state, (cell, key) => {
      if(cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
        state = this.cellUpdate(state, cell, cell.expr)
      }
    })
    return state
  }

  onCellsChanged(changes) {
    const state = _.assign({}, this.state)
    changes.forEach(({cell, value}) => {
      this.cellUpdate(state, cell, value)
    })
    this.setState(state)
  }

  render() {

    return (
      <Datasheet
        data={this.generateGrid()}
        valueRenderer={(cell) => cell.value}
        dataRenderer={(cell) => cell.expr}
        onCellsChanged={this.onCellsChanged}
      />
    )
  }

}

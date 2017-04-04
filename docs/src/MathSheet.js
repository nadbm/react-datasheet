import React from 'react';

export default class MathSheet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{readOnly: true, value: ''}, {value: 'A', readOnly: true}, {value: 'B', readOnly: true}, {value: 'C', readOnly: true}, {value: 'D', readOnly: true}],
        [{readOnly: true, value: 1}, {key: 'A1', value: '101', expr: '101'}, {key: 'B1', value: '202', expr: '=A2+100', className: 'equation'}, {key: 'C1', value: '', expr: ''}, {key: 'D1', value: '', expr: ''}],
        [{readOnly: true, value: 2}, {key: 'A2', value: '102', expr: '102'}, {key: 'B2', value: '', expr: ''}, {key: 'C2', value: '', expr: ''}, {key: 'D2', value: '', expr: ''}],
        [{readOnly: true, value: 3}, {key: 'A3', value: '103', expr: '103'}, {key: 'B3', value: '', expr: ''}, {key: 'C3', value: '', expr: ''}, {key: 'D3', value: '', expr: ''}],
        [{readOnly: true, value: 4}, {key: 'A4', value: '104', expr: '104'}, {key: 'B4', value: '', expr: ''}, {key: 'C4', value: '', expr: ''}, {key: 'D4', value: '', expr: ''}]
      ]
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange (cellEdit, colI, rowJ, editedValue) {
    
    const expMap = _.fromPairs(
      _.flatten(_.values(_.values(this.state.grid)))
      .filter(cell => !cell.readOnly)
      .map(cell => [cell.key, (cellEdit === cell ? editedValue : cell.expr).match(/[A-Z][1-9]+/g)])
    )

    const getScope = (grid) => _.fromPairs(
      _.flatten(_.values(_.values(grid)))
      .filter(cell => !cell.readOnly)
      .map(cell => [cell.key, cell.value])
    )

    const findLoops = (orginVars, exprMap, exprVars = []) => {
      let loop = false
      if (exprVars !== null && exprVars.length > 0) {
        exprVars.map(key => {
          if (orginVars.indexOf(key) > -1 || findLoops(orginVars.concat(key), exprMap, exprMap[key])) {
            loop = true
          }
        })
      }
      return loop
    }

    const computeCell = ({key, expr}, scope) => {
      if (expr[0] !== '=') {
        return ({key, expr, value: expr})
      } else {
        try {
          const valueExpr = expr.split('=')[1]
          const computed = mathjs.eval(valueExpr, scope)
          return ({
            key,
            expr,
            value: isNaN(computed) ? '' : computed.toString(),
            className: isNaN(expr) ? 'equation' : ''
          })
        } catch (e) {
          return ({key, className: 'error', expr, value: '⚠'})
        }
      }
    }

    const updateGrid = (grid, editKey) => {
      let updatedGrid = grid
      let loops = false
      updatedGrid = updatedGrid.map(row => row.map(cell => {
        if (findLoops([cell.key], expMap, expMap[cell.key])) {
          loops = true
          return _.assign({}, cell, {className: 'error', value: '⚠ Loops'})
        } else {
          return cell
        }
      }))

      if (loops) {
        return updatedGrid
      }
      _.each(expMap, (variables, key) => {
        if (_.find(variables, (v) => v === editKey)) {
          updatedGrid = updateGrid(updatedGrid, key)
        }
      })
      return updatedGrid.map(row => row.map(cell => {
        if (cell === cellEdit) {
          return computeCell(_.assign({}, cellEdit, {expr: editedValue}), getScope(updatedGrid))
        } else if (cell.readOnly) {
          return cell
        } else {
          return computeCell(cell, getScope(updatedGrid))
        }
      }))
    }

    this.setState({grid: updateGrid(this.state.grid, cellEdit.key)})
  }

  render () {
    return (
      <Datasheet
        data={this.state.grid}
        valueRenderer={(cell) => cell.value}
        dataRenderer={(cell) => cell.expr}
        onChange={this.onChange}
      />
    )
  }
}
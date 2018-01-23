import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import Datasheet from '../lib/DataSheet'

export default class ComponentSheet extends React.Component {
  constructor (props) {
    super(props)
    this.options = [
      { label: 'Bread', value: 2.35 },
      { label: 'Berries', value: 3.05 },
      { label: 'Milk', value: 3.99 },
      { label: 'Apples', value: 4.35 },
      { label: 'Chicken', value: 9.95 },
      { label: 'Yoghurt', value: 4.65 },
      { label: 'Onions', value: 3.45 },
      { label: 'Salad', value: 1.55 }
    ]
    this.state = {
      grocery: {},
      items: 3
    }
  }

  generateGrid () {
    const groceryValue = (id) => {
      if (this.state.grocery[id]) {
        const {label, value} = this.state.grocery[id]
        return `${label} (${value})`
      } else {
        return ''
      }
    }
    const component = (id) => {
      return (
        <Select
          autofocus
          openOnFocus
          value={this.state && this.state.grocery[id]}
          onChange={(opt) => this.setState({grocery: _.assign(this.state.grocery, {[id]: opt})})}
          options={this.options}
        />
      )
    }
    const total = _.reduce(_.values(this.state.grocery), (res, val, key) => {
      res += (val && val.value) || 0
      return res
    }, 0)
    let rows = [
      [{readOnly: true, colSpan: 2, value: 'Shopping List'}],
      [
        {readOnly: true, value: ''},
        {
          value: 'Grocery Item',
          component: (
            <div className={'add-grocery'}> Grocery List
              <div className={'add-button'} onClick={() => { console.log('add'); this.setState({items: this.state.items + 1}) }}> add item</div>
            </div>
          ),
          forceComponent: true
        }]
    ]
    rows = rows.concat(_.range(1, this.state.items + 1).map(id => [{readOnly: true, value: `Item ${id}`}, {value: groceryValue(id), component: component(id)}]))

    rows = rows.concat([[{readOnly: true, value: 'Total'}, {readOnly: true, value: `${total.toFixed(2)} $`}]])
    console.log(rows)
    return rows
  }

  render () {
    return (
      <Datasheet
        data={this.generateGrid()}
        valueRenderer={(cell) => cell.value}
        onChange={() => {}}
      />
    )
  }
}

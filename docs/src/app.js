import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import 'react-select/dist/react-select.css'
import  '../../lib/react-datasheet.css'
import {BasicSheet, MathSheet, ComponentSheet} from './examples/index';

export default class App extends React.Component {
  render () {
    return (
      <div>
        <div className={'header'}>
          <h1>React datasheet</h1>
          <h4>Simple and highly customizable excel-like spreadsheet</h4>
          <pre>npm install react-datasheet --save</pre>
        </div>
        <div className={'container'}>
          <h3 style={{color: '#e63946'}}>Basic datasheet</h3>
          <small>
            This small component allows you to integrate an excel-like datasheet. By default,
            the spreadsheet handles <b>keyboard navigation</b> and <b>copy pasting</b> of cells.
          </small>
          <div className={'sheet-container'}>
            <BasicSheet />
          </div>
          <div className={'divider'} />
          <h3 style={{color: '#e63946'}}>Formula datasheet</h3>
          <small>
            This example computes expression underneath using mathjs.
            On a invalid expression the cell changes color to show the error.
            <b> Note that react-datasheet does not handle the validation nor the formula computation</b>
          </small>
          <div className={'sheet-container'}>
            <MathSheet />
          </div>
          <div className={'divider'} />
          <h3 style={{color: '#e63946'}}>Sheet with components</h3>
          <div className={'sheet-container'}>
            <ComponentSheet />
          </div>
          <div className={'divider'} />
        </div>
        <div className={'footer-container'}>
          <div className={'footer'} >
            Check out the GitHub project at <a href=''>react-datasheet</a>
          </div>
        </div>
      </div>
    )
  }
}
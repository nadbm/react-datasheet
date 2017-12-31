import React from 'react'
import 'react-select/dist/react-select.css'
import  './lib/react-datasheet.css'
import {BasicSheet, MathSheet, ComponentSheet, CustomRendererSheet, OverrideEverythingSheet} from './examples/index';

export default class App extends React.Component {
  render () {
    return (
      <div>
        <div className={'header'}>
          <h1>React datasheet</h1>
          <h4>Simple and highly customizable excel-like spreadsheet</h4>
          <pre>npm install react-datasheet --save</pre>
          <a className={'github-link'} href="https://github.com/nadbm/react-datasheet"><span className="hidden-xs"> View on GitHub </span><span className="octicon octicon-mark-github" aria-hidden="true"></span></a>
        </div>
        <div className={'container'} >
          <div style={{float: 'right', marginTop: '-20px'}}>
            <a
              className="github-button"
              href="https://github.com/nadbm/react-datasheet"
              data-style="mega" data-count-href="/nadbm/react-datasheet/stargazers"
              data-count-api="/repos/nadbm/react-datasheet#stargazers_count"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star nadbm/react-datasheet on GitHub">
              Star
            </a>

          </div>
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
          <h3 style={{color: '#e63946'}}>Sheet with custom renderers</h3>
          <small>
            Custom renderers allow you to add significant new capabilities 
            to your sheets without requiring changes to react-datagrid itself.
            This example allows you to reorder both the columns and the rows
            using drag and drop. This is implemented by using custom components
            to render the main table (including a custom header) and each row.
            The drag handler for the rows is the gray cell at the beginning of each row.
          </small>
          <small>
            The "Rating" column also shows how to specify custom cell editing and viewing components.
          </small>
          <div className={'sheet-container'}>
            <CustomRendererSheet />
          </div>
          <div className={'divider'} />
          <h3 style={{color: '#e63946'}}>Sheet with custom structure</h3>
          <small>
            Ever wish you could <a href="https://github.com/nadbm/react-datasheet/issues/27">customize how data is displayed</a>,
            or <a href="https://github.com/nadbm/react-datasheet/pull/43">easily add custom attributes to your cells</a>, 
            or <a href="https://github.com/nadbm/react-datasheet/issues/45">add new behaviors</a> that React-DataSheet 
            doesn't currently support?
            This example demonstrates the great flexibility that custom renderers provide.
            You can completely change the sheet's structure:
            <ul>
              <li>Table - similar to the default rendering</li>
              <li>List - renders the data grid using an html unordered list</li>
              <li>Div - renders using divs</li>
            </ul>
            Although a bit contrived, it shows that you can deeply customize your sheet's markup while
            still retaining data sheet behavior. This example also adds controls for selecting rows. Note that the 
            model and controls for row selection are separate from the grid itself.
          </small>
          <div className={'sheet-container'}>
            <OverrideEverythingSheet />
          </div>
          <div className={'divider'} />
        </div>
        <div className={'footer-container'}>
          <div className={'footer'} >
            Check out the GitHub project at <a href='https://github.com/nadbm/react-datasheet'>react-datasheet</a>
          </div>
        </div>
      </div>
    )
  }
}
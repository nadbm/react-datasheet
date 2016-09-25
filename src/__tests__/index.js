import React from 'react';

import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import ReactDataSheet from '../index';
import TestUtils from 'react-addons-test-utils';
import {jsdom} from 'jsdom';


global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(global.window)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}

describe('Full DOM Rendering with object based cell', () => {
        
        let data = [];
        let rds  = null;
        let wrapper = null;

        beforeEach(()=> {
            data = [
                [{className:'test1', data:4},{className:'test2', data:2}],
                [{className:'test3', data:3},{className:'test4', data:5}]
            ];
            rds = <ReactDataSheet 
                className={'test'}
                data={data}
                valueRenderer={(cell) => cell.data}
                keyFunction={(cell)=> cell}
                onChange={(cell, i, j, value)=> data[i][j] = value} />

            wrapper = mount(rds);
        });

        afterEach(()=> {
            wrapper.unmount();
        });

        it('renders the proper elements', () => {

            expect(wrapper.find('table')).to.have.length(1);
            expect(_.values(wrapper.find('table').node.classList)).to.deep.equal(['data-grid', 'test'])
            expect(wrapper.find('td > span')).to.have.length(4);
            expect(wrapper.find('td > span').nodes.map(n => n.innerHTML)).to.deep.equal(['4','2','3','5']);
        })

        it('sets the proper classes for the cells', () => {
            expect(wrapper.find('td').nodes.map(n => _.values(n.classList).sort()))
              .to.deep.equal([['cell','test1'], ['cell','test2'],['cell','test3'],['cell','test4']]);
        });

        it('selects a single field properly', () => {
            expect(wrapper.find('td.cell.selected')).to.have.length(0);
            TestUtils.Simulate.mouseDown(wrapper.find('td').nodes[1]);
            TestUtils.Simulate.mouseUp(wrapper.find('td').nodes[1]);
            expect(wrapper.find('td.cell.selected')).to.have.length(1);
            expect(wrapper.find('td.cell.selected span').nodes[0].innerHTML).to.equal('2');
        });


        it('selects multiple field properly 2x2 (hold left click)', () => {
            expect(wrapper.find('td.cell.selected')).to.have.length(0);
            TestUtils.Simulate.mouseDown(wrapper.find('td').nodes[0]);
            TestUtils.Simulate.mouseOver(wrapper.find('td').nodes[3]);
            expect(wrapper.find('td.cell.selected')).to.have.length(4);
            expect(wrapper.find('td.cell.selected span').nodes.map(n => n.innerHTML)).to.deep.equal(['4','2','3','5']);

            expect(wrapper.state('selecting')).to.equal(true);
            expect(wrapper.state('editing')).to.deep.equal({});
            expect(wrapper.state('start')).to.deep.equal({i:0,j:0});
            expect(wrapper.state('end')).to.deep.equal({i:1,j:1});
        });

        it('selects multiple field properly 2x2 and stay selected after releasing mouse button', () => {
            let component = TestUtils.renderIntoDocument(rds); //document event, needs to be actually mounted
            let mouseUpEvt = document.createEvent("HTMLEvents");
                mouseUpEvt.initEvent("mouseup", false, true);

            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'selected')).to.have.length(0);
            let cells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
            expect(cells).to.have.length(4);
            TestUtils.Simulate.mouseDown(cells[0]);
            TestUtils.Simulate.mouseOver(cells[3]);

            document.dispatchEvent(mouseUpEvt);

            expect(component.state).to.deep.equal({
              start: {i:0,j:0}, 
              end : {i:1,j:1}, 
              selecting: false,
              editing: {}
            });
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'selected')).to.have.length(4);
        });


        it('copies the data propery', () => {
            let component = TestUtils.renderIntoDocument(rds);
            let cells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
            expect(cells).to.have.length(4);
            TestUtils.Simulate.mouseDown(cells[0]);
            TestUtils.Simulate.mouseOver(cells[3]);

            let pasted = "";
            let evt = document.createEvent("HTMLEvents");
                evt.initEvent("copy", false, true);
                evt.clipboardData = { setData: (type, text)=> { pasted = text}};
            document.dispatchEvent(evt);
            

            expect(pasted).to.equal("4\t2\n3\t5");
        });
});


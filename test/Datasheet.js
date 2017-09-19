import React from 'react';

import {
  shallow,
  mount,
  render
} from 'enzyme';
import sinon from 'sinon';
import expect from 'expect'
import _ from 'lodash';
import DataSheet from '../src/DataSheet';
import ComponentCell from '../src/ComponentCell';
import DataCell from '../src/DataCell';
import jsdom from 'mocha-jsdom';

const TAB_KEY = 9;
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const RIGHT_KEY = 39;
const LEFT_KEY = 37;
const UP_KEY = 38;
const DOWN_KEY = 40;
const DELETE_KEY = 46;

const dispatchKeyDownEvent = (key, shift=false) => {
  const e = document.createEvent('KeyboardEvent');
  Object.defineProperty(e, 'keyCode', {
    get: () => key
  });
  Object.defineProperty(e, 'shiftKey', {
    get: () => shift
  });
  e.initEvent("keydown", true, true);
  document.dispatchEvent(e);
}

const triggerMouseEvent = (node, eventType) => {
  const clickEvent = document.createEvent ('MouseEvents');
  clickEvent.initEvent (eventType, true, true);
  node.dispatchEvent (clickEvent);
}


describe('Component', () => {

  describe('DataCell component', () => {
    describe('rendering', () => {
      it('should properly render', () => {
        const onMouseDown = sinon.spy();
        const onMouseOver = sinon.spy();
        const onDoubleClick = sinon.spy();
        const onContextMenu = sinon.spy();
        const wrapper = shallow(
          <DataCell
            row={2}
            col={3}
            rowSpan={4}
            colSpan={5}
            value={5}
            width={'200px'}
            className={'test'}
            editing={false}
            selected={false}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
            onMouseOver={onMouseOver}
            onContextMenu={onContextMenu}
          />
        );

        expect(wrapper.html()).toEqual(
          shallow(<td className='test cell' colSpan={5} rowSpan={4} style={{ width: '200px' }}>
            <span style={{display:'block'}}>5</span>
            <input style={{display:'none'}}/>
          </td>).html())

        wrapper.simulate('mousedown');
        wrapper.simulate('doubleclick');
        wrapper.simulate('mouseover');
        wrapper.simulate('contextmenu');

        expect(onDoubleClick.calledWith(2, 3)).toEqual(true);
        expect(onMouseDown.calledWith(2, 3)).toEqual(true);
        expect(onMouseOver.calledWith(2, 3)).toEqual(true);
        const args = onContextMenu.getCall(0).args;
        expect(args[1]).toEqual(2);
        expect(args[2]).toEqual(3);
        wrapper.unmount();
      })

      it('should properly all update functions and render reading mode to editing mode ', () => {
        const props = {
          editing: false,
          selected: false,
          value: 5,
          data: 5,
          row: 1,
          col: 1,
          onMouseDown: () => {},
          onMouseOver: () => {},
          onDoubleClick: () => {},
          onContextMenu: () => {},
        }
        const wrapper = shallow(
          <DataCell
            {...props}
          />
        );
        expect(wrapper.html()).toEqual(
          shallow(<td className='cell' colSpan={1} rowSpan={1}>
            <span style={{display:'block'}}>5</span>
            <input style={{display:'none'}}/>
          </td>).html())

        wrapper.setProps({ editing: true, selected: true })

        expect(wrapper.html()).toEqual(
          shallow(<td className='cell selected editing' colSpan={1} rowSpan={1}>
            <span style={{display:'none'}}>5</span>
            <input style={{display:'block'}}/>
          </td>).html())
      })

      it('should properly render a flash when value changes', () => {
        const props = {
          editing: false,
          selected: false,
          value: 5,
          data: 5,
          row: 1,
          col: 1,
          onMouseDown: () => {},
          onMouseOver: () => {},
          onDoubleClick: () => {},
          onContextMenu: () => {},
        }
        const wrapper = shallow(
          <DataCell
            {...props}
          />
        );
        wrapper.setProps({ value: 6 });
        expect(wrapper.html()).toEqual(
          shallow(<td className='cell updated' colSpan={1} rowSpan={1}>
            <span style={{display:'block'}}>6</span>
            <input style={{display:'none'}}/>
          </td>).html());
      })
    })

    describe('editing', () => {
      let onChange = null;
      let props = null;
      let wrapper = null;
      jsdom();
      beforeEach(() => {
        wrapper && wrapper.detach();
        props = {
          editing: false,
          reverting: false,
          selected: false,
          value: '2',
          data: '5',
          row: 1,
          col: 2,
          onChange: sinon.spy(),
          onMouseDown: () => {},
          onDoubleClick: () => {},
          onMouseOver: () => {},
          onContextMenu: () => {},
        }
        document.body.innerHTML = '<table><tbody><tr id="root"></tr></tbody></table>'
        wrapper = mount(<DataCell {...props} />, {attachTo: document.getElementById('root')});
      });

      it('should not call onChange if value is the same', () => {
        wrapper.setProps({ editing: true, selected: true });
        expect(wrapper.find('input').node.value).toEqual('5');
        wrapper.find('input').node.value = '5';
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true });
        expect(props.onChange.called).toEqual(false)
      });

      it('should properly call onChange', () => {
        wrapper.setProps({ editing: true, selected: true });
        wrapper.find('input').node.value = '6';
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true });
        expect(props.onChange.called).toEqual(true);
        expect(props.onChange.calledWith(props.row, props.col, '6')).toEqual(true);
      })

      it('input value should be cleared if we go into editing with clear call', () => {
        wrapper.setProps({ editing: true, selected: true, clear: true});
        expect(wrapper.find('input').node.value).toEqual('');
      })
      it('input value should be set to value if data is null', () => {
        wrapper.setProps({ data: null});
        wrapper.setProps({ editing: true, selected: true});
        expect(wrapper.find('input').node.value).toEqual('2');

        wrapper.find('input').node.value = '2';
        console.log(wrapper.props)
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true });
        expect(props.onChange.called).toEqual(false)

      })
    })

  })

  describe('ComponentCell component', () => {
    describe('rendering', () => {
      it('should properly render', () => {
        const onMouseDown = sinon.spy();
        const onMouseOver = sinon.spy();
        const onDoubleClick = sinon.spy();
        const onContextMenu = sinon.spy();
        const wrapper = shallow(
          <ComponentCell
            row={2}
            col={3}
            readOnly={false}
            forceComponent={true}
            rowSpan={4}
            colSpan={5}
            value={5}
            width={'200px'}
            className={'test'}
            editing={false}
            selected={false}
            component={<div>HELLO</div>}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
            onMouseOver={onMouseOver}
            onContextMenu={onContextMenu}
          />
        );

        expect(wrapper.html()).toEqual(
          shallow(<td className='test cell' colSpan={5} rowSpan={4} style={{width: '200px'}}>
            <div>HELLO</div>
          </td>).html())
        wrapper.setProps({forceComponent: false})
        expect(wrapper.html()).toEqual(
          shallow(<td className='test cell' colSpan={5} rowSpan={4} style={{width: '200px'}}>
            5
          </td>).html())
        wrapper.setProps({value: 7})
        expect(wrapper.html()).toEqual(
          shallow(<td className='test cell updated' colSpan={5} rowSpan={4} style={{width: '200px'}}>
            7
          </td>).html())
        wrapper.simulate('mousedown');
        wrapper.simulate('doubleclick');
        wrapper.simulate('mouseover');
        wrapper.simulate('contextmenu');

        expect(onDoubleClick.calledWith(2, 3)).toEqual(true);
        expect(onMouseDown.calledWith(2, 3)).toEqual(true);
        expect(onMouseOver.calledWith(2, 3)).toEqual(true);
        const args = onContextMenu.getCall(0).args;
        expect(args[1]).toEqual(2);
        expect(args[2]).toEqual(3);
        wrapper.unmount();

      })
    })
    describe('rendering', () => {
      it('should properly render a change (flashing)', (done) => {
        const wrapper = shallow(
          <ComponentCell
            row={2}
            col={3}
            readOnly={false}
            forceComponent={true}
            value={5}
            className={'test'}
            editing={false}
            selected={false}
            component={<div>HELLO</div>}
            onMouseDown={()=>{}}
            onDoubleClick={()=>{}}
            onMouseOver={()=>{}}
            onContextMenu={()=>{}}
          />
        );
        wrapper.setProps({value: 7})
        expect(wrapper.html()).toEqual(
          shallow(<td className='test cell updated' colSpan={1} rowSpan={1}>
            <div>HELLO</div>
          </td>).html())

        setTimeout(() => {
          try {
            expect(wrapper.html()).toEqual(
              shallow(<td className='test cell' colSpan={1} rowSpan={1}>
                <div>HELLO</div>
              </td>).html())
            done();
          } catch(e) {
            done(e)
          }
        }, 750)
      })
    })
  })

  describe('Shallow DataSheet component', () => {
    describe('event listeners', () => {
      const savedDoc = global.doc;
      after(() => {
        global.document = savedDoc;
      })
      it('should remove all event listeners from document', () => {
        const addEvent = sinon.spy();
        const removeEvent = sinon.spy();
        global.document = { addEventListener: addEvent, removeEventListener: removeEvent};

        const component = shallow(<DataSheet
          keyFn = {(i) => 'custom_key_' + i}
          className = {'test'}
          data = {[[{data: 1}]]}
          valueRenderer = {(cell) => cell.data}
        />)
        component.unmount();
        expect(removeEvent.callCount).toEqual(5);
      })
    })
  })

  describe('DataSheet component', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let customWrapper = null;
    jsdom();

    beforeEach(() => {
      data = [
        [{
          className: 'test1',
          data: 4,
          overflow: 'clip'
        }, {
          className: 'test2',
          data: 2,
          key: 'custom_key'
        }],
        [{
          className: 'test3',
          data: 3,
          width: '25%'
        }, {
          className: 'test4',
          data: 5,
          width: 100
        }]
      ];
      component = <DataSheet
        keyFn = {(i) => 'custom_key_' + i}
        className = {'test'}
        overflow = 'nowrap'
        data = {data}
        valueRenderer = {(cell) => cell.data}
        onChange = {(cell, i, j, value) => data[i][j].data = value}
      />
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
      if(customWrapper) {
        customWrapper.instance().removeAllListeners();
        customWrapper = null;
      }
    })
    describe("rendering with varying props", () => {
      it('renders the proper elements', () => {
        expect(wrapper.find('table').length).toEqual(1);
        expect(_.values(wrapper.find('table').node.classList)).toEqual(['data-grid', 'test', 'nowrap'])

        expect(wrapper.find('td > span').length).toEqual(4);
        expect(wrapper.find('td > span').nodes.map(n => n.innerHTML)).toEqual(['4', '2', '3', '5']);
      })

       it('renders the proper keys', () => {
        expect(wrapper.find('table tr').at(0).key()).toEqual('custom_key_0');
        expect(wrapper.find('table tr').at(1).key()).toEqual('custom_key_1');
        expect(wrapper.find(DataCell).at(1).key()).toEqual('custom_key');
      })

      it('sets the proper classes for the cells', () => {
        expect(wrapper.find('td').nodes.map(n => _.values(n.classList).sort()))
          .toEqual([
            ['cell', 'clip', 'test1'],
            ['cell', 'test2'],
            ['cell', 'test3'],
            ['cell', 'test4']
          ]);
      });
      it('renders the data in the input properly if dataRenderer is set', () => {
        customWrapper = mount(<DataSheet
          data = {data}
          dataRenderer = {(cell) => '=+' + cell.data}
          valueRenderer = {(cell) => cell.data}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td.cell input').nodes[0].value).toEqual('=+4');
      });

      it('renders proper elements by column', () => {
        const withDates = data.map((row, index) => [{data: new Date('2017-0' + (index + 1) + '-01')}, ...row]);
        customWrapper = mount(<DataSheet
          data = {withDates}
          valueRenderer = {(cell, i, j) => j === 0 ? cell.data.toGMTString() : cell.data}
          dataRenderer = {(cell, i, j) => j === 0 ? cell.data.toISOString() : cell.data}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        //expect(wrapper.find('td > span').length).toEqual(6);
        expect(customWrapper.find('td > span').nodes.map(n => n.innerHTML)).toEqual(['Sun, 01 Jan 2017 00:00:00 GMT', '4', '2', 'Wed, 01 Feb 2017 00:00:00 GMT', '3', '5']);
      });

      it('renders data in the input properly if dataRenderer is set by column', () => {
        const withDates = data.map((row, index) => [{data: new Date('2017-0' + (index + 1) + '-01')}, ...row]);
        customWrapper = mount(<DataSheet
          data = {withDates}
          valueRenderer = {(cell, i, j) => j === 0 ? cell.data.toGMTString() : cell.data}
          dataRenderer = {(cell, i, j) => j === 0 ? cell.data.toISOString() : cell.data}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td.cell input').nodes[0].value).toEqual('2017-01-01T00:00:00.000Z');
      });

      it('renders a component properly', () => {
        customWrapper = mount(<DataSheet
          data = {[[{component: <div className={'custom-component'}>COMPONENT RENDERED</div>}]]}
          valueRenderer = {(cell) => "VALUE RENDERED"}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        expect(customWrapper.find('td').text()).toEqual('VALUE RENDERED');
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
      });

       it('forces a component rendering', () => {
        customWrapper = mount(<DataSheet
          data = {[[{forceComponent: true, component: <div className={'custom-component'}>COMPONENT RENDERED</div>}]]}
          valueRenderer = {(cell) => "VALUE RENDERED"}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
        customWrapper.find('td').first().simulate('mousedown');
        customWrapper.find('td').first().simulate('mouseover');
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.state('start')).toEqual({i:0, j:0})
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
      });

      it('renders a cell with readOnly field properly', () => {
        customWrapper = mount(<DataSheet
          data = {[[{data: 12, readOnly: true}, {data: 24, readOnly: false}]]}
          valueRenderer = {(cell) => cell.data}
          dataRenderer = {(cell) => '=+' + cell.data}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        expect(customWrapper.find('td.cell').at(0).text()).toEqual(12);
        expect(customWrapper.find('td.cell').at(1).text()).toEqual(24);
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(0).simulate('doubleClick');
        customWrapper.find('td').at(1).simulate('mouseDown');
        customWrapper.find('td').at(1).simulate('doubleClick');

        expect(customWrapper.find('td.cell').at(0).text()).toEqual(12);
        expect(customWrapper.find('td.cell').at(1).text()).toEqual(24);

        expect(customWrapper.find('td.cell input').at(0).html()).toEqual('<input style="display: none;">');
        expect(customWrapper.find('td.cell input').at(1).html()).toEqual('<input style="display: block;">');
      });

      it('renders a cell with disabled events', () => {
        customWrapper = mount(<DataSheet
          data = {[[{data: 12, disableEvents: true}, {data: 24, disableEvents: true}]]}
          valueRenderer = {(cell) => cell.data}
          onChange = {(cell, i, j, value) => data[i][j].data = value}
        />);
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(0).simulate('doubleClick');
        expect(customWrapper.state()).toEqual({
          start: {},
          end: {},
          selecting: false,
          editing: {},
          reverting: {},
          forceEdit: false,
          clear: {}
        })
      });
    });

    describe("selection", () => {
      it('selects a single field properly', () => {

        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        wrapper.find('td').at(1).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseUp');
        expect(wrapper.find('td.cell.selected').length).toEqual(1);
        expect(wrapper.find('td.cell.selected span').nodes[0].innerHTML).toEqual('2');
      });


      it('selects multiple field properly 2x2 (hold left click)', () => {
        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(3).simulate('mouseOver');
        expect(wrapper.find('td.cell.selected').length).toEqual(4);
        expect(wrapper.find('td.cell.selected span').nodes.map(n => n.innerHTML)).toEqual(['4', '2', '3', '5']);

        expect(wrapper.state('selecting')).toEqual(true);
        expect(wrapper.state('editing')).toEqual({});
        expect(wrapper.state('start')).toEqual({
          i: 0,
          j: 0
        });
        expect(wrapper.state('end')).toEqual({
          i: 1,
          j: 1
        });
      });

      it('selects multiple field properly 2x2 and stay selected after releasing mouse button', () => {
        let mouseUpEvt = document.createEvent("HTMLEvents");
        mouseUpEvt.initEvent("mouseup", false, true);

        expect(wrapper.find('.selected').length).toEqual(0);
        expect(wrapper.find('td.cell').length).toEqual(4);
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(3).simulate('mouseOver');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
        expect(wrapper.state('end')).toEqual({ i: 1, j: 1 });
        expect(wrapper.state('selecting')).toEqual(true);
        document.dispatchEvent(mouseUpEvt);
        expect(wrapper.state('selecting')).toEqual(false);
      });

      it('calls onSelect prop when a new element is selected', (done) => {
        customWrapper = mount(
            <DataSheet
              data = {data}
              onSelect =
                  /* eslint-disable keyword-spacing */
              {(cell) => {
                try {
                  expect(cell).toEqual({data: 4, className: 'test1', overflow: 'clip'});
                  done();
                }
                catch(err) {
                  done(err)
                }
              }}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => custData[i][j].data = value}
            />);
        customWrapper.find('td').at(0).simulate('mouseDown');
        expect(customWrapper.state('end')).toEqual({i: 0, j: 0});
      });
    });


    describe("keyboard movement", () => {
      it('moves right with arrow keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 0, j: 0});
        dispatchKeyDownEvent(RIGHT_KEY);
        expect(wrapper.state('start')).toEqual({i: 0, j: 1});
      })
      it('moves left with arrow keys', () => {
        wrapper.find('td').at(1).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 0, j: 1});
        dispatchKeyDownEvent(LEFT_KEY);
        expect(wrapper.state('start')).toEqual({i: 0, j: 0});
      })
      it('moves up with arrow keys', () => {
        wrapper.find('td').at(3).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 1, j: 1});
        dispatchKeyDownEvent(UP_KEY);
        expect(wrapper.state('start')).toEqual({i: 0, j: 1});
      })
      it('moves down with arrow keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 0, j: 0});
        dispatchKeyDownEvent(DOWN_KEY);
        expect(wrapper.state('start')).toEqual({i: 1, j: 0});
      })
      it('moves to next row if there is no right cell', () => {
        wrapper.find('td').at(1).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 0, j: 1});
        dispatchKeyDownEvent(TAB_KEY);
        expect(wrapper.state('start')).toEqual({i: 1, j: 0});
      })

      it('tab and shift tab keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({i: 0, j: 0});
        dispatchKeyDownEvent(TAB_KEY, false); //shift tab
        expect(wrapper.state('start')).toEqual({i: 0, j: 1});
        dispatchKeyDownEvent(TAB_KEY, true); //shift tab
        expect(wrapper.state('start')).toEqual({i: 0, j: 0});
      })
    })

    describe("editing", () => {
      let cells = null;
      beforeEach(() => {
        cells = wrapper.find('td');
      })

      it('starts editing when double clicked', () => {
        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        cells.at(3).simulate('doubleClick');
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1
        });
        expect(wrapper.state('forceEdit')).toEqual(true);

        cells.at(3).simulate('mousedown'); // mousedown should not affect edit mode
        cells.at(2).simulate('mouseover'); // mouseover should not affect edit mode
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1
        });
      });

      it('starts editing when double clicked', () => {
        cells.at(3).simulate('mousedown');
        dispatchKeyDownEvent(ENTER_KEY);
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1
        });
        expect(wrapper.state('forceEdit')).toEqual(true);

        cells.at(3).simulate('mousedown'); // mousedown should not affect edit mode
        cells.at(2).simulate('mouseover'); // mouseover should not affect edit mode
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1
        });
        expect(wrapper.state('clear')).toEqual({});
      });

      it('starts editing certain keys are pressed', () => {
      //[0  , 9 ,a , z , 0 , 9  , +  , = , decim]
        [48, 57, 65, 90, 96, 105, 107, 187, 189].map(charCode => {
          cells.at(0).simulate('mousedown');
          dispatchKeyDownEvent(charCode);
          expect(wrapper.state('editing')).toEqual({i: 0, j: 0});
          cells.at(1).simulate('mousedown');
          expect(wrapper.state('editing')).toEqual({});
        });
      });

      it('does not start editing if cell is readOnly', () => {
        wrapper.setProps({data: [[{data: 1, readOnly: true},{data: 2, readOnly: true}]]});
      //[0  , 9 ,a , z , 0 , 9  , +  , = , decim]
        [48, 57, 65, 90, 96, 105, 107, 187, 189].map(charCode => {
          cells.at(0).simulate('mousedown');
          dispatchKeyDownEvent(charCode);
          expect(wrapper.state('editing')).toEqual({});
          cells.at(1).simulate('mousedown');
          expect(wrapper.state('editing')).toEqual({});
        });
      });

      it('goes out of edit mode when another cell is clicked', () => {
        cells.at(0).simulate('mouseDown');
        dispatchKeyDownEvent('1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        cells.at(1).simulate('mouseDown');
        expect(data[0][0].data).toEqual(213)
        expect(wrapper.state('editing')).toEqual({})
      });

      it('goes out of edit mode when ENTER is clicked', () => {
        cells.at(0).simulate('mouseDown');
        dispatchKeyDownEvent('1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        dispatchKeyDownEvent(ENTER_KEY);
        expect(data[0][0].data).toEqual(213)
        expect(wrapper.state('editing')).toEqual({})
      });

      it('goes out of edit mode and reverts to original value when ESCAPE is pressed', () => {
        cells.at(0).simulate('mouseDown');
        dispatchKeyDownEvent('1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        dispatchKeyDownEvent(ESCAPE_KEY);
        expect(data[0][0].data).toEqual(4);
        expect(wrapper.state('editing')).toEqual({});
        expect(wrapper.state('reverting')).toEqual({ i: 0, j: 0 });
      });

      it('updates value properly after double clicking', () => {
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        cells.at(0).simulate('doubleClick');

        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: { i: 0, j: 0 },
          reverting: {},
          forceEdit: true,
          clear: {}
        });

        cells.at(0).find('input').node.value = 213;
        cells.at(0).find('input').simulate('change');
        dispatchKeyDownEvent(RIGHT_KEY);
        expect(data[0][0].data).toEqual(4)
        dispatchKeyDownEvent(TAB_KEY);
        expect(data[0][0].data).toEqual(213)
      });

      it('moves to the next cell on left/right arrow if editing wasn\'t started via double click or pressing enter', () => {
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        dispatchKeyDownEvent('1'.charCodeAt(0));
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: { i: 0, j: 0 },
          reverting: {},
          forceEdit: false,
          clear: { i: 0, j: 0 }
        });
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change')

        expect(data[0][0].data).toEqual(4)
        dispatchKeyDownEvent(RIGHT_KEY);
        expect(data[0][0].data).toEqual(213)
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 1 }, //RIGHT_KEY movement
          end: { i: 0, j: 1 }, //RIGHT_KEY movement
          selecting: true,
          editing: {},
          reverting: {},
          forceEdit: false,
          clear: { i: 0, j: 0 }
        });
      });


      it('doesn\'t moves to the next cell on left/right arrow if cell is a component', () => {
        data[0][0].component = <div>HELLO</div>
        wrapper.setProps({data: data});
        expect(wrapper.exists(<div>HELLO</div>)).toEqual(true);
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        dispatchKeyDownEvent('1'.charCodeAt(0));
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: { i: 0, j: 0 },
          reverting: {},
          forceEdit: false,
          clear: { i: 0, j: 0 }
        });
        dispatchKeyDownEvent(RIGHT_KEY);
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 }, //RIGHT_KEY movement
          end: { i: 0, j: 0 }, //RIGHT_KEY movement
          selecting: true,
          editing: { i: 0, j: 0 },
          reverting: {},
          forceEdit: false,
          clear: { i: 0, j: 0 }
        });
      });

      it('copies the data properly', () => {
        let copied = "";
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text)=> { copied = text}};

        cells.at(0).simulate('mouseDown');
        cells.at(3).simulate('mouseOver');
        document.dispatchEvent(evt);
        expect(copied).toEqual("4\t2\n3\t5");

      });

      it('copies the data from dataRenderer if it exists', () => {
        let copied = "";
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text)=> { copied = text}};
        customWrapper = mount(
          <DataSheet
            data = {data}
            valueRenderer = {(cell, i, j) => cell.data}
            dataRenderer = {(cell, i, j) => "{" + i + "," + j + "}" + cell.data}
            onChange = {(cell, i, j, value) => data[i][j].data = value}
          />
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(3).simulate('mouseOver');

        document.dispatchEvent(evt);
        expect(copied).toEqual("{0,0}4\t{0,1}2\n{1,0}3\t{1,1}5");
      })

      it('copies no data if there isn\'t anything selected', () => {
        let pasted = "";
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text)=> { pasted = text}};

        expect(wrapper.state('start')).toEqual({});
        document.dispatchEvent(evt);
        expect(pasted).toEqual("");
      });

      it('does not paste data if no cell is selected', () => {
          const evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '99\t100\n1001\t1002'};
          document.dispatchEvent(evt);
          expect(data[0].map(d => d.data)).toEqual([4, 2]);
          expect(data[1].map(d => d.data)).toEqual([3, 5]);
      });
      it('pastes data properly', () => {
          cells.at(0).simulate('mouseDown');
          expect(wrapper.state('end')).toEqual({i: 0, j: 0});

          const evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '99\t100\n1001\t1002'};
          document.dispatchEvent(evt);

          expect(data[0].map(d => d.data)).toEqual(['99', '100']);
          expect(data[1].map(d => d.data)).toEqual(['1001', '1002']);
          expect(wrapper.state('end')).toEqual({i: 1, j: 1});

      });

      it('pastes data properly on a different cell', () => {
          const datacust = [[{data: 12, readOnly: true}, {data: 24, readOnly: false}]];
          customWrapper = mount(
            <DataSheet
              data = {datacust}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => datacust[i][j].data = value}
            />
          );
          customWrapper.find('td').at(1).simulate('mouseDown');

          let evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '99\t100\n1001\t1002'};
          document.dispatchEvent(evt);

          expect(datacust[0].map(d => d.data)).toEqual([12, '99'])
      });

      it('pastes multiple rows correclty on windows', () => {
          const datacust = [[{data: 12, readOnly: true}, {data: 24, readOnly: false}],[{data: 1012, readOnly: true}, {data: 1024, readOnly: false}]];
          customWrapper = mount(
            <DataSheet
              data = {datacust}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => datacust[i][j].data = value}
            />
          );
          customWrapper.find('td').at(1).simulate('mouseDown');

          let evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '99\t100\r\n1001\t1002'};
          document.dispatchEvent(evt);

          expect(datacust[1].map(d => d.data)).toEqual([1012, '1001'])
      });

      it('doesnt auto paste data if cell is editing', () => {
          const datacust = [[{data: 12, readOnly: false}, {data: 24, readOnly: false}]];
          customWrapper = mount(
            <DataSheet
              data = {datacust}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => {datacust[i][j].data = value}}
            />
          );
          customWrapper.find('td').at(1).simulate('doubleclick');

          let evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '100'};

          expect(datacust[0].map(d => d.data)).toEqual([12, 24])
      });

      it('pastes data properly and fires onPaste function if defined', (done) => {
          const datacust = [[{data: 12, readOnly: true}, {data: 24, readOnly: false}]];
          customWrapper = mount(
            <DataSheet
              data = {datacust}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => datacust[i][j].data = value}
              onPaste =
                  /* eslint-disable keyword-spacing */
              {(pasted) => {
                try {
                  expect(pasted).toEqual([
                    [
                      {cell: datacust[0][0], data: '99'},
                      {cell: datacust[0][1], data: '100'}
                    ],
                    [
                      {cell: undefined, data: '1001'},
                      {cell: undefined, data: '1002'},
                    ]
                  ]);
                  done();
                }
                catch(err) {
                  done(err);
                }

              }}
            />
          );
          customWrapper.find('td').at(0).simulate('mouseDown');
          let evt = document.createEvent("HTMLEvents");
          evt.initEvent("paste", false, true);
          evt.clipboardData = { getData: (type)=> '99\t100\n1001\t1002'};
          document.dispatchEvent(evt);
      });



      it('stops editing on outside page click', () => {
        const cell = wrapper.find('td').first();
        cell.simulate('mouseDown');
        cell.simulate('doubleClick');
        triggerMouseEvent(document, 'mousedown');

        expect(wrapper.state()).toEqual({
          start: {},
          end: {},
          selecting: false,
          editing: {},
          reverting: {},
          forceEdit: false,
          clear: {}
        });
      });

      it('pageClick does not execute if the mouse click is within', () => {
        const cell = wrapper.find('td').first();
        cell.simulate('mousedown');
        cell.simulate('mouseup');

        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("mousedown", false, true);
        Object.defineProperty(evt, 'target', {value: cell.getDOMNode()});
        document.dispatchEvent(evt);

        expect(wrapper.state()).toEqual({
          start: {i: 0, j: 0},
          end: {i: 0, j: 0},
          selecting: true,
          editing: {},
          reverting: {},
          forceEdit: false,
          clear: {}
        });
      })
      it('delete on DELETE_KEY', () => {
        const cell = wrapper.find('td').first();
        data[0][1] = Object.assign(data[0][1], {readOnly: true});

        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseOver');

        expect(data[0][0].data).toEqual(4)
        expect(data[0][1].data).toEqual(2)
        dispatchKeyDownEvent(DELETE_KEY);
        expect(data[0][0].data).toEqual('')
        expect(data[0][1].data).toEqual(2)
      });
    })

    describe("contextmenu", () => {
      let cells = null;
      beforeEach(() => {
        cells = wrapper.find('td');
      })

      it('starts calls contextmenu with right object', (done) => {
          const datacust = [[{data: 12, readOnly: true}, {data: 24, readOnly: false}]];
          customWrapper = mount(
            <DataSheet
              data = {datacust}
              valueRenderer = {(cell) => cell.data}
              onChange = {(cell, i, j, value) => datacust[i][j].data = value}
              onContextMenu = {(e, cell, i, j) => {
                try {
                  expect(cell).toEqual({data: 12, readOnly: true});
                  done();
                }
                catch(err) {
                  done(err);
                }

              }}
            />
          );
          customWrapper.find('td').at(0).simulate('contextmenu');
      });


    });
  })
})

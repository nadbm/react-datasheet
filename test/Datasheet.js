import React from 'react';

import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import expect from 'expect';
import _ from 'lodash';
import DataSheet from '../src/DataSheet';
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

const triggerKeyDownEvent = (wrapper, keyCode, options = {}) => {
  wrapper.simulate('keydown', { keyCode, ...options });
};

const triggerEvent = (node, keyCode) => {
  node.dispatchEvent(new Event('focus'));
  node.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
};

const triggerMouseEvent = (node, eventType) => {
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

describe('Component', () => {
  describe('DataCell with DataEditor', () => {
    describe('rendering', () => {
      it('should properly render', () => {
        const onMouseDown = sinon.spy();
        const onMouseOver = sinon.spy();
        const onDoubleClick = sinon.spy();
        const onContextMenu = sinon.spy();
        const onChange = sinon.spy();
        const wrapper = shallow(
          <DataCell
            row={2}
            col={3}
            cell={{
              rowSpan: 4,
              colSpan: 5,
              value: 5,
              width: '200px',
              className: 'test',
            }}
            editing={false}
            selected={false}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
            onMouseOver={onMouseOver}
            onContextMenu={onContextMenu}
            onChange={onChange}
            valueRenderer={cell => cell.value}
          />,
        );

        expect(wrapper.html()).toEqual(
          shallow(
            <td
              className="test cell"
              colSpan={5}
              rowSpan={4}
              style={{ width: '200px' }}
            >
              <span className="value-viewer">5</span>
            </td>,
          ).html(),
        );

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
      });

      it('should properly all update functions and render reading mode to editing mode ', () => {
        const props = {
          editing: false,
          selected: false,
          cell: {
            value: 5,
            data: 5,
          },
          row: 1,
          col: 1,
          onMouseDown: () => {},
          onMouseOver: () => {},
          onDoubleClick: () => {},
          onContextMenu: () => {},
          onChange: () => {},
          valueRenderer: cell => cell.value,
        };
        const wrapper = shallow(<DataCell {...props} />);
        expect(wrapper.html()).toEqual(
          shallow(
            <td className="cell">
              <span className="value-viewer">5</span>
            </td>,
          ).html(),
        );

        wrapper.setProps({ editing: true, selected: true }, () => {
          expect(wrapper.html()).toEqual(
            shallow(
              <td className="cell selected editing">
                <input className="data-editor" value="5" />
              </td>,
            ).html(),
          );
        });
      });

      it('should properly render a flash when value changes', () => {
        const props = {
          editing: false,
          selected: false,
          cell: {
            value: 5,
            data: 5,
          },
          row: 1,
          col: 1,
          onMouseDown: () => {},
          onMouseOver: () => {},
          onDoubleClick: () => {},
          onContextMenu: () => {},
          valueRenderer: cell => cell.value,
        };
        const wrapper = shallow(<DataCell {...props} />);
        wrapper.setProps({ cell: { value: 6, data: 6 } }, () => {
          expect(wrapper.html()).toEqual(
            shallow(
              <td className="cell updated">
                <span className="value-viewer">6</span>
              </td>,
            ).html(),
          );
        });
      });
    });

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
          cell: {
            value: '2',
            data: '5',
          },
          row: 1,
          col: 2,
          onChange: sinon.spy(),
          onRevert: () => {},
          onMouseDown: () => {},
          onDoubleClick: () => {},
          onMouseOver: () => {},
          onContextMenu: () => {},
          valueRenderer: cell => cell.value,
          dataRenderer: cell => cell.data,
        };
        document.body.innerHTML =
          '<table><tbody><tr id="root"></tr></tbody></table>';
        wrapper = mount(<DataCell {...props} />, {
          attachTo: document.getElementById('root'),
        });
      });

      it('should not call onChange if value is the same', () => {
        wrapper.setProps({ editing: true, selected: true });
        expect(wrapper.find('input').node.value).toEqual('5');
        wrapper.find('input').node.value = '5';
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true });
        expect(props.onChange.called).toEqual(false);
      });

      it('should properly call onChange', () => {
        wrapper.setProps({ editing: true, selected: true });
        wrapper.find('input').node.value = '6';
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true });
        expect(props.onChange.called).toEqual(true);
        expect(props.onChange.calledWith(props.row, props.col, '6')).toEqual(
          true,
        );
      });

      it('input value should be cleared if we go into editing with clear call', () => {
        wrapper.setProps({ editing: true, selected: true, clearing: true });
        expect(wrapper.find('input').node.value).toEqual('');
      });
      it('input value should be set to value if data is null', () => {
        wrapper.setProps({ cell: { data: null, value: '2' } });
        wrapper.setProps({ editing: true, selected: true, editValue: '2' });
        expect(wrapper.find('input').node.value).toEqual('2');

        wrapper.find('input').node.value = '2';
        wrapper.find('input').simulate('change');
        wrapper.setProps({ editing: false, selected: true, editValue: '2' });
        expect(props.onChange.called).toEqual(false);
      });
    });
  });

  describe('DataCell with component', () => {
    let wrapper = null;
    jsdom();
    beforeEach(() => {
      wrapper && wrapper.detach();
      document.body.innerHTML =
        '<table><tbody><tr id="root"></tr></tbody></table>';
    });
    describe('rendering', () => {
      it('should properly render', () => {
        const onMouseDown = sinon.spy();
        const onMouseOver = sinon.spy();
        const onDoubleClick = sinon.spy();
        const onContextMenu = sinon.spy();
        const onNavigate = sinon.spy();
        const onChange = sinon.spy();
        const onRevert = sinon.spy();
        const cell = {
          foo: 'bar',
          readOnly: false,
          forceComponent: true,
          rowSpan: 4,
          colSpan: 5,
          value: 5,
          width: '200px',
          className: 'test',
          component: <div>HELLO</div>,
        };
        wrapper = mount(
          <DataCell
            row={2}
            col={3}
            cell={cell}
            editing={false}
            selected={false}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
            onMouseOver={onMouseOver}
            onContextMenu={onContextMenu}
            onNavigate={onNavigate}
            onChange={onChange}
            onRevert={onRevert}
            valueRenderer={cell => cell.value}
          />,
          { attachTo: document.getElementById('root') },
        );

        expect(wrapper.html()).toEqual(
          mount(
            <td
              className="test cell"
              colSpan={5}
              rowSpan={4}
              style={{ width: '200px' }}
            >
              <div>HELLO</div>
            </td>,
          ).html(),
        );
        wrapper.setProps({ cell: { ...cell, forceComponent: false } });
        expect(wrapper.html()).toEqual(
          mount(
            <td
              className="test cell"
              colSpan={5}
              rowSpan={4}
              style={{ width: '200px' }}
            >
              <span className="value-viewer">5</span>
            </td>,
          ).html(),
        );
        wrapper.setProps({
          cell: { ...cell, forceComponent: false, value: 7 },
        });
        expect(wrapper.html()).toEqual(
          mount(
            <td
              className="test cell updated"
              colSpan={5}
              rowSpan={4}
              style={{ width: '200px' }}
            >
              <span className="value-viewer">7</span>
            </td>,
          ).html(),
        );
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
        wrapper.detach();
      });
    });

    describe('rendering', () => {
      it('should properly render a change (flashing)', done => {
        const cell = {
          readOnly: false,
          forceComponent: true,
          value: 5,
          className: 'test',
          component: <div>HELLO</div>,
        };
        wrapper = mount(
          <DataCell
            row={2}
            col={3}
            cell={cell}
            editing={false}
            selected={false}
            onMouseDown={() => {}}
            onDoubleClick={() => {}}
            onMouseOver={() => {}}
            onContextMenu={() => {}}
            onNavigate={() => {}}
            onChange={() => {}}
            onRevert={() => {}}
            valueRenderer={cell => cell.value}
          />,
          { attachTo: document.getElementById('root') },
        );
        wrapper.setProps({ cell: { ...cell, value: 7 } });
        expect(wrapper.html()).toEqual(
          shallow(
            <td className="test cell updated">
              <div>HELLO</div>
            </td>,
          ).html(),
        );

        setTimeout(() => {
          try {
            expect(wrapper.html()).toEqual(
              shallow(
                <td className="test cell">
                  <div>HELLO</div>
                </td>,
              ).html(),
            );
            done();
          } catch (e) {
            done(e);
          }
        }, 750);
      });
    });
  });

  describe('Shallow DataSheet component', () => {
    describe('event listeners', () => {
      const savedDoc = global.doc;
      after(() => {
        global.document = savedDoc;
      });
      it('should remove all event listeners from document', () => {
        const addEvent = sinon.spy();
        const removeEvent = sinon.spy();
        global.document = {
          addEventListener: addEvent,
          removeEventListener: removeEvent,
        };

        const component = shallow(
          <DataSheet
            keyFn={i => 'custom_key_' + i}
            className={'test'}
            data={[[{ data: 1 }]]}
            valueRenderer={cell => cell.data}
          />,
        );
        component.unmount();
        expect(removeEvent.callCount).toEqual(6);
      });
    });
  });

  describe('DataSheet component', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let customWrapper = null;
    let selected = null;
    jsdom();

    beforeEach(() => {
      data = [
        [
          {
            className: 'test1',
            data: 4,
            overflow: 'clip',
          },
          {
            className: 'test2',
            data: 2,
            key: 'custom_key',
          },
        ],
        [
          {
            className: 'test3',
            data: 0,
            width: '25%',
          },
          {
            className: 'test4',
            data: 5,
            width: 100,
          },
        ],
      ];
      component = (
        <DataSheet
          keyFn={i => 'custom_key_' + i}
          className={'test'}
          overflow="nowrap"
          data={data}
          valueRenderer={cell => cell.data}
          onChange={(cell, i, j, value) => (data[i][j].data = value)}
        />
      );
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
      if (customWrapper) {
        if ('removeAllListeners' in customWrapper.instance()) {
          customWrapper.instance().removeAllListeners();
        }
        customWrapper = null;
      }
    });
    describe('rendering with varying props', () => {
      it('renders the proper elements', () => {
        expect(wrapper.find('table').length).toEqual(1);
        expect(_.values(wrapper.find('table').node.classList)).toEqual([
          'data-grid',
          'test',
          'nowrap',
        ]);

        expect(wrapper.find('td.cell span').length).toEqual(4);
        expect(
          wrapper.find('td.cell span').nodes.map(n => n.innerHTML),
        ).toEqual(['4', '2', '0', '5']);
      });

      it('renders the proper keys', () => {
        expect(wrapper.find('Sheet Row').at(0).key()).toEqual('custom_key_0');
        expect(wrapper.find('Sheet Row').at(1).key()).toEqual('custom_key_1');
        expect(wrapper.find('DataCell').at(1).key()).toEqual('custom_key');
      });

      it('sets the proper classes for the cells', () => {
        expect(
          wrapper.find('td').nodes.map(n => _.values(n.classList).sort()),
        ).toEqual([
          ['cell', 'clip', 'test1'],
          ['cell', 'test2'],
          ['cell', 'test3'],
          ['cell', 'test4'],
        ]);
      });
      it('renders the data in the input properly if dataRenderer is set', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            dataRenderer={cell => '=+' + cell.data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td.cell input').nodes[0].value).toEqual(
          '=+4',
        );
      });

      it('renders proper elements by column', () => {
        const withDates = data.map((row, index) => [
          { data: new Date('2017-0' + (index + 1) + '-01') },
          ...row,
        ]);
        customWrapper = mount(
          <DataSheet
            data={withDates}
            valueRenderer={(cell, i, j) =>
              j === 0 ? cell.data.toGMTString() : cell.data
            }
            dataRenderer={(cell, i, j) =>
              j === 0 ? cell.data.toISOString() : cell.data
            }
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        // expect(wrapper.find('td > span').length).toEqual(6);
        expect(
          customWrapper.find('td.cell span').nodes.map(n => n.innerHTML),
        ).toEqual([
          'Sun, 01 Jan 2017 00:00:00 GMT',
          '4',
          '2',
          'Wed, 01 Feb 2017 00:00:00 GMT',
          '0',
          '5',
        ]);
      });

      it('renders data in the input properly if dataRenderer is set by column', () => {
        const withDates = data.map((row, index) => [
          { data: new Date('2017-0' + (index + 1) + '-01') },
          ...row,
        ]);
        customWrapper = mount(
          <DataSheet
            data={withDates}
            valueRenderer={(cell, i, j) =>
              j === 0 ? cell.data.toGMTString() : cell.data
            }
            dataRenderer={(cell, i, j) =>
              j === 0 ? cell.data.toISOString() : cell.data
            }
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td.cell input').nodes[0].value).toEqual(
          '2017-01-01T00:00:00.000Z',
        );
      });

      it('renders the attributes to the cell if the attributesRenderer is set', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            valueRenderer={(cell, i, j) => cell.data}
            dataRenderer={(cell, i, j) => cell.data}
            attributesRenderer={(cell, i, j) => {
              if (i === 0 && j === 0) {
                return { 'data-hint': 'Not valid' };
              } else if (i === 1 && j === 1) {
                return { 'data-hint': 'Valid' };
              }

              return null;
            }}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );

        expect(
          customWrapper.find('td.cell').first().props()['data-hint'],
        ).toEqual('Not valid');
        expect(
          customWrapper.find('td.cell').last().props()['data-hint'],
        ).toEqual('Valid');
      });

      it('renders a component properly', () => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                {
                  component: (
                    <div className={'custom-component'}>COMPONENT RENDERED</div>
                  ),
                },
              ],
            ]}
            valueRenderer={cell => 'VALUE RENDERED'}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        expect(customWrapper.find('td').text()).toEqual('VALUE RENDERED');
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
      });

      it('forces a component rendering', () => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                {
                  forceComponent: true,
                  component: (
                    <div className={'custom-component'}>COMPONENT RENDERED</div>
                  ),
                },
              ],
            ]}
            valueRenderer={cell => 'VALUE RENDERED'}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
        customWrapper.find('td').first().simulate('mousedown');
        customWrapper.find('td').first().simulate('mouseover');
        customWrapper.find('td').first().simulate('doubleClick');
        expect(customWrapper.state('start')).toEqual({ i: 0, j: 0 });
        expect(customWrapper.find('td').text()).toEqual('COMPONENT RENDERED');
      });

      it('handles  a custom editable component and exits on ENTER_KEY', done => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                { value: 1 },
                { component: <input className={'custom-component'} /> },
                { value: 2 },
              ],
            ]}
            valueRenderer={cell => 'VALUE RENDERED'}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        const cell = customWrapper.find('td').at(1);
        cell.simulate('mouseDown');
        cell.simulate('doubleClick');

        expect(customWrapper.state('start')).toEqual({ i: 0, j: 1 });
        cell.find('.custom-component').first().simulate('doubleClick');
        triggerEvent(customWrapper.find('.data-grid-container').node, TAB_KEY);
        setTimeout(() => {
          expect(customWrapper.state('start')).toEqual({ i: 0, j: 2 });
          done();
        }, 50);
      });

      it('handles  a custom editable component and exits', done => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                { value: 1 },
                { component: <input className={'custom-component'} /> },
                { value: 2 },
              ],
            ]}
            valueRenderer={cell => 'VALUE RENDERED'}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        const cell = customWrapper.find('td').at(1);

        const selectCell = () => {
          cell.simulate('mouseDown');
          cell.simulate('doubleClick');
        };

        const checkEnterKey = callback => {
          selectCell();
          expect(customWrapper.state('start')).toEqual({ i: 0, j: 1 });
          cell.find('.custom-component').first().simulate('doubleClick');
          triggerEvent(
            customWrapper.find('.data-grid-container').node,
            ENTER_KEY,
          );
          setTimeout(() => {
            expect(customWrapper.state('start')).toEqual({ i: 0, j: 1 });
            callback();
          }, 50);
        };
        const checkTabKey = callback => {
          selectCell();
          expect(customWrapper.state('start')).toEqual({ i: 0, j: 1 });
          cell.find('.custom-component').first().simulate('doubleClick');
          triggerEvent(
            customWrapper.find('.data-grid-container').node,
            TAB_KEY,
          );
          setTimeout(() => {
            expect(customWrapper.state('start')).toEqual({ i: 0, j: 2 });
            callback();
          }, 50);
        };
        checkEnterKey(() => checkTabKey(done));
      });

      it('renders a cell with readOnly field properly', () => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                { data: 12, readOnly: true },
                { data: 24, readOnly: false },
              ],
            ]}
            valueRenderer={cell => cell.data}
            dataRenderer={cell => '=+' + cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        expect(customWrapper.find('td.cell').at(0).text()).toEqual(12);
        expect(customWrapper.find('td.cell').at(1).text()).toEqual(24);
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(0).simulate('doubleClick');
        customWrapper.find('td').at(1).simulate('mouseDown');
        customWrapper.find('td').at(1).simulate('doubleClick');

        expect(customWrapper.find('td.cell').at(0).text()).toEqual(12);
        expect(
          customWrapper.find('td.cell').at(1).find('input').props().value,
        ).toEqual('=+24');

        expect(customWrapper.find('td.cell').at(0).html()).toEqual(
          '<td class="cell read-only"><span class="value-viewer">12</span></td>',
        );
        expect(customWrapper.find('td.cell').at(1).html()).toEqual(
          '<td class="cell selected editing"><input class="data-editor" value="=+24"></td>',
        );
      });

      it('renders a cell with disabled events', () => {
        customWrapper = mount(
          <DataSheet
            data={[
              [
                { data: 12, disableEvents: true },
                { data: 24, disableEvents: true },
              ],
            ]}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(0).simulate('doubleClick');
        expect(customWrapper.state()).toEqual({
          start: {},
          end: {},
          selecting: false,
          editing: {},
          forceEdit: false,
          clear: {},
        });
      });
    });

    describe('selection', () => {
      it('selects a single field properly', () => {
        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        wrapper.find('td').at(1).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseUp');
        expect(wrapper.find('td.cell.selected').length).toEqual(1);
        expect(
          wrapper.find('td.cell.selected span').nodes[0].innerHTML,
        ).toEqual('2');
      });

      it('selects multiple field properly 2x2 (hold left click)', () => {
        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(3).simulate('mouseOver');
        expect(wrapper.find('td.cell.selected').length).toEqual(4);
        expect(
          wrapper.find('td.cell.selected span').nodes.map(n => n.innerHTML),
        ).toEqual(['4', '2', '0', '5']);

        expect(wrapper.state('selecting')).toEqual(true);
        expect(wrapper.state('editing')).toEqual({});
        expect(wrapper.state('start')).toEqual({
          i: 0,
          j: 0,
        });
        expect(wrapper.state('end')).toEqual({
          i: 1,
          j: 1,
        });
      });

      it('selects multiple field properly 2x2 and stay selected after releasing mouse button', () => {
        let mouseUpEvt = document.createEvent('HTMLEvents');
        mouseUpEvt.initEvent('mouseup', false, true);

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

      it('calls onSelect prop when a new element is selected', done => {
        customWrapper = mount(
          <DataSheet
            data={data}
            onSelect={({ start, end }) => {
              try {
                expect(start).toEqual({ i: 0, j: 0 });
                expect(end).toEqual({ i: 0, j: 0 });
                done();
              } catch (err) {
                done(err);
              }
            }}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (custData[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        expect(customWrapper.state('end')).toEqual({ i: 0, j: 0 });
      });

      it('calls onSelect prop when a new element is selected and the selection is controlled', done => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={selected}
            onSelect={({ start, end }) => {
              try {
                selected = { start, end };
                expect(start).toEqual({ i: 0, j: 0 });
                expect(end).toEqual({ i: 0, j: 0 });
                done();
              } catch (err) {
                done(err);
              }
            }}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (custData[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        expect(selected.end).toEqual({ i: 0, j: 0 });
      });

      it('selects a single cell if passed in the "selected" prop', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={{ start: { i: 0, j: 0 }, end: { i: 0, j: 0 } }}
            valueRenderer={cell => cell.data}
          />,
        );
        expect(customWrapper.find('td.cell.selected').length).toEqual(1);
      });

      it('selects multiple cells if passed in the "selected" prop', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={{ start: { i: 0, j: 0 }, end: { i: 1, j: 1 } }}
            valueRenderer={cell => cell.data}
          />,
        );
        expect(customWrapper.find('td.cell.selected').length).toEqual(4);
      });

      it('does not select cells if passed "null" in the "selected" prop', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={null}
            valueRenderer={cell => cell.data}
          />,
        );
        expect(customWrapper.find('td.cell.selected').length).toEqual(0);
      });

      it('does not select cells if missing "start" in the "selected" prop', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={{ end: { i: 1, j: 1 } }}
            valueRenderer={cell => cell.data}
          />,
        );
        expect(customWrapper.find('td.cell.selected').length).toEqual(0);
      });

      it('does not select cells if missing "end" in the "selected" prop', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={{ start: { i: 0, j: 0 } }}
            valueRenderer={cell => cell.data}
          />,
        );
        expect(customWrapper.find('td.cell.selected').length).toEqual(0);
      });

      it('selects multiple cells when click and drag over other cells and selection is controlled', () => {
        customWrapper = mount(
          <DataSheet
            data={data}
            selected={null}
            onSelect={selected => customWrapper.setProps({ selected })}
            valueRenderer={cell => cell.data}
          />,
        );
        // validate inital state
        expect(customWrapper.find('td.cell.selected').length).toEqual(0);
        // perform mouse events
        let mouseUpEvt = document.createEvent('HTMLEvents');
        mouseUpEvt.initEvent('mouseup', false, true);
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(3).simulate('mouseOver');
        document.dispatchEvent(mouseUpEvt);
        // validate
        expect(customWrapper.props().selected.start).toEqual({ i: 0, j: 0 });
        expect(customWrapper.props().selected.end).toEqual({ i: 1, j: 1 });
        expect(customWrapper.find('td.cell.selected').length).toEqual(4);
      });
    });

    describe('keyboard movement', () => {
      it('moves right with arrow keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
        triggerKeyDownEvent(wrapper, RIGHT_KEY);
        expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      });
      it('moves left with arrow keys', () => {
        wrapper.find('td').at(1).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
        triggerKeyDownEvent(wrapper, LEFT_KEY);
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
      });
      it('moves up with arrow keys', () => {
        wrapper.find('td').at(3).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
        triggerKeyDownEvent(wrapper, UP_KEY);
        expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      });
      it('moves down with arrow keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
        triggerKeyDownEvent(wrapper, DOWN_KEY);
        expect(wrapper.state('start')).toEqual({ i: 1, j: 0 });
      });
      it('moves to next row if there is no right cell', () => {
        wrapper.find('td').at(1).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
        triggerKeyDownEvent(wrapper, TAB_KEY);
        expect(wrapper.state('start')).toEqual({ i: 1, j: 0 });
      });

      it('tab and shift tab keys', () => {
        wrapper.find('td').at(0).simulate('mouseDown');
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
        triggerKeyDownEvent(wrapper.find('td').at(0), TAB_KEY);
        expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
        triggerKeyDownEvent(wrapper.find('td').at(0), TAB_KEY, {
          shiftKey: true,
        });
        expect(wrapper.state('start')).toEqual({ i: 0, j: 0 });
      });
    });

    describe('editing', () => {
      let cells = null;
      beforeEach(() => {
        cells = wrapper.find('td');
      });

      it('starts editing when double clicked', () => {
        expect(wrapper.find('td.cell.selected').length).toEqual(0);
        cells.at(3).simulate('doubleClick');
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1,
        });
        expect(wrapper.state('forceEdit')).toEqual(true);

        cells.at(3).simulate('mousedown'); // mousedown should not affect edit mode
        cells.at(2).simulate('mouseover'); // mouseover should not affect edit mode
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1,
        });
      });

      it('starts editing when enter key pressed', () => {
        cells.at(3).simulate('mousedown');
        triggerKeyDownEvent(cells.at(3), ENTER_KEY);
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1,
        });
        expect(wrapper.state('forceEdit')).toEqual(true);

        cells.at(3).simulate('mousedown'); // mousedown should not affect edit mode
        cells.at(2).simulate('mouseover'); // mouseover should not affect edit mode
        expect(wrapper.state('editing')).toEqual({
          i: 1,
          j: 1,
        });
        expect(wrapper.state('clear')).toEqual({});
      });

      it('starts editing certain keys are pressed', () => {
        // [0  , 9 ,a , z , 0 , 9  , +  , = , decim]
        [48, 57, 65, 90, 96, 105, 107, 187, 189].map(charCode => {
          cells.at(0).simulate('mousedown');
          triggerKeyDownEvent(cells.at(0), charCode);
          expect(wrapper.state('editing')).toEqual({ i: 0, j: 0 });
          cells.at(1).simulate('mousedown');
          expect(wrapper.state('editing')).toEqual({});
        });
      });

      it('does not start editing if cell is readOnly', () => {
        wrapper.setProps({
          data: [
            [
              { data: 1, readOnly: true },
              { data: 2, readOnly: true },
            ],
          ],
        });
        // [0  , 9 ,a , z , 0 , 9  , +  , = , decim]
        [48, 57, 65, 90, 96, 105, 107, 187, 189].map(charCode => {
          cells.at(0).simulate('mousedown');
          triggerKeyDownEvent(cells.at(0), charCode);
          expect(wrapper.state('editing')).toEqual({});
          cells.at(1).simulate('mousedown');
          expect(wrapper.state('editing')).toEqual({});
        });
      });

      it('goes out of edit mode when another cell is clicked', () => {
        cells.at(0).simulate('mouseDown');
        triggerKeyDownEvent(cells.at(0), '1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        cells.at(1).simulate('mouseDown');
        expect(data[0][0].data).toEqual(213);
        expect(wrapper.state('editing')).toEqual({});
      });

      it('goes out of edit mode when ENTER is clicked', () => {
        cells.at(0).simulate('mouseDown');
        triggerKeyDownEvent(cells.at(0), '1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        wrapper
          .find('td.cell.selected input')
          .simulate('keydown', { keyCode: ENTER_KEY });
        expect(data[0][0].data).toEqual(213);
        expect(wrapper.state('editing')).toEqual({});
      });

      it('goes out of edit mode and reverts to original value when ESCAPE is pressed', () => {
        cells.at(0).simulate('mouseDown');
        triggerKeyDownEvent(cells.at(0), '1'.charCodeAt(0));
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');
        triggerKeyDownEvent(wrapper.find('td.cell.editing input'), ESCAPE_KEY);
        expect(data[0][0].data).toEqual(4);
        expect(wrapper.state('editing')).toEqual({});
        expect(
          wrapper.find('td.cell.selected').first().hasClass('editing'),
        ).toBe(false);
      });

      it('goes to the next row when editing and enter key pressed when edit started via double click', () => {
        cells.at(1).simulate('mousedown');
        triggerKeyDownEvent(cells.at(1), '1'.charCodeAt(0));
        expect(wrapper.state('editing')).toEqual({
          i: 0,
          j: 1,
        });

        const newPosition = { i: 1, j: 1 };
        triggerKeyDownEvent(wrapper.find('td.cell.editing input'), ENTER_KEY);
        expect(wrapper.state('editing')).toEqual({});
        expect(wrapper.state('start')).toEqual(newPosition);
        expect(wrapper.state('end')).toEqual(newPosition);
      });

      it('goes to the next row when editing and enter key pressed', () => {
        cells.at(1).simulate('mousedown');
        triggerKeyDownEvent(wrapper, ENTER_KEY);
        expect(wrapper.state('editing')).toEqual({
          i: 0,
          j: 1,
        });

        const newPosition = { i: 1, j: 1 };
        triggerKeyDownEvent(wrapper.find('td.cell.editing input'), ENTER_KEY);
        wrapper.update();
        expect(wrapper.state('editing')).toEqual({});
        expect(wrapper.state('start')).toEqual(newPosition);
        expect(wrapper.state('end')).toEqual(newPosition);
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
          forceEdit: true,
          clear: {},
        });

        cells.at(0).find('input').node.value = 213;
        cells.at(0).find('input').simulate('change');
        cells.at(0).find('input').simulate('keydown', { keyCode: RIGHT_KEY });
        expect(data[0][0].data).toEqual(4);
        cells.at(0).find('input').simulate('keydown', { keyCode: TAB_KEY });
        expect(data[0][0].data).toEqual(213);
      });

      it("moves to the next cell on left/right arrow if editing wasn't started via double click or pressing enter", () => {
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        triggerKeyDownEvent(wrapper, '1'.charCodeAt(0));
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: { i: 0, j: 0 },
          forceEdit: false,
          clear: { i: 0, j: 0 },
        });
        wrapper.find('td.cell.selected input').node.value = 213;
        wrapper.find('td.cell.selected input').simulate('change');

        expect(data[0][0].data).toEqual(4);
        triggerKeyDownEvent(wrapper.find('td.cell.selected input'), RIGHT_KEY);
        expect(data[0][0].data).toEqual(213);
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 1 }, // RIGHT_KEY movement
          end: { i: 0, j: 1 }, // RIGHT_KEY movement
          selecting: true,
          editing: {},
          forceEdit: false,
          clear: { i: 0, j: 0 },
        });
      });

      it("doesn't moves to the next cell on left/right arrow if cell is a component", () => {
        data[0][0].component = <div>HELLO</div>;
        wrapper.setProps({ data: data });
        expect(wrapper.exists(<div>HELLO</div>)).toEqual(true);
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        triggerKeyDownEvent(wrapper, '1'.charCodeAt(0));
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: { i: 0, j: 0 },
          forceEdit: false,
          clear: { i: 0, j: 0 },
        });
        cells.at(0).simulate('keyDown', { keyCode: RIGHT_KEY });
        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 }, // RIGHT_KEY movement
          end: { i: 0, j: 0 }, // RIGHT_KEY movement
          selecting: true,
          editing: { i: 0, j: 0 },
          forceEdit: false,
          clear: { i: 0, j: 0 },
        });
      });

      it('copies the data properly', () => {
        let copied = '';
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text) => (copied = text) };

        cells.at(0).simulate('mouseDown');
        cells.at(3).simulate('mouseOver');
        document.dispatchEvent(evt);
        expect(copied).toEqual('4\t2\n0\t5');
      });

      it('copies the data from dataRenderer if it exists', () => {
        let copied = '';
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text) => (copied = text) };
        customWrapper = mount(
          <DataSheet
            data={data}
            valueRenderer={(cell, i, j) => cell.data}
            dataRenderer={(cell, i, j) => `{${i},${j}}${cell.data}`}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(3).simulate('mouseOver');

        document.dispatchEvent(evt);
        expect(copied).toEqual('{0,0}4\t{0,1}2\n{1,0}0\t{1,1}5');
      });

      it("copies no data if there isn't anything selected", () => {
        let pasted = '';
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text) => (pasted = text) };

        expect(wrapper.state('start')).toEqual({});
        document.dispatchEvent(evt);
        expect(pasted).toEqual('');
      });

      it('copies data properly, using handleCopy if defined', () => {
        let copied = '';
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('copy', false, true);
        evt.clipboardData = { setData: (type, text) => (copied = text) };
        customWrapper = mount(
          <DataSheet
            data={data}
            valueRenderer={(cell, i, j) => cell.data}
            dataRenderer={(cell, i, j) => `{${i},${j}}${cell.data}`}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            handleCopy={({
              event,
              dataRenderer,
              valueRenderer,
              data,
              start,
              end,
              range,
            }) => {
              const text = range(start.i, end.i)
                .map(i =>
                  range(start.j, end.j)
                    .map(j => {
                      const cell = data[i][j];
                      const value = dataRenderer
                        ? dataRenderer(cell, i, j)
                        : null;
                      if (
                        value === '' ||
                        value === null ||
                        typeof value === 'undefined'
                      ) {
                        const val = valueRenderer(cell, i, j);
                        return JSON.stringify(val);
                      }
                      return JSON.stringify(value);
                    })
                    .join('\t'),
                )
                .join('\n');
              if (window.clipboardData && window.clipboardData.setData) {
                window.clipboardData.setData('Text', text);
              } else {
                event.clipboardData.setData('text/plain', text);
              }
            }}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        customWrapper.find('td').at(3).simulate('mouseOver');

        document.dispatchEvent(evt);
        expect(copied).toEqual('"{0,0}4"\t"{0,1}2"\n"{1,0}0"\t"{1,1}5"');
      });

      it('does not paste data if no cell is selected', () => {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
        expect(data[0].map(d => d.data)).toEqual([4, 2]);
        expect(data[1].map(d => d.data)).toEqual([0, 5]);
      });
      it('pastes data properly', () => {
        cells.at(0).simulate('mouseDown');
        expect(wrapper.state('end')).toEqual({ i: 0, j: 0 });

        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);

        expect(data[0].map(d => d.data)).toEqual(['99', '100']);
        expect(data[1].map(d => d.data)).toEqual(['1001', '1002']);
        expect(wrapper.state('end')).toEqual({ i: 1, j: 1 });
      });

      it('pastes data properly on a different cell', () => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(1).simulate('mouseDown');

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);

        expect(datacust[0].map(d => d.data)).toEqual([12, '99']);
      });

      it('pastes multiple rows correclty on windows', () => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
          ],
          [
            { data: 1012, readOnly: true },
            { data: 1024, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(1).simulate('mouseDown');

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\r\n1001\t1002' };
        document.dispatchEvent(evt);

        expect(datacust[1].map(d => d.data)).toEqual([1012, '1001']);
      });

      it('pastes multiple rows correclty when multiple cells are selected', () => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
            { data: 25, readOnly: false },
          ],
          [
            { data: 1012, readOnly: true },
            { data: 1024, readOnly: false },
            { data: 1036, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(1).simulate('mouseDown');

        wrapper.setState({
          start: { i: 1, j: 0 },
          end: { i: 2, j: 0 },
        });

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = {
          getData: type => '99\t100\t101\r\n1001\t1002\t1003',
        };
        document.dispatchEvent(evt);

        expect(datacust[1].map(d => d.data)).toEqual([1012, '1001', '1002']);
      });

      it('pastes multiple rows correclty when multiple cells are selected from bottom up', () => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
            { data: 25, readOnly: false },
          ],
          [
            { data: 1012, readOnly: true },
            { data: 1024, readOnly: false },
            { data: 1036, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(1).simulate('mouseDown');

        wrapper.setState({
          start: { i: 2, j: 0 },
          end: { i: 1, j: 0 },
        });

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = {
          getData: type => '99\t100\t101\r\n1001\t1002\t1003',
        };
        document.dispatchEvent(evt);

        expect(datacust[1].map(d => d.data)).toEqual([1012, '1001', '1002']);
      });

      it('doesnt auto paste data if cell is editing', () => {
        const datacust = [
          [
            { data: 12, readOnly: false },
            { data: 24, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
          />,
        );
        customWrapper.find('td').at(1).simulate('doubleclick');

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '100' };

        expect(datacust[0].map(d => d.data)).toEqual([12, 24]);
      });

      it('pastes data properly and fires onPaste function if defined', done => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
            onPaste={pasted => {
              try {
                expect(pasted).toEqual([
                  [
                    { cell: datacust[0][0], data: '99' },
                    { cell: datacust[0][1], data: '100' },
                  ],
                  [
                    { cell: undefined, data: '1001' },
                    { cell: undefined, data: '1002' },
                  ],
                ]);
                done();
              } catch (err) {
                done(err);
              }
            }}
          />,
        );
        customWrapper.find('td').at(0).simulate('mouseDown');
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
      });

      it('pastes data properly, using parsePaste if defined', () => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
          ],
          [
            { data: 1012, readOnly: true },
            { data: 1024, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
            // "--" is our arbitrary row delimiter, "," is our arbitrary field delimiter
            parsePaste={pasted => {
              return pasted.split('--').map(line => line.split(','));
            }}
          />,
        );
        customWrapper.find('td').at(1).simulate('mouseDown');

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99,100--1001,1002' };
        document.dispatchEvent(evt);

        expect(datacust[1].map(d => d.data)).toEqual([1012, '1001']);
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
          forceEdit: false,
          clear: {},
        });
      });

      it('pageClick does not execute if the mouse click is within', () => {
        const cell = wrapper.find('td').first();
        cell.simulate('mousedown');
        cell.simulate('mouseup');

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('mousedown', false, true);
        Object.defineProperty(evt, 'target', { value: cell.getDOMNode() });
        document.dispatchEvent(evt);

        expect(wrapper.state()).toEqual({
          start: { i: 0, j: 0 },
          end: { i: 0, j: 0 },
          selecting: true,
          editing: {},
          forceEdit: false,
          clear: {},
        });
      });
      it('delete on DELETE_KEY', done => {
        const cell = wrapper.find('td').first();
        data[0][1] = Object.assign(data[0][1], { readOnly: true });

        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseOver');

        expect(data[0][0].data).toEqual(4);
        expect(data[0][1].data).toEqual(2);
        triggerKeyDownEvent(wrapper, DELETE_KEY);
        setTimeout(() => {
          expect(data[0][0].data).toEqual('');
          expect(data[0][1].data).toEqual(2);
          done();
        }, 0);
      });
    });

    describe('contextmenu', () => {
      let cells = null;
      beforeEach(() => {
        cells = wrapper.find('td');
      });

      it('starts calls contextmenu with right object', done => {
        const datacust = [
          [
            { data: 12, readOnly: true },
            { data: 24, readOnly: false },
          ],
        ];
        customWrapper = mount(
          <DataSheet
            data={datacust}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (datacust[i][j].data = value)}
            onContextMenu={(e, cell, i, j) => {
              try {
                expect(cell).toEqual({ data: 12, readOnly: true });
                done();
              } catch (err) {
                done(err);
              }
            }}
          />,
        );
        customWrapper.find('td').at(0).simulate('contextmenu');
      });
    });
  });

  describe('DataSheet component with restricted cell movement (column)', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let customWrapper = null;
    const selected = null;
    jsdom();

    beforeEach(() => {
      data = [
        [
          {
            className: 'test1',
            data: 4,
            overflow: 'clip',
          },
          {
            className: 'test2',
            data: 2,
            key: 'custom_key',
          },
          {
            className: 'test3',
            data: 3,
          },
          {
            className: 'test4',
            data: 4,
          },
        ],
        [
          {
            className: 'test5',
            data: 0,
            width: '25%',
          },
          {
            className: 'test6',
            data: 5,
            width: 100,
          },
          {
            className: 'test7',
            data: 5,
            width: 100,
          },
          {
            className: 'test8',
            data: 3,
          },
        ],
      ];
      component = (
        <DataSheet
          keyFn={i => 'custom_key_' + i}
          className="test"
          overflow="nowrap"
          data={data}
          valueRenderer={cell => cell.data}
          // only allow navigation to the middle 2 columns
          isCellNavigable={(cell, row, col) => col === 1 || col === 2}
          onChange={(cell, i, j, value) => (data[i][j].data = value)}
        />
      );
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
      if (customWrapper) {
        if ('removeAllListeners' in customWrapper.instance()) {
          customWrapper.instance().removeAllListeners();
        }
        customWrapper = null;
      }
    });

    it('navigate with tab over restricted cells', () => {
      // click into row0, col1
      wrapper.find('td').at(1).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      // first tab gets us to row0, col2
      triggerKeyDownEvent(wrapper.find('td').at(2), TAB_KEY);
      expect(wrapper.state('start')).toEqual({ i: 0, j: 2 });
      // next tab gets us to row1, col1
      triggerKeyDownEvent(wrapper.find('td').at(5), TAB_KEY);
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
      // next tab gets us to row1, col2
      triggerKeyDownEvent(wrapper.find('td').at(6), TAB_KEY);
      expect(wrapper.state('start')).toEqual({ i: 1, j: 2 });
      // next tab stays at row1, col2
      triggerKeyDownEvent(wrapper.find('td').at(7), TAB_KEY);
      expect(wrapper.state('start')).toEqual({ i: 1, j: 2 });
    });

    it('navigate with shift tab over restricted cells', () => {
      // click into row1, col2
      wrapper.find('td').at(6).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 1, j: 2 });
      // first shift tab gets us to row1, col1
      triggerKeyDownEvent(wrapper.find('td').at(6), TAB_KEY, {
        shiftKey: true,
      });
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
      // next shift tab gets us to row0, col2
      triggerKeyDownEvent(wrapper.find('td').at(5), TAB_KEY, {
        shiftKey: true,
      });
      expect(wrapper.state('start')).toEqual({ i: 0, j: 2 });
      // next shift tab gets us to row0, col1
      triggerKeyDownEvent(wrapper.find('td').at(3), TAB_KEY, {
        shiftKey: true,
      });
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      // next shift tab stays at row0, col1
      triggerKeyDownEvent(wrapper.find('td').at(2), TAB_KEY, {
        shiftKey: true,
      });
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
    });
  });

  describe('DataSheet component with restricted cell movement (row)', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let customWrapper = null;
    const selected = null;
    jsdom();

    beforeEach(() => {
      data = [
        [
          {
            className: 'test1',
            data: 4,
            overflow: 'clip',
          },
          {
            className: 'test2',
            data: 2,
            key: 'custom_key',
          },
        ],
        [
          {
            className: 'test3',
            data: 3,
          },
          {
            className: 'test4',
            data: 4,
          },
        ],
        [
          {
            className: 'test5',
            data: 0,
            width: '25%',
          },
          {
            className: 'test6',
            data: 5,
            width: 100,
          },
        ],
        [
          {
            className: 'test7',
            data: 5,
            width: 100,
          },
          {
            className: 'test8',
            data: 3,
          },
        ],
      ];
      component = (
        <DataSheet
          keyFn={i => 'custom_key_' + i}
          className="test"
          overflow="nowrap"
          data={data}
          valueRenderer={cell => cell.data}
          // dont allow navigating into row 2 (index 1)
          isCellNavigable={(cell, row, col) => row !== 1}
          onChange={(cell, i, j, value) => (data[i][j].data = value)}
        />
      );
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
      if (customWrapper) {
        if ('removeAllListeners' in customWrapper.instance()) {
          customWrapper.instance().removeAllListeners();
        }
        customWrapper = null;
      }
    });

    it('navigate with down key when inside restricted row should jump to next navigable', () => {
      // click into row1, col1
      wrapper.find('td').at(3).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
      // nav down should get us to next free row
      triggerKeyDownEvent(wrapper, DOWN_KEY);
      expect(wrapper.state('start')).toEqual({ i: 2, j: 1 });
    });
    it('navigate with up key at the top should stay', () => {
      // click into row0, col1
      wrapper.find('td').at(1).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      // navigating up should stay in the top row
      triggerKeyDownEvent(wrapper, UP_KEY);
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
    });
    it('navigate with up key below restricted row should jump over', () => {
      // click into row0, col1
      wrapper.find('td').at(5).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 2, j: 1 });
      // nav up should jump over row1
      triggerKeyDownEvent(wrapper, UP_KEY);
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
    });
  });

  describe('DataSheet component with restricted cell movement (top row)', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let customWrapper = null;
    const selected = null;
    jsdom();

    beforeEach(() => {
      data = [
        [
          {
            className: 'test1',
            data: 4,
            overflow: 'clip',
          },
          {
            className: 'test2',
            data: 2,
            key: 'custom_key',
          },
        ],
        [
          {
            className: 'test3',
            data: 3,
          },
          {
            className: 'test4',
            data: 4,
          },
        ],
        [
          {
            className: 'test5',
            data: 0,
            width: '25%',
          },
          {
            className: 'test6',
            data: 5,
            width: 100,
          },
        ],
        [
          {
            className: 'test7',
            data: 5,
            width: 100,
          },
          {
            className: 'test8',
            data: 3,
          },
        ],
      ];
      component = (
        <DataSheet
          keyFn={i => 'custom_key_' + i}
          className="test"
          overflow="nowrap"
          data={data}
          valueRenderer={cell => cell.data}
          // dont allow navigating into row 1 (index 0)
          isCellNavigable={(cell, row, col) => row > 0}
          onChange={(cell, i, j, value) => (data[i][j].data = value)}
        />
      );
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
      if (customWrapper) {
        if ('removeAllListeners' in customWrapper.instance()) {
          customWrapper.instance().removeAllListeners();
        }
        customWrapper = null;
      }
    });

    it('navigate with down key when inside restricted row should jump to next navigable', () => {
      // click into row0, col1
      wrapper.find('td').at(1).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      // nav down should get us to next free row
      triggerKeyDownEvent(wrapper, DOWN_KEY);
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
    });
    it('navigate with up key at the top should stay', () => {
      // click into row0, col1
      wrapper.find('td').at(1).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
      // navigating up should stay in the top row
      triggerKeyDownEvent(wrapper, UP_KEY);
      expect(wrapper.state('start')).toEqual({ i: 0, j: 1 });
    });
    it('navigate with up key below top row should stay', () => {
      // click into row1, col1
      wrapper.find('td').at(3).simulate('mouseDown');
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
      // nav up should stay in last navigable row
      triggerKeyDownEvent(wrapper, UP_KEY);
      expect(wrapper.state('start')).toEqual({ i: 1, j: 1 });
    });
  });

  describe('DataSheet with custom renderers', () => {
    let data = [];
    let columns = [];
    let component = null;
    let wrapper = null;
    jsdom();

    beforeEach(() => {
      data = [
        [
          {
            className: 'test1',
            data: 4,
            overflow: 'clip',
          },
          {
            className: 'test2',
            data: 2,
            key: 'custom_key',
          },
        ],
        [
          {
            className: 'test3',
            data: 3,
            width: '25%',
          },
          {
            className: 'test4',
            data: 5,
            width: 100,
          },
        ],
      ];
      columns = ['Column 1', 'Column 2'];
    });
    afterEach(() => {
      wrapper && wrapper.instance().removeAllListeners();
    });

    describe('rendering', () => {
      it('renders a custom sheet', () => {
        component = (
          <DataSheet
            className={'test'}
            data={data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            sheetRenderer={props => {
              const className = `${props.className} height-${data.length} width-${data[0].length}`;
              return (
                <table className={className}>
                  <tbody>{props.children}</tbody>
                </table>
              );
            }}
          />
        );
        wrapper = mount(component);
        const dataGrid = wrapper.childAt(0);
        expect(dataGrid.hasClass('data-grid')).toEqual(true);
        expect(dataGrid.hasClass('test')).toEqual(true);
        expect(dataGrid.hasClass('height-2')).toEqual(true);
        expect(dataGrid.hasClass('width-2')).toEqual(true);
      });

      it('renders a custom header', () => {
        component = (
          <DataSheet
            className={'test'}
            data={data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            sheetRenderer={props => {
              return (
                <table className={props.className}>
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{props.children}</tbody>
                </table>
              );
            }}
          />
        );
        wrapper = mount(component);
        // extra row for header
        expect(wrapper.find('tr').length).toEqual(3);
        expect(wrapper.find('th').nodes.map(n => n.innerHTML)).toEqual(columns);
        expect(wrapper.find('td span').nodes.map(n => n.innerHTML)).toEqual([
          '4',
          '2',
          '3',
          '5',
        ]);
      });

      // custom tr
      // custom td
      it('renders custom table structure', () => {
        component = (
          <DataSheet
            className={'test'}
            data={data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            sheetRenderer={props => (
              <ul className={props.className}>{props.children}</ul>
            )}
            rowRenderer={props => <li>{props.children}</li>}
            cellRenderer={props => (
              <div
                className={props.className}
                onMouseDown={props.onMouseDown}
                onMouseOver={props.onMouseOver}
                onDoubleClick={props.onDoubleClick}
              >
                {props.children}
              </div>
            )}
          />
        );
        wrapper = mount(component);
        expect(wrapper.find('ul.data-grid li').length).toEqual(2);
        expect(
          wrapper
            .find('ul.data-grid li div.cell span')
            .nodes.map(n => n.innerHTML),
        ).toEqual(['4', '2', '3', '5']);
        expect(wrapper.find('DataCell').at(1).key()).toEqual('custom_key');
        expect(
          wrapper.find('ul.data-grid li div.cell').at(3).hasClass('test4'),
        ).toBe(true);
      });

      it('renders custom valueViewers', () => {
        data[0][0].valueViewer = props => (
          <p className="value-viewer">{props.value}</p>
        );
        component = (
          <DataSheet
            className={'test'}
            data={data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            valueViewer={props => (
              <div className="value-viewer">{props.value}</div>
            )}
          />
        );
        wrapper = mount(component);
        expect(
          wrapper.find('td.cell p.value-viewer').nodes.map(n => n.innerHTML),
        ).toEqual(['4']);
        expect(
          wrapper.find('td.cell div.value-viewer').nodes.map(n => n.innerHTML),
        ).toEqual(['2', '3', '5']);
      });

      it('renders custom dataEditors', () => {
        data[0][0].dataEditor = props => {
          const { value, onKeyDown, onChange } = props;
          return (
            <select
              className="data-editor"
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={onKeyDown}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          );
        };
        component = (
          <DataSheet
            className={'test'}
            data={data}
            valueRenderer={cell => cell.data}
            onChange={(cell, i, j, value) => (data[i][j].data = value)}
            dataEditor={props => {
              const { value, onKeyDown, onChange } = props;
              return (
                <input
                  type="range"
                  className="data-editor"
                  value={value}
                  min="1"
                  max="5"
                  onChange={e => onChange(e.target.value)}
                  onKeyDown={onKeyDown}
                />
              );
            }}
          />
        );
        wrapper = mount(component);
        expect(
          wrapper.find('.value-viewer').nodes.map(n => n.innerHTML),
        ).toEqual(['4', '2', '3', '5']);

        const cells = wrapper.find('td');
        cells.at(0).simulate('mouseDown');
        cells.at(0).simulate('mouseUp');
        cells.at(0).simulate('doubleClick');
        expect(wrapper.find('td.cell.selected select').node.value).toEqual('4');

        wrapper
          .find('td.cell.selected select')
          .simulate('change', { target: { value: '5' } });
        wrapper
          .find('td.cell.selected select')
          .simulate('keydown', { keyCode: ENTER_KEY });
        expect(data[0][0].data).toEqual(5);

        // should have gone down one cell on ENTER
        triggerKeyDownEvent(wrapper, ENTER_KEY);
        const input = cells.at(2).find('input');
        expect(input.node.value).toEqual('3');
        input.simulate('change', { target: { value: '1' } });
        triggerKeyDownEvent(input, ENTER_KEY);
        expect(data[1][0].data).toEqual('1');
      });
    });
  });

  describe('DataSheet change events', () => {
    let data = [];
    let component = null;
    let wrapper = null;
    let handleChange = null;
    let handlePaste = null;
    let handleCellsChanged = null;
    jsdom();

    const changeData = changes => {
      const newData = data.map(row => [...row]);
      changes.forEach(({ cell, row, col, value }) => {
        newData[row][col] = { data: value };
      });

      return newData;
    };

    const cellCoords = (cell, data) => {
      let col = -1,
        row = -1;
      data.forEach((currentRow, rowIndex) => {
        if (col < 0) {
          const colIndex = currentRow.findIndex(element => element === cell);
          if (colIndex > -1) {
            col = colIndex;
            row = rowIndex;
          }
        }
      });
      if (row < 0 || col < 0) {
        throw new Error(
          'Could not find coords for cell ' + JSON.stringify(cell),
        );
      }
      return [row, col];
    };

    beforeEach(() => {
      data = [
        [{ data: 4 }, { data: 2 }],
        [{ data: 3 }, { data: 5 }],
      ];

      component = (
        <DataSheet
          data={[[...data[0]], [...data[1]]]}
          valueRenderer={cell => cell.data}
        />
      );
      wrapper = mount(component);
    });
    afterEach(() => {
      wrapper.instance().removeAllListeners();
    });

    describe('onChange with no other handlers', () => {
      beforeEach(() => {
        handleChange = sinon.spy((cell, row, col, value) => {
          const newData = changeData([{ cell, row, col, value }]);
          wrapper.setProps({ data: newData });
        });
        wrapper.setProps({ onChange: handleChange });
      });

      it('should be called once on single cell edit', () => {
        const td = wrapper.find('td').first();
        const cell = data[0][0];
        td.simulate('mouseDown');
        triggerKeyDownEvent(td, '1'.charCodeAt(0));
        td.find('input').node.value = '213';
        td.find('input').simulate('change');
        td.find('input').simulate('keydown', { keyCode: ENTER_KEY });
        expect(handleChange.callCount).toEqual(1);
        expect(handleChange.firstCall.calledWith(cell, 0, 0, '213')).toEqual(
          true,
        );
      });

      it('should be called multiple times when pasting', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
        setTimeout(() => {
          expect(handleChange.callCount).toEqual(4);
          expect(
            handleChange.firstCall.calledWith(data[0][0], 0, 0, '99'),
          ).toEqual(true);
          expect(
            handleChange.secondCall.calledWith(data[0][1], 0, 1, '100'),
          ).toEqual(true);
          expect(
            handleChange.thirdCall.calledWith(data[1][0], 1, 0, '1001'),
          ).toEqual(true);
          expect(
            handleChange.lastCall.calledWith(data[1][1], 1, 1, '1002'),
          ).toEqual(true);
          done();
        }, 1);
      });

      it('should be called multiple times when deleting multiple cells', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseOver');

        triggerKeyDownEvent(wrapper, DELETE_KEY);
        setTimeout(() => {
          expect(handleChange.calledTwice).toEqual(true);
          expect(
            handleChange.firstCall.calledWith(data[0][0], 0, 0, ''),
          ).toEqual(true);
          expect(
            handleChange.secondCall.calledWith(data[0][1], 0, 1, ''),
          ).toEqual(true);
          done();
        }, 1);
      });
    });

    describe('onPaste', () => {
      beforeEach(() => {
        handleChange = sinon.spy((cell, row, col, value) => {
          const newData = changeData([{ cell, row, col, value }]);
          wrapper.setProps({ data: newData });
        });
        handlePaste = sinon.spy(changes => {
          // really inefficient but does the trick for small test
          const indexed = [];
          changes.forEach(changedRow => {
            changedRow.forEach(change => {
              const [row, col] = cellCoords(change.cell, data);
              indexed.push({
                cell: change.cell,
                value: change.data,
                row,
                col,
              });
            });
          });
          const newData = changeData(indexed);
          wrapper.setProps({ data: newData });
        });
        wrapper.setProps({ onChange: handleChange, onPaste: handlePaste });
      });

      it('should not be called on single cell edit', () => {
        const td = wrapper.find('td').first();
        const cell = data[0][0];
        td.simulate('mouseDown');
        triggerKeyDownEvent(td, '1'.charCodeAt(0));
        td.find('input').node.value = '213';
        td.find('input').simulate('change');
        td.find('input').simulate('keydown', { keyCode: ENTER_KEY });
        expect(handleChange.callCount).toEqual(1);
        expect(handleChange.firstCall.calledWith(cell, 0, 0, '213')).toEqual(
          true,
        );
        expect(handlePaste.notCalled).toEqual(true);
      });

      it('should be called once when pasting', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
        expect(handlePaste.calledOnce).toBe(true);
        expect(
          handlePaste.firstCall.calledWith([
            [
              { cell: data[0][0], data: '99' },
              { cell: data[0][1], data: '100' },
            ],
            [
              { cell: data[1][0], data: '1001' },
              { cell: data[1][1], data: '1002' },
            ],
          ]),
        ).toBe(true);

        setTimeout(() => {
          expect(handleChange.called).toBe(false);
          done();
        }, 1);
      });

      it('should be not called when deleting multiple cells', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseOver');

        triggerKeyDownEvent(wrapper, DELETE_KEY);
        setTimeout(() => {
          expect(handleChange.calledTwice).toBe(true);
          expect(handleChange.firstCall.calledWith(data[0][0], 0, 0, '')).toBe(
            true,
          );
          expect(handleChange.secondCall.calledWith(data[0][1], 0, 1, '')).toBe(
            true,
          );
          expect(handlePaste.notCalled).toBe(true);
          done();
        }, 1);
      });
    });

    describe('onCellsChanged', () => {
      beforeEach(() => {
        handleChange = sinon.spy();
        handlePaste = sinon.spy();
        handleCellsChanged = sinon.spy(changes => {
          const newData = changeData(changes);
          setTimeout(() => {
            wrapper.setProps({ data: newData });
          }, 5);
        });
        wrapper.setProps({
          onChange: handleChange,
          onPaste: handlePaste,
          onCellsChanged: handleCellsChanged,
        });
      });

      it('should be called on single cell edit', done => {
        const td = wrapper.find('td').first();
        const cell = data[0][0];
        td.simulate('mouseDown');
        triggerKeyDownEvent(td, '1'.charCodeAt(0));
        td.find('input').node.value = '213';
        td.find('input').simulate('change');
        td.find('input').simulate('keydown', { keyCode: ENTER_KEY });
        expect(handlePaste.called).toBe(false);
        expect(handleCellsChanged.calledOnce).toBe(true);
        expect(
          handleCellsChanged.firstCall.calledWith([
            { cell, row: 0, col: 0, value: '213' },
          ]),
        ).toBe(true);

        setTimeout(() => {
          expect(handleChange.called).toBe(false);
          done();
        }, 1);
      });

      it('should be called with two arguments if pasted data exceeds bounds', done => {
        wrapper.find('td').at(3).simulate('mouseDown');
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
        expect(handlePaste.called).toBe(false);
        setTimeout(() => {
          expect(handleCellsChanged.calledOnce).toBe(true);
          expect(
            handleCellsChanged.firstCall.calledWith(
              [{ cell: data[1][1], row: 1, col: 1, value: '99' }],
              [
                { row: 1, col: 2, value: '100' },
                { row: 2, col: 1, value: '1001' },
                { row: 2, col: 2, value: '1002' },
              ],
            ),
          ).toBe(true);
          expect(handleChange.called).toBe(false);
          done();
        }, 100);
      });

      it('should be called once when pasting', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('paste', false, true);
        evt.clipboardData = { getData: type => '99\t100\n1001\t1002' };
        document.dispatchEvent(evt);
        expect(handlePaste.called).toBe(false);
        setTimeout(() => {
          expect(handleCellsChanged.calledOnce).toBe(true);
          expect(
            handleCellsChanged.firstCall.calledWith([
              { cell: data[0][0], row: 0, col: 0, value: '99' },
              { cell: data[0][1], row: 0, col: 1, value: '100' },
              { cell: data[1][0], row: 1, col: 0, value: '1001' },
              { cell: data[1][1], row: 1, col: 1, value: '1002' },
            ]),
          ).toBe(true);
          expect(handleChange.called).toBe(false);
          done();
        }, 100);
      });

      it('should be called once when deleting multiple cells', done => {
        wrapper.find('td').at(0).simulate('mouseDown');
        wrapper.find('td').at(1).simulate('mouseOver');

        triggerKeyDownEvent(wrapper, DELETE_KEY);

        setTimeout(() => {
          expect(handleCellsChanged.calledOnce).toBe(true);
          expect(
            handleCellsChanged.calledWith([
              { cell: data[0][0], row: 0, col: 0, value: '' },
              { cell: data[0][1], row: 0, col: 1, value: '' },
            ]),
          ).toBe(true);
          expect(handlePaste.called).toBe(false);
          expect(handleChange.called).toBe(false);
          done();
        }, 100);
      });
    });
  });
});

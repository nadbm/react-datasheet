import expect from 'expect'
import { filterCellExtraAttributes } from '../src/utils/utils';

describe('Utils Unit Test', () => {

  describe('filterCellExtraAttributes', () => {
    it('Not attributes', () => {
      expect(filterCellExtraAttributes()).toEqual({});
    });

    it('Trying to set invalid attributes', () => {
      const sourceAttribs = {
        onClick: () => {},
        onMouseOver: () => {},
        'data-hint': 'Hint'
      };

      const expectAttribs = {
        'data-hint': 'Hint'
      };

      expect(filterCellExtraAttributes(sourceAttribs)).toEqual(expectAttribs);
    });

    it('Trying to set only valid attributes', () => {
      const attribs = {
        'data-hint': 'Hint',
        'data-color': '#fff',
        'data-x': 1
      };

      const expectAttribs = {
        'data-hint': 'Hint'
      };

      expect(filterCellExtraAttributes(attribs)).toEqual(attribs);
    });

    it('Trying to set only not valid attributes', () => {
      const attribs = {
        onClick: () => {},
        onMouseOver: () => {},
        style: 'width: 100px;',
        colSpan: 3,
        rowSpan: 1
      };

      expect(filterCellExtraAttributes(attribs)).toEqual({});
    });
  });
});
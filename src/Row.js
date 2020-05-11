import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CellShape from './CellShape';

class Row extends PureComponent {
  render() {
    return <tr>{this.props.children}</tr>;
  }
}

Row.propTypes = {
  row: PropTypes.number.isRequired,
  cells: PropTypes.arrayOf(PropTypes.shape(CellShape)).isRequired,
};

export default Row;

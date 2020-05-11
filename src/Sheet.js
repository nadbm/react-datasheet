import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Sheet extends PureComponent {
  render() {
    return (
      <table className={this.props.className}>
        <tbody>{this.props.children}</tbody>
      </table>
    );
  }
}

Sheet.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default Sheet;

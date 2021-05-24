import React from 'react';
import PropTypes from 'prop-types';

export default function HorizontalLine({ width }) {
  return (
    <hr
      className='mt-0 mb-0'
      style={{
        alignSelf: 'center',
        width,
      }}
    />
  );
}

HorizontalLine.propTypes = {
  width: PropTypes.string,
};

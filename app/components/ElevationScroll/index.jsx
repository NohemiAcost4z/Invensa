import React from 'react';
import PropTypes from 'prop-types';

function ElevationScroll({ children, elevationColor, trigger }) {
  return children
    ? React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        sx: {
          backgroundColor: trigger ? elevationColor : 'transparent',
          transition: 'background-color 0.3s ease',
        },
      })
    : null;
}

ElevationScroll.propTypes = {
  children: PropTypes.element,
};

export { ElevationScroll };

import React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';

function ElevationScroll({ children, elevationColor }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== 'undefined' ? window : undefined,
  });

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

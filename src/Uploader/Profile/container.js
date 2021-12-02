import React from 'react';
import ComponentView from './index';

const Named = React.forwardRef(function Named(props, ref) {
  return <ComponentView {...props} fwdref={ref} />;
});

export default Named;

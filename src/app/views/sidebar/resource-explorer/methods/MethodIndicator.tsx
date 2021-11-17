import { Icon, TooltipHost } from '@fluentui/react';
import React from 'react';

import { getStyleFor, getMethodIcon } from '../../../../utils/http-methods.utils';

const MethodIndicator = (props: any) => {
  const { methods } = props;
  return (
    <span style={{ float: 'right', position: 'absolute', right: 1 }}>
      {methods.map((method: string, index: number) => {
        return (
          <TooltipHost key={`tool-tip-${index}`} content={`${method}`}>
            <Icon
              style={{ color: getStyleFor(method), textAlign: 'right' }}
              iconName={getMethodIcon(method)} />
          </TooltipHost>
        );
      })}
    </span>
  );
}

export default MethodIndicator;

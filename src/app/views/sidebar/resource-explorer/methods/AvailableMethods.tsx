import {
  Checkbox,
  Icon, Stack
} from '@fluentui/react';
import React from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getMethodIcon, getStyleFor } from '../../../../utils/http-methods.utils';
import { classes } from './methods.styles';

const AvailableMethods = () => {

  httpMethods.forEach((element: any) => {
    element.selected = true;
    element.icon = getMethodIcon(element.text)
  });

  return (
    <Stack horizontal wrap>
      {httpMethods.map((method: any, index: number) => {
        return (
          <Checkbox key={index} className={classes.checkbox} checked={true} label={method.text}
            onRenderLabel={() => {
              return (
                <span style={{ marginTop: 5 }}>
                  <Icon
                    style={{ color: getStyleFor(method.text) }}
                    className={classes.icon}
                    iconName={method.icon} />
                  {method.text}
                </span>
              )
            }}
            styles={{
              label: {
                display: 'block'
              }
            }} />
        );
      })}
    </Stack>
  );
}

export default AvailableMethods;

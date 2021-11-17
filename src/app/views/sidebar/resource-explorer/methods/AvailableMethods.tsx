import {
  Checkbox,
  Icon, Label, Stack
} from '@fluentui/react';
import React from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getMethodIcon, getStyleFor } from '../../../../utils/http-methods.utils';

const AvailableMethods = () => {


  httpMethods.forEach((element: any) => {
    element.selected = true;
    element.icon = getMethodIcon(element.text)
  });

  return (
    <Stack>
      {httpMethods.map((method: any, index: number) => {
        return (
          <Label key={index} style={{ marginRight: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox checked={true} />
            <Icon
              style={{ color: getStyleFor(method.text), marginRight: 3, alignItems: 'center' }}
              iconName={method.icon} />
            {method.text}
          </Label>
        );
      })}
    </Stack>
  );
}

export default AvailableMethods;

import {
  Icon, IDropdownOption, Label, Stack
} from '@fluentui/react';
import React from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getStyleFor } from '../../../../utils/badge-color';

const AvailableMethods = () => {
  httpMethods.forEach(element => {
    element.selected = true;
  });

  return (
    <Stack horizontal wrap tokens={{
      childrenGap: 10
    }}>
      {httpMethods.map((method: IDropdownOption, index: number) => {
        return (
          <Label key={index} style={{ marginRight: 5 }}>
            <Icon
              style={{ color: getStyleFor(method.text), marginRight: 3, alignItems: 'center' }}
              iconName="CheckboxFill" />
            {method.text}
          </Label>
        );
      })}
    </Stack>
  )
}

export default AvailableMethods;

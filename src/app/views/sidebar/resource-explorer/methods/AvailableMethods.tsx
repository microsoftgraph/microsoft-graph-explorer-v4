import {
  Icon, IDropdownOption, Label
} from '@fluentui/react';
import React from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getStyleFor } from '../../../../utils/badge-color';

const AvailableMethods = () => {
  httpMethods.forEach(element => {
    element.selected = true;
  });

  return (
    <>
      {httpMethods.map((method: IDropdownOption, index: number) => {
        return (
          <Label key={index}>
            <Icon
              style={{ color: getStyleFor(method.text), marginRight: 3, alignItems: 'center' }}
              iconName="CheckboxFill" />
            {method.text}
          </Label>
        );
      })}
    </>
  )
}

export default AvailableMethods;

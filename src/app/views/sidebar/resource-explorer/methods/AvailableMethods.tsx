import {
  Checkbox, ICheckboxStyleProps,
  ICheckboxStyles, IDropdownOption, Stack
} from '@fluentui/react';
import React, { useState } from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getStyleFor } from '../../../../utils/badge-color';

interface IAvailableMethods {
  changeAvailableMethods: Function;
}

const AvailableMethods = (props: IAvailableMethods) => {
  httpMethods.forEach(element => {
    element.selected = true;
  });
  const [selectedMethods, setSelectedMethods] = useState<any[]>(httpMethods);

  const changeSelectedMethods = (ev?: any, checked?: boolean): void => {
    const methods = selectedMethods.map(a => ({ ...a }));
    methods[selectedMethods.findIndex(k => k.key === ev.key)].selected = checked;
    setSelectedMethods(methods);
    const availableMethods: string[] = getMethodsInStringArray(methods);
    props.changeAvailableMethods(availableMethods);
  }

  const getMethodsInStringArray = (methods: any[]) => {
    const methodsArray: string[] = [];
    methods.forEach((method: any) => {
      if (method.selected) {
        methodsArray.push(method.text);
      }
    });
    return methodsArray;
  }

  return (
    <Stack tokens={{ childrenGap: 3 }}>
      {selectedMethods.map((method: IDropdownOption, index: number) => {
        const checkBoxStyles = (properties: ICheckboxStyleProps): ICheckboxStyles => {
          const background = getStyleFor(method.text);
          const chkStyles: ICheckboxStyles = {
            checkbox: [
              { background },
              properties.checked && { background }
            ]
          };
          return chkStyles;
        };

        return (
          <Checkbox
            styles={checkBoxStyles}
            key={index}
            label={method.text}
            checked={method.selected}
            onChange={(event, choice) => changeSelectedMethods(method, choice)} />
        );
      })}
    </Stack>
  )
}

export default AvailableMethods;

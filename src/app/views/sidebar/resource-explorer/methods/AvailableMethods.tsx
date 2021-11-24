import {
  Checkbox,
  Icon, Stack
} from '@fluentui/react';
import React, { useState } from 'react';

import { httpMethods } from '../../../../../types/query-runner';
import { getMethodIcon, getStyleFor } from '../../../../utils/http-methods.utils';
import { classes } from './methods.styles';

interface IAvailableMethods {
  changeAvailableMethods: Function;
}

const AvailableMethods = (props: IAvailableMethods) => {

  httpMethods.forEach((element: any) => {
    element.selected = true;
    element.icon = getMethodIcon(element.text)
  });

  const [selectedMethods, setSelectedMethods] = useState<any[]>(httpMethods);

  const changeSelectedMethods = (ev?: any, checked?: boolean): void => {
    const methods = selectedMethods.map(a => ({ ...a }));
    methods[selectedMethods.findIndex(k => k.key === ev.key)].selected = checked;
    setSelectedMethods(methods);
    const availableMethods: string[] = getMethodsAsStringArray(methods);
    props.changeAvailableMethods(availableMethods);
  }

  const getMethodsAsStringArray = (methods: any[]) => {
    const methodsArray: string[] = [];
    methods.forEach((method: any) => {
      if (method.selected) {
        methodsArray.push(method.text);
      }
    });
    return methodsArray;
  }

  return (
    <Stack horizontal wrap>
      {selectedMethods.map((method: any, index: number) => {
        return (
          <Checkbox
            key={index}
            className={classes.checkbox}
            checked={method.selected}
            label={method.text}
            onChange={(event, choice) => changeSelectedMethods(method, choice)}
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

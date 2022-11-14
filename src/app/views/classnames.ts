import { classNamesFunction, ITheme } from '@fluentui/react';

export interface IClassNames {
  [prop: string]: unknown;
  theme?: ITheme;
  styles?: object;
}

export function classNames({ styles, theme }: IClassNames): any {
  const getClassNames = classNamesFunction();
  return getClassNames(styles, theme);
}

import { classNamesFunction, ITheme } from 'office-ui-fabric-react';

interface IClassNames {
  theme?: ITheme;
  styles?: object;
}

export function classNames({ styles, theme }: IClassNames): any {
  const getClassNames = classNamesFunction();
  return getClassNames(styles, theme);
}

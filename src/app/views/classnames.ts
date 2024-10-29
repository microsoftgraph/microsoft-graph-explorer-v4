import { classNamesFunction, IProcessedStyleSet, ITheme} from '@fluentui/react';
import {IStyleSetBase} from '@fluentui/merge-styles'

interface IClassNames {
  [prop: string]: unknown;
  theme?: ITheme;
  styles?: object;
}

export function classNames({ styles, theme }: IClassNames): IProcessedStyleSet<IStyleSetBase> {
  const getClassNames = classNamesFunction();
  return getClassNames(styles, theme);
}

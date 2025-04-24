import { tokens } from '@fluentui/react-components';

const commonHighlightColors = {
  default: 'rgba(0, 0, 0, 0.13)',
  subtle: 'rgba(0, 0, 0, 0.06)'
};

const createColorSet = (defaultColor: string, subtleColor: string) => ({
  default: defaultColor,
  subtle: subtleColor,
  highlightColors: commonHighlightColors
});

const createForegroundColors = (
  defaultSet: { default: string; subtle: string },
  darkSet: { default: string; subtle: string },
  lightSet: { default: string; subtle: string },
  accentSet: { default: string; subtle: string },
  goodSet: { default: string; subtle: string },
  warningSet: { default: string; subtle: string },
  attentionSet: { default: string; subtle: string }
) => ({
  default: createColorSet(defaultSet.default, defaultSet.subtle),
  dark: createColorSet(darkSet.default, darkSet.subtle),
  light: createColorSet(lightSet.default, lightSet.subtle),
  accent: createColorSet(accentSet.default, accentSet.subtle),
  good: createColorSet(goodSet.default, goodSet.subtle),
  warning: createColorSet(warningSet.default, warningSet.subtle),
  attention: createColorSet(attentionSet.default, attentionSet.subtle)
});

const darkDefaultForegroundColors = createForegroundColors(
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForeground4 },
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorBrandForeground1, subtle: tokens.colorBrandForeground2 },
  { default: tokens.colorPaletteGreenForeground1, subtle: tokens.colorPaletteGreenForeground2 },
  { default: tokens.colorPaletteYellowForeground1, subtle: tokens.colorPaletteYellowForeground2 },
  { default: tokens.colorPaletteRedForeground1, subtle: tokens.colorPaletteRedForeground2 }
);

const darkEmphasisForegroundColors = createForegroundColors(
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForeground4 },
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorBrandForeground1, subtle: tokens.colorBrandForeground2 },
  { default: tokens.colorPaletteGreenForeground1, subtle: tokens.colorPaletteGreenForeground2 },
  { default: tokens.colorPaletteRedForeground1, subtle: tokens.colorPaletteRedForeground2 },
  { default: tokens.colorPaletteYellowForeground1, subtle: tokens.colorPaletteYellowForeground2 }
);

const lightDefaultForegroundColors = createForegroundColors(
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForeground2 },
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorBrandForeground1, subtle: tokens.colorBrandForeground1 },
  { default: tokens.colorPaletteGreenForeground1, subtle: tokens.colorPaletteGreenForeground2 },
  { default: tokens.colorPaletteYellowForeground1, subtle: tokens.colorPaletteYellowForeground2 },
  { default: tokens.colorPaletteRedForeground1, subtle: tokens.colorPaletteRedForeground2 }
);

const lightEmphasisForegroundColors = createForegroundColors(
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForeground2 },
  { default: tokens.colorNeutralForeground1, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorNeutralForegroundOnBrand, subtle: tokens.colorNeutralForegroundDisabled },
  { default: tokens.colorBrandForeground1, subtle: tokens.colorBrandForeground2 },
  { default: tokens.colorPaletteGreenForeground1, subtle: tokens.colorPaletteGreenForeground2 },
  { default: tokens.colorPaletteYellowForeground1, subtle: tokens.colorPaletteYellowForeground2 },
  { default: tokens.colorPaletteRedForeground1, subtle: tokens.colorPaletteRedForeground2 }
);

export const darkThemeHostConfig: any = {
  containerStyles: {
    default: {
      foregroundColors: darkDefaultForegroundColors,
      backgroundColor: tokens.colorNeutralBackground1
    },
    emphasis: {
      foregroundColors: darkEmphasisForegroundColors,
      backgroundColor: tokens.colorNeutralBackground3
    }
  }
};

export const lightThemeHostConfig: any = {
  containerStyles: {
    default: {
      foregroundColors: lightDefaultForegroundColors,
      backgroundColor: tokens.colorNeutralBackground1
    },
    emphasis: {
      foregroundColors: lightEmphasisForegroundColors,
      backgroundColor: tokens.colorNeutralBackground5
    }
  }
};
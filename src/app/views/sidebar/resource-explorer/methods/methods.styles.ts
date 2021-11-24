import { mergeStyleSets } from '@fluentui/react';

export const classes = mergeStyleSets({
  checkbox: {
    marginRight: 5, display: 'flex', flexDirection: 'row', alignItems: 'center',
    padding: 3,
    minWidth: '55px'
  },
  icon: { marginRight: 3, alignItems: 'center', paddingTop: 5 }
});

import { FontWeights, mergeStyleSets } from '@fluentui/react';

export const styles = mergeStyleSets({
  iconButton: {
    cursor: 'pointer',
    height: 20
  },
  callout: {
    width: 320,
    padding: '20px 24px'
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight
  },
  link: {
    display: 'block',
    marginTop: 20
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20
  }
});

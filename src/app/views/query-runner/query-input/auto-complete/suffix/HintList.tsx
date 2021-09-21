import { Link, Separator, Text } from '@fluentui/react';
import React from 'react';

import { IHint } from './suffix-util';
import { styles } from './suffix.styles';

export const HintList = ({ hints }: any) => {
  const listItems = hints.map((hint: IHint, index: any) => <div key={index}>
    {hint.description && <Text block variant='small' id={'description' + index}>
      {hint.description}
    </Text>}
    {hint.link && <Link href={hint.link.url} target='_blank' className={styles.link}>
      {hint.link.name}
    </Link>}
    <Separator />
  </div>
  );
  return listItems;
};

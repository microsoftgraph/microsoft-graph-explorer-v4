import { DefaultButton, Separator, Stack, Text } from '@fluentui/react';
import React from 'react';

import { IHint } from './suffix-util';
import { styles } from './suffix.styles';

export const HintList = ({ hints }: any) => {
  const listItems = hints.map((hint: IHint, index: any) => <div key={index}>
    {hint.description && <Text block variant='small' id={'description' + index}>
      {hint.description}
    </Text>}
    {hint.link &&
      <Stack className={styles.buttons} tokens={{ childrenGap: 8 }} horizontal>
        <DefaultButton href={hint.link.url} target='_blank' className={styles.link}>
          {hint.link.name}
        </DefaultButton>
      </Stack>
    }
    <Separator />
  </div>
  );
  return listItems;
};

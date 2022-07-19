import { DefaultButton, Separator, Stack, Text } from '@fluentui/react';
import React from 'react';
import { componentNames, telemetry, eventTypes } from '../../../../../../telemetry';
import { validateExternalLink } from '../../../../../utils/external-link-validation';

import { IHint } from './suffix-util';
import { styles } from './suffix.styles';

export const HintList = ({ hints }: any) => {

  const onDocumentationLinkClicked = (item: IHint) => {
    window.open(item.link?.url, '_blank');
    trackDocumentLinkClickedEvent(item);
  };

  const trackDocumentLinkClickedEvent = async (item: IHint): Promise<void> => {
    const properties: { [key: string]: any } = {
      ComponentName: componentNames.DOCUMENTATION_LINK,
      SampleId: 'Autocomplete',
      SampleName: 'Autocomplete',
      SampleCategory: 'Autocomplete',
      Link: item.link?.url
    };
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);

    // Check if link throws error
    validateExternalLink(item.link?.url || '', componentNames.DOCUMENTATION_LINK, item.link?.name);
  }

  return hints.map((hint: IHint, index: any) => <div key={index}>
    {hint.description && <Text block variant='medium' id={'description' + index}>
      {hint.description}
    </Text>}
    {hint.link &&
      <Stack className={styles.buttons} tokens={{ childrenGap: 8 }} horizontal>
        <DefaultButton onClick={() => onDocumentationLinkClicked(hint)}
          className={styles.link}>
          {hint.link.name}
        </DefaultButton>
      </Stack>
    }
    <Separator />
  </div>
  );
};

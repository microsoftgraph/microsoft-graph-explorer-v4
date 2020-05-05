import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
export function termsOfUseMessage(termsOfUse: any, actions: any, classes: any, language: string) {
  return termsOfUse && (
  <MessageBar messageBarType={MessageBarType.info}
    isMultiline={false} onDismiss={actions.clearTermsOfUse}>
    <FormattedMessage id='use the Microsoft Graph API' />
        <a className={classes.links} href={'https://docs.microsoft.com/' + language +
      '/legal/microsoft-apis/terms-of-use?context=graph/context'} target='_blank'>
      <FormattedMessage id='Terms of use' /></a>.
    <FormattedMessage id='View the' />
        <a className={classes.links} href={'https://privacy.microsoft.com/' + language + '/privacystatement'}
        target='_blank'>
      <FormattedMessage id='Microsoft Privacy Statement' /></a>
  </MessageBar>);
}

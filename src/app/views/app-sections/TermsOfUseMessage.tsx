import { MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { componentNames, telemetry } from '../../../telemetry';
export function termsOfUseMessage(termsOfUse: any, actions: any, classes: any, language: string) {
  return termsOfUse && (
    <MessageBar messageBarType={MessageBarType.info}
      isMultiline={true}
      onDismiss={actions.clearTermsOfUse}
      dismissButtonAriaLabel='Close'
      style={{ position: 'relative' }}>
      <FormattedMessage id='use the Microsoft Graph API' />
      <a onClick={(e) => telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.MICROSOFT_APIS_TERMS_OF_USE_LINK)}
        className={classes.links} href={'https://docs.microsoft.com/' + language +
          '/legal/microsoft-apis/terms-of-use?context=graph/context'} target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Terms of use' /></a>.
      <FormattedMessage id='View the' />
      <a onClick={(e) => telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.MICROSOFT_PRIVACY_STATEMENT_LINK)}
        className={classes.links} href={'https://privacy.microsoft.com/' + language + '/privacystatement'}
        target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Microsoft Privacy Statement' /></a>.
    </MessageBar>);
}

import { Link, MessageBar, MessageBarType, styled } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../appLocale';
import { componentNames, telemetry } from '../../../telemetry';
import { IRootState } from '../../../types/root';
import { clearTermsOfUse } from '../../services/actions/terms-of-use-action-creator';
import { appStyles } from '../App.styles';

const styledTermsOfUseMessage = () => {

  const { termsOfUse } =
    useSelector((state: IRootState) => state);

  const dispatch = useDispatch();
  if (termsOfUse) {
    return <MessageBar messageBarType={MessageBarType.info}
      isMultiline={true}
      onDismiss={() => dispatch(clearTermsOfUse())}
      dismissButtonAriaLabel='Close'
      style={{ position: 'relative' }}>
      <FormattedMessage id='use the Microsoft Graph API' />
      <Link
        onClick={(e) =>
          telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_APIS_TERMS_OF_USE_LINK)}
        href={'https://learn.microsoft.com/' + geLocale +
          '/legal/microsoft-apis/terms-of-use?context=graph/context'} target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Terms of use' /></Link>.
      <FormattedMessage id='View the' />
      <Link
        onClick={(e) =>
          telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_PRIVACY_STATEMENT_LINK)}
        href={'https://privacy.microsoft.com/' + geLocale + '/privacystatement'}
        target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Microsoft Privacy Statement' /></Link>.
    </MessageBar>;
  }
  return <div />;
}
// @ts-ignore
const TermsOfUseMessage = styled(styledTermsOfUseMessage, appStyles);
export default TermsOfUseMessage;
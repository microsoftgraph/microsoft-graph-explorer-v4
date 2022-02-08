import { MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../appLocale';
import { componentNames, telemetry } from '../../../telemetry';
import { IRootState } from '../../../types/root';
import { clearTermsOfUse } from '../../services/actions/terms-of-use-action-creator';
import { classNames } from '../classnames';

const TermsOfUseMessage = (props: any) => {

  const { termsOfUse } =
    useSelector((state: IRootState) => state);


  const classes = classNames(props);
  const dispatch = useDispatch();
  if (termsOfUse) {
    return <MessageBar messageBarType={MessageBarType.info}
      isMultiline={true}
      onDismiss={() => dispatch(clearTermsOfUse())}
      dismissButtonAriaLabel='Close'
      style={{ position: 'relative' }}>
      <FormattedMessage id='use the Microsoft Graph API' />
      <a
        onClick={(e) =>
          telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.MICROSOFT_APIS_TERMS_OF_USE_LINK)}
        className={classes.links} href={'https://docs.microsoft.com/' + geLocale +
          '/legal/microsoft-apis/terms-of-use?context=graph/context'} target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Terms of use' /></a>.
      <FormattedMessage id='View the' />
      <a
        onClick={(e) =>
          telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.MICROSOFT_PRIVACY_STATEMENT_LINK)}
        className={classes.links} href={'https://privacy.microsoft.com/' + geLocale + '/privacystatement'}
        target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Microsoft Privacy Statement' /></a>.
    </MessageBar>;
  }
  return <div />;
}

export default TermsOfUseMessage;
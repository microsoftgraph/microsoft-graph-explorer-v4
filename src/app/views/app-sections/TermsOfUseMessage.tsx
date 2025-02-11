import { Link, MessageBar, MessageBarType, styled } from '@fluentui/react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { componentNames, telemetry } from '../../../telemetry';
import { clearTermsOfUse } from '../../services/slices/terms-of-use.slice';
import { translateMessage } from '../../utils/translate-messages';
import { appStyles } from '../App.styles';

const StyledTermsOfUseMessage = () => {

  const  termsOfUse = useAppSelector((state) => state.termsOfUse);

  const dispatch = useAppDispatch();
  if (termsOfUse) {
    return <MessageBar messageBarType={MessageBarType.info}
      isMultiline={true}
      onDismiss={() => dispatch(clearTermsOfUse())}
      dismissButtonAriaLabel='Close'
      style={{ position: 'relative' }}>
      {translateMessage('use the Microsoft Graph API')}
      <Link
        onClick={(e) =>
          telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_APIS_TERMS_OF_USE_LINK)}
        href={'https://learn.microsoft.com/legal/microsoft-apis/terms-of-use?context=graph/context'}
        target='_blank'
        rel='noopener noreferrer'
        underline>
        {translateMessage('Terms of use')}</Link>.
      {translateMessage('View the')}
      <Link
        onClick={(e) =>
          telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_PRIVACY_STATEMENT_LINK)}
        href={'https://privacy.microsoft.com/privacystatement'}
        target='_blank' rel='noopener noreferrer'
        underline>
        {translateMessage('Microsoft Privacy Statement')}</Link>.
    </MessageBar>;
  }
  return <div />;
}
// @ts-ignore
const TermsOfUseMessage = styled(StyledTermsOfUseMessage, appStyles);
export default TermsOfUseMessage;
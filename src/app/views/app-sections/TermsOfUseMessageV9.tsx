import { Link, makeStyles, Button, MessageBar, MessageBarActions, MessageBarBody } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { componentNames, telemetry } from '../../../telemetry';
import { clearTermsOfUse } from '../../services/slices/terms-of-use.slice';
import { translateMessage } from '../../utils/translate-messages';

const useTermsStyles = makeStyles({
  root: {
    position: 'relative'
  }
});

const TermsOfUseMessageV9 = () => {

  const  termsOfUse = useAppSelector((state) => state.termsOfUse);
  const termsStyles = useTermsStyles();

  const dispatch = useAppDispatch();
  if (termsOfUse) {
    return <MessageBar intent={'info'}
      className={termsStyles.root}>
      <MessageBarBody>
        {translateMessage('use the Microsoft Graph API')}
        <Link
          onClick={(e) =>
            telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
              componentNames.MICROSOFT_APIS_TERMS_OF_USE_LINK)}
          href={'https://learn.microsoft.com/legal/microsoft-apis/terms-of-use?context=graph/context'}
          target='_blank'
          rel='noopener noreferrer'
          inline>
          {translateMessage('Terms of use')}
        </Link>.
        {translateMessage('View the')}
        <Link
          onClick={(e) =>
            telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
              componentNames.MICROSOFT_PRIVACY_STATEMENT_LINK)}
          href={'https://privacy.microsoft.com/privacystatement'}
          target='_blank'
          rel='noopener noreferrer'
          inline>
          {translateMessage('Microsoft Privacy Statement')}</Link>.
      </MessageBarBody>
      <MessageBarActions
        containerAction={
          <Button
            onClick={() => dispatch(clearTermsOfUse())}
            aria-label="dismiss"
            appearance="transparent"
            icon={<DismissRegular />}
          />
        }
      />
    </MessageBar>;
  }
  return <div />;
}

export default TermsOfUseMessageV9;
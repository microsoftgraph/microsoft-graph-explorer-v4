import { Button, DialogActions, Field, Input, makeStyles, Spinner, Text } from '@fluentui/react-components';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { PopupsComponent } from '../../../services/context/popups-context';
import { applyCustomSamples } from '../../../services/custom-samples';
import { getDevxAccount, normalizeDevxUrl } from '../../../services/devx-api';
import { devxErrorCleared } from '../../../services/devx-events';
import { translateMessage } from '../../../utils/translate-messages';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';

const useStyles = makeStyles({
  form: { display: 'flex', flexDirection: 'column', rowGap: '16px' }
});

const CustomSamples = (props: PopupsComponent<{ accountKey: string }>) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const devxApi = useAppSelector(state => state.devxApi);
  const token = useAppSelector(state => !!state.auth.authToken.token);
  const [org, setOrg] = useState('');
  const [branchName, setBranchName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const operation = useRef<{ abort: () => void } | null>(null);
  const closed = useRef(false);
  const account = getDevxAccount(token);
  const { dismissPopup } = props;
  const eligible = account.eligible && devxApi.eligible && account.accountKey === props.data.accountKey;

  const trackApplyResult = (status: 'succeeded' | 'failed' | 'cancelled', reason?: string) => {
    telemetry.trackEvent(eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: status,
      ...(reason ? { Reason: reason } : {})
    });
  };

  const recordClose = (reason: 'cancel' | 'applied' | 'account-changed' | 'dismissed') => {
    if (closed.current) { return; }
    closed.current = true;
    if (operation.current) {
      trackApplyResult('cancelled', reason);
      operation.current.abort();
      operation.current = null;
    }
    telemetry.trackEvent(eventTypes.WINDOW_CLOSE_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: reason
    });
  };

  useEffect(() => {
    closed.current = false;
    dispatch(devxErrorCleared());
    telemetry.trackEvent(eventTypes.WINDOW_OPEN_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG });
    return () => recordClose('dismissed');
  }, []);

  useEffect(() => {
    if (!eligible) {
      recordClose('account-changed');
      dismissPopup();
    }
  }, [eligible, dismissPopup]);

  const apply = async (event: FormEvent) => {
    event.preventDefault();
    if (closed.current || devxApi.pending) { return; }
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_APPLY_BUTTON });
    setSubmitted(true);
    const validationFailure = !eligible ? 'unavailable'
      : !org.trim() || !branchName.trim() ? 'required-fields'
        : baseUrl.trim() && !normalizeDevxUrl(baseUrl) ? 'invalid-url' : '';
    if (validationFailure) {
      trackApplyResult('failed', validationFailure);
      return;
    }
    const request = dispatch(applyCustomSamples({ org, branchName, baseUrl }));
    operation.current = request;
    try {
      await request.unwrap();
      operation.current = null;
      if (closed.current) { return; }
      trackApplyResult('succeeded');
      recordClose('applied');
      dismissPopup();
    } catch (error) {
      operation.current = null;
      if (closed.current) { return; }
      if (error === translateMessage('Custom samples cancelled') ||
        (error as { name?: string })?.name === 'AbortError' ||
        (error as { name?: string })?.name === 'ConditionError') {
        trackApplyResult('cancelled', 'interrupted');
      } else {
        trackApplyResult('failed', 'loading-failed');
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={apply} noValidate>
      <Text>{translateMessage('Custom samples service warning')}</Text>
      <Field label={translateMessage('Organization')} required
        validationMessage={submitted && !org.trim() ? translateMessage('Required field') : undefined}>
        <Input value={org} onChange={(_, data) => setOrg(data.value)} disabled={devxApi.pending} />
      </Field>
      <Field label={translateMessage('Branch')} required
        validationMessage={submitted && !branchName.trim() ? translateMessage('Required field') : undefined}>
        <Input value={branchName} onChange={(_, data) => setBranchName(data.value)} disabled={devxApi.pending} />
      </Field>
      <Field label={translateMessage('DevX API URL')}
        hint={translateMessage('Custom samples URL hint')}
        validationMessage={submitted && baseUrl.trim() && !normalizeDevxUrl(baseUrl)
          ? translateMessage('Invalid custom samples URL') : undefined}>
        <Input value={baseUrl} onChange={(_, data) => setBaseUrl(data.value)} disabled={devxApi.pending} />
      </Field>
      {devxApi.error && <Text role='alert'>{devxApi.error}</Text>}
      {devxApi.pending && <Spinner label={translateMessage('Loading custom samples')} />}
      <DialogActions>
        <Button type='submit' appearance='primary' disabled={devxApi.pending}>
          {translateMessage('Apply')}
        </Button>
        <Button type='button' onClick={() => {
          telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
            ComponentName: componentNames.CUSTOM_SAMPLES_CANCEL_BUTTON
          });
          recordClose('cancel');
          dismissPopup();
        }}>
          {translateMessage('Cancel')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CustomSamples;

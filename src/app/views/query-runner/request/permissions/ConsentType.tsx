import { Spinner, Label, Tooltip, Button, makeStyles } from '@fluentui/react-components';
import { ArrowSyncRegular } from '@fluentui/react-icons';

import { IPermission } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';

interface IConsentType {
  item: IPermission;
  allPrincipalPermissions: string[];
  singlePrincipalPermissions: string[];
  itemNotInGrants?: Function,
  tenantGrantFetchPending: boolean | undefined;
  dispatch: Function;
}

const useStyles = makeStyles({
  consentTypeLabel: {
    textAlign: 'center',
    paddingLeft: '10px'
  }
});

export const PermissionConsentType = (props: IConsentType) => {
  const {
    item,
    allPrincipalPermissions,
    singlePrincipalPermissions,
    tenantGrantFetchPending,
    dispatch
  } = props;

  const consentStyles = useStyles();

  if (allPrincipalPermissions.includes(item.value)) {
    return (
      <Label className={consentStyles.consentTypeLabel}>
        {translateMessage('AllPrincipal')}
      </Label>
    );
  }

  if (singlePrincipalPermissions.includes(item.value)) {
    return (
      <Label className={consentStyles.consentTypeLabel}>
        {translateMessage('Principal')}
      </Label>
    );
  }

  const handleOnClick = () => {
    dispatch(fetchAllPrincipalGrants());
  };

  return (
    tenantGrantFetchPending ?
      (<Spinner></Spinner>) :
      (
        <Tooltip content={translateMessage('Reload consent-type')} relationship='label'>
          <Button
            onClick={handleOnClick}
            icon={<ArrowSyncRegular />}
            aria-label={translateMessage('Reload consent-type')}
            style={{ marginLeft: '50px' }}
          >
            {translateMessage('Reload')}
          </Button>
        </Tooltip>
      )
  );
};
import {
  Button,
  Tooltip,
  Label
} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { IPermission, IPermissionGrant } from '../../../../../types/permissions';
import { revokeScopes } from '../../../../services/actions/revoke-scopes.action';
import { REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../../../../services/graph-constants';
import { consentToScopes } from '../../../../services/slices/auth.slice';
import { getAllPrincipalGrant, getSinglePrincipalGrant } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { PermissionConsentType } from './ConsentType';
import { InfoRegular } from '@fluentui/react-icons';
import permissionStyles from './Permission.styles';

interface PermissionItemProps {
  item: IPermission;
  index: number;
  column: { key: string; fieldName?: string } | undefined;
}

const PermissionItem = (props: PermissionItemProps): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const scopes = useAppSelector((state) => state.scopes);
  const consentedScopes  = useAppSelector((state) => state.auth.consentedScopes);
  const user  = useAppSelector((state) => state.profile.user);
  const permissionGrants = useAppSelector((state) => state.permissionGrants);
  const { item, column } = props;
  const styles = permissionStyles();

  const consented = !!item.consented;

  const handleConsent = async (permission: IPermission): Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(consentToScopes(consentScopes));
  };

  const getAllPrincipalPermissions = (tenantWidePermissionsGrant: IPermissionGrant[]): string[] => {
    const allPrincipalPermissions = tenantWidePermissionsGrant.find((permission: IPermissionGrant) =>
      permission.consentType.toLowerCase() === 'allprincipals'
    );
    return allPrincipalPermissions ? allPrincipalPermissions.scope.split(' ') : [];
  };

  const userHasRequiredPermissions = (): boolean => {
    if (permissionGrants && permissionGrants.permissions && permissionGrants.permissions.length > 0) {
      const allPrincipalPermissions = getAllPrincipalPermissions(permissionGrants.permissions);
      const principalAndAllPrincipalPermissions = [...allPrincipalPermissions, ...consentedScopes];
      const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
      return requiredPermissions.every((scope) => principalAndAllPrincipalPermissions.includes(scope));
    }
    return false;
  };

  const ConsentTypeProperty = (): JSX.Element | null => {
    if (scopes && consented && user?.id) {
      const tenantWideGrant: IPermissionGrant[] = permissionGrants.permissions!;
      const allPrincipalPermissions = getAllPrincipalGrant(tenantWideGrant);
      const singlePrincipalPermissions: string[] = getSinglePrincipalGrant(tenantWideGrant, user?.id);
      const tenantGrantFetchPending = permissionGrants.pending;
      const consentTypeProperties = {
        item,
        allPrincipalPermissions,
        singlePrincipalPermissions,
        tenantGrantFetchPending,
        dispatch
      };
      return <PermissionConsentType {...consentTypeProperties} />;
    }
    return null;
  };

  const handleRevoke = async (permission: IPermission): Promise<void> => {
    dispatch(revokeScopes(permission.value));
  };

  const ConsentButton = (): JSX.Element => {
    if (consented) {
      if (userHasRequiredPermissions()) {
        return (
          <Button
            appearance='primary'
            onClick={() => handleRevoke(item)}
          >
            {translateMessage('Revoke')}
          </Button>
        );
      }
      return (
        <Tooltip content={translateMessage('You require the following permissions to revoke')} relationship='label'>
          <Button appearance='primary' disabled>
            {translateMessage('Revoke')}
          </Button>
        </Tooltip>
      );
    }
    return (
      <Button appearance='primary' onClick={() => handleConsent(item)}>
        {translateMessage('Consent')}
      </Button>
    );
  };


  if (column) {
    const content = item[column.fieldName as keyof IPermission] as string;
    switch (column.key) {
    case 'value':
      return (
        <div>
          {content}
          {props.index === 0 && (
            <Tooltip content={translateMessage('Least privileged permission')} relationship='label'>
              <Button className={styles.icon} icon={<InfoRegular />} appearance='subtle' size='small' />
            </Tooltip>
          )}
        </div>
      );

    case 'isAdmin':
      return (
        <div className={styles.adminLabel}>
          <Label weight='semibold'>{translateMessage(item.isAdmin ? 'Yes' : 'No')}</Label>
        </div>
      );

    case 'consented':
      return <ConsentButton />;

    case 'consentDescription':
      return (
        <Tooltip content={item.consentDescription} relationship='label'>
          <span>{item.consentDescription}</span>
        </Tooltip>
      );

    case 'consentType':
      return <ConsentTypeProperty />;

    default:
      return (
        <Tooltip content={content} relationship='label'>
          <span>{content}</span>
        </Tooltip>
      );
    }
  }
  return null;
};

export default PermissionItem;

import {
  DefaultButton, FontSizes, IColumn, IIconProps, IconButton, Label,
  PrimaryButton, TooltipHost, getId, getTheme
} from '@fluentui/react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../../store';
import { IPermission, IPermissionGrant } from '../../../../../types/permissions';
import { revokeScopes } from '../../../../services/actions/revoke-scopes.action';
import { REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../../../../services/graph-constants';
import { consentToScopes } from '../../../../services/slices/auth.slice';
import { getAllPrincipalGrant, getSinglePrincipalGrant } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { PermissionConsentType } from './ConsentType';
import { permissionStyles } from './Permission.styles';

interface PermissionItemProps {
  item: IPermission; index: number; column: IColumn | undefined;
}

const buttonIcon: IIconProps = {
  iconName: 'Info',
  style: {
    position: 'relative',
    top: '1px',
    left: '6px'
  }
};

const infoIcon: IIconProps = {
  iconName: 'Info'
};

const PermissionItem = (props: PermissionItemProps): JSX.Element | null => {
  const theme = getTheme();
  const dispatch: AppDispatch = useAppDispatch();
  const hostId: string = getId('tooltipHost');
  const { scopes, auth: { consentedScopes }, profile: { user }, permissionGrants } = useAppSelector((state) => state);
  const { item, column } = props;
  const consented = !!item.consented;

  const { adminLabelStyles, consentButtonStyles } = permissionStyles(theme);

  const handleConsent = async (permission: IPermission): Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(consentToScopes(consentScopes));
  };

  const getAllPrincipalPermissions = (tenantWidePermissionsGrant: IPermissionGrant[]): string[] => {
    const allPrincipalPermissions = tenantWidePermissionsGrant.find((permission: IPermissionGrant) =>
      permission.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
    return allPrincipalPermissions ? allPrincipalPermissions.scope.split(' ') : [];
  }

  const userHasRequiredPermissions = (): boolean => {
    if (permissionGrants && permissionGrants.permissions && permissionGrants.permissions.length > 0) {
      const allPrincipalPermissions = getAllPrincipalPermissions(permissionGrants.permissions);
      const principalAndAllPrincipalPermissions = [...allPrincipalPermissions, ...consentedScopes];
      const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
      return requiredPermissions.every(scope => principalAndAllPrincipalPermissions.includes(scope));
    }
    return false;
  }

  const ConsentTypeProperty = (): JSX.Element | null => {
    if (scopes && consented && user?.id) {
      const tenantWideGrant: IPermissionGrant[] = permissionGrants.permissions!;
      const allPrincipalPermissions = getAllPrincipalGrant(tenantWideGrant);
      const singlePrincipalPermissions: string[] = getSinglePrincipalGrant(tenantWideGrant, user?.id);
      const tenantGrantFetchPending = permissionGrants.pending;
      const consentTypeProperties = {
        item, allPrincipalPermissions, singlePrincipalPermissions,
        tenantGrantFetchPending, dispatch
      }
      return <PermissionConsentType {...consentTypeProperties} />
    }
    return null;
  }

  const handleRevoke = async (permission: IPermission): Promise<void> => {
    dispatch(revokeScopes(permission.value));
  };

  const ConsentButton = (): JSX.Element => {
    if (consented) {
      if (userHasRequiredPermissions()) {
        return <PrimaryButton onClick={() => handleRevoke(item)}
          styles={consentButtonStyles}
        >
          {translateMessage('Revoke')}
        </PrimaryButton>
      }
      return <TooltipHost
        content={translateMessage('You require the following permissions to revoke')}
        id={hostId}
        calloutProps={{ gapSpace: 0 }}
      >
        <DefaultButton
          iconProps={buttonIcon}
          allowDisabledFocus
          disabled={true}
          styles={consentButtonStyles}>
          {translateMessage('Revoke')}
        </DefaultButton>
      </TooltipHost>
    }
    return <PrimaryButton onClick={() => handleConsent(item)}
      styles={consentButtonStyles}
    >
      {translateMessage('Consent')}
    </PrimaryButton>;
  }

  if (column) {
    const content = item[column.fieldName as keyof IPermission] as string;
    switch (column.key) {

    case 'value':
      if (props.index === 0) {
        return <div>
          {content}
          <TooltipHost
            content={translateMessage('Least privileged permission')}
            id={'leastPrivilegedPermissionsTooltipHost'}
            calloutProps={{ gapSpace: 0 }}
          >
            <IconButton
              iconProps={infoIcon}
              styles={{
                root: {
                  position: 'relative',
                  top: '4px'
                }
              }}
            />
          </TooltipHost>
        </div>
      }
      return <div>{content}</div>

    case 'isAdmin':
      return <div style={adminLabelStyles}>
        <Label>{translateMessage(item.isAdmin ? 'Yes' : 'No')}</Label>
      </div>;

    case 'consented':
      return <ConsentButton />;

    case 'consentDescription':
      return (
        <>
          <TooltipHost
            content={item.consentDescription}
            id={hostId}
            calloutProps={{ gapSpace: 0 }}
            styles={{
              root: { display: 'block' }
            }}
          >
            <span aria-labelledby={hostId}>
              {item.consentDescription}
            </span>
          </TooltipHost></>
      );

    case 'consentType':
      return <ConsentTypeProperty />;

    default:
      return (
        <TooltipHost
          content={content}
          id={hostId}
          calloutProps={{ gapSpace: 0 }}
        >
          <span aria-labelledby={hostId} style={{ fontSize: FontSizes.medium }}>
            {content}
          </span>
        </TooltipHost>
      );
    }
  }
  return null;
}

export default PermissionItem;
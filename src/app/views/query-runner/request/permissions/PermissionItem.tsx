import {
  DefaultButton, FontSizes, IColumn, IIconProps, Label,
  PrimaryButton, TooltipHost, getId, getTheme
} from '@fluentui/react';
import { useDispatch } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { AppDispatch, useAppSelector } from '../../../../../store';
import { IPermission, IPermissionGrant } from '../../../../../types/permissions';
import { consentToScopes, revokeScopes } from '../../../../services/actions/permissions-action-creator';
import { REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { permissionStyles } from './Permission.styles';

interface PermissionItemProps {
  item: any; index: any; column: IColumn | undefined;
}

const buttonIcon: IIconProps = {
  iconName: 'Info',
  style: {
    position: 'relative',
    top: '1px',
    left: '6px'
  }
};

const PermissionItem = (props: PermissionItemProps) => {
  const theme = getTheme();
  const dispatch: AppDispatch = useDispatch();
  const hostId: string = getId('tooltipHost');
  const { scopes, consentedScopes } = useAppSelector((state) => state);

  const { adminLabelStyles, consentButtonStyles, consentTypeLabelStyles } = permissionStyles(theme);

  const { item, column } = props;
  const consented = !!item.consented;

  const handleConsent = async (permission: IPermission): Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(consentToScopes(consentScopes));
  };

  const getAllPrincipalPermissions = (tenantWidePermissionsGrant: IPermissionGrant[]): string[] => {
    const allPrincipalPermissions = tenantWidePermissionsGrant.find((permission: any) =>
      permission.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
    return allPrincipalPermissions ? allPrincipalPermissions.scope.split(' ') : [];
  }

  const userHasRequiredPermissions = (): boolean => {
    if (scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0) {
      const allPrincipalPermissions = getAllPrincipalPermissions(scopes.data.tenantWidePermissionsGrant);
      const principalAndAllPrincipalPermissions = [...allPrincipalPermissions, ...consentedScopes];
      const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
      return requiredPermissions.every(scope => principalAndAllPrincipalPermissions.includes(scope));
    }
    return false;
  }

  const ConsentTypeProperty = (): JSX.Element => {
    if (scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0
      && consented) {

      const tenantWideGrant: IPermissionGrant[] = scopes.data.tenantWidePermissionsGrant;
      const allPrincipalPermissions = getAllPrincipalPermissions(tenantWideGrant);
      const permissionInAllPrincipal = allPrincipalPermissions.some((permission: string) =>
        item.value === permission);
      return (
        <div style={consentTypeLabelStyles}>
          <Label>
            {permissionInAllPrincipal ? translateMessage('AllPrincipal') : translateMessage('Principal')}
          </Label>
        </div>
      )
    }
    return <div />
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
          <FormattedMessage id='Revoke' />
        </PrimaryButton>
      }
      else {
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
    } else {
      return <PrimaryButton onClick={() => handleConsent(item)}
        styles={consentButtonStyles}
      >
        <FormattedMessage id='Consent' />
      </PrimaryButton>;
    }
  }

  if (column) {
    const content = item[column.fieldName as keyof any] as string;
    switch (column.key) {

      case 'isAdmin':
        return <div style={adminLabelStyles}>
          <Label>{item.isAdmin ? <FormattedMessage id='Yes' /> : <FormattedMessage id='No' />}</Label>
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
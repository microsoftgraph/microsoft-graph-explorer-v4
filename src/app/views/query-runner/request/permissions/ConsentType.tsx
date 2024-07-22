import { DirectionalHint, IconButton, IIconProps, Label, Spinner, TooltipHost } from '@fluentui/react';

import { IPermission } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';

interface IConsentType {
  item: IPermission;
  allPrincipalPermissions: string[],
  singlePrincipalPermissions: string[],
  itemNotInGrants?: Function,
  tenantGrantFetchPending: boolean | undefined,
  dispatch: Function
}

export const PermissionConsentType = (props: IConsentType) => {
  const { item, allPrincipalPermissions, singlePrincipalPermissions,
    tenantGrantFetchPending, dispatch
  } = props;
  const consentTypeLabelStyles = {
    textAlign: 'center' as 'center',
    paddingLeft: '10px'
  }

  if(allPrincipalPermissions.includes(item.value)){
    return (
      <Label style={consentTypeLabelStyles}>
        {translateMessage('AllPrincipal')}
      </Label>
    )
  }

  if(singlePrincipalPermissions.includes(item.value)){
    return (
      <Label style={consentTypeLabelStyles}>
        {translateMessage('Principal')}
      </Label>
    )
  }

  const handleOnClick = () => {
    dispatch(fetchAllPrincipalGrants());
  }

  const iconProps: IIconProps = {
    iconName: 'Refresh'
  }

  return (
    tenantGrantFetchPending ?
      (<Spinner></Spinner>) :
      (
        <TooltipHost
          content={translateMessage('Reload consent-type')}
          directionalHint={DirectionalHint.leftCenter}
        >
          <IconButton onClick={handleOnClick}
            iconProps={iconProps}
            styles={{root: {left: '50px'}}}
            ariaLabel={translateMessage('Reload consent-type')}
          >
            {translateMessage('Reload ')}
          </IconButton>
        </TooltipHost>
      )
  )
}
import { DirectionalHint, IconButton, IIconProps, Label, Spinner, TooltipHost } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { IPermission } from '../../../../../types/permissions'
import { fetchAllPrincipalGrants } from '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';

interface IConsentType {
  item: IPermission;
  allPrincipalPermissions: string[],
  singlePrincipalPermissions: string[],
  itemNotInGrants?: Function,
  consentedScopes: string[],
  tenantGrantFetchPending: boolean | undefined
}

export const permissionConsentType = (props: IConsentType) => {
  const { item, allPrincipalPermissions, singlePrincipalPermissions, consentedScopes,
    tenantGrantFetchPending
  } = props;
  // const dispatch = useDispatch();
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

  if(!consentedScopes.includes(item.value)){
    return null;
  }

  const handleOnClick = () => {
    // dispatch(fetchAllPrincipalGrants());
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
          >
            {translateMessage('Reload ')}
          </IconButton>
        </TooltipHost>
      )
  )
}
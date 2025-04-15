import { CompoundButton, Tooltip } from '@fluentui/react-components'
import { GlobeSurface24Regular } from '@fluentui/react-icons'
import { useAppSelector } from '../../../store'
import { translateMessage } from '../../utils/translate-messages'
import { useHeaderStyles } from './utils'

const Tenant = ()=>{
  const styles = useHeaderStyles()
  const user = useAppSelector(state => state.profile.user)
  const secondaryContent = user && user.tenant ? user.tenant : 'Sample'
  const tooltipContent = user && user.tenant    ? user.tenant
    : `${translateMessage('Using demo tenant')} ${translateMessage('To access your own data:')}`

  return (
    <Tooltip content={tooltipContent} relationship="description">
      <CompoundButton
        className={styles.tenantButton}
        appearance="transparent"
        icon={<GlobeSurface24Regular />}
        secondaryContent={secondaryContent}>
        Tenant
      </CompoundButton>
    </Tooltip>
  )
}

export { Tenant }


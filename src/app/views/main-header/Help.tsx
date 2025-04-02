import {
  Button, Menu, MenuDivider, MenuItemLink, MenuList, MenuPopover, MenuTrigger, Tooltip
} from '@fluentui/react-components'
import {
  Branch20Regular,
  ChatHelp20Regular, DocumentMultiple20Regular, DocumentOnePage20Regular, DocumentQuestionMark20Regular
} from '@fluentui/react-icons'
import { componentNames, eventTypes, telemetry } from '../../../telemetry'
import {
  GE_DOCUMENTATION_LINK, GITHUB_LINK, GRAPH_DOCUMENTATION_LINK, REPORT_AN_ISSUE_LINK
} from '../../../telemetry/component-names'
import { translateMessage } from '../../utils/translate-messages'
import { useHeaderStyles } from './utils'
import { REPORTANISSUELINK,
  GEDOCSLINK,
  TRACKINGPARAMS,
  GRAPHDOCSLINK,
  GITHUBLINK
} from '../../services/graph-constants'

const trackHelpButtonClickEvent = () => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    ComponentName: componentNames.HELP_BUTTON
  });
}

const trackLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, componentName: string) => {
  telemetry.trackLinkClickEvent(e.currentTarget.href, componentName)
}

const Help = ()=>{
  const styles = useHeaderStyles();

  return (
    <Menu>
      <Tooltip content={translateMessage('Help')} relationship='description'>
        <MenuTrigger disableButtonEnhancement>
          <Button
            aria-label={translateMessage('Help')}
            onClick={trackHelpButtonClickEvent}
            className={styles.iconButton} appearance='subtle' icon={<ChatHelp20Regular />} />
        </MenuTrigger>
      </Tooltip>

      <MenuPopover>
        <MenuList>
          <MenuItemLink
            as='a'
            href={REPORTANISSUELINK} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, REPORT_AN_ISSUE_LINK)}
            icon={<DocumentQuestionMark20Regular />}>{translateMessage('Report an Issue')}</MenuItemLink>
        </MenuList>
        <MenuDivider />
        <MenuList>
          <MenuItemLink
            as='a'
            href={GEDOCSLINK + TRACKINGPARAMS} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GE_DOCUMENTATION_LINK)}
            icon={<DocumentOnePage20Regular />}>{translateMessage('Get started with Graph Explorer')}</MenuItemLink>
        </MenuList>
        <MenuList>
          <MenuItemLink
            as='a'
            href={GRAPHDOCSLINK + TRACKINGPARAMS} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GRAPH_DOCUMENTATION_LINK)}
            icon={<DocumentMultiple20Regular />}>{translateMessage('Graph Documentation')}</MenuItemLink>
        </MenuList>
        <MenuList>
          <MenuItemLink
            as='a'
            href={GITHUBLINK} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GITHUB_LINK)}
            icon={<Branch20Regular />}>GitHub</MenuItemLink>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

export { Help }


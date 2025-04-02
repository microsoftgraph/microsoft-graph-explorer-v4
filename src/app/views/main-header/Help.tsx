/* eslint-disable max-len */
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

const trackHelpButtonClickEvent = () => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    ComponentName: componentNames.HELP_BUTTON
  });
}
const reportAnIssueLink = 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues/new/choose';
const geDocsLink = 'https://learn.microsoft.com/graph/graph-explorer/graph-explorer-overview?view=graph-rest-1.0/?WT.mc_id=msgraph_inproduct_graphexhelp'
const graphDocsLink = 'https://learn.microsoft.com/en-us/graph/graph-explorer/graph-explorer-overview?view=graph-rest-1.0%2F/?WT.mc_id=msgraph_inproduct_graphexhelp'
const ghLink = 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4#readme'

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
            href={reportAnIssueLink} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, REPORT_AN_ISSUE_LINK)}
            icon={<DocumentQuestionMark20Regular />}>{translateMessage('Report an Issue')}</MenuItemLink>
        </MenuList>
        <MenuDivider />
        <MenuList>
          <MenuItemLink
            as='a'
            href={geDocsLink} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GE_DOCUMENTATION_LINK)}
            icon={<DocumentOnePage20Regular />}>{translateMessage('Get started with Graph Explorer')}</MenuItemLink>
        </MenuList>
        <MenuList>
          <MenuItemLink
            as='a'
            href={graphDocsLink} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GRAPH_DOCUMENTATION_LINK)}
            icon={<DocumentMultiple20Regular />}>{translateMessage('Graph Documentation')}</MenuItemLink>
        </MenuList>
        <MenuList>
          <MenuItemLink
            as='a'
            href={ghLink} target='_blank'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>)=> trackLinkClick(e, GITHUB_LINK)}
            icon={<Branch20Regular />}>GitHub</MenuItemLink>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

export { Help }


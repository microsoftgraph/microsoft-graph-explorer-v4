import { Resizable } from 're-resizable';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../../services/context/popups-context';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeaderV9 } from '../main-header/MainHeaderV9';
import { QueryResponseV9 } from '../query-response';
import { QueryRunner } from '../query-runner';
import { SidebarV9 } from '../sidebar/SidebarV9';
import Notification from '../common/banners/Notification';
import { makeStyles, tokens } from '@fluentui/react-components';

interface LayoutProps {
    handleSelectVerb: (verb: string) => void;
}

const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalS
  },
  content: {
    display: 'flex'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1
  }
})

export const Layout = (props: LayoutProps)=>{
  const layoutStyles = useLayoutStyles()
  return <>
    <PopupsProvider>
      <div className={layoutStyles.container}>
        <MainHeaderV9 />
        {/* TODO: handle the graphExplorerMode */}
        <div  id="content" className={layoutStyles.content}>
          {/* TODO: find better minimum and maximu values.  */}
          <Resizable defaultSize={{ width: '25%', height: '100%' }} minWidth={'15%'} maxWidth={'60%'}>
            <div id="sidebar" className={layoutStyles.sidebar}>
              <SidebarV9 />
            </div>
          </Resizable>
          <div id="main-content" className={layoutStyles.mainContent}>
            <Notification
              header={translateMessage(
                'Banner notification 1 header'
              )}
              content={translateMessage(
                'Banner notification 1 content'
              )}
              link={translateMessage('Banner notification 1 link')}
              linkText={translateMessage(
                'Banner notification 1 link text'
              )}
            />
            TODO: handle try-it mode. Make the sidebar hidden and the main content spans all width
            <ValidationProvider>
              <div style={{ marginBottom: 2, flex: 1, background: 'red' }} id="query-runner0request">
                <QueryRunner onSelectVerb={props.handleSelectVerb} />
              </div>
              <div
                id="status-message-response"
                style={{
                  flex: 1
                }}
              >
                <StatusMessagesV9 />
                <QueryResponseV9 />
              </div>
            </ValidationProvider>
          </div>
        </div>

        {/* TODO: handle mobile screen view */}
        <TermsOfUseMessageV9 />
      </div>
      <CollectionPermissionsProvider>
        <PopupsWrapper />
      </CollectionPermissionsProvider>
    </PopupsProvider>
  </>
}
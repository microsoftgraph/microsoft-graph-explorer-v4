import { makeStyles } from '@fluentui/react-components'
import { translateMessage } from '../../utils/translate-messages'
import Notification from '../common/banners/Notification'
import { MainHeaderV9 } from '../main-header/MainHeaderV9'
import { SidebarV9 } from '../sidebar/SidebarV9'
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider'
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections'
import { QueryResponse } from '../query-response'
import { QueryRunner } from '../query-runner'
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider'
import PopupsWrapper from '../common/popups/PopupsWrapper'

const layoutStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  header: {
    flex: '0 0 auto'
  },
  body: {
    display: 'flex',
    flex: '1 1 auto'
  },
  sidebar: {
    flex: '0 0 auto',
    height: '100%',
    overflow: 'auto'
  },
  content: {
    flex: '1 1 auto'
  }
})

interface LayoutProps {
    handleSelectVerb: (verb: string) => void
}

const Layout = (props: LayoutProps) =>{
  const styles = layoutStyles();
  return <div className={styles.root}>
    <div className={styles.header}><MainHeaderV9/></div>
    {/* TODO: Handle the Modes - Modes.Complete and Modes.TryIt */}
    <div className={styles.body}>
      <div className={styles.sidebar}><SidebarV9/></div>
      <div className={styles.content}>
        <Notification
          header={translateMessage('Banner notification 1 header')}
          content={translateMessage('Banner notification 1 content')}
          link={translateMessage('Banner notification 1 link')}
          linkText={translateMessage('Banner notification 1 link text')}/>
        <ValidationProvider>
          <QueryRunner onSelectVerb={props.handleSelectVerb} />
          <StatusMessagesV9 />
          <QueryResponse />
        </ValidationProvider>
        <TermsOfUseMessageV9 />
        <CollectionPermissionsProvider>
          <PopupsWrapper />
        </CollectionPermissionsProvider>
      </div>
    </div>
  </div>
}

export {Layout}
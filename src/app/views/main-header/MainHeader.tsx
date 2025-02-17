import { makeStyles, Text, tokens } from '@fluentui/react-components';
import AuthenticationV9 from '../authentication/Authentication';
import { FeedbackButtonV9 } from './FeedbackButton';
import { HelpV9 } from './Help';
import { Settings } from './settings/Settings';
import { Tenant } from './Tenant';
const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 0 0 24px',
    height: '48px',
    background: tokens.colorNeutralBackground4,
    marginBottom: '8px' // TODO: remove when sidebar and query areas are updated
  },
  headerIcons: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    maxHeight: '100%',
    columnGap: '4px'
  },
  headerText: {
    color: tokens.colorBrandForeground1,
    lineHeight: '28px'
  }
});

const MainHeaderV9 = ()=>{
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <Text size={600} as="h1" className={styles.headerText}>Graph Explorer</Text>
      <HeaderIcons />
    </div>
  )
}

const HeaderIcons = () => {

  const styles = useStyles()
  return (
    <div className={styles.headerIcons}>
      <Tenant/>
      <Settings />
      <HelpV9 />
      <FeedbackButtonV9 />
      <AuthenticationV9 />
    </div>
  )
}

export { MainHeaderV9 };


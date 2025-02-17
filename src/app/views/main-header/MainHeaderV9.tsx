import { makeStyles, Text, tokens } from '@fluentui/react-components';
import AuthenticationV9 from '../authentication/AuthenticationV9';
import { FeedbackButtonV9 } from './FeedbackButtonV9';
import { HelpV9 } from './HelpV9';
import { Settings } from './settings/Settings';
import { Tenant } from './Tenant';
import { useAppDispatch, useAppSelector } from '../../../store';
import { toggleSidebar } from '../../services/slices/sidebar-properties.slice';
import { PanelLeftExpand20Regular } from '@fluentui/react-icons';
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
  headerTextContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  headerText: {
    color: tokens.colorBrandForeground1,
    lineHeight: '28px'
  },
  menuIcon: {
    display: 'none',
    cursor: 'pointer',

    '@media (max-width: 480px)': {
      display: 'block'
    }
  }
});

const MainHeaderV9 = ()=>{
  const styles = useStyles()
  const dispatch = useAppDispatch();
  const  mobileScreen  = useAppSelector((state) => state.sidebarProperties.mobileScreen);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar({ showSidebar: true, mobileScreen: true }));
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerTextContainer}>
        {mobileScreen && (
          <PanelLeftExpand20Regular className={styles.menuIcon} onClick={handleSidebarToggle} />
        )}
        <Text size={mobileScreen ? 500 : 600} as="h1" className={styles.headerText}>Graph Explorer</Text>
      </div>
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


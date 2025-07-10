import { Text, makeStyles, tokens } from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../store';

import Authentication from '../authentication/Authentication';
import { FeedbackButton } from './FeedbackButton';
import { Help } from './Help';
import { PanelLeftExpand20Regular } from '@fluentui/react-icons';
import { Settings } from './settings/Settings';
import { Tenant } from './Tenant';
import { toggleSidebar } from '../../services/slices/sidebar-properties.slice';
import { translateMessage } from '../../utils/translate-messages';

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

    '@media (max-width: 768px)': {
      display: 'block'
    }
  }
});

const MainHeader = ()=>{
  const styles = useStyles()
  const dispatch = useAppDispatch();
  const  mobileScreen  = useAppSelector((state) => state.sidebarProperties.mobileScreen);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar({ mobileScreen: true }));
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerTextContainer}>
        {mobileScreen && (
          <PanelLeftExpand20Regular className={styles.menuIcon} onClick={handleSidebarToggle} />
        )}
        <Text
          size={mobileScreen ? 500 : 600} as="h1"
          style={{lineHeight: '28px',
            color: tokens.colorBrandForeground1
          }}
          className="notranslate">
          {translateMessage('Graph Explorer')}
        </Text>
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
      <Help />
      <FeedbackButton />
      <Authentication />
    </div>
  )
}

export { MainHeader };


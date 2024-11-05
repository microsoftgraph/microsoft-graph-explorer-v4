import { makeStyles } from '@fluentui/react-components';
import polygons from './bgPolygons.svg'

export const useNotificationStyles = makeStyles({
    container: {
        padding: '8px',
        marginBottom: '8px',
        backgroundImage: `url(${polygons})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'right',
        backgroundColor: '#E8EFFF'
    }
}
)

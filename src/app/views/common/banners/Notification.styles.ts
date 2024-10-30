import { mergeStyleSets } from '@fluentui/react';

export const useNotificationStyles = ()=>{
    return mergeStyleSets({
        container: {
            borderRadius: '8px',
            backgroundColor: 'blue',
            textColor: '#ffffff'
        }
    })
}
import { mergeStyleSets } from '@fluentui/react';

export const useNotificationStyles = ()=>{
    return mergeStyleSets({
        container: {
            padding: '8px',
            marginBottom: '8px'
        }
    })
}
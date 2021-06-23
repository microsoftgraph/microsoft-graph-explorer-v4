import { ITheme } from 'office-ui-fabric-react';

export interface IToggleProps {
    minimised: boolean;
    actions?: {
        getMode: Function;
    };
}

export interface IToggleState {
    user: IToggle;
}


export interface IToggle {
    mode: string;
}

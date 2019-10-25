import { Mode } from './action';

export interface IHeadersListControl {
    handleOnHeaderDelete: Function;
    headers?: Array<{ name: string; value: string; }>;
}

export interface IRequestHeadersProps {
    headers?: Array<{ name: string; value: string; }>;
    actions?: {
        addRequestHeader: Function;
        removeRequestHeader: Function;
    };
    intl: {
        message: object;
    };
}

export interface IRequestComponent {
    sampleBody?: string;
    mode: Mode;
    handleOnEditorChange: Function;
    headers?: Array<{ name: string; value: string; }>;
    intl: {
        message: object;
    };
}

export interface IRequestOptions {
    headers?: {};
    method?: string;
    body?: string | undefined;
}

export interface IRequestState {
    headers: Array<{ name: string; value: string; }>;
    headerName: string;
    headerValue: string;
}

import { Mode } from './enums';
import { IQuery } from './query-runner';

export interface IHeadersListControl {
    handleOnHeaderDelete: Function;
    headers?: Array<{ name: string; value: string; }>;
    messages: any;
}

export interface IRequestHeadersProps {
    sampleQuery: IQuery;
    actions?: {
        setSampleQuery: Function;
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

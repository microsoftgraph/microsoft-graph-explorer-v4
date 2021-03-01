import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { IQuery } from './query-runner';

export interface IHeadersListControl {
    handleOnHeaderDelete: Function;
    headers?: Array<{ name: string; value: string; }>;
    messages: any;
}

export interface IRequestHeadersProps {
    sampleQuery: IQuery;
    height: string;
    actions?: {
        setSampleQuery: Function;
    };
    intl: {
        message: object;
    };
}

export interface IRequestComponent {
    sampleQuery: IQuery;
    mode: Mode;
    handleOnEditorChange: Function;
    dimensions: IDimensions;
    headers?: Array<{ name: string; value: string; }>;
    intl: {
        message: object;
    };
    actions: {
        setDimensions: Function;
    };
    officeBrowserFeedback: any;
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

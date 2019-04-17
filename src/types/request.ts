export interface IRequestHeadersControl {
    handleOnHeaderDelete: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
    headers: Array<{ name: string; value: string; }>;
}

export interface IRequestComponent {
    handleOnEditorChange: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderDelete: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
    headers: Array<{ name: string; value: string; }>;
}

export interface IRequestOptions {
    headers?: {};
    method?: string;
    body?: string|undefined;
  }

export interface IRequestState {
    headers: Array<{ name: string; value: string; }>;
    headerName: string;
    headerValue: string;
}

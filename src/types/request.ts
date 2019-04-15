export interface IRequestHeadersControl {
    handleOnHeaderDelete: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
    headers: Array<{ name: string; value: string; }>;
}

export interface IRequestState {
    headers: Array<{ name: string; value: string; }>;
    headerName: string;
    headerValue: string;
}

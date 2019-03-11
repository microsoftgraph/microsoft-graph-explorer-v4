export interface IRequestHeadersControl {
    handleOnHeaderDelete: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
    headers: Array<{ name: string; value: string; }>;
}

import { IApiResponse } from "./action";

export interface IPolicies extends IApiResponse {
    pending: boolean;
    data: any;
    error: any | null;
}

export interface ErrorSchema {
    message?: string;
    httpStatus?: number;
    status?: string;
    comingFrom?: string;
    field?:string;
    path?:string;
    requestId?:string;
    timestamp?:string;
}




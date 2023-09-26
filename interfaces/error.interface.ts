export default interface IError {
    statusCode?: number;
    message?: string|string[];
    code?: number|string;
    keyValue?: any;
    errors?: any;
}
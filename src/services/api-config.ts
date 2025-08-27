import axios, { AxiosRequestConfig } from "axios";

import { HttpMethod } from "./api-service";

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export default function getRequestConfig(url: string, method: HttpMethod, data: any | undefined = undefined) {

    let config: {
        url: string;
        headers: { [key: string]: string };
        [key: string]: any;
    } = {
        url: BASE_URL + url,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    switch (method) {
        case HttpMethod.GET:
        default:
            config = {
                ...config,
                method: 'get',
                params: data
            };
            break;
        case HttpMethod.POST:
            config = {
                ...config,
                method: 'post',
                data
            };
            break;
        case HttpMethod.PUT:
            config = {
                ...config,
                method: 'put',
                data
            };
            break;
        case HttpMethod.DELETE:
            config = {
                ...config,
                method: 'delete',
                data
            };
            break;
        case HttpMethod.UPLOAD:
            config = {
                ...config,
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                },
                method: 'post',
                data
            };
            break;
        case HttpMethod.DOWNLOAD:
            config = {
                ...config,
                responseType: 'blob',
            };
            return config;
    }
    return config;
}

export async function apiRequest(config: AxiosRequestConfig<any>) {
    try {
        const response = await axios(config as AxiosRequestConfig<any>);
        return response.status < 400
            ? Promise.resolve(response.data)
            : Promise.reject(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}


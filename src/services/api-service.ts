import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  UPLOAD = "upload",
  DOWNLOAD = "download"
};

export const apiService = {
  get,
  post,
  put,
  apiDelete
};

function getGenericConfig(url: string) {
  const config = {
    url: BASE_URL + url,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return config;
}

async function apiRequest(config: any) {
  try {
      const response = await axios(config);
      return response.statusText === 'OK' || response.status < 400
        ? Promise.resolve(response.data)
        : Promise.reject(response.data);
    } catch (error: any) {
      if (error.hasOwnProperty('response')){
        return Promise.reject(error.response);
      } else {
        console.log(error);
        return Promise.reject(error.response);
      }
    }
}

function get(url: string, data: any) {
  const config = {
    method: 'get',
    ...getGenericConfig(url),
    params: data
  };
  return apiRequest(config);
}

function post(url: string, data: any) {
  const config = {
    method: 'post',
    ...getGenericConfig(url),
    data
  };
  return apiRequest(config);
}

function put(url: string, data: any) {
  const config = {
    method: 'put',
    ...getGenericConfig(url),
    data
  };
  return apiRequest(config);
}

function apiDelete(url: string) {
  const config = {
    method: 'delete',
    ...getGenericConfig(url),
  };
  return apiRequest(config);
}

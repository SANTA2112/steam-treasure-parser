import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import toastr from 'toastr';

import { IResponse, IPriceError } from './interfaces';

import { BASE_URL } from './constants';

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true
};

const handleResponse = <T>(response: AxiosResponse<T>): AxiosResponse<T> => response;

const handleError = (error: AxiosError): IResponse<IPriceError> => {
  toastr.error(error.message);
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    return { data: error.response.data || { success: false }, status: error.response.status };
  }
  console.log(error.message);
  return { data: { success: false }, status: 500 };
};

const fetchAPI: AxiosInstance = axios.create(config);

export const doReq = (url: string) =>
  fetchAPI
    .get(url)
    .then(handleResponse)
    .catch(handleError);

import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  RawAxiosRequestHeaders,
} from "axios";
import { useCallback, useMemo, useState } from "react";
export type ErrorMessage = {
  message: string;
  status: number;
  statusText?: string;
};
type RequestMethod = "get" | "post" | "put" | "delete";
type CallbackFn = (method: RequestMethod, data: any, success?: boolean) => void;
type CamelName<DataType extends any, N extends string = string> = Record<
  `get${Capitalize<N>}`,
  <ResponseDataType extends any = DataType>(
    config?: AxiosRequestConfig<any>
  ) => Promise<ResponseDataType>
> &
  Record<
    `post${Capitalize<N>}`,
    <ResponseDataType extends any = DataType>(
      p?: DataType,
      config?: AxiosRequestConfig<any>
    ) => Promise<ResponseDataType>
  > &
  Record<
    `update${Capitalize<N>}`,
    <ResponseDataType extends any = DataType>(
      p?: DataType,
      config?: AxiosRequestConfig<any>
    ) => Promise<ResponseDataType>
  > &
  Record<
    `delete${Capitalize<N>}`,
    <ResponseDataType extends any = DataType>(
      config?: AxiosRequestConfig<any>
    ) => Promise<ResponseDataType>
  > &
  Record<`${N}Data`, DataType | undefined> &
  Record<`${N}Loading`, boolean> &
  Record<`${N}Error`, false | ErrorMessage> &
  Record<`register${Capitalize<N>}Callback`, (p: CallbackFn) => void>;
type BasicReturnType<
  DataType extends any,
  ResponseDataType extends any = DataType
> = {
  get: <NewResponseDataType extends any = ResponseDataType>(
    config?: AxiosRequestConfig<any>
  ) => Promise<NewResponseDataType>;
  post: <NewResponseDataType extends any = ResponseDataType>(
    p?: DataType,
    config?: AxiosRequestConfig<any>
  ) => Promise<NewResponseDataType>;
  update: <NewResponseDataType extends any = ResponseDataType>(
    p?: DataType,
    config?: AxiosRequestConfig<any>
  ) => Promise<NewResponseDataType>;
  delete: <NewResponseDataType extends any = ResponseDataType>(
    config?: AxiosRequestConfig<any>
  ) => Promise<NewResponseDataType>;
  loading: boolean;
  error: false | ErrorMessage;
  registerCallback: (p: CallbackFn) => void;
  registerAuthorizationToken: (token?: string) => void;
  tokenRegistered: boolean;
  data: DataType | undefined;
};
type ReturnApiType<DataType extends any, N extends string = string> = CamelName<
  DataType,
  N
> &
  BasicReturnType<DataType>;
export function useApi<
  DataType extends any = any,
  ResponseDataType extends any = DataType
>(apiUrl: string): BasicReturnType<DataType, ResponseDataType>;
export function useApi<DataType extends any = any, N extends string = string>(
  name: N,
  apiUrl: string
): CamelName<DataType, N>;
export function useApi<DataType extends any = any, N extends string = string>(
  arg1: string,
  arg2?: string
) {
  const [name, apiUrl] = arg2 ? [arg1, arg2] : [undefined, arg1];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | ErrorMessage>(false);
  const [data, setData] = useState<DataType>();
  const [callback, setCallback] = useState<CallbackFn>(
    () => (m: RequestMethod, d: any) => {}
  );
  const [headers, setHeaders] = useState<RawAxiosRequestHeaders>({});
  async function axiosRequest(
    method: "get" | "delete",
    configRaw?: AxiosRequestConfig
  ): Promise<DataType>;
  async function axiosRequest(
    method: "post" | "put",
    dataRaw?: DataType,
    configRaw?: AxiosRequestConfig
  ): Promise<DataType>;
  async function axiosRequest(
    method: "get" | "delete" | "put" | "post",
    dataRaw?: DataType | AxiosRequestConfig,
    configRaw?: AxiosRequestConfig
  ): Promise<DataType> {
    setError(false);
    setLoading(true);
    try {
      const config = ["get", "delete"].includes(method)
        ? {
            ...(dataRaw as AxiosRequestConfig),
            headers: {
              ...headers,
              ...(dataRaw as AxiosRequestConfig)?.headers,
            },
          }
        : {
            ...configRaw,
            headers: { ...headers, ...configRaw?.headers },
          };
      const data = ["get", "delete"].includes(method) ? config : dataRaw;
      const res = await axios[method](apiUrl, data, config);
      setData(res.data);
      setLoading(false);
      callback(method, res.data, true);
      return res.data;
    } catch (err) {
      console.log("err0", err);
      const axiosErr: AxiosError<any, any> = err as any;
      const error: ErrorMessage = {
        message: axiosErr.code || "error",
        status: axiosErr.response?.status || 500,
        statusText: axiosErr.response?.statusText,
      };
      callback(method, error, false);
      setError(error);
      setLoading(false);
      throw error;
    }
  }
  function registerAuthorizationToken(token?: string) {
    if (token) setHeaders((s) => ({ ...s, Authorization: `Bearer ${token}` }));
    else setHeaders((s) => ({ ...s, Authorization: undefined }));
  }
  const basic = useMemo(() => {
    return {
      data,
      loading,
      error,
      get: (config) => axiosRequest("get", config),
      post: (data, config) => axiosRequest("post", data, config),
      update: (data, config) => axiosRequest("put", data, config),
      delete: (config) => axiosRequest("delete", config),
      registerCallback: (cb: CallbackFn) => setCallback(() => cb),
      registerAuthorizationToken,
      tokenRegistered: !!headers.Authorization,
    } as BasicReturnType<DataType>;
  }, [headers]);
  if (name)
    return {
      [name + "Data"]: data,
      [name + "Loading"]: loading,
      [name + "Error"]: error,
      ["get" + capitalize(name)]: basic.get,
      ["post" + capitalize(name)]: basic.post,
      ["update" + capitalize(name)]: basic.update,
      ["delete" + capitalize(name)]: basic.delete,
      [`register${capitalize(name)}Callback`]: basic.registerCallback,
      ...basic,
    } as ReturnApiType<DataType, N>;
  else return basic;
}
function capitalize(word: string) {
  return word.substring(0, 1).toUpperCase() + word.substring(1);
}
export function apiUrl(url: string) {
  return `/api/${url.startsWith("/") ? url.substring(1) : url}`;
}

declare module '@zgj/api' {
  export const $http: any
  export function baseRequest<T = any>(
    url: string,
    value?: any,
    method?: 'post' | 'get' | 'formdata' | string,
    options?: any
  ): Promise<T>
}

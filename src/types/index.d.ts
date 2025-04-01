/* 库对外的声明文件 */
// 配置选项
interface LocalTangoConfig {
  // 是否启用加密
  encrypt?: boolean,
  // 加密key
  encryptKey?: string,
  // 默认使用的存储方式
  driver?: 'localStorage' | 'sessionStorage' | 'session' | 'storage',
  // 存储key默认前缀
  prefixOfKey?: string,
  // 是否打开日志
  logging?: boolean | 'simple' | 'full' | { level?: 'simple' | 'full', filter?: string[] }
}

// 类声明
declare class LocalTango {
  public constructor ()

  public storage: LocalTango
  public session: LocalTango
  public encrypt: LocalTango
  public config (options: LocalTangoConfig): LocalTango

  public getItem (key: string, defaultValue?: any): any
  public getItemString(key: string, defaultValue?: string): string | null
  public getItemNumber(key: string, defaultValue?: number): number | null
  public getItemBoolean(key: string, defaultValue?: boolean): boolean | null
  public getItemJSON (key: string, defaultValue?: Record<string, any> | Array<any>): Record<any, any> | Array<any> | null
  public getItemExpired (key: string, defaultValue?: any): any

  public setItem (key: string, value: any): void
  public setItemString (key: string, value: string): void
  public setItemNumber (key: string, value: number): void
  public setItemBoolean (key: string, value: boolean): void
  public setItemJSON (key: string, value: Record<string, any> | Array<any>): void
  public setItemExpired (key: string, value: any, expired: number): void

  public removeItem (key: string): void
  public clear (): void
}

// 导出到全局
interface Window {
  localTango: LocalTango
}
declare const localTango: LocalTango

// 导出为实例
declare module "local-tango" {
  let localTango: LocalTango
  export = localTango
}


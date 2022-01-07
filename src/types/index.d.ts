/* 库对外的声明文件 */
// 配置选项
interface LocalTangoConfig {
  encrypt?: boolean,
  encryptKey?: string,
  driver?: 'localStorage' | 'sessionStorage' | 'session' | 'storage'
}

// 导出类声明
declare class LocalTango {
  public constructor ()

  public storage: LocalTango
  public session: LocalTango
  public encrypt: LocalTango
  public config (options: LocalTangoConfig): LocalTango

  public getItem (key: string): string | null
  public getItemString(key: string, defaultValues: string): string
  public getItemNumber(key: string, defaultValues: number): number
  public getItemBoolean(key: string, defaultValue: boolean): boolean
  public getItemJSON (key: string, defaultValue?: Record<any, any> | Array<any>): Record<any, any> | Array<any>
  public getItemExpired (key: string, defaultValue?: any): any

  public setItem (key: string, value: any): void
  public setItemString (key: string, value: string): void
  public setItemNumber (key: string, value: number): void
  public setItemBoolean (key: string, value: boolean): void
  public setItemJSON (key: string, value: JSON): void
  public setItemExpired (key: string, value: any, expired: number): void
}

declare module "local-tango" {
  let localTango: LocalTango
  export = localTango
}

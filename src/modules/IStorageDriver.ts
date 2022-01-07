/* 存储接口约定 */
export default interface IStorage {
  // 根据指定key获取记录
  getItem (key: string): string | null

  // 根据指定key获取字符串记录， 默认值''
  getItemString (key: string, defaultValue?: string): string

  // 根据指定key获取number类型记录， 默认值0
  getItemNumber (key: string, defaultValue?: number): number

  // 根据指定key获取boolean类型记录， 默认值false
  getItemBoolean (key: string, defaultValue?: boolean): boolean

  // 根据指定key获取JSON类型记录, 默认值{}
  getItemJSON (key: string, defaultValue?: Record<any, any> | Array<any>): Record<any, any> | Array<any>

  // 根据指定key获取时间戳记录
  getItemExpired (key: string, defaultValue?: any): any

  // 根据指定key设置记录
  setItem (key: string, value: any): void

  // 根据指定key设置记录, value为string
  setItemString (key: string, value: string): void

  // 根据指定key设置记录, value为number
  setItemNumber (key: string, value: number): void

  // 根据指定key设置记录, value为boolean
  setItemBoolean (key: string, value: boolean): void

  // 根据指定key设置记录, value为json
  setItemJSON (key: string, value: Record<any, any> | Array<any>): void

  // 根据指定key设置时间戳记录
  setItemExpired (key: string, value: any, expired: number): void
}

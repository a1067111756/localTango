/* 存储diver接口约定 */
export default interface IStorageDriver {
  // 根据指定key获取记录
  getItem (key: string): string | null

  // 根据指定key设置记录
  setItem (key: string, value: any): void

  // 根据指定key移除记录
  removeItem (key: string): void

  // 清空所有记录
  clear (): void
}

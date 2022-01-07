/* SessionStorage存储实现 */
import IStorage from '../IStorage'

export default class SessionStorage implements IStorage {
  // 根据指定key获取记录
  getItem(key: string): string | null {
    return sessionStorage.getItem(key)
  }

  // 根据指定key设置记录
  setItem (key: string, value: any): void {
    sessionStorage.setItem(key, value)
  }

  // 根据指定key移除记录
  removeItem(key: string): void {
    sessionStorage.removeItem(key)
  }

  // 清空所有记录
  clear(): void {
    sessionStorage.clear()
  }
}

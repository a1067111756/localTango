/* LocalStorage存储实现 */
import IStorage from "../IStorage";
import LogUtil from '../logging'

export default class LocalStorage implements IStorage {
  // 根据指定key获取记录
  getItem(key: string): string | null {
    const result = localStorage.getItem(key)
    LogUtil.log({ driver: 'localStorage', action: 'getItem', key: key, result: result })
    return result
  }

  // 根据指定key获取字符串记录， 默认值''
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  // 根据指定key移除记录
  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  // 清空所有记录
  clear(): void {
    localStorage.clear()
  }
}

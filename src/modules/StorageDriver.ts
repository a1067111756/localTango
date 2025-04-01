/* Driver功能实现 - 关注数据读取/存储前的数据处理 */
import AES from 'crypto-js/aes'
import EncUtf8 from 'crypto-js/enc-utf8'
import LocalStorage from "./localStorage"
import SessionStorage from "./sessionStorage"
import LogUtil from './logging'
import type IStorage from './IStorage'
import type IStorageDriver from "./IStorageDriver"

export default class StorageDriver implements IStorageDriver {
  // 全局配置选项
  public globalOptions: LocalTangoOptions
  // 动态配置选项
  public dynamicOptions: LocalTangoOptions | Record<string, never>
  // LocalStorage存储实例
  private readonly storageInstance: LocalStorage
  // LocalStorage存储实例
  private readonly sessionInstance: SessionStorage

  public static SUPPORT_DRIVER = {
    STORAGE: 'storage',
    LOCAL_STORAGE: 'localStorage',
    SESSION: 'session',
    SESSION_STORAGE: 'sessionStorage'
  }

  public constructor(globalOptions: LocalTangoOptions) {
    this.dynamicOptions = {}
    this.globalOptions = globalOptions
    this.storageInstance = new LocalStorage()
    this.sessionInstance = new SessionStorage()

    LogUtil.setStorageDriver(this)
  }

  // 方法 - 获取使用的config配置
  public getConfig () {
    return Object.keys(this.dynamicOptions).length > 0
      ? { ...this.globalOptions, ...this.dynamicOptions }
      : this.globalOptions
  }

  // 方法 - 获取真正的key, 即配置了前缀的key
  private getRealKey (key: string) {
    return this.globalOptions.prefixOfKey ? `${this.globalOptions.prefixOfKey}_${key}` : key
  }

  // 方法 - 获取使用的driver实例
  private getDriver () {
    const strategy: Record<string, IStorage> = {
      [StorageDriver.SUPPORT_DRIVER.STORAGE]: this.storageInstance,
      [StorageDriver.SUPPORT_DRIVER.LOCAL_STORAGE]: this.storageInstance,
      [StorageDriver.SUPPORT_DRIVER.SESSION]: this.sessionInstance,
      [StorageDriver.SUPPORT_DRIVER.SESSION_STORAGE]: this.sessionInstance
    }
    return strategy[this.getConfig().driver]
  }

  // 方法 - 获取加密的文本
  private getEncryptContent (value: string) {
    const { encrypt, encryptKey } = this.getConfig()
    return encrypt
      ? AES.encrypt(value, encryptKey)
      : value
  }

  // 方法 - 获取解密的文本
  private getDencryptContent (value: string): any {
    const { encrypt, encryptKey } = this.getConfig()

    try {
      return encrypt
        ? AES.decrypt(value, encryptKey).toString(EncUtf8)
        : value
    } catch (e) {
      // throw new Error(`dencrypt content failed, please check your encrypt key is same as dencrypt key`)
      console.warn('dencrypt content failed, please check your encrypt key is same as dencrypt key')
      return ''
    }
  }

  // 方法 - 重置动态配置选项
  private resetDynamicOptions () {
    this.dynamicOptions = {}
  }

  // 根据指定key获取记录， 默认值null
  public getItem(key: string, defaultValue?: any) {
    const realKey = this.getRealKey(key)
    let resString = this.getDriver().getItem(realKey)
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    resString = this.getDencryptContent(resString)
    this.resetDynamicOptions()
    return resString
  }

  // 根据指定key获取字符串记录， 默认值null
  public getItemString(key: string, defaultValue?: string) {
    const realKey = this.getRealKey(key)
    let resString = this.getDriver().getItem(realKey) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    resString = this.getDencryptContent(resString)
    this.resetDynamicOptions()
    return resString
  }

  // 根据指定key获取number类型记录， 默认值null
  public getItemNumber(key: string, defaultValue?: number) {
    const realKey = this.getRealKey(key)
    const resString = this.getDriver().getItem(realKey) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    const resNumber = Number(this.getDencryptContent(resString))
    if (isNaN(resNumber)) {
      this.resetDynamicOptions()
      throw new Error(`the search result cannot be converted to number correctly, result: ${resString}`)
    }

    this.resetDynamicOptions()
    return resNumber
  }

  // 根据指定key获取boolean类型记录， 默认值null
  public getItemBoolean(key: string, defaultValue?: boolean) {
    const realKey = this.getRealKey(key)
    let resString = this.getDriver().getItem(realKey) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    resString = this.getDencryptContent(resString)
    if (resString !== '0' && resString !== '1' && resString !== 'true' && resString !== 'false') {
      this.resetDynamicOptions()
      throw new Error(`the search result cannot be converted to boolean correctly, result: ${resString}`)
    }

    // 注：Boolean('false')、Boolean('0')的结果为true，需要单独处理
    if (resString === 'false' || resString === '0') {
      resString = ''
    }

    this.resetDynamicOptions()
    return Boolean(resString)
  }

  // 根据指定key获取JSON类型记录, 默认值null
  public getItemJSON(key: string, defaultValue?: Record<any, any> | Array<any>) {
    const realKey = this.getRealKey(key)
    let resString = this.getDriver().getItem(realKey)
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    resString = this.getDencryptContent(resString)
    try {
      this.resetDynamicOptions()
      return JSON.parse(resString as string)
    } catch (e) {
      this.resetDynamicOptions()
      throw new Error(`the search result cannot be converted to JSON correctly, result: ${resString}`)
    }
  }

  // 根据指定key获取带时间戳的记录, 默认值null
  public getItemExpired(key: string, defaultValue?: any) {
    const realKey = this.getRealKey(key)
    const valueWrapper = this.getItemJSON(realKey)

    // 没用找到
    if (valueWrapper === null) {
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    // 包裹层结构不对
    if (!Object.keys(valueWrapper).includes('expired') || !Object.keys(valueWrapper).includes('data')) {
      this.resetDynamicOptions()
      throw new Error(`the search result cannot be converted to itemExpired correctly, result: ${valueWrapper}`)
    }

    // expired为0表示无过期期限
    if (valueWrapper.expired <= 0) {
      this.resetDynamicOptions()
      return valueWrapper.data
    }

    // 超过期限，删除返回默认值或null
    const nowStamp = new Date().getTime()
    if (nowStamp > valueWrapper.expired) {
      this.getDriver().removeItem(realKey)
      this.resetDynamicOptions()
      return defaultValue ?? null
    }

    // 正常返回
    this.resetDynamicOptions()
    return valueWrapper.data
  }

  // 根据指定key设置记录, 默认将所有类型数据转换为string
  public setItem (key: string, value: any) {
    const realKey = this.getRealKey(key)
    this.getDriver().setItem(realKey, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为string
  public setItemString (key: string, value: string) {
    if (Object.prototype.toString.call(value) !== '[object String]') {
      this.resetDynamicOptions()
      throw new Error(`setItemString only receive a string variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    const realKey = this.getRealKey(key)
    this.getDriver().setItem(realKey, this.getEncryptContent(value))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为number
  public setItemNumber (key: string, value: number) {
    if (Object.prototype.toString.call(value) !== '[object Number]') {
      this.resetDynamicOptions()
      throw new Error(`setItemNumber only receive a number variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    const realKey = this.getRealKey(key)
    this.getDriver().setItem(realKey, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为boolean
  public setItemBoolean (key: string, value: boolean) {
    if (Object.prototype.toString.call(value) !== '[object Boolean]') {
      this.resetDynamicOptions()
      throw new Error(`setItemBoolean only receive a boolean variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    const realKey = this.getRealKey(key)
    this.getDriver().setItem(realKey, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为boolean
  public setItemJSON (key: string, value: Record<string, any> | Array<any>) {
    if (Object.prototype.toString.call(value) !== '[object Object]' && Object.prototype.toString.call(value) !== '[object Array]') {
      this.resetDynamicOptions()
      throw new Error(`setItemJSON only receive a json format data(json、object、array) as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    const realKey = this.getRealKey(key)
    this.getDriver().setItem(realKey, this.getEncryptContent(JSON.stringify(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置带时间戳记录, value为any
  public setItemExpired(key: string, value: any, expired = 0) {
    if (Object.prototype.toString.call(expired) !== '[object Number]') {
      this.resetDynamicOptions()
      throw new Error(`setItemExpired only receive a number variable as expired, but received: ${expired} - ${Object.prototype.toString.call(expired)}`)
    }

    const valueWrapper = {
      data: value,
      expired: expired === 0 ? expired : new Date().getTime() + expired
    }

    const realKey = this.getRealKey(key)
    this.setItemJSON(realKey, valueWrapper)
    this.resetDynamicOptions()
  }

  // 移除指定记录
  public removeItem(key: string) {
    const realKey = this.getRealKey(key)
    this.getDriver().removeItem(realKey)
    this.resetDynamicOptions()
  }

  // 清除所有记录
  public clear() {
    this.getDriver().clear()
    this.resetDynamicOptions()
  }
}

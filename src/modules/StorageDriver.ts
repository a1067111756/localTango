/* Driver功能实现 - 关注数据读取/存储前的数据处理 */
import AES from 'crypto-js/aes'
import EncUtf8 from 'crypto-js/enc-utf8'
import LocalStorage from "./localStorage"
import SessionStorage from "./sessionStorage"
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
  }

  // 方法 - 获取使用的config配置
  private getConfig () {
    return Object.keys(this.dynamicOptions).length > 0
      ? { ...this.globalOptions, ...this.dynamicOptions }
      : this.globalOptions
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
      throw new Error(`dencrypt content failed, please check your encrypt key is same as dencrypt key`)
    }
  }

  // 方法 - 重置动态配置选项
  private resetDynamicOptions () {
    this.dynamicOptions = {}
  }

  // 根据指定key获取记录
  public getItem(key: string) {
    let resString = this.getDriver().getItem(key)
    if (!resString) {
      this.resetDynamicOptions()
      return null
    }

    resString = this.getDencryptContent(resString)
    this.resetDynamicOptions()
    return resString
  }

  // 根据指定key获取字符串记录， 默认值''
  public getItemString(key: string, defaultValue = '') {
    let resString = this.getDriver().getItem(key) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue
    }

    resString = this.getDencryptContent(resString)
    this.resetDynamicOptions()
    return resString
  }

  // 根据指定key获取number类型记录， 默认值0
  public getItemNumber(key: string, defaultValue = 0) {
    const resString = this.getDriver().getItem(key) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue
    }

    const resNumber = Number(this.getDencryptContent(resString))
    if (isNaN(resNumber)) {
      this.resetDynamicOptions()
      throw new Error(`the search result cannot be converted to number correctly, result: ${resString}`)
    }

    this.resetDynamicOptions()
    return resNumber
  }

  // 根据指定key获取boolean类型记录， 默认值false
  public getItemBoolean(key: string, defaultValue = false) {
    let resString = this.getDriver().getItem(key) as string
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue
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

  // 根据指定key获取JSON类型记录, 默认值{}
  public getItemJSON(key: string, defaultValue = {}) {
    let resString = this.getDriver().getItem(key)
    if (!resString) {
      this.resetDynamicOptions()
      return defaultValue
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
  public getItemExpired(key: string, defaultValue = null) {
    const valueWrapper = this.getItemJSON(key, 'no find value')
    if (valueWrapper === 'no find value') {
      return defaultValue
    }

    if (!Object.keys(valueWrapper).includes('expired') || !Object.keys(valueWrapper).includes('data')) {
      throw new Error(`the search result cannot be converted to itemExpired correctly, result: ${valueWrapper}`)
    }

    if (valueWrapper.expired <= 0) {
      return valueWrapper.data
    }

    const nowStamp = new Date().getTime()
    if (nowStamp > valueWrapper.expired) {
      this.getDriver().removeItem(key)
      return defaultValue
    }

    return valueWrapper.data
  }

  // 根据指定key设置记录, 默认将所有类型数据转换为string
  public setItem (key: string, value: any) {
    this.getDriver().setItem(key, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为string
  public setItemString (key: string, value: string) {
    if (Object.prototype.toString.call(value) !== '[object String]') {
      this.resetDynamicOptions()
      throw new Error(`setItemString only receive a string variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    this.getDriver().setItem(key, this.getEncryptContent(value))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为number
  public setItemNumber (key: string, value: number) {
    if (Object.prototype.toString.call(value) !== '[object Number]') {
      this.resetDynamicOptions()
      throw new Error(`setItemNumber only receive a number variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    this.getDriver().setItem(key, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为boolean
  public setItemBoolean (key: string, value: boolean) {
    if (Object.prototype.toString.call(value) !== '[object Boolean]') {
      this.resetDynamicOptions()
      throw new Error(`setItemBoolean only receive a boolean variable as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    this.getDriver().setItem(key, this.getEncryptContent(String(value)))
    this.resetDynamicOptions()
  }

  // 根据指定key设置记录, value为boolean
  public setItemJSON (key: string, value: Record<string, any> | Array<any>) {
    if (Object.prototype.toString.call(value) !== '[object Object]' && Object.prototype.toString.call(value) !== '[object Array]') {
      this.resetDynamicOptions()
      throw new Error(`setItemJSON only receive a json format data(json、object、array) as value, but received: ${value} - ${Object.prototype.toString.call(value)}`)
    }

    this.getDriver().setItem(key, this.getEncryptContent(JSON.stringify(value)))
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

    this.setItemJSON(key, valueWrapper)
  }
}

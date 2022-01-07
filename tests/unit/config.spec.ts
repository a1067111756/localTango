/* 插件 -> 配置测试 */
import LocalTango from "@/index"
import { defaultGlobalOptions } from '@/config'

describe('插件 -> 配置测试', () => {
  // 生命周期 - 每个测试进行前
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    LocalTango.config(defaultGlobalOptions)
  })

  it('config:driver测试', async () => {
    // localTango.storage形式调用测试
    const key = 'localTango.storage'
    const value = 'localTango.storage测试Value';
    (LocalTango.storage as any).setItem(key, value)
    expect(localStorage.getItem(key)).toEqual(value)
    expect((LocalTango.storage as any).getItem(key)).toEqual(value)

    // localTango.session形式调用测试
    const key1 = 'localTango.session'
    const value1 = 'localTango.session测试Value';
    (LocalTango.session as any).setItem(key1, value1)
    expect(sessionStorage.getItem(key1)).toEqual(value1)
    expect((LocalTango.session as any).getItem(key1)).toEqual(value1)

    // 全局配置driver选项为storage
    LocalTango.config({ driver: 'localStorage' })
    const key2 = 'localTango.config.storage'
    const value2 = 'localTango.config.storage测试Value';
    (LocalTango.storage as any).setItem(key2, value2)
    expect(localStorage.getItem(key2)).toEqual(value2)
    expect((LocalTango.storage as any).getItem(key2)).toEqual(value2)

    // 全局配置driver选项为session
    LocalTango.config({ driver: 'sessionStorage' })
    const key3 = 'localTango.config.session'
    const value3 = 'localTango.config.session测试Value';
    (LocalTango.session as any).setItem(key3, value3)
    expect(sessionStorage.getItem(key3)).toEqual(value3)
    expect((LocalTango.session as any).getItem(key3)).toEqual(value3)
  });

  it('config:encrypt测试', async () => {
    // localTango.encrypt形式调用测试
    const key = 'localTango.encrypt'
    const value = 'localTango.encrypt测试Value';
    (LocalTango.encrypt as any).setItem(key, value)
    expect(localStorage.getItem(key)).not.toEqual(value)
    expect((LocalTango.encrypt as any).getItem(key)).toEqual(value)

    // 全局配置encrypt选项测试
    LocalTango.config({ encrypt: true })
    const key1 = 'localTango.config.encrypt'
    const value1 = 'localTango.config.encrypt测试Value';
    LocalTango.setItem(key1, value1)
    expect(localStorage.getItem(key1)).not.toEqual(value1)
    expect(LocalTango.getItem(key1)).toEqual(value1)
  });

  it('config:encryptKey测试', async () => {
    // 全局配置encryptKey选项测试
    const key = 'localTango.config.encryptKey'
    const value = 'localTango.config.encryptKey测试Value';
    (LocalTango.encrypt as any).setItem(key, value)
    expect((LocalTango.encrypt as any).getItem(key)).toEqual(value)
    LocalTango.config({ encryptKey: 'config_encryptKey' })
    expect((LocalTango.encrypt as any).getItem(key)).not.toEqual(value)
  });
})

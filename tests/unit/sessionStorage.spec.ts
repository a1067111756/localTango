/* 插件 -> 基础功能API测试 -> sessionStorage */
import LocalTango from "@/index"
import { defaultGlobalOptions } from '@/config'

describe('插件 -> 功能API测试 -> sessionStorage', () => {
  // 生命周期 - 每个测试进行前
  beforeEach(() => {
    sessionStorage.clear()
    LocalTango.config(defaultGlobalOptions)
  })

  it('setItem / getItem测试', async () => {
    // 普通接口测试
    const key = 'setItem'
    const value = 'setItem value测试'
    LocalTango.setItem(key, value)
    expect(LocalTango.getItem(key)).toEqual(value)

    // driver动态配置接口测试
    const key1 = 'setItem_driver'
    const value1 = 'setItem driver value测试';
    (LocalTango.session as any).setItem(key1, value1)
    expect((LocalTango.session as any).getItem(key1)).toEqual(value1)

    // encrypt动态配置接口测试
    const key2 = 'setItem_encrypt'
    const value2 = 'setItem encrypt value测试';
    (LocalTango.encrypt as any).setItem(key2, value2)
    expect((LocalTango.encrypt as any).getItem(key2)).toEqual(value2)

    // 查找为空，默认返回值测试
    const key3 = 'setItem_default'
    expect(LocalTango.getItem(key3)).toBeNull()
  });

  it('setItemString / getItemString测试', async () => {
    const key = 'setItemString'
    const value = 'setItemString value测试'
    LocalTango.setItemString(key, value)
    expect(LocalTango.getItemString(key)).toEqual(value)

    const key1 = 'setItemString_driver'
    const value1 = 'setItemString driver value测试';
    (LocalTango.session as any).setItemString(key1, value1)
    expect((LocalTango.session as any).getItemString(key1)).toEqual(value1)

    const key2 = 'setItemString_encrypt'
    const value2 = 'setItemString encrypt value测试';
    (LocalTango.encrypt as any).setItemString(key2, value2)
    expect((LocalTango.encrypt as any).getItemString(key2)).toEqual(value2)

    const key3 = 'setItemString_default'
    const value3 = 'setItemString default value测试';
    expect(LocalTango.getItemString(key3, value3)).toEqual(value3)
  });

  it('setItemNumber / getItemNumber测试', async () => {
    const key = 'setItemNumber'
    const value = 10
    LocalTango.setItemNumber(key, value)
    expect(LocalTango.getItemNumber(key)).toEqual(value)

    const key1 = 'setItemNumber_driver'
    const value1 = 11;
    (LocalTango.session as any).setItemNumber(key1, value1)
    expect((LocalTango.session as any).getItemNumber(key1)).toEqual(value1)

    const key2 = 'setItemNumber_encrypt'
    const value2 = 12;
    (LocalTango.encrypt as any).setItemNumber(key2, value2)
    expect((LocalTango.encrypt as any).getItemNumber(key2)).toEqual(value2)

    const key3 = 'setItemNumber_default'
    const value3 = 13;
    expect(LocalTango.getItemNumber(key3, value3)).toEqual(value3)
  });

  it('setItemBoolean / getItemBoolean测试', async () => {
    const key = 'setItemBoolean'
    const value = true
    LocalTango.setItemBoolean(key, value)
    expect(LocalTango.getItemBoolean(key)).toBeTruthy()

    const key1 = 'setItemBoolean_driver'
    const value1 = false;
    (LocalTango.session as any).setItemBoolean(key1, value1)
    expect((LocalTango.session as any).getItemBoolean(key1)).toBeFalsy()

    const key2 = 'setItemBoolean_encrypt'
    const value2 = true;
    (LocalTango.encrypt as any).setItemBoolean(key2, value2)
    expect((LocalTango.encrypt as any).getItemBoolean(key2)).toBeTruthy()

    const key3 = 'setItemBoolean_default'
    const value3 = false;
    expect(LocalTango.getItemBoolean(key3, value3)).toBeFalsy()
  });

  it('setItemJSON / getItemJSON测试', async () => {
    const key = 'setItemJSON'
    const value = { a: 'setItemJSON value测试', b: 12 }
    LocalTango.setItemJSON(key, value)
    expect(LocalTango.getItemJSON(key)).toEqual(value)

    const key1 = 'setItemJSON_driver'
    const value1 = [{ a: 'setItemJSON value测试', b: 12 }];
    (LocalTango.session as any).setItemJSON(key1, value1)
    expect((LocalTango.session as any).getItemJSON(key1)).toEqual(value1)

    const key2 = 'setItemJSON_encrypt'
    const value2 = { a: 'setItemJSON_encrypt value测试', b: 10 };
    (LocalTango.encrypt as any).setItemJSON(key2, value2)
    expect((LocalTango.encrypt as any).getItemJSON(key2)).toEqual(value2)

    const key3 = 'setItemJSON_default'
    const value3 = [{ a: 'setItemJSON_default value测试', b: 13 }];
    expect(LocalTango.getItemJSON(key3, value3)).toEqual(value3)
  });

  it('getItemExpired / setItemExpired测试', async () => {
    const key = 'setItemExpired'
    const value = { a: 'setItemExpired value测试', b: 10, c: true }
    LocalTango.setItemExpired(key, value, 10 * 1000)
    expect(LocalTango.getItemExpired(key)).toEqual(value)

    const key1 = 'setItemExpired_driver'
    const value1 = [{ a: 'setItemExpired value测试', b: 11, c: false }];
    (LocalTango.session as any).setItemExpired(key1, value1, 10 * 1000)
    expect((LocalTango.session as any).getItemExpired(key1)).toEqual(value1)

    const key2 = 'setItemExpired_encrypt'
    const value2 = { a: 'setItemExpired_encrypt value测试', b: 12, c: '测试' };
    (LocalTango.encrypt as any).setItemExpired(key2, value2)
    expect((LocalTango.encrypt as any).getItemExpired(key2)).toEqual(value2)

    const key3 = 'setItemExpired_default'
    expect(LocalTango.getItemExpired(key3)).toBeNull()

    // 过期测试
    const key4 = 'setItemExpired_expired'
    const value4 = { a: 'setItemExpired_encrypt value测试', b: 12, c: '测试' };
    (LocalTango.encrypt as any).setItemExpired(key4, value4, 1000)
    jest.useFakeTimers()
    setTimeout(() => {
      expect((LocalTango.encrypt as any).getItemExpired(key4)).toBeNull()
    }, 1500)
    jest.runAllTimers()
  });
})

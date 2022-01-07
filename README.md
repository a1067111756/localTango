# 🚀 Local Tango

> 🔥 一个基于业务总结、更好的管理本地持久化存储功能

### 一、插件的背景和目标
___
- 背景 - 实际项目开发中，根据项目属性在简单的本地持久化存储选择上经常会在localStorage、sessionStorage等中来回切换，并且还需要进行一些功能加强

- 目标 - 尽可能实现一个上层的管控工具，提供统一的持久化接口，兼容前端常见持久化方式（eg: localStorage、sessionStorage、indexDb）

- 声明 - 该插件旨在减化自己工作中重复工作的工具，实现原理简单，自身能力有限，使用者勿喷，如果有好的想法和建议也可在issue中提出

### 二、预期实现功能
___
- 多个底层持久化库兼容，当前兼容了localStorage、sessionStorage

- 支持复杂对象存储，支持string, number, boolean, object, Array等常见数据类型的存储，避免使用者需要自行转换类型

- 支持存储加密，比较常见和实用的场景，当前只支持AES加密，后期考虑支持多种加密方式选择

- 支持存储过期时间戳，不是很常见但是实用的需求，比如登录信息的过期，当前是扩展了setItemExpired / getItemExpired两个接口进行支持


### 三、插件的使用
___

Install:
```bash
$ npm i local-tango
```

Use in code:
```javascript
import localTango from 'local-tango'
localTango.setItem('key', value)
```

Best practices:
```
local-tango默认导出的是一个实例对象，不需要new直接可以调用，目的是为了全局只存在一个对象。
建议在项目初始化时，对插件进行初始化和全局配置，将实例对象挂载到window对象食用更佳。

import localTango from 'local-tango'
localTango.config({
  driver: 'localStorage',
  encrypt: false,
  encryptKey: 'local_tango_encrypt_key'
})
window.localTango = localTango
```

### 四、插件配置API
___
### `localTango.config()`
全局配置选项，一旦配置将会之后调用的所有API生效

```typescript
// interface declaration
interface LocalTangoConfig {
    encrypt?: boolean,
    encryptKey?: string,
    driver?: 'localStorage' | 'sessionStorage' | 'session' | 'storage'
}

// use in code
localTango.config({
    // 使用的driver，默认值localStorage
    driver: 'localStorage',
    // 是否加密， 默认是false
    encrypt: false,
    // 加密key, 默认值local_tango_encrypt_key
    encryptKey: 'local_tango_encrypt_key'
})
```

### `localTango.storage / localTango.session / localTango.encrypt`
动态配置选项，链式调用的形式配置部分可选项，只对当次生效不影响全局配置

```typescript
// use in code
// 使用localStorage进行存储
localTango.storage.setItem(key, value)
// 使用sessionStorage进行存储
localTango.session.setItem(key, value)
// 使用加密进行存储
localTango.encrypt.setItem(key, value)
// 使用localStorage并进行加密存储
localTango.storage.encrypt.setItem(key, value)
// 使用sessionStorage并进行加密存储
localTango.session.encrypt.setItem(key, value)

// 使用localStorage获取存储
localTango.storage.getItem(key, value)
// 使用sessionStorage获取存储
localTango.session.getItem(key, value)
// 使用解密获取存储
localTango.encrypt.getItem(key, value)
// 使用localStorage并进行解密获取存储
localTango.storage.encrypt.getItem(key, value)
// 使用sessionStorage并进行解密获取存储
localTango.session.encrypt.getItem(key, value)

tip: 链式的可选配置返回的都是对象本身,可选项可以进行任何类型组合,只会对当次生效,不影响全局
```

### 五、插件功能API
___
### `localTango.setItem (key: string, value: any): void`
根据指定key设置记录

```typescript
{
  localTango.setItem('key', value)
}

注意: localTango.setItem虽然可以设置任意类型的value, 但是底层会通过String(value)进行数据转换
在进行存储, 这样实际是和localStorage/sessionStorage的接口保持一致的, 使用者需要注意这个个问题
```

### `localTango.getItem (key: string): string | null`
根据指定key获取记录

```typescript
{
  localTango.getItem('key')
}
```

### `localTango.setItemString (key: string, value: string): void`
根据指定key设置string类型记录

```typescript
{
  localTango.setItemString('key', 'value is string')
}
```

### `localTango.getItemString (key: string, defaultValue?: string): string`
根据指定key获取string类型记录， defaultValue默认值''

```typescript
{
  localTango.getItemString('key')
  localTango.getItemString('key', 'defaultValue is string')
}
```

### `localTango.setItemNumber (key: string, value: number): void`
根据指定key设置number类型记录

```typescript
{
  localTango.setItemNumber('key', 0)
}
```

### `localTango.getItemNumber (key: string, defaultValue?: number): number`
根据指定key获取number类型记录， defaultValue默认值0

```typescript
{
  localTango.getItemNumber('key')
  localTango.getItemNumber('key', 1000)
}
```

### `localTango.setItemBoolean (key: string, value: boolean): void`
根据指定key设置boolean类型记录

```typescript
{
  localTango.setItemBoolean('key', true)
}
```

### `localTango.getItemBoolean (key: string, defaultValue?: boolean): boolean`
根据指定key获取boolean类型记录， defaultValue默认值false

```typescript
{
  localTango.getItemBoolean('key')
  localTango.getItemBoolean('key', true)
}
```

### `localTango.setItemJSON (key: string, value: Record<any, any> | Array<any>): void`
根据指定key设置json形式数据记录

```typescript
{
  localTango.setItemJSON('key', [{ a: 'aa' }, { b: 'bb' }])
}
```

### `localTango.getItemJSON (key: string, defaultValue?: Record<any, any> | Array<any>): Record<any, any> | Array<any>`
根据指定key获取json形式数据记录, defaultValue默认值{}

```typescript
{
  localTango.getItemJSON('key')
  localTango.getItemJSON('key', {})
  localTango.getItemJSON('key', [])
}
```

### `localTango.setItemExpired (key: string, value: any, expired: number): void`
根据指定key设置时间戳记录, expired代表过期时间(当前时间往后)，单位为毫秒, 为0时表示永不过期

```typescript
{
  // 永不过期
  localTango.setItemExpired('key', 'value is a string')
  // 1s后过期
  localTango.setItemExpired('key', [{ a: 'aa' }, { b: 'bb' }], 1000)
}
```

### `localTango.getItemExpired (key: string, defaultValue?: any): any`
根据指定key获取时间戳记录, defaultValue默认值null。

```typescript
{
  localTango.getItemExpired('key')
  localTango.getItemExpired('key', {})
  localTango.getItemExpired('key', [])
  localTango.getItemExpired('key', 'default value is string')
}

注意: 时间戳只是一个语法糖, 底层实际存储的是一个对象{ data: any, expired: number }
你也可以使用setItemJSON/getItemJSON这些接口来完成,其中getItemExpired内置了一个操作
是当发现expired过期会自动去删除该记录,返回默认值给使用者,我认为这个是很有用的,用户不
用在关心记录的过期清除问题
```

### 六、Q&A
___
1. local-tango为什么不导出类而直接导出对象？
```
    这个问题思考的点在，我想把这个工具的目标定为了一个全局的工具使用，只需要一次性的初始化配置全局
    就生效。就像console、localStorage、sessionStorage这样的接口一样全局使用
```

2. 为什么扩展setItemExpired/getItemExpired接口去支持时间戳记录而不是在配置上进行全局支持时间戳记录？
```
    这个问题衡量了许久，如果全局支持时间戳，那么底层保存的数据必然是一个时间戳对象，和通常我们使用
    localStorage、sessionStorage存储的数据有别，对于就项目的数据解析就会不兼容。所有我退一步进行
    两个接口的扩展，使用者自行决定是否使用带时间戳去存储数据
```

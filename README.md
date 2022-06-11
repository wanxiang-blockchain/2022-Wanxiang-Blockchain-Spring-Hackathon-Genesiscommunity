# 商鼎云桌面端

## 待做事项
#### 第一周任务
- [x] 重构架构
- [ ] 简易实现合约上传,mp3播放
- [ ] 迁移`login`代码
- [ ] 整合`near`服务
- [ ] 搭建主页面`layout`样式
- [ ] 开发控制台
- [ ] 开发文件列表

## 下载依赖
```bash
$ yarn
```
## 启动
```bash
$ yarn start
```
## 目录结构
    public/
    src/
      auth/ 权限判断
      components/ 公用组件(至少两个页面使用)
      layouts/ 全局布局
      locales/ 国际化
      models/ 全局状态管理
      pages/ 页面
      utils/ 工具箱
      app.js 运行时配置文件
      global.less 全局样式文件


## 开发规范
    1. js和文件名称使用驼峰命名
    2. 单个页面
       1. 页面默认主页使用 index.jsx 和 index.less 表示
       2. 页面所需要的静态文件放到页面目录的 assets 中
       3. 组件在页面目录中创建 components 保存
       4. 页面内部所需使用的状态管理在页面目录中创建 model.js 进行管理
    3. 顶层 models/ 文件夹内部只需要有一个状态管理文件
    4. 需要全局使用的样式变量放到 src/global.less 中

## Git仓库管理规范
    1. 远程有两个分支
        1. master 上线后的主分支
        2. develop 开发分支
    2. 本地开发
        1. 每次任务单独新建分支, 开发完成后合并到本地 develop 分支
        2. 本地分支提交只能提交到远程开发分支(develop)
    3. 合并到 master 分支(上线)的操作只能由项目负责人确认后进行

## 参考技术文档
> [react](https://zh-hans.reactjs.org/)

> [react hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)

> [umi](https://umijs.org/zh-CN/)

> [ahooks](https://ahooks.js.org/zh-CN) 网络请求 防抖 截流...

> [路由](https://umijs.org/zh-CN/docs/convention-routing)

> [状态管理](https://umijs.org/zh-CN/plugins/plugin-dva)

> [国际化](https://umijs.org/zh-CN/plugins/plugin-locale)

> [typescript](https://www.tslang.cn/docs/home.html)
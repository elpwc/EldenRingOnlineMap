

<p align="center" style="font-size: 2em; font-weight: bold;">
   <img align="center" src="./public/resource/images/fire.png" width="200px"/>
</p>
<div align="center">
 
# 老头环协作编辑地图
 
### 𝐄𝐋𝐃𝐄𝐍 𝐑𝐈𝐍𝐆 𝐎𝐍𝐋𝐈𝐍𝐄 𝐌𝐀𝐏
   
![alt GithubStars](https://img.shields.io/github/stars/elpwc/EldenRingOnlineMap.svg?style=flat)
![alt GithubStars](https://img.shields.io/github/forks/elpwc/EldenRingOnlineMap.svg?style=flat)
![alt license](https://img.shields.io/badge/license-MIT-green)
   
 
地址：https://www.elpwc.com/eldenringmap/
</div>


<hr/>

## 技术栈

- Frontend: Svelte + Leaflet, via TypeScript
- Backend: PHP + MySQL, based on Apache + nginx, WinServer

一开始只是随手写的个人用的小网站，因为一直有在尝鲜 Svelte 框架，就很大胆地使用了  
选用纯 PHP 写后端接口也是图方便省事的原因

地图是基于 Leaflet 实现的，现行版本的地标全部使用 DOM 渲染。

## 截图

![alt screenshot](./images/ss1.png)
![alt screenshot](./images/ss2.png)

## 关于参与开发

老头环地图的日访问量一直维持在20-30万之间，在如此庞大的用户量面前，我笨拙的技术水平已经不足以跟得上日日增加的计划功能、反馈的bug的开发，所以，欢迎通过邮件/QQ/issue联系 参与到开发里来~

## 贡献者

| <img src="https://avatars.githubusercontent.com/u/52597061?v=4" width = "100" alt="spking11" align=center />|<img src="https://avatars.githubusercontent.com/u/13135477?v=4" width = "100" alt="Ranger" align=center />|
|-|-|
|spking11([@spking11](https://github.com/spking11))|Ranger([@RangerChen](https://github.com/RangerChen))|


## 开发与部署

### 前端

前端框架：
Svelte：一个比较新的轻量化的前端框架，具体信息可以参考[官网](https://svelte.dev/)或[中文网](https://www.sveltejs.cn/) 

> Svelte 是一种全新的构建用户界面的方法。传统框架如 React 和 Vue 在浏览器中需要做大量的工作，而 Svelte 将这些工作放到构建应用程序的编译阶段来处理。

nodejs version: 16.13.0

npm version: 8.1.2

pnpm version: 7.0.0-beta.2

1. 克隆仓库到本地
```bash
   git clone https://github.com/elpwc/EldenRingOnlineMap.git
```

2. 依赖安装

**由于项目当前使用了 npm 进行包管理，推荐使用 `npm` 或 `pnpm` 进行依赖安装**

 [pnpm传送门](https://www.pnpm.cn/)

 如果本地的环境使用的是 `yarn`，提交 pull request 是可以忽略 `yarn.lock` 文件
```bash
   npm i // or pnpm install | yarn 
```

3. 开发环境调试
```bash
   npm run dev // or pnpm dev | yarn dev
```

4. 构建打包
```bash
   npm run build // or pnpm build | yarn build
```

5. 部署

打包后的静态文件位于 `/public` 文件夹下，可以直接作为静态资源部署在静态服务器上。

### 后端

依赖`php`,`mysql`,，

1. 初始化数据库

找到数据库初始化脚本文件 `/database.sql`，通过数据库客户端软件(e.g. navicat)执行脚本即可；

2. 配置数据库

数据库配置在 `/public/api/private/` 下：

```bash
├── public
│   ├── api
│   │   ├── private
│   │   │   ├── admin.example.php // Admin 模式密码
│   │   │   ├── dbcfg.example.php // 数据库配置文件
│   │   │   └── illegal_words_list.example.php // 屏蔽词列表
```  

启动方式：

在对应的配置中增加了自己的内容后，重命名，将文件名中的 `.example` 就可以生效了

e.g. `admin.example.php` -> `admin.php`

在前端进入管理员模式的办法可以可以细读 `src/pages/About.svelte` 内容，进入了就可以直接在前端对各个数据删改了(说明页会出现一个（Admin）字样说明已进入 Admin 模式；

3. 部署

直接将 `/public` 文件夹的内容部署至 Apache 服务器上即可。

PS：关于各个文件的说明在 `/src/description.txt` 中；


## 开源许可

MIT

在包含此协议的前提下可以随意使用、修改、发布 EldenRingMap 的代码。


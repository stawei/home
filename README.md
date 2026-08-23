# 浅小兮の主页

一个基于 Vue 3 + Vite 构建的个人主页 / 导航站，兼顾视觉展示、社交展示、天气信息和音乐播放器等能力，适合用于个人博客、主页、导航页和作品展示。

<p align="center">
  <img src="./screenshots/main.jpg" alt="项目预览" width="100%" />
</p>

## 项目概览

- 个人主页与导航入口集合
- 响应式布局，兼容桌面端与移动端
- 一言、天气、时间、进度等动态展示模块
- 可自定义网站链接、社交链接、站点信息
- 支持音乐播放器、壁纸背景、PWA 缓存
- 可直接做静态站点部署，适配 Vercel、Netlify、GitHub Pages、Docker 等

## 功能特性

- [x] 加载动画
- [x] 站点简介与个性化文案
- [x] Hitokoto 一言
- [x] 日期与时间
- [x] 实时天气（和风天气 API）
- [x] 时间进度条
- [x] APlayer 音乐播放器
- [x] 移动端自适应
- [x] 自定义壁纸 / 背景图
- [x] 社交链接与网站导航配置
- [x] PWA 支持与静态资源缓存

## 技术栈

- [Vue 3](https://cn.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [Element Plus](https://element-plus.org/)
- [Aplayer](https://aplayer.js.org/)
- [IconPark](https://iconpark.oceanengine.com/official)
- [xicons](https://xicons.org/)

## 项目结构

```text
.
├── public/                     # 静态资源、图标、背景图
├── src/
│   ├── api/                   # API 请求
│   ├── assets/                # JSON 配置、静态资源
│   ├── components/            # 通用组件
│   ├── store/                 # Pinia 状态
│   ├── style/                 # 全局样式
│   ├── utils/                 # 工具函数
│   ├── views/                 # 页面视图
│   ├── App.vue                # 根组件
│   └── main.js                # 入口文件
├── .env                       # 环境变量
├── Dockerfile                 # 容器构建文件
├── package.json               # 项目脚本与依赖
├── vite.config.js             # Vite 配置
├── README.md                  # 中文说明
├── README_EN.md               # English documentation
├── screenshots/               # 项目截图
└── dist/                      # 构建产物
```

## 快速开始

### 1. 安装依赖

要求：Node.js >= 18，推荐使用 pnpm。

```bash
npm install -g pnpm
pnpm install
```

### 2. 启动开发环境

```bash
pnpm dev
```

开发服务器默认在 `http://localhost:3000` 启动。

### 3. 构建产物

```bash
pnpm build
```

构建完成后，静态资源会输出到 `dist/` 目录，可直接部署到静态托管服务。

## 环境变量配置

项目中已经提供了 `.env` 文件，按需修改以下配置：

```bash
# 站点信息
VITE_SITE_NAME = "浅小兮の梦"
VITE_SITE_ANTHOR = "千曦一梦"
VITE_SITE_KEYWORDS = "千曦一梦&浅小兮,个人主页"
VITE_SITE_DES = "欢迎来到我的主页"
VITE_SITE_URL = "https://your-domain.com"
VITE_SITE_LOGO = "/images/favicon.ico"
VITE_SITE_MAIN_LOGO = "/images/logo.png"
VITE_SITE_APPLE_LOGO = "/images/logo.png"

# 简介文本
VITE_DESC_HELLO = "Hope is a good thing and maybe the best thing, and no good things ever dies."
VITE_DESC_TEXT = "从相遇的刹那开始就注定了别离！"
VITE_DESC_HELLO_OTHER = "Oops !"
VITE_DESC_TEXT_OTHER = "哎呀，这都被你发现了（ 再点击一次可关闭 ）"

# 天气
VITE_WEATHER_KEY = "your_qweather_key"
VITE_SENIVERSE_KEY = "your_seniverse_key"   # 可选：备用天气服务

# 站点信息
VITE_SITE_START = "2023-12-31"
VITE_SITE_ICP = "萌ICP备20231231号"

# 音乐播放器
VITE_SONG_API = "https://meting-api.saop.cc/api"
VITE_SONG_SERVER = "netease"
VITE_SONG_TYPE = "playlist"
VITE_SONG_ID = "5314875708"
VITE_SONG_ID_QQ = "1171747653"

# 壁纸
VITE_CUSTOM_COVER_URL = "https://example.com/cover.mp4"
VITE_CUSTOM_API_URL = "https://api.example.com/wallpaper"
```

说明：

- `VITE_WEATHER_KEY` 需要从 [和风天气开发者服务](https://dev.qweather.com/docs/api/) 申请 Key，并使用其城市定位与实时天气接口
- `VITE_SENIVERSE_KEY` 为备用天气服务，可用于兜底；若不需要可保持为空
- `VITE_SONG_API` 推荐使用自行部署的 Meting API 服务；公共服务可能受限
- 若不需要展示天气、音乐、站点备案等内容，可将相关变量设为空

## 自定义内容

### 1. 网站导航

修改 `src/assets/siteLinks.json` 即可自定义链接列表：

```json
[
  {
    "icon": "Blog",
    "name": "博客",
    "link": "https://example.com/blog"
  }
]
```

图标名称可在 `src/components/Links.vue` / `src/views/Main` 中继续扩展，并引入对应的 `@vicons/*` 图标。

### 2. 社交链接

修改 `src/assets/socialLinks.json` 即可自定义社交入口：

```json
[
  {
    "name": "Github",
    "icon": "ri-github-fill",
    "tip": "去 GitHub 看看吧",
    "url": "https://github.com/your-name"
  }
]
```

### 3. 背景图与站点图标

- 背景图：`public/images/`
- 图标：`public/images/icon/`
- 可替换背景图、Logo 或文件名，随后在组件中按现有逻辑使用

## 部署方式

### 手动部署

```bash
pnpm install
pnpm build
```

构建产物位于 `dist/`，直接上传到 Nginx、Apache、对象存储或静态托管平台即可。

### Docker 部署

```bash
docker build -t home .
docker run -p 12445:12445 -d home
```

访问地址：`http://localhost:12445`

### Vercel / Netlify 等平台

1. 连接 GitHub 仓库
2. 选择 `Vite` / 默认静态站点配置
3. 设置构建命令：`pnpm build`
4. 设置发布目录：`dist`
5. 部署完成后访问生成的域名即可

## 相关 API

- [和风天气开发者服务](https://dev.qweather.com/docs/api/)
- [Meting API](https://github.com/xizeyoupan/Meting-API)
- [Hitokoto 一言](https://hitokoto.cn/)
- [心知天气](https://seniverse.com/)

## 许可证

该项目遵循 MIT 开源协议，详情请查看 [LICENSE](./LICENSE)。

## 备注

> 若需要更换字体、调整壁纸、增加页面模块，推荐优先查看 `src/assets`、`src/components` 与 `src/views` 目录中的配置与组件实现。
> 由于站点会依赖外部 API 和第三方资源，部署前请确认对应 Key 与访问权限已正确配置。


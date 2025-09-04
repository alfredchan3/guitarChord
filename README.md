# 吉他和弦推导

一个用于吉他和弦推导和可视化的Web应用，已从Create React App迁移到Next.js。

## 功能特点

- 🎸 根据和弦组成音推导吉他指法
- 🎵 支持三音和弦和四音和弦
- 🎯 交互式和弦音选择界面
- 📊 SVG和弦图谱可视化
- 📱 响应式设计，支持移动端

## 技术栈

- **Next.js 14** - React框架
- **React 18** - 用户界面库
- **CSS Modules** - 样式管理
- **SVG** - 和弦图谱绘制

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
npm run start
```

## 使用说明

1. 通过拖动界面上方的音符选择器来改变和弦组成音
2. 选择三音和弦或四音和弦模式
3. 系统会自动计算并显示对应的吉他指法图谱
4. 每个指法图显示和弦名称、品格位置和按弦方式

## 项目结构

```
guitarChord/
├── components/          # React组件
│   ├── ChordSelect.js   # 和弦选择组件
│   ├── ChordDraw.js     # 和弦绘制组件
│   └── *.module.css     # 组件样式
├── lib/                 # 核心库
│   └── guitarChord.js   # 和弦推导算法
├── pages/               # Next.js页面
│   ├── _app.js          # App组件
│   └── index.js         # 首页
├── public/              # 静态资源
└── styles/              # 全局样式
```

## 算法说明

项目包含完整的吉他和弦推导算法，支持：

- 单音类（Tone）- 音的映射和转换
- 吉他和弦推导（GuitarChord）- 指法计算
- 和弦名称推导（ChordName）- 和弦识别
- SVG绘图（ChordSvg）- 指法图谱生成

## 许可证

本项目基于原作者的算法和设计理念开发。
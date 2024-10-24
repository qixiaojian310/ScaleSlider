# Scale Slider

目录

1. scaleSlider： 前端
2. scaleSliderBacked： 后端
3. scaleSliderPyDeploy: 使用uvicorn部署前端的build文件

## 部署

### 简单版

1. 如果有node环境

   ```bash
   npm install serve -g
   # 进入scaleSlider下的dist文件夹
   cd scaleSlider/dist
   # 运行serve
   serve -p 5173
   ```

   此时环境会运行在 `localhost:5173`上
2. 没有node环境有python

   ```bash
   #在scaleSliderPyDeploy目录下已经复制了dist文件，可以直接用uvicorn部署
   cd scaleSliderPyDeploy
   uvicorn html:app --reload --port 5173
   ```

## 前端

使用React，需要有React环境，在有node的情况下可以用 `npm install` 安装依赖开发

## 后端

项目的基础结构是

1. 后端提供所有slider的对象
2. 前端渲染对象并注册事件
3. 前端获取用户的操作后将每个滚动条对应的刻度返回给后端
4. 后端处理后展示

目前后端需要完成的TODO是

1. 后端数据处理的过程
2. 初始化的数据

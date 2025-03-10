# Docker 入门与服务编排进阶

## 之前项目怎么部署的？有用过CI/CD吗？简单说一下流程？

### 传统项目的部署方式

- pnpm build 前端项目打包
- 分支
  - 最暴力，静态资源上传服务器，在服务器配置nginx静态代理就完了
  - 使用公司 CI平台，Jenkins, gitlab, 代码通过ci代码源拉到构建机器，进行打包部署
  - 云效、github action、circleCI 云平台

**手动部署的缺点：**

- 效率很低，需要一个专门的打包员
- 容易出错，（环境变量、基础变量）
- 不可回滚，（假设你发现新的版本有问题，想用之前的）
- 多人协作，（很麻烦，谁来打包）

### CI/CD

将打包构建发布整个流程平台化（CI/CD）

- 部署方式多种，push触发部署，pr触发部署，打tag封板部署
- 整个环节都可以邮件通知、钉钉通知

#### CI/CD是什么？

CI: 每次代码变更可以触发自动构建和测试
- 持续集成（Continuous Integration）
CD: 将测试所有卡点通过的代码部署到生产环境
- 持续交付（Continuous Delivery）
- 持续部署（Continuous Deployment）

#### CI/CD工作流

1. 代码提交，提交到仓库，配置push策略
2. CI, (缺陷扫描、ESLint检查、Unit Test、E2E Test, 自动触发构建脚本 pnpm i pnpm build )
3. CD, 构建产物部署到环境（自动部署）
   - ECS服务器部署
   - Docker部署
4. 通知

#### 工具链

- 持续集成，Jenkins、Github Action、CircleCI、Gitlab
- 持续交付，ArgoCD、Spinnaker
- 产物部署管理，Docker Compose、Kubernetes

#### 迁移CI/CD

docker 最佳实践
前端：构建的产物都是静态文件
    - oss 直接上传
    - nginx 静态代理
    - caddy 静态代理
node：`pnpm i` & `node server.js`
    - pm2构建镜像
其他服务：mysql、redis、clickhouse选用镜像

**在项目下新建Dockerfile文件**

node项目：
``` yaml
# 基础镜像
FROM node:16-alpine

# 工作目录
WORKDIR /app

# 安装pnpm
RUN npm install pnpm -g

# 复制项目文件到工作目录
COPY . .

# 安装依赖
RUN pnpm install

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start"] 


```

前端项目：
``` yaml
# 基础镜像
FROM nginx:latest

# 复制构建产物到nginx的默认静态文件目录
COPY dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

```

**启动Docker：**

1. 将Dockerfile中的内容通过命令打包构建成镜像
   `docker build -t my-app .`
2. 运行
   `docker run -d --name my-app -p 8080:80 nginx(新的镜像名称)`

## Docker使用和Dockerfile常见配置

Docker最佳实践
- compose 的拆分
- k8s

### Docker 基础

容器化平台，提供容器运行环境，以此简化开发和部署。（容器 约等于 操作系统）
（不同的平台，运行环境不同, CentOS, Ubuntu）

#### 核心概念
- 镜像 (image)
- 容器 (container)
- 仓库  (repository)

#### 优势
- 环境一致性，换哪台电脑都没问题（排除CPU架构）
- 高效利用，方便快捷使用轻量化容器
- 服务与微服务架构

#### 常用命令
- docker ps： 查看当前进程
- docker images : 查看所有镜像
- docker container ls：查看当前运行的容器
- docker container ls -a：查看所有的容器
- docker container start：启动容器
- docker container stop：停止容器
- docker container rm：删除容器
- docker run --name my-nginx -p 8080:80 -d nginx：运行nginx容器(没有的话会自动拉取)
- docker build -t my-app:latest .：构建镜像
- docker push my-app:latest：推送镜像
- docker pull my-app:latest：拉取镜像

### Dockerfile（使用命令太复杂）

Dockerfile是一个文本文件，用于基于官方镜像构建一个新的镜像。（运行时指定新的镜像名称）
写好Dockerfile后，通过docker build命令可以将其转换为镜像。
通过docker run命令运行新的镜像就可以启动容器。


## 基础Docker设计构建部署流程，前端、服务端、数据库等基础服务

docker compose来实现服务编排(一键启动所有容器)

- 前端静态资源托管服务，nginx,caddy
- 后端服务 node pm2
- 数据库 mysql redis clickhouse

## 实践：使用bitnami/nginx:latest镜像部署静态资源服务

1. 使用vite创建react项目
2. 编写Dockerfile
3. 构建镜像
4. 运行镜像
5. 访问

**踩坑：**
1. 目录路径错误：Bitnami官方镜像的默认网站目录是 /opt/bitnami/nginx/html ，而非标准nginx的 /usr/share/nginx/html
2. 文件权限问题：Bitnami镜像默认使用非root用户运行，可尝试添加：COPY --chown=1001:0 dist /opt/bitnami/nginx/html
3. 路由配置问题：SPA应用需要try_files配置（项目根目录新建nginx，dockerfile添加自定义nginx配置 COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/my_app.conf）

Dockerfile:
``` yaml
FROM bitnami/nginx:latest

# 添加自定义nginx配置（需在项目中创建对应文件）
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/my_app.conf

# 确保dist目录存在且包含index.html
COPY --chown=1001:0 dist /opt/bitnami/nginx/html

# 添加健康检查指令
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl --fail http://localhost:80 || exit 1

EXPOSE 80
```

nginx.conf:
``` conf
server {
    listen       80;
    server_name  localhost;
    
    location / {
        root   /opt/bitnami/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /opt/bitnami/nginx/html;
    }
}
```

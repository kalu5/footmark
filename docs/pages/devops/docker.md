# Docker

## 容器和虚拟机

- 什么是容器（类似于单间房间，共用大楼基础设施）Docker
容器是一种轻量级的虚拟化技术，可以把软件、运行依赖、配置文件打包在一起，形成一个独立、可快速运行的隔离环境
  - 核心特点
    - 共享宿主机内核，只隔离应用级资源
    - 秒级启动
    - 占用内存、CPU极少

- 虚拟机（独立的小别墅）VMware
完整的硬件级虚拟化，会虚拟出CPU、内存、硬盘、网卡等硬件资源，内部需要安装独立的操作系统
  - 核心特点
    - 拥有独立内核，完全硬件隔离
    - 分钟级启动
    - 资源消耗高

- 对比
|维度|容器|虚拟机|
|--|--|--|
|底层|共享宿主机内核|拥有独立内核|
|启动时间|秒级，快速部署|分钟级，开机缓慢，耗时长|
|资源占用|占用内存、CPU极少（一台机器可跑上百个）|占用内存、CPU较多（数量受限）|
|隔离性|只隔离应用级资源，安全性一般|完全隔离，安全性高|
|系统兼容|仅限同内核系统（Linux容器通用）| 支持不同内核系统（Windows、Linux、macOS等）|
|用途|适用于应用部署、项目打包、微服务等场景|多系统运行、测试环境、桌面虚拟化|

- 总结：部署项目用容器，多系统测试用虚拟机

## Docker安装与启动

- 基础命令
  - 添加Docker仓库源
    - yum-utils提供yum-config-manager工具`sudo dnf install yum-utils -y`
    - 配置Docker官方源`sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo`
  - 安装Docker核心组件`sudo dnf install docker-ce -y`
  - 启动Docker服务`sudo systemctl start docker`
  - 启动自启`sudo systemctl enable docker`
  - 检查Docker状态`sudo systemctl status docker`
  - 验证安装成功`docker info`
  - 重启Docker服务`sudo systemctl restart docker`

## 运行一个Nginx容器

- 运行容器`docker run [参数] 镜像名称:标签`
  - 参数
    - -d：后台模式运行，不阻塞当前终端
    - --name：指定容器名称
    - -p：映射端口，格式为端口：容器端口

- 启动Nginx容器
  - 拉取Nginx镜像`docker pull registry.openanolis.cn/openanolis/nginx:1.14.1-8.6`
  - 启动Nginx容器`docker run -d --name nginx -p 80:80 registry.openanolis.cn/openanolis/nginx:1.14.1-8.6`
    - -p 80:80：映射端口，将宿主机(nginx)80端口映射到容器80端口（通过docker proxy代理过去）
    - 镜像名称：registry.openanolis.cn/openanolis/nginx:1.14.1-8.6
    - 容器名称：nginx
  - 检查容器状态`docker ps`
  - 访问Nginx容器`http://localhost`

- 常用命令
  - 查看所有容器`docker ps -a`
  - 查看容器日志`docker logs 容器名称`
  - 停止容器`docker stop 容器名称`
  - 删除容器`docker rm 容器名称`（删除已停止的容器）
  - 强制删除容器`docker rm -f 容器名称`
  - 查看已经拉取的镜像`docker images`
  - 删除镜像`docker rmi 镜像名称/ID`

## 进入运行中的Docker容器内部

- 基础命令`docker exec [参数] 容器名称/ID 要执行的命令`
  - 参数
    - -it：交互式模式，分配伪终端，开启标准输入输出
    - -u：指定用户，默认root
    - -w：指定工作目录，默认/

- 进入Nginx容器内部
  - 进入容器`docker exec -it nginx /bin/bash（/bin/sh）`
  - 查看Nginx版本`nginx -v`

- 退出容器`exit`

- 不进入容器，直接执行命令
  - 执行Nginx容器内的命令`docker exec nginx nginx -v`

## 镜像和容器

### 镜像

相当于容器的模板，是静态的文件（Nginx镜像是Nginx服务的安装包）

- 核心特点
  - 静态性：不运行、不占用CPU/内存，只占用磁盘空间
  - 只读性：镜像内容不能被修改，只能被读取
  - 可复用性：一个镜像可以被多个容器使用
  - 获取方式
    - 从Docker Hub拉取
    - 从本地镜像仓库拉取
    - 从其他容器导出镜像

### 容器-镜像的运行示例

基于镜像启动的动态运行实例，是镜像的运行状态版本，可启动、停止、重启、删除等操作，运行时会占用CPU/内存资源

- 核心特点
  - 动态性：容器是动态运行的，可以被启动、停止、重启、删除等操作
  - 隔离性：容器之间是隔离的，互不干扰
  - 可扩展性：容器可以被扩展，增加或减少资源分配
  - 依赖镜像：容器运行时需要依赖镜像，镜像内容不能被修改，只能被读取

### 容器和镜像的核心区别
  - 镜像：相当于容器的模板，是静态的文件（Nginx镜像是Nginx服务的安装包）
  - 容器：镜像运行后的实例，是动态的（Nginx镜像启动的容器就是正在运行的Nginx服务）
  - 容器和镜像的关系：镜像=手机系统安装包，容器=安装好系统后正在使用的手机

**生命周期**
拉取镜像 -> 启动容器 -> 运行容器 -> 停止容器 -> 删除容器 -> 删除镜像


## 自定义构建镜像

- 编写Dockerfile
- 构建镜像`docker build`: Docker会逐行执行Dockerfile中的指令，一步一步构建镜像
- 启动容器：`docker run -d --name 容器名称 镜像名称:标签`：用构建好的自定义镜像启动

### Dockerfile

- 编写一系列指令，每一条指令对应镜像构建的一个步骤，通过docker build命令将Dockerfile转换为镜像，全程自动化执行。

- 核心指令：FROM -> RUN -> COPY -> CMD

  - FROM：指定基础镜像，是镜像构建的基础
    - 核心作用：直接构建自定义镜像的基础原料，即基于哪个已有的镜像进行构建
    - 注意：FROM指令只能有一个（开头），且必须在Dockerfile的顶部
    - 语法：`FROM 镜像名称:标签`（需要提前下载镜像）
    - 示例：`FROM ac2-registry.cn-hangzhou.cr.aliyuncs.com/ac2/base:ubuntu22.04`

  - RUN：执行命令，安装依赖、配置环境等
    - 核心作用：在构建镜像过程中
    - 语法：`RUN 命令1 && 命令2 && 命令3 ...`
    - 示例：`RUN apt-get update -y && apt-get install -y nginx`

  - COPY：将本地文件复制到构建的镜像内部(添加自定义配置，代码等)
    - 核心作用：将本地文件复制到镜像内部，用于自定义配置或代码部署
    - 语法：`COPY 本地文件 镜像内部路径`
      - 本地文件：本地文件路径，必须是相对路径，必须和Dockerfile在同一目录下, 否则报错
      - 镜像内部路径：绝对路径（/usr/share/nginx/html）
      - 注意：若复制目录，COPY会复制目录下的所有文件，不包含目录本身
    - 示例：`COPY nginx.conf /etc/nginx/nginx.conf`
  
  - EXPOSE：指定容器暴露的端口，用于外部访问
    - 核心作用：在容器启动时，会将指定的端口映射到主机的随机端口，外部可以通过随机端口访问容器
    - 语法：`EXPOSE 端口号`
    - 示例：`EXPOSE 80`
    
  - CMD：指定容器启动时要执行的命令
    - 核心作用：指定容器启动时，默认执行的命令（若启动容器时手动指定了命令，会覆盖CMD指令），一个Dockerfile只能有一个CMD指令, 多个会覆盖，只执行最后一个
    - 语法：`CMD 命令1 命令2 命令3 ...`
    - 示例：`CMD ["nginx", "-g", "daemon off;"]`
    - 注意：CMD指令只能有一个（开头），且必须在Dockerfile的底部
``` dockerfile
FROM 镜像名称:标签
RUN 安装依赖
COPY 本地文件 镜像内部路径
EXPOSE 端口号
CMD 启动应用
```

``` dockerfile
FROM ac2-registry.cn-hangzhou.cr.aliyuncs.com/ac2/base:ubuntu22.04
RUN apt-get update -y && apt-get install -y nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /var/www/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- 构建镜像`docker build -t 镜像名称:标签 .`
  - `-t`：指定镜像名称和标签
  - `.`：表示当前目录，即Dockerfile所在目录
  - 镜像名称:标签：自定义镜像的名称和标签，用于标识镜像

## 数据卷Volume

- 核心说明：数据卷是Docker中用于持久化容器数据的独立存储空间，它独立于容器生命周期，容器删除后，数据卷中的数据不会丢失，同时可以实现本地目录与容器内部目录的双向同步，方便数据管理与备份

- 为什么需要数据卷
  - 容器删除后，数据会丢失，无法持久化存储
  - 数据卷可以实现容器之间的数据共享，方便数据备份与恢复
  - 核心需求：解决容器删除后数据丢失的问题，同时方便本地管理容器数据（不进入容器，直接在本地修改数据）

- 核心优势
  - 共享：数据卷可以实现容器之间的数据共享，方便数据备份与恢复
  - 持久化：数据卷可以实现数据的持久化存储，容器删除后，数据不会丢失
  - 易管理：数据卷可以实现数据的备份与恢复，方便数据管理
  - 双向同步：数据卷可以实现本地目录与容器内部目录的双向同步，方便数据管理与备份

- 核心操作
  - 创建数据卷：`docker volume create 数据卷名称`
  - 挂载数据卷：`docker run -d --name 容器名称 -p 主机端口:容器端口 -v 数据卷名称:容器内部路径 镜像名称:标签`
    - `-v`：指定数据卷名称和挂载路径
    - 容器内部路径：容器内部挂载路径，必须是绝对路径（/usr/share/nginx/html）
    - 注意：若挂载目录，挂载目录下的所有文件，不包含目录本身
    - 示例：`docker run -d --name 容器名称 -p 主机端口:容器端口 -v 数据卷名称:/usr/share/nginx/html 镜像名称:标签`
    - 注意：
     - 挂载到容器指定目录
     - 将数据卷目录与/usr/share/nginx/html目录实现双向同步，方便数据管理与备份
    
  - 查看数据卷：`docker volume ls`
  - 查看数据卷详情：`docker volume inspect 数据卷名称`
  - 删除数据卷：`docker volume prune 数据卷名称`

## 网络通信Docker bridge

- 核心说明：Docker bridge网络是Docker默认的网络模式，也是最常用的网络类型，它相当于一个虚拟交换机，负责连接宿主机和容器，以及容器与容器之前的网络通信，实现容器的联网功能。（没有bridge网络，容器无法访问外网、无法被外部连接、无法与其他容器通信）

- 核心逻辑
  - 类比：bridge网络（docker 0） = 路由器，宿主机=宽带主机，容器=手机/电脑设备
  - 启动容器时自动连接bridge网络，容器之间可以通过IP地址进行通信

- 核心操作
  - 查看bridge网络：`docker network ls`
  - 查看bridge网络详情：`docker network inspect 网络名称`
  - 查看网络IP地址：`docker inspect 网络名称 | grep "IPAddress"`
  - 端口映射：`docker run -d --name 容器名称 -p 主机端口:容器端口 镜像名称:标签`
    - `-p`：指定主机端口和容器端口，格式为`主机端口:容器端口`
    - 注意：若不指定端口映射，容器端口只能在容器内部访问，无法被外部访问

## 端口映射

容器内部暴露端口给宿主机访问
`docker run -d --name 容器名称 -p 主机端口:容器端口 镜像名称:标签`

- 核心操作
  - 查看容器的端口映射：`docker port 容器名称`
  - 查看容器的端口映射详情：`docker port -l 容器名称`

## 查看容器日志

- 核心操作
  - 查看容器的日志：`docker logs [选项] 容器名称`
    - `-f`：实时查看容器日志，不退出容器
    - `-t`：显示容器日志的时间戳
    - `--tail n`：显示最近n行日志，默认显示最近10行日志
    - `--since 时间`：显示指定时间之后的日志
    - `--until 时间`：显示指定时间之前的日志






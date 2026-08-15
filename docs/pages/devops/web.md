# Web服务

## 基本概念

### 静态服务

- 定义：内容提前写好，不会变的网页，文件真实存在服务器硬盘上
- 特点：
  - 内容固定：.html/.jpg/.css/.js
  - 速度极快，服务器只需要读取并返回
  - 无计算、无数据库、无程序逻辑
- 举例：公司介绍页/纯展示博客/活动宣传页
- 服务：Nginx/Apache静态站点

### 动态服务

- 定义：网页内容实时计算生成（不同人/时间看到的内容不一样）
- 特点：
  - 需要程序语言运行：java/python/go/node
  - 需要应用服务器：Tomcat
  - 通常配合数据库：MySql、PostgreSQL
  - 每次请求都要计算+查询数据+拼接页面
- 举例：登录/购物车/后台管理

### 静态与动态对比

静态=读文件
动态=跑程序

### 代理（Proxy）

- 正向代理（客户端代理）
  - 作用：客户端通过代理访问外部网站
    - 隐藏客户端真实IP
    - 翻墙、加速、访问限制资源
  - 结构：客户端-正向代理-互联网目标网站

- 反向代理（服务器代理）
  - 作用：代理后端服务接收用户请求
    - 隐藏真实服务器IP
    - 安全、缓存、压缩、HTTPS、路由转发
  - 结构：用户-反向代理（Nginx）-应用服务器（Tomcat/PHP）

- 记忆
  - 正向代理：替客户端出门
  - 反向代理：替服务器接管

### 负载均衡

- 定义：把大量用户请求均分给多台后端服务器，避免单台压力过大崩溃
- 解决问题
  - 单台服务器扛不住高并非
  - 单点故障（一台挂了全站挂）
  - 提高系统稳定性与并发能力
- 结构：用户-负载均衡（Nginx）-服务器1、2、3、4


**常用反向代理+负载均衡服务器**


## Nginx

- 安装和配置
  - 配置官方源 -> dnf/yum安装 -> 启动认证
  - 必须切换到root用户操作，否则会因权限不足安装失败
  - 启动Nginx后需确认状态activ(running)，才算真正成功
  - 常用命令：start、stop、restart、status
  - 防火墙需开放80端口，否则浏览器无法访问Nginx欢迎页

- 配置文件
  - 全局块
    - 位置：配置文件最外层，不在任何{}内部
    - 核心作用：控制Nginx全局运行状态，影响所有服务
    - 常见配置：（重点记2个）
      ``` conf
      # 运行用户：Nginx进程以哪个用户身份运行，默认nginx
      user nginx;

      # 工作进程数：建议等于CPU核心数，提升并发能力
      worker_processes auto;

      # 错误日志路径，全局错误日志存放位置
      error_log /var/log/nginx/error.log;

      # 进程PID文件；记录Nginx主进程ID，用于启停服务
      pid /run/nginx.pid

      ```
  - events块
    - 位置：全局块下方，用events{}包裹
    - 核心作用：控制Nginx网络连接相关配置，影响并发性能
    - 常见配置项
      ```conf
      events {
        # 每个工作进程的最大连接数，单进程最多处理多少个连接
        # 值越来越大承载的并发访问越来越多
        worker_connections 1024;

        # 连接复用机制，提升并发场景性能
        use epoll;
      }
      ```
  
  - http块（核心）
    - 位置：events块下方用http{}
    - 核心作用：配置HTTP协议相关规则，是Nginx处理Web请求的核心区域
    - 关键特点：内部包含多个server块，实现多站点管理
    - 核心结构示例
      ```conf
      http: {
        # 全局变量定义：自定义全局变量，供后续使用

        # 引入文件类型映射，让Nginx识别不同文件格式
        include /etc/nginx/mime.types;

        # 默认文件类型
        default——type application/octet-stream;

        # 日志格式定义：定义访问日志的记录规则
        log_format main '$remote_addr - $remote_user [$time_local] "$request"'

        # 访问日志路径：所有站点的默认访问日志
        access_log /var/log/nginx/access.log main;

        # 发送文件优化：提升静态文件传输速度
        sendfile on;

        # 连接超时限制：客户端与服务器保持连接的超时时间
        keepalive_timeout 65;

        # 负载均衡：定义后端服务器集群
        # upstream是核心命令，my_backend是自定义集群名称
        # 平均分配（轮询）
        upstream my_backend {
          server 127.0.0.1:8001;
          server 127.0.0.1:8002;
        }

        # 引入子配置目录：自动加载conf.d下的所有.conf配置
        include /etc/nginx/conf.d/*.conf;

        # 单个server块：单个虚拟主机配置(默认站点)
        # 实现多站点共存（一台服务器跑多个网站）
        server {
          # 监听端口
          listen 80;

          # 域名/主机名：匹配访问的域名
          server_name localhost;

          # 默认编码
          charset utf-8;

          # 访问日志
          access_log /var/log/nginx/localhost.access.log main;

          # location块：路由匹配，处理具体请求路径
          location / {
            # 网页根目录：请求/时访问该目录下的文件
            root /usr/share/nginx/html;

            # 默认首页：访问根目录时优先加载的文件
            index index.html; 
          }

          # 精确匹配：访问/api时转发到后端接口
          location /api {
            # 转发请求到后端服务器
            proxy_pass http://127.0.0.1:8080/;

            # 传递客户端请求的HOST信息（避免后端报错，必传）
            proxy_set_header Host $host;

            # 传递客户端真实IP(可选，推荐添加)
            proxy_set_header X-Real-IP $remote_addr;
          }

          # 精确匹配
          location /test {
            root /usr/share/nginx/html;
            index test.html;
          }


          # 前缀匹配：请求路径以指定前缀开头就会生效
          location /demo {
            root /usr/share/nginx/html/demo/;
            index index.html;
          }

          # 正则匹配（～ 开头）：请求路径符合正则表达式就会生效
          location ~ /regex {
            root /usr/share/nginx/html/regex/;
            index index.html;
          }

          # 负载均衡
          location /transport {
            # 转发到后端集群
            proxy_pass http://my_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
          }

        }
      }
      ```

- 编辑配置文件：使用vim`vi /etc/nginx/nginx.conf`
- 关键操作
  - 验证配置语法`nginx -t`
  - 重载配置`systemctl reload nginx`(不中断服务，修改立即生效)
  - 启动`systemctl start nginx`
  - 停止`systemctl stop nginx`
  - 开机自启`systemctl enable nginx`
  - 检查状态`systemctl status nginx`
  - 关闭防火墙`systemctl stop/disable firewalld`
  - 放行80端口`firewall -cmd --add-service=http --permanent` `firewall -cmd --reload`

- https
  - 生成证书(自签名，会过期)
    - 安装依赖
      - `dfn update -y`
      - 安装certbot依赖`dnf install epel-release -y`
      - 安装ertbot及nginx插件`dnf install certbot python3-certbot-nginx -y`
    - 获取免费证书（Lets Encrypt）
      - 有公网域名（推荐，自动配置Nginx;前提域名解析到服务器公公网IP,并且443端口已经放行（云服务器需配置安全组））
        - 自动获取证书并配置Nginx`certbot --nginx -d domain.com -d www.domain.com`命令执行后按步骤操作即可
        - 成功后默认路径为`/etc/letsencrypt/live/domain.com/`
      - 无公网域名
        - `cd /etc/nginx`
        - `IP='192.168.1.1'`
        - `openssl req -x509 -newkey rsa:2048 -keyout privkey.pem -out fullchain.pem -days 3650 -nodes -subj "/CN=${IP}" -addext "subjectAltName=IP:${IP}"`
        - 生成路径`/etc/letsencrypt/live/localhost/`

  - 手动配置Nginx(HTTPS+自动跳转)（Cerbot未自动配置需手动配置）
  ```conf
  http {
    server {
      listen 80;
      server_name: domain.com www.domain.com;
      # 自动跳转到https
      return 301 https://$host$request_uri;
    }
    # https
    server {
      listen 443;
      server_name domain.com www.domain.com;
      # SSL证书配置（替换为实际路径）
      # 公钥证书文件
      ssl_certificate /etc/nginx/fullchain.pem;
      # 私钥证书文件
      ssl_certificate_key /etc/nginx/privkey.pem;

      # SSL优化配置（直接复制，无需修改）
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_perfer_server_ciphers on;
      ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AEs256-GCM-SHA384:DHE-RSA-AEs256-GCM-SHA384;
    }
  }
  ```

  - SSL证书到期自动续费
    - 测试续费命令`certbot renew --dry-run`
    - 配置自动续费`crontab -e`
    - 每天凌晨3点自动检查续费`0 3 * * * /usr/bin/certbot renew --quiet`

- Nginx访问日志（每个server可单独配置日志文件，记得重启）
  - 访问日志acces.log
    - 关键信息
      - 访问者IP
      - 访问时间
      - 访问的请求路径
      - 访问状态吗
      - 资源大小
      - 访问来源
  - 错误日志error.log
    - 关键信息
      - 发生时间
      - 级别（warn:警告，error：错误，cerit:严重错误）
      - 具体描述
      - 位置
  - 查看日志推荐使用
    - `tail -f /var/log/nginx/error.log`
    - `tail -n 10 /var/log/nginx/error.log`
  - 清空日志(清空后直接删除，要保留需备份copy)
    - `echo "" > /var/log/nginx/access.log`
    - `echo "" > /var/log/nginx/error.log`

- Java环境
  - JDK：java development kit
  - `dnf list | grep jdk`
  - `dnf install java-17-openjdk -y`
  - 查找jdk安装路径`alternative --list | grep java`
  - 编辑环境变量配置文件 `vim /etc/profile`
    - `export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-17.0.10.0.7-1.el9_4.x86_64/`
    - 能查找到JAVA_HOME不需要配置PATH
      - `which java`
      - `export PATH=$JAVA_HOME/bin:$PATH`
  - 确定安装成功
    - `javac -version`
    - `java -version`

- Tomcat部署war包
  - 默认端口8080
  - 放行防火墙
  - Tomcat是免费开源的Java Web服务器，基于JDK运行，主要用于部署和运行java web应用程序（后缀为.war包）-war包相当于压缩好的app安装包，部署tomcat后会自动解压并运行该程序
  - 依赖jdk
  - 到官网下载后上传到服务器
  - 运行
    - 进入执行文件`cd /usr/local/tomcat/bin`
    - 执行启动`./startup.sh`
    - 查看tomcat进行`ps -ef | grep tomcat`
    - 停止`./shutdown.sh`(要在bin目录下)
    - 重启：先停止再启动
  - 部署war包：将war包上传到tomcat安装路径下的webapps下
  - 删除部署的程序
    - 停止tomcat
    - 进入webapps删除test和test.war
    - 重启tomcat

## FTP服务（File Transfer Protocol）

FTP: 用于网络中传输文件的标准协议
vsftpd: FTP服务程序用于搭建FTP服务

FTP服务：从本地电脑连接到服务器，实现文件上传、文件下载、查看文件等操作

- vsftpd
  - 安装`dnf update -f` `dnf install vsftpd -y`
  - 配置：
    - 先备份原始文件`cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.bak`
    - 执行自签名证书生成命令（创建FTPS所需证书）
    - 修改配置
  - 创建用户
    - 创建`useradd -d /home/ftpuser ftpuser`
      - `-d`指定用户家目录，禁止用户登录服务器系统，只能登录FTP更安全
    - 设置用户密码`password ftpuser`
    - 设置用户家目录权限（必做）`chown ftpuser:ftpuser /home/ftpuser`
  - 基本操作
    - 启动`systemctl start vsftpd`
    - 停止`systemctl stop vsftpd`
    - 查看状态`systemctl status vsftpd`
    - 开机自启`systemctl enable vsftpd`
  - 验证是否启动（安装FileZilla）

## DHCP服务（Dynamic Host Configuration Protocol 动态主机配置协议）

网络中有不需要单独配置

动态主机配置协议，本质就是IP地址自动分配器，核心作用是在局域网中，自动向连接的网络设备分配IP地址、子网掩码、网关、DNS服务器等网络参数，无需人工手动配置，实现插网即连、自动上网

**步骤**
设备连接网络-> 向DHCP服务器发送申请IP请求-> DHCP服务器分配可用IP及网络参数-> 设备获取IP后正常联网-> 租期到期后，设备归还IP(或自动续租)

**为什么需要配置**
- 避免手动配置麻烦：如果没有DHCP，每台设备上网前，都要手动配置IP、子网掩码、网关、步骤繁琐
- 节约IP地址资源：IP地址数量有限，DHCP采用租期制，设备断开网络后，IP会归还，分配给其他需要的设备，避免浪费
- 便于管理：局域网中设备数量较多（公司、学校），管理员无需逐台配置IP，通过DHCP服务就能统一管理所有设备的IP分配，减少维护成本
- 减少配置错误：手动配置IP时，容易出现IP冲突，导致设备无法上网，DHCP会自动分配未使用的IP，避免冲突

### 核心概念

- 静态IP和动态IP
静态需要手动配置，动态由DHCP生成

- DHCP服务器（端口号67，68）
自动分配IP的服务器，提前设定IP地址池，设备请求时，从地址池子分配一个未使用的IP,同时下发子网掩码、网关、DNS等参数，确保能正常联网

IP地址池可用范围192.168.1.100-200

### 使用

- 安装 `dnf install -y dhcp-server`

- 配置文件`/etc/dhcp/dhcpd.conf`

- 验证配置文件`dhcpd -t -cf /etc/dhcp/dhcpd.conf`

- 启动`systemctl start dhcpd`

- 查看状态`systemctl status dhcpd`

- 停止`systemclt stop dhcpd`

修改配置后需要重新启动


## Samba 

跨系统文件共享的服务（windows/linux/mac）

用windows的网上邻居共享

**核心逻辑**
Linux服务器安装Samba -> 配置共享目录 -> 创建Samba用户 -> 启动Samba服务 -> Windows/其他设备通过网络访问共享目录 ——> 实现文件上传、下载、修改

### 核心概念

- Samba服务核心组件
  - smbd: 负责处理文件共享、用户认证
  - nmbd：负责解析NetBIOS名称（Windows主机名），让客户端通过主机找到Linux服务器

- 共享目录：需配置权限

- 创建Samba用户

### 使用

- 安装 `dnf install -y samba samba-common samba-client`

- 创建Samba用户
  - 先创建Linux系统用户(仅用于Samba访问)`useradd -s /sbin/nologin sambauser`
  - 创建Samba用户（与Linux用户名相同）`smbpasswd -a sambauser`
- 创建共享文件夹
  - 创建目录`mkdir -p /home/samba/share`
  - 设置所有者和所属组`chown -R sambauser:sambauser /home/samba/share`
  - 设置目录权限`chmod -R 755 /home/samba/share`

- 修改配置文件`/etc/samba/smb.conf`
- 验证`testparm`
- 启动`systemctl start smb nmb`

- 查看状态`systemctl status smb nmb`

- 停止`systemclt stop smb nmb`

- Linux访问
  - 连接`smbclient //localhost/share -U sambauser`
  - 上传文件`put /ect/hosts`
  - 退出`exit`

- Windows访问
确保同一个局域网

1. Win+R 输入`\\Linux服务器IP`确认
2. 弹出登录，输入账号和密码
3. 操作共享目录


## rsync 文件同步

同步文件到服务器

- 核心定义
rsync是一款用于文件同步的工具，核心作用是将一个目录的文件同步到另一个目标目录，支持本地同步、远程同步，默认采用增量同步模式（只同步变化的内容，效率极高）

- 工作流程
  - 对比文件：执行rsync命令后，rsync命令会自动对比源目录与目标目录中的所有文件，判断哪些文件是新增、修改、删除的
  - 增量同步：只将变化的文件，从源目录同步到目标目录，未变化的文件跳过，不重复同步
  - 同步完成：输出同步结果

- 使用
  - 安装`dnf install -y rsync`
  - Linux本地同步`rsync -av /home/rsync/source /home/rsync/target/`
    - `-a`： 归档模式，相当于同时启用多个参数（同步目录、保留文件权限、保留时间等）
    - `-v`：详细模式，显示同步的详细过程（哪些文件被同步、同步结果）
    - `-z`: 压缩同步
    - `--delete`保持两端文件一致
    - `--progress`显示进度条
  - 同步到另一台服务器`rsync -av /home/rsync/source/ root@192.168.1.101:/home/rsync/target/`
  - 从其他服务器同步到当前服务器`rsync -av root@192.168.1.101:/home/rsync/target/ /home/rsync/source/ `





  






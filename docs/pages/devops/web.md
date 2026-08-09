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

  





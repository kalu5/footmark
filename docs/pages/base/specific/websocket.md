# Websocket 

# 封装WebsocketClient

``` ts
import { TRecordble } from '@/typings/http';

// socket连接类型
export enum ESocketType {
  // 心跳检测
  HEART_BEAT,
  // 在线
  ONLINE,
  // 异常
  ERROR = -1,
}

// 消息内容
export interface ISocketMessageItem {
  type?: number;
  operatorType?: number;
  body?: {
    msg?: string;
    type?: number;
    users?: {
      id: number;
      name: string;
      previewUrl: string;
    }[];
  };
}

type WebSocketEventType = 'open' | 'close' | 'error' | 'message';

// Websocket关闭码
enum EWebSockCloseCode {
  timeout = 4000,
}

// 重连配置
type ReconnectOptions = {
  // 最大重连次数
  maxRetries?: number;
  // 间隔多少时间重连
  retryInterval?: number;
  // 指数退避机制可以有效减少网络拥塞。
  exponentialBackoff?: boolean;
};

// 心跳检查配置
type HeartbeatOptions = {
  interval?: number;
  timeout?: number;
  pingMessage?: string | TRecordble;
  pongMessage?: TRecordble;
};

// 实例配置
type WebSocketClientOptions = {
  // 协议
  protocols?: string | string[];
  // 重连配置
  reconnect?: ReconnectOptions;
  // 心跳配置
  heartbeat?: HeartbeatOptions;
  // 自动重连
  autoConnect?: boolean;
};

export type EventCallback = (data: any) => void;

export default class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();

  private readonly options: WebSocketClientOptions;
  // 重连次数
  private reconnectAttempts = 0;
  // 等待pong 消息
  private waitForPong = false;

  constructor(url: string, options: WebSocketClientOptions) {
    this.url = url;
    this.options = options;
  }

  // socket连接
  public connect(): void {
    if (this.ws && [WebSocket.CONNECTING, WebSocket.OPEN].includes(this.ws.readyState as 0 | 1)) {
      return;
    }
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (_e) {
      this.reconnect();
    }
  }

  // 监听事件
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('open', null);
    };

    this.ws.onclose = () => {
      this.emit('close', null);
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const {
          body: { msg, type },
        } = data || {};
        // 连接异常
        if (type == ESocketType.ERROR) {
          this.emit('error', new Error(msg));
          this.stopHeartbeat();
          return;
        }
        // 心跳检测处理
        if (this.options.heartbeat?.pongMessage) {
          const { type: pongType, msg: pongMsg } = this.options.heartbeat.pongMessage;
          if (type === pongType && msg === pongMsg) {
            this.waitForPong = false;
            return;
          }
        }
        this.emit('message', data);
      } catch (error) {
        this.emit('error', error);
      }
    };
  }

  // 重连
  public reconnect(): void {
    if (!this.options.reconnect) return;

    this.stopReconnect();

    const {
      maxRetries = 3,
      retryInterval = 3000,
      exponentialBackoff = true,
    } = this.options.reconnect;
    if (this.reconnectAttempts < maxRetries) {
      const delay = exponentialBackoff
        ? retryInterval * Math.pow(2, this.reconnectAttempts)
        : retryInterval;

      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts = this.reconnectAttempts + 1;
        this.connect();
      }, delay);
    }
  }

  // 心跳检查
  private startHeartbeat(): void {
    if (!this.options.heartbeat) return;

    const {
      interval = 30000,
      timeout = 5000,
      pingMessage = {
        type: 0,
        operatorType: 0,
        str: 'ping',
      },
    } = this.options.heartbeat;

    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.waitForPong = true;
        this.send(pingMessage);
        this.stopHeartbeatTimeout();
        this.heartTimeout = setTimeout(() => {
          // 心跳超时后断开连接
          if (this.waitForPong) {
            this.ws?.close(EWebSockCloseCode.timeout, 'Heartbeat timeout');
            // 此时不会触发socket的onClose,直接向外抛出错误
            // 心跳超时后，让用户手动重连
            this.emit('error', new Error('连接超时，请重试'));
            this.stopHeartbeat();
          }
        }, timeout);
      }
    }, interval);
  }

  // 停止重试
  private stopReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // 停止心跳
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.stopHeartbeatTimeout();
  }

  // 停止心跳超时检测
  private stopHeartbeatTimeout(): void {
    if (this.heartTimeout) {
      clearTimeout(this.heartTimeout);
      this.heartTimeout = null;
    }
  }

  // 发送消息
  public send(data: string | object): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.ws.send(message);
  }

  // 收集消息依赖
  public on(event: WebSocketEventType, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  // 删除消息
  public off(event: WebSocketEventType, callback: EventCallback): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  // 执行消息依赖
  private emit(event: WebSocketEventType, data: any): void {
    this.eventListeners.get(event)?.forEach((callback) => callback(data));
  }

  // 断开连接
  public disconnect(type = 'normal'): void {
    this.reconnectAttempts = 0;
    this.stopHeartbeat();
    this.stopReconnect();
    // 普通断开，清空监听事件，重试时不需要清空
    if (type === 'normal') {
      this.eventListeners.clear();
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

```

# 封装全局Websocket

``` ts
import WebSocketClient, { EventCallback } from '@/utils/socketClient';
import { TRecordble } from '@/typings/http';
import { ESocketType } from './socketClient';
import { ElMessageBox } from 'element-plus';

const typeMessageMap = new Map();
const allMessageSet = new Set();
let ws = null;

/**
 * fn: 消息回调函数
   type: 收到消息类型
*/
const useSocket = (fn?: EventCallback, type?: number) => {
  // type 存在将只关联各种类型的消息
  if (type) {
    if (fn) {
      if (!typeMessageMap.has(type)) {
        typeMessageMap.set(type, new Set());
      }
      typeMessageMap.get(type)?.add(fn);
    }
  } else {
    // 所有的消息都会收到
    if (fn) {
      allMessageSet.add(fn);
    }
  }

  // 拼接socketUrl
  function concatSocketUrl(query: TRecordble) {
    const { host, protocol } = window.location;
    const socketProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
    const params = new URLSearchParams(query).toString();
    const backendUrl = `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/websocket/projectChat`;
    return `${socketProtocol}//${host}${backendUrl}?${params}`;
  }

  /**
   * 连接socket并监听消息
   * @query 连接参数
   * @callback 连接成功后的回调，解决首次连接成功后就需要发送消息
   */
  const connect = (query: TRecordble, callback?: () => void) => {
    const url = concatSocketUrl(query);
    // 创建 WebSocket 客户端实例
    ws = new WebSocketClient(url, {
      reconnect: {
        maxRetries: 5,
        retryInterval: 1000,
      },
      heartbeat: {
        interval: 3000,
        timeout: 5000,
        pingMessage: {
          type: ESocketType.HEART_BEAT,
          msg: 'ping',
        },
        pongMessage: {
          type: ESocketType.HEART_BEAT,
          msg: 'pong',
        },
      },
    });

    ws?.on('open', () => {
      callback?.();
    });

    ws?.on('message', (data) => {
      const type = data?.body?.type;
      const typeCallBack = typeMessageMap.get(type);
      if (typeCallBack?.size) {
        typeCallBack.forEach((callback) => callback(data));
      }

      if (allMessageSet?.size) {
        allMessageSet.forEach((callback: EventCallback) => callback(data));
      }
    });
    ws?.on('error', (_e) => {
      const message = _e.message || '网络异常';
      // 处理其他异常，手动重连
      ElMessageBox.confirm(`${message ?? ''}，是否重试？`, '异常提示', {
        confirmButtonText: '确认重试',
      })
        .then(() => {
          ws?.disconnect('retry');
          setTimeout(() => {
            ws?.reconnect();
          });
        })
        .catch(() => {
          disconnect();
        });
    });
    ws?.connect();
  };

  // 发送消息
  function sendMessage(data: TRecordble) {
    ws?.send(data);
  }

  // 断开连接
  function disconnect() {
    ws?.disconnect();
    ws = null;
    typeMessageMap.clear();
    allMessageSet.clear();
  }

  return {
    ws,
    connect,
    sendMessage,
    disconnect,
  };
};

export default useSocket;

```

# 使用

``` vue
<script langt="ts" setup>
import useSocket from '@/utils/socket';
import { ESocketType, ISocketMessageItem } from '@/utils/socketClient';
import { onMounted, onUnmounted, ref } from 'vue';

const onlineUsers = ref([]);

const { connect, disconnect } = useSocket(handleMessage, ESocketType.ONLINE);

// 处理收到的消息
function handleMessage(data: ISocketMessageItem) {
  const {
    body: { users },
  } = data || {};
  if (users?.length) {
    const newUsers = users.filter((item) => item.id !== userStore.id);
    onlineUsers.value = newUsers || [];
  } else {
    onlineUsers.value = [];
  }
}

// 建立连接
function connectSocket() {
  const params: {
    userId: number;
    token?: string;
  } = {
    userId: userStore.id,
    token: GET_TOKEN() || '',
  };
  connect(params);
}

onMounted(() => {
  // 建立Socket连接
  connectSocket();
});

onUnmounted(() => {
  disconnect();
});
</script>

```
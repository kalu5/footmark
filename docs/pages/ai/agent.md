# Agent

## 什么是Agent

在人工智能领域，Agent(智能体或代理)是指一种能够**感知环境**、进行推理、**自主决策**并**采取行动**以实现特定目标的智能系统。

| 特性 | 传统聊天机器人/LLM |  AI Agent |
| --- | -------          |  ------   |
| 交互模式 | 被动响应，一问一答 | 下达命令，自主执行 |
| 执行力   |  停留在文本成面 | 能操作软件、发送邮件、联网搜索 |
| 自主性  |   需要人类给出详细步骤 | 只需给定最终目标，自主寻找路径 |

## Agent基本能力

**示例：**
帮我计划一个5天的海南之旅，预算5000

- 使用大模型
结果：直接根据训练数据生成一段答案

- 使用Agent
  - 任务规划 （大模型自主规划）
    - 查询机票
    - 查询天气
    - 计划行程
    - 预算统计
  - 调用工具（传统编程工具提供的大模型，大模型结合工具给出答案），自主执行
    - 查询机票
    - 查询天气
    - 搜索经典
  - 感知反馈 （反馈最终的结果）

## LangChain

### 开发Agent

步骤：
- 加载环境变量
- 定义工具
- 定义Agent
- 调用Agent

### 模型
Agent的大脑，负责推理分析

#### 初始化模型
- init_chat_model
  - 使用langchain支持的模型
  - 自定义模型提供商
- 使用model类（调用千文code等）


### 消息

#### BaseMessage子类

- SystemMessage: role="system"
- HumanMessage: role="user"
- AIMessage: role="assistant"
- ToolMessage: role="tool"

```py

agent.stream({
  "message": [
    SystemMessage(content="你是一个专业的翻译"),
    HumanMessage(content="你好"),
    AIMessage(content="你好"),
    ToolMessage(content="工具调用结果")
  ],
  "stream_mode": "messages"
})

```


#### 多模态消息（图片、视频、音频等）

```py

message = HumanMessage(content=[
  {"type": "text", "text": "请解析以下图片、视频、音频等"},
  {"type": "image", "url": "https://example.com/image.jpg"},
  # base64
  {"type": "image", "base64": "base64编码的图片", "mime_type": "image/jpeg"},
  {"type": "video", "url": "https://example.com/video.mp4"},
  {"type": "audio", "url": "https://example.com/audio.mp3"}
])

agent.stream({
  "message": [message],
  "stream_mode": "messages"
})

```

### 提示词

- 系统提示词： 用于设置大模型的行为和规则，例如设置大模型是一个专业的翻译。
```py
agent = create_agent(model, system_prompt="你是一个专业的翻译")
```
- 用户提示词： 用于给大模型传递用户的问题或指令。
- 工具调用提示词


#### 提示词工程

通过优化提示词使模型输出的结果更符合业务需要的过程

组成部分：
- 身份角色： 描述AI的职责、沟通风格和总体目标
- 指令说明：请指导模型如何生成所需响应，它应该遵循哪些规则，模型应该做什么，不能做什么。
- 对话示例：通过可能的输入示例以及模型期望的输出
- 背景信息：向模型提供生成响应所需的任何额外信息，例如RAG的额外知识库、上下文信息等。

可以使用markdown和xml格式来帮助模型理解提示和上下文边界
- markdown格式： 标题和列表有助于标记提示的不同部分，并传达层次结构，提升可读性
- xml格式： 区分一段内容的起始位置

```py

system_prompt = """
# 身份
你是一个编程助手，帮助用户编写python代码。

# 指令
- 定义变量时使用snake case命名
- 不要返回markdown格式的代码

# 示例
- user：请编写一个python函数，实现将一个列表中的所有元素乘以2
- assistant：def double_list(lst):
    return [x * 2 for x in lst]
"""


# 格式化输出：指令+示例
system_prompt = """
# 身份
你是一个编程助手，帮助用户编写python代码。

# 指令
- 定义变量时使用snake case命名
- 输出json格式

# 示例
- user：请编写一个python函数，实现将一个列表中的所有元素乘以2
- assistant：[
     {
        "role": "user",
        "content": "请编写一个python函数，实现将一个列表中的所有元素乘以2"
     },
     {
        "role": "assistant",
        "content": "def double_list(lst): return [x * 2 for x in lst]"
     }
  ]
"""

# 使用pyDantic的格式化输出
from pydantic import BaseModel

class Response(BaseModel):
    message: str
    data: dict
    code: int
    data_type: str = "json"

agent = create_agent(model, system_prompt=system_prompt, response_format=Response)
```

### 工具

Agent的手脚，负责执行任务与外界交互

步骤：
- 定义工具
- 初始化模型
- 初始化Agent,绑定模型和工具

#### 自定义工具

工具本质就是一个可调用的函数，给大模型调用，我们需要清晰的描述这个工具让模型知道如何使用
- 工具名称
- 工具描述
- 工具参数
- 工具返回值
- 工具调用示例

##### 基于tool描述工具
```py
from langchain.tools import tool

# 不推荐
@tool(name="double_list", description="将列表中的所有元素乘以2")
def double_list(lst: list[int]) -> list[int]:
    """将列表中的所有元素乘以2"""
    return [x * 2 for x in lst]

# 推荐
@tool()
def double_list(lst: list[int]) -> list[int]:
    """
    将列表中的所有元素乘以2
    args:
        lst: 输入的整数列表
    return:
        乘以2后的整数列表
    """
    return [x * 2 for x in lst]

# 参数比较复杂时使用pydantic的模型描述参数
from pydantic import BaseModel

class DoubleListParams(BaseModel):
    lst: list[int]

@tool(args_schema=DoubleListParams)
def double_list(params: DoubleListParams) -> list[int]:
    """
    将列表中的所有元素乘以2
    """
    return [x * 2 for x in params.lst]

```

#### 预定义工具

Langchain自带的工具（langchain_tavily等）

步骤：
- 获取Key
- 配置环境变量
- 安装依赖
- 使用

```py
from langchain_tavily import TavilySearchResults
from langchain.tools import tool

# 实时检索网页信息
search_tool = TavilySearchResults(
    max_results=3,
    topic="general"
)

search_tool.invoke("你好")

agent = create_agent(
  model="deepseek", 
  tools=[search_tool],
  system_prompt="你是一个专业的检索工具，帮助用户检索网页信息",
)
```

##### 优化

- 封装自定义工具优化tavily消耗的token
- 格式化输出确保信息来源可信

``` py
from langchain.tools import tool
from pydantic import BaseModel, Field

class Reference(BaseModel):
    url: str = Field(description="引用的url")
    title: str = Field(description="引用的标题")
    content: str = Field(description="引用的内容")

class Answer(BaseModel):
    content: str = Field(description="搜索结果")
    reference: list[Reference] = Field(description="搜索结果的引用")

@tool()
def search_web(query: str) -> Answer:
    """
    检索网页信息
    args:
        query: 搜索查询
    return:
        搜索结果
    """
    return search_tool.invoke(query)

agent = create_agent(
  model="deepseek", 
  tools=[search_web],
  system_prompt="你是一个专业的检索工具，帮助用户检索网页信息",
)
```

### 记忆

- 短期记忆：当前任务或会话的上下文
- 长期记忆： 跨任务或会话的经验与知识

#### 短期记忆

通过AgentState实现短期记忆,保持在Checkpoint中,
每次交互都会生成一个快照,记录为一个checkpoint;
Checkpoint作用：
- 会话记忆（每当有新消息时，checkpoint都会拿到最近的一次快照，根据快照拼接当前消息发送给模型根据历史消息进行回答）
- 时间穿梭（用户可以回滚到之前的快照，查看之前的上下文）
同一个会话的多个checkpoint形成一个组，用thread_id标识(每个会话都有一个唯一的thread_id).


##### Memory存在内存中，会话太大会导致内存溢出
```py
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
  model="deepseek", 
  tools=[search_web],
  system_prompt="你是一个专业的检索工具，帮助用户检索网页信息",
  checkpoint=InMemorySaver()
)

# 需要指定thread_id
agent.invoke({
  "message": [
    {
        "role": "user",
        "content": "你好"
    }
  ]
},
{
  "configurable": {
    "thread_id": "1234567890"
  }
}
)
```

##### Memory持久化存储：database

步骤：
- 安装依赖
- 导入依赖
- 初始化checkpoint
- 自动建表
- 创建agent,指定checkpoint

示例见官网

#### 记忆管理策略

多轮对话会导致历史消息越来越多，最终超出模型上下文限制，导致消息被截取，影响模型回答的准确性。

Langchain提供了多种记忆管理策略，包括：
- 修剪（会导致记忆丢失）
  拿到消息历史后，先移除前N条或后N条消息再调用模型（一般移除前面的历史记录）
- 删除（会导致记忆丢失）
  永久删除AgentState中的快照
- 总结摘要（对快照进行了压缩，又不会丢失记忆）
  先总结历史消息中的早期消息得到消息摘要，然后用消息摘要和最近的消息形成消息列表再调用模型
  需要单独使用一个总结大模型，用于总结早期消息
- 自定义

**推荐使用总结摘要**

示例见官网




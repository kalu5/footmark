const template = '<div>vue</div>'

/**
 * 将上述模版转为模版AST
 * const ast = {
 *   type: 'Root',
 *   children: [
 *     {
 *       type: 'Element',
 *       tag: 'div',
 *       children: [
 *         {
 *           type: 'Element',
 *           tag: 'h1',
 *           props: [
 *             {
 *             type: 'Directive',
 *             name: 'if',
 *             exp: {
 *               type: 'Expression',
 *               content: 'ok'
 *             }
 *           }]
 *         }
 *       
 *   ]
   }
 * 
 * 
 * */ 
// 定义状态机状态
const State = {
  initial: 1 , // 初始状态
  tagOpen: 2, // 标签开始
  tagName: 3, // 标签名称
  text: 4, // 文本
  tagEnd: 5, // 标签结束
  tagEndName: 6 // 标签结束名称
}

// 判断是否为字母
function isAlpha(str) {
  return /^[a-zA-Z]$/.test(str)
}
// 将模版字符串分词 生成tokens
function tokenize(str) {
  // 初始化状态为1
  let state = State.initial;
  // 缓存字符
  const chars = [];
  // 生成的tokens
  const tokens = [];
  while(str) {
    const char = str[0]
    switch(state) {
      // 初始状态
      case State.initial:
        if (char === '<') {
          // 状态变为标签开始状态
          state = State.tagOpen;
          // 消费当前字符 <
          str = str.slice(1)
        } else if (isAlpha(char)) {
          // 字母
          // 状态文本状态
          state = State.text;
          chars.push(char)
          str = str.slice(1)
        }
        break;
      // 标签开始状态
      case State.tagOpen:
        // 字母
        if (isAlpha(char)) {
          // 状态变为标签名称状态
          state = State.tagName;
          chars.push(char)
          str = str.slice(1)
        } 
        // /
        else if (char === '/') {
          // 状态变为标签结束状态
          state = State.tagEnd;
          str = str.slice(1)
        }
        break;
      // 标签名称状态
      case State.tagName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '>') {
          state = State.initial
          // 创建一个标签token，添加到tokens中
          const token = {
            type: 'tag',
            name: chars.join('')
          }
          tokens.push(token)
          // 清空chars
          chars.length = 0
          str = str.slice(1)
        }
        break;
      // 文本状态
      case State.text:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '<') {
          state = State.tagOpen;
          // 创建一个文本token，添加到tokens中
          const token = {
            type: 'text',
            content: chars.join('')
          }
          tokens.push(token)
          chars.length = 0
          str = str.slice(1)
        }
        break;
      // 标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          state = State.tagEndName;
          chars.push(char)
          str = str.slice(1)
        }
        break;
      // 标签结束名称状态
      case State.tagEndName: 
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '>') {
          state = State.initial
          // 创建一个标签结束token，添加到tokens中
          const token = {
            type: 'tagEnd',
            name: chars.join('')
          }
          tokens.push(token)
          chars.length = 0
          str = str.slice(1)
        }
    }
  }
  return tokens;
}

const tokens = tokenize(template)
console.log(tokens, 'tokens ======')

function parse(str) {
  const tokens = tokenize(str)
  // 创建一个根节点
  const root = {
    type: 'Root',
    children: []
  }

  // 创建一个栈
  const stack = [root]
  while (tokens.length) {
    const parent = stack[stack.length - 1]

    const t = tokens[0]

    switch(t.type) {
      case "tag": 
        // 创建element类型ast
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        // 将elementNode添加到parent的children中
        parent.children.push(elementNode)
        // 将elementNode添加到栈中
        stack.push(elementNode)
        break;
      case "text":
        // 创建text类型ast
        const textNode = {
          type: 'Text',
          content: t.content
        }
        // 将textNode添加到parent的children中
        parent.children.push(textNode)
        break;
      case "tagEnd":
        // 将栈中的最后一个元素弹出
        stack.pop()
        break;
      default:
        break;
    }
    tokens.shift()
  }

  return root;
}

const templateAst = parse(template)
console.log(templateAst, 'templateAst ======')

// 修改模版AST
// 深度优先遍历
function traverseNode (node, context) {
  const currentNode = node;
  context.currentNode = currentNode;
  const transforms = context.nodeTransforms;

  // 记录转换函数退出节点的回调
  const exitFns = [];

  for (let i = 0 ; i < transforms.length; i++) {
    const transform = transforms[i];
    // 转换函数返回一个函数，用于退出节点时执行特殊操作
    const exitFn = transform(currentNode, context)
    if (exitFn) {
      exitFns.push(exitFn)
    }
    // 当前节点可能被删除了
    if (!context.currentNode) return;
  }

  const children = currentNode.children
  if (children?.length) {
    for (let i = 0; i < children.length; i++) {
      context.parent = currentNode
      context.childIndex = i
      traverseNode(children[i], context)
    }
  }

  // 反序执行退出函数
  let i = exitFns.length;
  while(i--) {
    exitFns[i]()
  }
}

function transformElement (node) {
  if (node.type === 'Element' && node.tag === 'h1') {
    node.tag = 'p'
  }
}

function transformText(node, context) {
  if (node.type === 'Text') {
    context.replaceNode({
      type: 'Element',
      tag: 'span'
    })
  }
}

// 将模版AST转为 jsAST
function transformE (ast) {
  const context = {
    // 存储基础信息，用于替换节点
    currentNode: null,
    parent: null,
    childIndex: 0,
    // 替换节点
    replaceNode (node) {
      // 将当前节点替换为node
      const { parent, childIndex } = this;
      if (parent) {
        parent.children[childIndex] = node
        this.currentNode = node
      }
    },
    // 删除节点
    removeNode() {
      const { parent, childIndex } = this;
      if (parent) {
        parent.children.splice(childIndex, 1)
        this.currentNode = null
      }
    },
    nodeTransforms: [transformElement, transformText]
  }
  traverseNode(ast, context)
}

// 模版对应的渲染函数是
// function render() {
//   return h('div', [
//     h('p', 'vue'),
//     h('p', 'template')
//   ])
// }
// 渲染函数用jsAst描述
// const FunctionDeclNode = {
//   type: 'FunctionDecl',
//   id: {
//     type: 'Identifier',
//     name: 'render'
//   },
//   params: [],
//   body: {
//     type: 'RetureStatement',
//     return: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'h'
//       },
//       arguments: [
//         {
//           type: 'StringLiteral',
//           value: 'div'
//         },
//         {
//           type: 'ArrayExpression',
//           elements: [
//             {
//               type: 'CallExpression',
//               callee: {
//                 type: 'Identifier',
//                 name: 'h'
//               },
//               arguments: [
//                 {
//                   type: 'StringLiteral',
//                   value: 'p'
//                 },
//                 {
//                   type: 'StringLiteral',
//                   value: 'vue'
//                 }
//               ]
//             },
//             {
//               type: 'CallExpression',
//               callee: {
//                 type: 'Identifier',
//                 name: 'h'
//               },
//               arguments: [
//                 {
//                   type: 'StringLiteral',
//                   value: 'p'
//                 },
//                 {
//                   type: 'StringLiteral',
//                   value: 'template'
//                 }
//               ]
//             }
//           ]
//         }
//       ],

//     }
//   }
// }

// 将渲染函数模版转为jsAst
// 创建StringLiteral 节点
function  createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value
  }
}

// 创建Identifier 节点
function createIdentifier(name) {
  return {
    type: 'Identifier',
    name
  }
}

// 创建CallExpression 节点
function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments
  }
}

// 创建ArrayExpression 节点
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  }
}

// 转换文本节点
function transformAstText(node) {
  if (node.type !== 'Text') return;

  // 文本节点对应的jsast节点就是一个字符串字面量
  // 只需要将文本节点的内容转为字符串字面量即可
  // 最后将文本对应的jsAst添加到node.jsNode中
  node.jsNode = createStringLiteral(node.content)
}

// 转换元素节点
function transformAstElement(node) {

  return () => {
    if (node.type !== 'Element') return;
    // 调用h创建函数
    const callExp = createCallExpression(
      'h',
      [
        createStringLiteral(node.tag),
      ]
    )
    // 处理子节点
    const len = node?.children?.length;
    if (len) {
      len === 1
      ? callExp.arguments.push(node.children[0].jsNode) 
      : callExp.arguments.push(createArrayExpression(node.children.map(child => child.jsNode)))
    }

    node.jsNode = callExp
  }
}

// 转换根节点
function transformAstRoot(node) {

  return () => {
    if (node.type!== 'Root') return;
    const vnodeJSAST = node.children[0].jsNode;
    node.jsNode = {
      type: 'FunctionDecl',
      id: {
        type: 'Identifier',
        name:'render'
      },
      params: [],
      body: {
        type: 'ReturnStatement',
        return: vnodeJSAST
      }
    };
  }
}

// 将模版AST转为 jsAST
function transform (ast) {
  const context = {
    // 存储基础信息，用于替换节点
    currentNode: null,
    parent: null,
    childIndex: 0,
    nodeTransforms: [transformAstText, transformAstElement, transformAstRoot]
  }
  traverseNode(ast, context)
}

// 处理函数参数
function genNodeList(params, context) {
  if (params?.length) {
    for (let i = 0 ; i < params.length; i++) {
      const node = params[i]
      genNode(node, context)
      if (i < params.length - 1) {
        context.push(',')
      }
    }
  }
}

// 生成函数
function genFunctionDecl(node, context) {
  const { push, ident, deIdent } = context;
  push(`function ${node.id.name}`)
  push('(')
  
  // 参数处理
  genNodeList(node.params, context)
  push(')')
  push('{')
  ident()
  // 处理函数体
  const body = node.body
  //debugger;
  if (Array.isArray(body)) {
    body.forEach(n => genNode(node, context))
  } 
  else {
    genNode(body, context)
  }
  deIdent()
  push('}')
}

// 生成返回语句
function genReturnStatement(node, context) {
  const { push } = context;
  push('return ')
  genNode(node.return, context)
}

// 生成调用表达式
function genCallExpression(node, context) {
  const { push } = context;
  const { callee, arguments: args } = node;
  push(`${callee.name}(`)
  genNodeList(args, context)
  push(')')
}

// 生成字符串
function genStringLiteral(node, context) {
  const { push } = context;
  push(`'${node.value}'`)
}

// 生成子节点
function genArrayExpression(node, context) {
  const { push } = context;
  push('[')
  genNodeList(node.elements, context)
  push(']')
}

function genNode(node, context) {
  switch(node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context)
      break;
    case 'ReturnStatement': 
      genReturnStatement(node, context)
      break;
    case 'CallExpression':
      genCallExpression(node, context)
      break;
    case 'StringLiteral':
      genStringLiteral(node, context)
      break;
    case 'ArrayExpression':
      genArrayExpression(node, context)
      break;
    default:
      break;
    
  }
}

// 代码生成 本质是字符串拼接
function generate(node) {
  const context = {
    code: '',
    push(code) {
      context.code += code
    },
    // 当前缩进级别
    currentIdent: 0,
    // 换行
    // 换行时应该保留缩进
    newline() {
      context.code += '\n' + `  `.repeat(context.currentIdent)
    },
    // 缩进
    ident() {
      context.currentIdent++
      context.newline()
    },
    // 取消缩进
    deIdent() {
      context.currentIdent--
      context.newline()
    }
  }
  genNode(node, context)
  return context.code
}

const newTemplate = `<div><p>Vue</p><span>Template</span></div>`
function compile(template) {
  const ast = parse(template)
  transform(ast)
  console.log (ast.jsNode, 'ast.jsNode ======')
  const code = generate(ast.jsNode)
  console.log (code, 'code ======')
}

compile(newTemplate)

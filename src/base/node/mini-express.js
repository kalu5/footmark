const {
  createServer
} = require('http')

const {
  parse
} = require('url')

const {
  readFileSync
} = require('fs')

const  EventsEmiter = require('events')

const ee = new EventsEmiter()

const methods = ['get', 'post']

const express = () => {
  const app = createServer((req, res) => {
    // 获取方法
    const method = req.method.toLowerCase()
    // 解析url
    const { pathname, query } = parse(req.url)
    // 处理query
    if (query) {
      req.params = dealQuery(query);
    }

    // 响应json
    res.json = (data) => {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      res.write(JSON.stringify(data))
    }

    // 响应html
    res.html = (fileName, data) => {
      const tpl = readFileSync(fileName, 'utf8')
      const concatTpl = concatTplData(tpl, data)
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(concatTpl)
    }

    ee.emit(pathname, method, req, res)
  })

  methods.forEach(m => {
    app[m] = (pathname, callback) => {
      ee.on(pathname, (m, req, res) => {
        // 处理body
        if (m === 'post') {
          let body = ''
          req.on('data', chunk => body+= chunk)
          req.on('end', () => {
            req.body = JSON.parse(body)
            callback(req, res)
            res.end()
          })
          return
        }
        callback(req, res)
        res.end()
      })
    }
  })

  return app
}

const dealQuery = (query) => {
  // id=xx&page=xx
  const attr = query.split('&');
  return attr.reduce((obj, item) => {
    const [key, value] = item.split('=');
    obj[key] = value
    return obj
  }, {})
}

const concatTplData = (tpl, data) => {
  if (!data) return tpl
  return tpl.replace(/\{\{\s*(.+?)\s*\}\}/g, (node, key) => {
    return data[key]
  })
}

module.exports = express;
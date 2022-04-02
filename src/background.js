const resourceTypes = {
  xmlhttprequest: 'xmlhttprequest',
  stylesheet: 'stylesheet',
  script: 'script',
  main_frame: 'main_frame',
  sub_frame: 'sub_frame',
  image: 'image',
  font: 'font',
  object: 'object',
  ping: 'ping',
  csp_report: 'csp_report',
  media: 'media',
  websocket: 'websocket',
  webtransport: 'webtransport',
  webbundle: 'webbundle',
}

const actionTypes = {
  redirect: 'redirect',
  modifyHeaders: 'modifyHeaders',
}

const domains = ['hao123.com']

const _rules = [
  {
    condition: {
      domains: ['hao123-static.cdn.bcebos.com', ...domains],
      resourceTypes: [resourceTypes.script],
      urlFilter:
        'fe-res/her/static/indexnew/component/hotgoods/hotgoods.144f696.js',
    },
    action: {
      type: actionTypes.redirect,
      redirect: {
        extensionPath: '/files/hi.js',
      },
    },
  },
  {
    condition: {
      domains,
      resourceTypes: [resourceTypes.xmlhttprequest],
    },
    action: {
      type: actionTypes.modifyHeaders,
      requestHeaders: [
        {
          header: 'X-DeclarativeNetRequest-Sample',
          operation: 'set',
          value: '1-request',
        },
      ],
      responseHeaders: [
        {
          header: 'X-DeclarativeNetRequest-Sample',
          operation: 'set',
          value: '2-response',
        },
      ],
    },
  },
]

// run

function create(list) {
  const addRules = []

  list.forEach((obj, i) => {
    let redirect = {}
    i++

    if (obj.to.startsWith('http')) {
      redirect.url = obj.to
    } else {
      redirect = {
        extensionPath: '/files/' + obj.to,
      }
    }

    const r = {
      id: i,
      priority: 1,
      condition: {
        domains: [obj.domain],
        resourceTypes: [obj.resourceTypes],
        urlFilter: obj.from,
      },
      action: {
        type: actionTypes.redirect,
        redirect,
      },
    }

    addRules.push(r)
  })

  const rules = { addRules }

  chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    } else {
      chrome.declarativeNetRequest.getDynamicRules((list) => console.log(list))
    }
  })
}

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' })
})

chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
  if (!Array.isArray(data)) {
    return true
  }

  chrome.declarativeNetRequest.getDynamicRules((list) => {
    const clear = {
      removeRuleIds: list.map((o) => o.id),
    }
    chrome.declarativeNetRequest.updateDynamicRules(clear, () => {
      create(data)
    })
  })

  return true
})

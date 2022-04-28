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

const domains = ['laof.github.io']

const _rules = [
  {
    condition: {
      domains,
      resourceTypes: [resourceTypes.script],
      urlFilter: 'assets/js/laof.js',
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
      urlFilter: 'assets/data/user.json',
    },
    action: {
      type: actionTypes.redirect,
      redirect: {
        extensionPath: '/files/test.json',
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

  return addRules
}

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' })
})

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (!Array.isArray(data)) {
    return true
  }

  chrome.declarativeNetRequest.getDynamicRules((list) => {
    const clear = {
      removeRuleIds: list.map((o) => o.id),
      addRules: create(data),
    }
    chrome.declarativeNetRequest.updateDynamicRules(clear, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
      } else {
        chrome.declarativeNetRequest.getDynamicRules((list) =>
          console.log(list),
        )
      }
    })
  })

  return true
})



// https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest
// https://developer.chrome.com/docs/extensions/reference/scripting

//   const arr = [
//     {
//       js: ['start.js'],
//       matches: ['<all_urls>'],
//       allFrames: true,
//       id: 'aa',
//       runAt: 'document_start',
//     },
//     {
//       js: ['end.js'],
//       matches: ['<all_urls>'],
//       allFrames: true,
//       id: 'bb',
//       runAt: 'document_end',
//     },
//     {
//       js: ['idle.js'],
//       matches: ['<all_urls>'],
//       allFrames: true,
//       id: 'cc',
//       runAt: 'document_idle',
//     },
//   ];

// chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
//   if (!Array.isArray(data)) {
//     return true;
//   }

//   const rules = await chrome.declarativeNetRequest.getDynamicRules();
//   await chrome.declarativeNetRequest.updateDynamicRules({
//     removeRuleIds: rules.map((o) => o.id),
//     addRules: create(data),
//   });

//   await chrome.scripting.unregisterContentScripts();

//   if (typeof scripting) {
//     await chrome.scripting.registerContentScripts([]);
//   }

//   if (chrome.runtime.lastError) {
//     console.error(chrome.runtime.lastError);
//   }

//   return sendResponse();
// });


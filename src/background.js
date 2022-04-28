const resourceTypes = {
  xmlhttprequest: "xmlhttprequest",
  stylesheet: "stylesheet",
  script: "script",
  main_frame: "main_frame",
  sub_frame: "sub_frame",
  image: "image",
  font: "font",
  object: "object",
  ping: "ping",
  csp_report: "csp_report",
  media: "media",
  websocket: "websocket",
  webtransport: "webtransport",
  webbundle: "webbundle",
};

const actionTypes = {
  redirect: "redirect",
  modifyHeaders: "modifyHeaders",
};

const domains = ["laof.github.io"];

const _rules = [
  {
    condition: {
      domains,
      resourceTypes: [resourceTypes.script],
      urlFilter: "assets/js/laof.js",
    },
    action: {
      type: actionTypes.redirect,
      redirect: {
        extensionPath: "/files/hi.js",
      },
    },
  },
  {
    condition: {
      domains,
      resourceTypes: [resourceTypes.xmlhttprequest],
      urlFilter: "assets/data/user.json",
    },
    action: {
      type: actionTypes.redirect,
      redirect: {
        extensionPath: "/files/test.json",
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
          header: "X-DeclarativeNetRequest-Sample",
          operation: "set",
          value: "1-request",
        },
      ],
      responseHeaders: [
        {
          header: "X-DeclarativeNetRequest-Sample",
          operation: "set",
          value: "2-response",
        },
      ],
    },
  },
];

// run

const ruletType = {
  inject: 0,
  forward: 1,
};

function createRequest(arr) {
  const addRules = [];

  const list = arr.filter((data) => data.type == ruletType.forward);

  list.forEach((obj, i) => {
    let redirect = {};
    i++;

    if (obj.to.startsWith("http")) {
      redirect.url = obj.to;
    } else {
      redirect = {
        extensionPath: "/files/forward/" + obj.to,
      };
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
    };

    addRules.push(r);
  });

  return addRules;
}

function createInject(arr) {
  const addInject = [];
  const list = arr.filter((data) => data.type == ruletType.inject);

  list.forEach((obj, i) => {
    const data = {
      js: ["/files/inject/" + obj.to],
      matches: [obj.domain],
      allFrames: true,
      id: obj.id,
      runAt: obj.run,
    };
    addInject.push(data);
  });

  return addInject;
}

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "index.html" });
});

chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
  sendResponse({});
  if (!Array.isArray(data)) {
    return true;
  }

  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((o) => o.id),
    addRules: createRequest(data),
  });

  await chrome.scripting.unregisterContentScripts();

  const js = createInject(data);
  if (js.length) {
    await chrome.scripting.registerContentScripts(js);
  }

  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  }
});

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

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

const all_urls = "<all_urls>";

const domains = ["laof.github.io"];

const test = [
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
        resourceTypes: [obj.run],
        urlFilter: obj.from,
      },
      action: {
        type: actionTypes.redirect,
        redirect,
      },
    };

    if (obj.domain != all_urls) {
      r.condition.domains = [obj.domain];
    }

    addRules.push(r);
  });
  return addRules;
}

function createInject(arr) {
  const addInject = [];
  const list = arr.filter((data) => data.type == ruletType.inject);

  list.forEach((obj, i) => {
    let matches = "*://" + obj.domain + "/*";
    if (obj.domain == all_urls) {
      matches = all_urls;
    }

    const data = {
      js: ["/files/inject/" + obj.to],
      matches: [matches],
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
  sendResponse();
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
// https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-URLTransform

// https://developer.chrome.com/docs/extensions/reference/scripting
// https://developer.chrome.com/docs/extensions/mv3/match_patterns

//   const arr = [
//     {
//       js: ['start.js'],
//       matches: ['<all_urls>'],
//       allFrames: true,
//       id: 'aa',
//       runAt: 'document_start',
//     },
//   ];

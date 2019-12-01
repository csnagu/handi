chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: "#3aa757" }, function () {
    console.log("The color is green.");
  });
  chrome.storage.sync.set({ site: [] }, function () {
    console.log("site settins.")
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.status === "complete") {
    chrome.storage.sync.get("site", function (data) {
      for (let sitePattern of data.site) {
        if (tab.url.includes(sitePattern) && !tab.url.includes(`?newHost=${sitePattern}`)) {
          chrome.tabs.remove(tabId);
        }
      }
    });
  }
});

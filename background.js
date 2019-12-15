chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ site: {} })
  chrome.declarativeContent.onPageChanged.removeRules(undefined);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  removeMatchedTab(tab)
})

const removeMatchedTab = (tab) => {
  chrome.storage.sync.get("site", function (data) {
    for (let key of Object.keys(data.site)) {
      const siteInfo = data.site[key];
      const hostPattern = siteInfo.hostPattern;
      const killTime = siteInfo.killTime;

      if (tab.url.includes(hostPattern) && !tab.url.includes(`?hostPattern=${hostPattern}`)) {
        setTimeout(function () {
          // check tab.id exist
          // if tab.id exist, removing tab matching with tab.id
          chrome.tabs.get(tab.id, function () {
            if (chrome.runtime.lastError) {
              // throw up my hands.
            } else {
              chrome.tabs.remove(tab.id);
            }
          });
        }, killTime*1000);
      }
    }
  });
}

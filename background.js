chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: "#3aa757" }, function () {
    console.log("The color is green.");
  });
  chrome.storage.sync.set({ site: [] }, function () {
    console.log("site settins.")
  })

  chrome.declarativeContent.onPageChanged.removeRules(undefined);
});

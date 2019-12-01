function applySiteList() {
    chrome.storage.sync.get("site", function (data) {
        // get site list
        let targetSiteList = [];
        for (let sitePattern of data.site) {
            targetSiteList.push(new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostContains: sitePattern }
            }));
        }

        // add rules
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
            chrome.declarativeContent.onPageChanged.addRules([
                {
                    conditions: targetSiteList,
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                }
            ]);
        });
    });
};

function insertSiteList(targetElement) {
    chrome.storage.sync.get("site", function (data) {
        for (let sitePattern of data.site) {
            targetElement.appendChild(document.createElement("li"));
            let input_text = document.createElement("input");
            input_text.setAttribute("type", "text");
            input_text.setAttribute('value', sitePattern);
            input_text.setAttribute('readonly', 1)
            targetElement.appendChild(input_text);
        }
    });
};
let siteList = document.getElementById("siteList");
insertSiteList(siteList);
applySiteList();

function addSiteList(newSite) {
    chrome.storage.sync.get("site", function (data) {
        chrome.storage.sync.set({ site: [...data.site, newSite] });
    });
};
let submitButton = document.getElementById("addSite");
submitButton.addEventListener('click', function () {
    const newSite = document.getElementById("newSite").value;
    addSiteList(newSite);
});

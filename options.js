function applySiteList() {
    chrome.storage.sync.get("site", function (data) {
        // get site info
        let targetSiteList = [];
        for (let key of Object.keys(data.site)) {
            const siteInfo = data.site[key];
            const hostPattern = siteInfo.hostPattern
            targetSiteList.push(new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostContains: hostPattern }
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
        let fragment = document.createDocumentFragment();
        for (let key of Object.keys(data.site)) {
            const siteInfo = data.site[key]
            const showSiteListText = document.createTextNode(`${siteInfo.hostPattern}:\t${siteInfo.killTime}秒`);

            fragment.appendChild(document.createElement("li"));
            fragment.appendChild(showSiteListText)
        }
        targetElement.appendChild(fragment)
    });
};
let siteList = document.getElementById("siteList");
insertSiteList(siteList);


function addSiteList(hostPattern, killTime) {
    const newHost = {
        [hostPattern]: {
            hostPattern: hostPattern,
            killTime: parseInt(killTime, 10)
        }
    }

    chrome.storage.sync.get("site", function (data) {
        chrome.storage.sync.set({ site: { ...data.site, ...newHost } });
    });
};

const form = document.getElementById("add");
form.addEventListener('submit', function () {
    const hostPattern = document.getElementById("hostPattern").value;
    let killTime = parseInt(document.getElementById("killTime").value, 10);
    if (killTime < 0) { killTime = 0; }

    addSiteList(hostPattern, killTime);
    applySiteList();
});

const resetButton = document.getElementById("reset");
resetButton.addEventListener('click', function () {
    const siteList = document.getElementById("siteList");
    chrome.storage.sync.set({ site: {} });

    applySiteList();
});

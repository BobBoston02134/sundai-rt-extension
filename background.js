chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupMovie",
    title: "Look up \"%s\" on Rotten Tomatoes",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "lookupMovie") {
    chrome.storage.local.set({ movieQuery: info.selectionText });
    chrome.action.openPopup();
  }
});
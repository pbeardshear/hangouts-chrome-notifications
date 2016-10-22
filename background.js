chrome.extension.onConnect.addListener(function(port) {
  var tabs = {
    // notificationId: tabId
  }

  chrome.notifications.onClicked.addListener(function(notificationId) {
    var tabId = tabs[notificationId]

    if (tabId) {
      chrome.tabs.update(tabId, {
        selected   : true,
        active     : true
      }, function(tab) {
        chrome.windows.update(tab.windowId, { focused: true }, function() {
          chrome.notifications.clear(notificationId)
          delete tabs[notificationId]
        })
      })
    }
  })

  port.onMessage.addListener(function(data, port) {
    var tab = port.sender.tab
    var notificationId = tab.id + '-' + data.title

    chrome.notifications.create(notificationId, {
      type   : 'basic',
      title  : data.title,
      message: data.text,
      iconUrl: data.avatar
    }, function(notificationId) {
      tabs[notificationId] = tab.id
    })
  })

})

(function() {
    var DEFAULT = {
        authKey: 'getlink',
        server: 'https://server.get-link.xyz/uptoken'
    };

    function copyTextToClipboard(text) {
        var copyFrom, body;
        copyFrom = document.createElement("textarea");
        copyFrom.textContent = text;
        body = document.getElementsByTagName('body')[0];
        body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        body.removeChild(copyFrom);
    }

    chrome.runtime.onInstalled.addListener(function() {
        var notification = new Notification('Important Notification!!!', {
            icon: 'images/icon48-warn.png',
            body: 'Please click me to check.'
        });
        notification.onclick = function() {
            window.open("https://goo.gl/VcOE5q");
        };
        chrome.contextMenus.create({
            'type': 'normal',
            'title': 'Get Link!',
            'contexts': ["image"],
            'id': 'gl'
        });
    });

    function showMsg(isOK) {
        var notification = new Notification(isOK ? 'Getlink successfully :-)' : 'Failed to getlink!', {
            icon: isOK ? 'images/icon48-ok.png' : 'images/icon48-error.png',
            body: isOK ? 'The link is now in your clipboard' : 'Please upload in getlink.int64ago.org'
        });
    }

    function getlink(callback) {
        var xhr = new XMLHttpRequest(),
            server = localStorage.getItem('getlink_server') || DEFAULT.server,
            authKey = localStorage.getItem('getlink_authKey') || DEFAULT.authKey;
        xhr.open('POST', server, true);
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                } else {
                    showMsg(false);
                }
            }
        };
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send('getlink_key=' + authKey);
    }

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        if (request.method === "setStorage") {
            localStorage.setItem('getlink_server', request.data.server);
            localStorage.setItem('getlink_authKey', request.data.authKey);
            sendResponse({
                status: 'OK'
            });
        }
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId === 'gl') {
            getlink(function(upToken) {
                upToken = JSON.parse(upToken);
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        method: 'picInfo',
                        data: {
                            srcUrl: info.srcUrl,
                            pageUrl: info.pageUrl,
                            token: upToken.token
                        }
                    }, function(response) {
                        if (response.result && response.result !== 'error') {
                            copyTextToClipboard(upToken.domain + '/' + response.result);
                            showMsg(true);
                        } else {
                            showMsg(false);
                        }
                    });
                });
            });
        }
    });
}());

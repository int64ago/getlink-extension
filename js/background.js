/*global chrome, Notification */
/*jshint nonew: true */

(function () {
    "use strict";
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

    chrome.runtime.onInstalled.addListener(function () {
        chrome.contextMenus.create({
            'type': 'normal',
            'title': 'Get Link!',
            'contexts': [ "image" ],
            'id': 'gl'
        });
    });

    function showMsg(isOK) {
        var notification = new Notification(isOK ? 'Getlink successfully :-)' : 'Failed to getlink!', {
            icon: isOK ? 'images/icon48.png' : 'images/icon48_red.png',
            body: isOK ? 'The link is now in your clipboard' : 'Please upload in getlink.int64ago.org'
        });
    }

    function getlink(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://qiniu.coding.io/uptoken', true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                } else {
                    showMsg(false);
                }
            }
        };
        xhr.send();
    }

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId === 'gl') {
            getlink(function (upToken) {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        picInfo: {srcUrl: info.srcUrl, pageUrl: info.pageUrl, token: upToken}
                    }, function (response) {
                        if (response.result && response.result !== 'error') {
                            copyTextToClipboard('https://dn-getlink.qbox.me/' + response.result);
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


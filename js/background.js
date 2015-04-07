/*global chrome, Notification */
/*jshint nonew: true */


function copyTextToClipboard(text) {
    "use strict";
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
    "use strict";
	chrome.contextMenus.create({
		'type': 'normal',
		'title': 'Get Link!',
		'contexts': [ "image" ],
		'id': 'gl'
	});
});

function showMsg(msgTitle, msgIcon, msgBody) {
    "use strict";
    var notification = new Notification(msgTitle, {
        icon: msgIcon,
        body: msgBody
    });
}

function getlink(url) {
    "use strict";
    var picUrl, xhr;
	picUrl = 'http://getlink.sinaapp.com/ext?url=' + url;
	xhr = new XMLHttpRequest();
	xhr.open("GET", picUrl, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			var retUrl = xhr.responseText;
			if (retUrl !== 'none' && retUrl.match(".com") !== null) {
				copyTextToClipboard(retUrl);
				showMsg("成功生成外链:-)", "images/icon48.png", "链接已经复制到剪贴板");
			} else {
				showMsg("生成外链失败！", "images/icon48_red.png", "请下载后在http://getlink.sinaapp.com/上传");
			}
		}
	};
	xhr.send();
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    "use strict";
    if (info.menuItemId === 'gl') {
        getlink(info.srcUrl);
    }
});



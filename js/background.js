chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		'type':'normal',
		'title':'Get Link!',
		'contexts':["image"],
		'id':'gl',
	});
});

function showMsg(msgTitle, msgIcon, msgBody) {
  new Notification(msgTitle, {
    icon: msgIcon,
    body: msgBody
  });
}

function getlink(url){
	var picUrl = 'http://getlink.sinaapp.com/ext?url='+url;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", picUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var retUrl = xhr.responseText;
			if(retUrl != 'none' && retUrl.match(".com") != null){
				copyTextToClipboard(retUrl);
				showMsg("成功生成外链:-)", "images/icon48.png", "链接已经复制到剪贴板");
			}else{
				showMsg("生成外链失败！", "images/icon48_red.png", "请下载后在http://getlink.sinaapp.com/上传");
			}
		}
	}
	xhr.send();
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == 'gl')
        getlink(info.srcUrl);
});

function copyTextToClipboard(text) {
	var copyFrom = document.createElement("textarea");
	copyFrom.textContent = text;
	var body = document.getElementsByTagName('body')[0];
	body.appendChild(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	body.removeChild(copyFrom);
}

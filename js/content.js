/*global chrome, FormData*/

(function () {
    "use strict";
    function upload(blob, isHTTPS, token, callback) {
        var form, xhr;
        form = new FormData();
        form.append('token', token);
        form.append('key', Math.random().toString(36).substring(5) + '.' + blob.type.split('/')[1]);
        form.append("file", blob);
        xhr = new XMLHttpRequest();
        xhr.open('POST', isHTTPS ? 'https://up.qbox.me' : 'http://up.qiniu.com/', true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText).key);
                } else {
                    callback('error');
                }
            }
        };
        xhr.send(form);
    }
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            var xhr, isHTTPS = (request.picInfo.pageUrl.split(':')[0] === 'https');
            xhr = new XMLHttpRequest();
            xhr.open('GET', request.picInfo.srcUrl, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (this.status === 200) {
                    upload(this.response, isHTTPS, request.picInfo.token, function (res) {
                        sendResponse({result: res});
                    });
                }
            };
            xhr.send();
            return true;
        }
    );
}());
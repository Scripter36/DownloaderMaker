/*jslint esversion: 6*/
function addURL(type) {
    if (type === 'script') {
        let div = document.createElement('div');
        div.innerHTML = 'URL: <input type="text" id="scriptURL1"></input> ' +
            'Title: <input type="text" id="scripttitle1"></input> ' +
            'SubTitle: <input type="text" id="scriptsubtitle1"></input> ' +
            'Path: <input type="text" id="scriptpath1"></input>';
        document.getElementById('scriptURLdiv').appendChild(div);
    } else if (type === 'map') {
        let div = document.createElement('div');
        div.innerHTML = 'URL: <input type="text" id="mapURL1"></input> ' +
            'Title: <input type="text" id="maptitle1"></input> ' +
            'SubTitle: <input type="text" id="mapsubtitle1"></input> ' +
            'Path: <input type="text" id="mappath1"></input>';
        document.getElementById('mapURLdiv').appendChild(div);
    } else if (type === 'apk') {
        let div = document.createElement('div');
        div.innerHTML = 'URL: <input type="text" id="apkURL1"></input> ' +
            'Title: <input type="text" id="apktitle1"></input> ' +
            'SubTitle: <input type="text" id="apksubtitle1"></input> ' +
            'Path: <input type="text" id="apkpath1"></input>';
        document.getElementById('apkURLdiv').appendChild(div);
    } else if (type === 'other') {
        let div = document.createElement('div');
        let count = document.getElementsByClassName('otherURL').length + 1;
        div.innerHTML = 'URL: <input type="text" id="otherURL1"></input> ' +
            'Title: <input type="text" id="othertitle1"></input> ' +
            'SubTitle: <input type="text" id="othersubtutle1"></input> ' +
            'Path: (sdcard/)<input type="text" id="otherpath1"></input>';
        document.getElementById('otherURLdiv').appendChild(div);
    }
}

function reverseColor(color) {
    color = color.toLowerCase();
    let red = "0x" + color.substring(0, 2).toString(10);
    let green = "0x" + color.substring(2, 4).toString(10);
    let blue = "0x" + color.substring(4, 6).toString(10);
    return "rgb(" + (255 - parseInt(red)) + "," + (255 - parseInt(green)) + "," + (255 - parseInt(blue)) + ")";
}

function colorChange(type) {
    if (type === 0) {
        let color = document.getElementById('mainwindowtitlecolor').value;
        document.getElementById('mainwindowtitlecolor').style = "background-color: " + color + "; color:" + reverseColor(color);
    } else if (type === 1) {
        let color = document.getElementById('maincolor').value;
        document.getElementById('maincolor').style = "background-color: " + color + "; color:" + reverseColor(color);
    }
}

function create() {
    let script = [];
    let map = [];
    let apk = [];
    let other = [];
    for (let i = 1;; i++) {
        let url = document.getElementById('scriptURL' + i);
        let path = document.getElementById('scriptpath' + i);
        let title = document.getElementById('scripttitle' + i);
        let subtitle = document.getElementById('scriptsubtitle' + i);
        if (url === null || path === null || title === null || subtitle === null) break;
        if (url.value !== '' && path.value !== '' && title.value !== '') script.push({
            URL: url.value,
            Path: path.value,
            Title: title.value,
            Subtitle: subtitle.value
        });
    }
    for (let i = 1;; i++) {
        let url = document.getElementById('mapURL' + i);
        let path = document.getElementById('mappath' + i);
        let title = document.getElementById('maptitle' + i);
        let subtitle = document.getElementById('mapsubtitle' + i);
        if (url === null || path === null || title === null || subtitle === null) break;
        if (url.value !== '' && path.value !== '' && title.value !== '') map.push({
            URL: url.value,
            Path: path.value,
            Title: title.value,
            Subtitle: subtitle.value
        });
    }
    for (let i = 1;; i++) {
        let url = document.getElementById('apkURL' + i);
        let path = document.getElementById('apkpath' + i);
        let title = document.getElementById('apktitle' + i);
        let subtitle = document.getElementById('apksubtitle' + i);
        if (url === null || path === null || title === null || subtitle === null) break;
        if (url.value !== '' && path.value !== '' && title.value !== '') apk.push({
            URL: url.value,
            Path: path.value,
            Title: title.value,
            Subtitle: subtitle.value
        });
    }
    for (let i = 1;; i++) {
        let url = document.getElementById('otherURL' + i);
        let path = document.getElementById('otherpath' + i);
        let title = document.getElementById('othertitle' + i);
        let subtitle = document.getElementById('othersubtitle' + i);
        if (url === null || path === null || title === null || subtitle === null) break;
        if (url.value !== '' && path.value !== '' && title.value !== '') other.push({
            URL: url.value,
            Path: path.value,
            Title: title.value,
            Subtitle: subtitle.value
        });
    }
    let result = {
        script: script,
        map: map,
        apk: apk,
        other: other
    };
    document.getElementById('resultDiv').innerText = JSON.stringify(result);
}

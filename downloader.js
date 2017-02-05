/*jshint esversion: 6 */

/**
 * 스크립트, 어플, 파일 자동 다운로드 스크립트
 * @author Scripter36(1350adwx)
 */


/**
 * 파일 다운로더
 * @param {String} _url     다운로드 받을 Url
 * @param {File} _path    다운로드 받아질 경로
 * @param {Boolean} _install 설치 여부
 * @param {Boolean} _force   강제 설치 여부
 */
function AutoDownloader(_url, _path, _install, _force) {
    /** @type {Context} 마크 context */
    let ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    /** @type {String} 다운로드 받을 Url */
    let url = _url,
        /** @type {File} 다운로드 받아질 경로 */
        path = _path,
        /** @type {Boolean} 설치 여부 */
        install = _install,
        /** @type {Boolean} 강제 설치 여부 */
        force = _force,
        /** @type {Number} 진행 Byte */
        progress = 0,
        /** @type {Number} 다운받는 파일 크기(Byte) */
        max = 0,
        /** @type {Boolean} 다운로드 시작 여부 */
        started = false;

    /**
     * 다운로드 받을 Url 변경
     * @param {String} _url 다운로드 받을 Url
     */
    this.setUrl = function(_url) {
        url = _url;
        return this;
    };

    /**
     * 다운로드 받을 Url 가져오기
     * @return {String} 다운로드 받을 Url
     */
    this.getUrl = function() {
        return url;
    };

    /**
     * 다운로드 받아질 경로 변경
     * @param {File} _path 다운로드 받아질 경로
     */
    this.setPath = function(_path) {
        if (_path instanceof java.io.File) path = _path;
        else path = new java.io.File(_path);
        return this;
    };

    /**
     * 다운로드 받아질 경로 가져오기
     * @return {File} 다운로드 받아질 경로
     */
    this.getPath = function() {
        return path;
    };

    /**
     * 다운로드 후 설치 여부 변경
     * @param {Boolean} _install 설치 여부
     */
    this.setInstall = function(_install) {
        install = _install == true;
        return this;
    };

    /**
     * 다운로드 후 설치 여부 가져오기
     * @return {Boolean} 설치 여부
     */
    this.isInstall = function() {
        return install;
    };

    /**
     * 다운로드 후 강제 설치 여부 변경
     * @param {Boolean} _force 강제 설치 여부
     */
    this.setForceInstall = function(_force) {
        force = _force == true;
        return this;
    };

    /**
     * 다운로드 후 강제 설치 여부
     * @return {Boolean} 강제 설치 여부
     */
    this.isForceInstall = function() {
        return force;
    };

    /**
     * 다운로드 시작 여부 가져오기
     * @return {Boolean} 다운로드 시작 여부
     */
    this.isStarted = function() {
        return started;
    };

    /**
     * 다운로드해야 할 Byte 가져오기
     * @return {Number} 다운로드 해야 할 Byte
     */
    this.getMax = function() {
        return max;
    };

    /**
     * 다운로드 한 Byte 가져오기
     * @return {Number} 다운로드 한 Byte
     */
    this.getProgress = function() {
        if (path === undefined) return 0;
        if (!started) return 0;
        return path.length();
    };

    /**
     * 다운로드
     * @param  {Function} callback 다운로드 완료 후 실행될
     */
    this.download = function(callback) {
        if (path.exists()) path.delete();
        started = true;
        let thread = new java.lang.Thread(new java.lang.Runnable({
            run: function() {
                try {
                    let _url = new java.net.URL(url);
                    let urlConn = _url.openConnection();
                    max = urlConn.getContentLength();
                    var bis = new java.io.BufferedInputStream(_url.openStream());
                    var bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(path));
                    var len;
                    while ((len = bis.read()) !== -1) {
                        bos.write(len);
                    }
                    bos.flush();
                    bis.close();
                    bos.close();
                    if (install) {
                        let name = path.getName() + "";
                        let lastname = name.split(".")[name.split(".").length - 1].toLowerCase();
                        if (lastname === "apk") {
                            try {
                                let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                                intent.setDataAndType(android.net.Uri.fromFile(path), "application/vnd.android.package-archive");
                                ctx.startActivity(intent);
                                if (force) {
                                    let packageName = ctx.getPackageManager().getPackageArchiveInfo(path.getAbsolutePath(), 0).packageName;
                                    try {
                                        ctx.getPackageManager().getPackageInfo(packageName, android.content.pm.PackageManager.GET_ACTIVITIES);
                                        let uninstallIntent = new android.content.Intent(android.content.Intent.ACTION_DELETE, android.net.Uri.fromParts("package", packageName, null));
                                        ctx.startActivity(uninstallIntent);
                                    } catch (e) {

                                    }
                                }
                            } catch (e) {
                                print(e.lineNumber + "" + e);
                            }
                        } else if (lastname === "js") {
                            let file;
                            if (net.zhuoweizhang.mcpelauncher.Utils.isPro()) file = new java.io.File(android.os.Environment.getDataDirectory().getAbsolutePath() + "/data/net.zhuoweizhang.mcpelauncher.pro/app_modscripts/" + path.getName());
                            else file = new java.io.File(android.os.Environment.getDataDirectory().getAbsolutePath() + "/data/net.zhuoweizhang.mcpelauncher/app_modscripts/" + path.getName());
                            if (!file.exists() || force) {
                                try {
                                    let bis = new java.io.BufferedInputStream(new java.io.FileInputStream(path));
                                    let bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
                                    let len;
                                    let lens = [];
                                    while ((len = bis.read()) !== -1) {
                                        lens.push(len);
                                    }
                                    for (len of lens) bos.write(len);
                                    bos.flush();
                                    bis.close();
                                    bos.close();
                                } catch (e) {
                                    print(e.lineNumber + "" + e);
                                }
                            }
                            net.zhuoweizhang.mcpelauncher.ScriptManager.setEnabled(file, true);
                        } else if (lastname === "zip") {
                            var zis = new java.util.zip.ZipInputStream(new java.io.FileInputStream(path));
                            let entry;
                            while ((entry = zis.getNextEntry()) != null) {
                                let file = new File(sdcard+"/games/com.mojang/minecraftWorlds/" + entry.getName());
                                if (entry.isDirectory()) file.mkdirs();
                                else {
                                    let fos = new java.io.FileOutputStream(file);
                                    let buf = new java.nio.ByteBuffer.allocate(1024).array();
                                    let len;
                                    while ((len = zis.read(buf)) != -1) fos.write(buf, 0, len);
                                    fos.close();
                                }
                                zis.closeEntry();
                            }
                            zis.close();
                        }
                    }
                    callback();
                    started = false;
                } catch (e) {
                    print(e.lineNumber + "" + e);
                }
            }
        }));
        thread.start();
        return this;
    };
}
const ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
const Runnable = java.lang.Runnable;
const Button = android.widget.Button;
const TextView = android.widget.TextView;
const ToggleButton = android.widget.ToggleButton;
const CheckBox = android.widget.CheckBox;
const Switch = android.widget.Switch;
const SeekBar = android.widget.SeekBar;
const ProgressBar = android.widget.ProgressBar;
const PopupWindow = android.widget.PopupWindow;
const Toast = android.widget.Toast;
const EditText = android.widget.EditText;
const OnCheckedChangeListener = android.widget.CompoundButton.OnCheckedChangeListener;
const OnTouchListener = android.view.View.OnTouchListener;
const OnClickListener = android.view.View.OnClickListener;
const MotionEvent = android.view.MotionEvent;
const Gravity = android.view.Gravity;
const ScrollView = android.widget.ScrollView;
const LinearLayout = android.widget.LinearLayout;
const horizontalScrollView = android.widget.HorizontalScrollView;
const FrameLayout = android.widget.FrameLayout;
const Width = ctx.getScreenWidth();
const Height = ctx.getScreenHeight();
const Bitmap = android.graphics.Bitmap;
const BitmapFactory = android.graphics.BitmapFactory;
const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const Drawable = android.graphics.drawable.Drawable;
const drawable = android.graphics.drawable;
const ColorDrawable = android.graphics.drawable.ColorDrawable;
const Color = android.graphics.Color;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;
const Typeface = android.graphics.Typeface;
const ScriptManager = net.zhuoweizhang.mcpelauncher.ScriptManager;
const Thread = java.lang.Thread;
const File = java.io.File;
const OutputStreamWriter = java.io.OutputStreamWriter;
const FileOutputStream = java.io.FileOutputStream;
const FileInputStream = java.io.FileInputStream;
const BufferedReader = java.io.BufferedReader;
const BufferedInputStream = java.io.BufferedInputStream;
const BufferedOutputStream = java.io.BufferedOutputStream;
const InputStreamReader = java.io.InputStreamReader;
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const LayoutParams = android.widget.RelativeLayout.LayoutParams;
let listURL = /*SPLIT*/ ;
let buttonMessage = /*SPLIT*/ ;
let mainWindowTitle = " " + /*SPLIT*/ ;
let mainWindowTitleColor = /*SPLIT*/ ;
let mainColor = /*SPLIT*/ ;
let language = /*SPLIT*/ ;
let screenWindow;

function readFromUrl(u, finishdo) {
    var thread = new java.lang.Thread(new java.lang.Runnable({
        run: function() {
            try {
                let ans = [];
                var url = new java.net.URL(u);
                var urlConn = url.openConnection();
                var inputStream = url.openStream();
                let br = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                let temp;
                while ((temp = br.readLine()) !== null) {
                    ans.push(temp);
                }
                finishdo(ans.join(""));
            } catch (e) {
                print(e);
            }
        }
    }));
    thread.start();
}

function showWindow() {
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                let outValue = new android.util.TypedValue();
                ctx.getTheme().resolveAttribute(android.R.attr.selectableItemBackground, outValue, true);
                let resourceId = outValue.resourceId;
                let divider = ctx.obtainStyledAttributes([android.R.attr.listDivider]).getDrawable(0);
                let verticalDivider = ctx.obtainStyledAttributes([android.R.attr.dividerVertical]).getDrawable(0);
                let scale = 1.5;
                let width = Width / 16;
                let height = Height / 16;
                let layout = new LinearLayout(ctx);
                let window = new PopupWindow(layout, width * 12, height * 12, true);
                layout.setOrientation(1);
                let titleLayout = new LinearLayout(ctx);
                titleLayout.setBackgroundColor(Color.parseColor(mainColor));
                let title = new TextView(ctx);
                title.setText(" " + mainWindowTitle);
                title.setTextColor(Color.parseColor(mainWindowTitleColor));
                title.setLayoutParams(new LayoutParams(width * 12 - height * 2, height * 2));
                let closeButton = new Button(ctx);
                closeButton.setText("X");
                closeButton.setTextColor(Color.parseColor(mainWindowTitleColor));
                closeButton.setLayoutParams(new LayoutParams(height * 2, height * 2));
                closeButton.setBackgroundResource(resourceId);
                closeButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {
                            if (window !== undefined) {
                                window.dismiss();
                                window = undefined;
                            }
                        } catch (e) {
                            print("Error at " + e.lineNumber + " Reason: " + e);
                        }
                    }
                }));
                titleLayout.addView(title);
                titleLayout.addView(closeButton);
                layout.addView(titleLayout);
                let mainLayout = new LinearLayout(ctx);
                mainLayout.setOrientation(1);
                mainLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                mainLayout.setDividerDrawable(divider);

                let scriptCheckBoxes = null;
                let mapCheckBoxes = null;
                let apkCheckBoxes = null;
                let otherCheckBoxes = null;
                let listData = null;
                readFromUrl(listURL, function(data) {
                    ctx.runOnUiThread(new Runnable({
                        run: function() {
                            try {
                                listData = JSON.parse(data);
                                scriptCheckBoxes = [];
                                mapCheckBoxes = [];
                                apkCheckBoxes = [];
                                otherCheckBoxes = [];

                                let selectAllCheckBox = new CheckBox(ctx);
                                selectAllCheckBox.setLayoutParams(new LayoutParams(width * 12, height * 2));
                                selectAllCheckBox.setText("전체 선택");
                                selectAllCheckBox.setOnCheckedChangeListener(new OnCheckedChangeListener({
                                    onCheckedChanged: function(v, c){
                                        try{
                                            if (!v.isPressed()) return;
                                            for (let i of scriptCheckBoxes) i.setChecked(c);
                                            for (let i of mapCheckBoxes) i.setChecked(c);
                                            for (let i of apkCheckBoxes) i.setChecked(c);
                                            for (let i of otherCheckBoxes) i.setChecked(c);
                                        }catch(e){
                                            print("Error at " + e.lineNumber + " Reason: " + e);
                                        }
                                    }
                                }));
                                mainLayout.addView(selectAllCheckBox);

                                let updateListener = new OnCheckedChangeListener({
                                    onCheckedChanged: function(v, c){
                                        try{
                                            if (!v.isPressed()) return;
                                            for (let i of scriptCheckBoxes) if (!i.isChecked()){
                                                selectAllCheckBox.setChecked(false);
                                                return;
                                            }
                                            for (let i of mapCheckBoxes) if (!i.isChecked()){
                                                selectAllCheckBox.setChecked(false);
                                                return;
                                            }
                                            for (let i of apkCheckBoxes) if (!i.isChecked()){
                                                selectAllCheckBox.setChecked(false);
                                                return;
                                            }
                                            for (let i of otherCheckBoxes) if (!i.isChecked()){
                                                selectAllCheckBox.setChecked(false);
                                                return;
                                            }
                                            selectAllCheckBox.setChecked(true);
                                        }catch(e){
                                            print("Error at " + e.lineNumber + " Reason: " + e);
                                        }
                                    }
                                });

                                if (listData.script.length > 0) {
                                    let scriptText = new TextView(ctx);
                                    scriptText.setTextColor(Color.BLACK);
                                    if (language === "Korean") scriptText.setText("스크립트");
                                    else scriptText.setText("Scripts");
                                    mainLayout.addView(scriptText);
                                    for (let i in listData.script) {
                                        let scriptCheckLayout = new LinearLayout(ctx);
                                        scriptCheckBoxes[i] = new CheckBox(ctx);
                                        scriptCheckBoxes[i].setText("");
                                        scriptCheckBoxes[i].setLayoutParams(new LayoutParams(width * 1, height * 2));
                                        scriptCheckBoxes[i].setClickable(false);
                                        scriptCheckBoxes[i].setOnCheckedChangeListener(updateListener);
                                        scriptCheckLayout.addView(scriptCheckBoxes[i]);
                                        let scriptCheckTextLayout = new LinearLayout(ctx);
                                        scriptCheckTextLayout.setOrientation(1);
                                        let scriptCheckTitle = new TextView(ctx);
                                        scriptCheckTitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        scriptCheckTitle.setText(listData.script[i].Title);
                                        scriptCheckTitle.setTextColor(Color.BLACK);
                                        scriptCheckTitle.setClickable(false);
                                        scriptCheckTextLayout.addView(scriptCheckTitle);
                                        let scriptCheckSubtitle = new TextView(ctx);
                                        scriptCheckSubtitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        scriptCheckSubtitle.setText(listData.script[i].Subtitle);
                                        scriptCheckSubtitle.setClickable(false);
                                        scriptCheckTextLayout.addView(scriptCheckSubtitle);
                                        scriptCheckLayout.addView(scriptCheckTextLayout);
                                        scriptCheckLayout.setClickable(true);
                                        let index = i;
                                        scriptCheckLayout.setOnClickListener(new OnClickListener({
                                            onClick: function() {
                                                scriptCheckBoxes[index].setChecked(!scriptCheckBoxes[index].isChecked());
                                            }
                                        }));
                                        mainLayout.addView(scriptCheckLayout);
                                    }
                                }

                                if (listData.map.length > 0) {
                                    let mapText = new TextView(ctx);
                                    mapText.setTextColor(Color.BLACK);
                                    if (language === "Korean") mapText.setText("맵");
                                    else mapText.setText("Maps");
                                    mainLayout.addView(mapText);
                                    for (let i in listData.map) {
                                        let mapCheckLayout = new LinearLayout(ctx);
                                        mapCheckBoxes[i] = new CheckBox(ctx);
                                        mapCheckBoxes[i].setText("");
                                        mapCheckBoxes[i].setLayoutParams(new LayoutParams(width * 1, height * 2));
                                        mapCheckBoxes[i].setClickable(false);
                                        mapCheckBoxes[i].setOnCheckedChangeListener(updateListener);
                                        mapCheckLayout.addView(mapCheckBoxes[i]);
                                        let mapCheckTextLayout = new LinearLayout(ctx);
                                        mapCheckTextLayout.setOrientation(1);
                                        let mapCheckTitle = new TextView(ctx);
                                        mapCheckTitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        mapCheckTitle.setText(listData.map[i].Title);
                                        mapCheckTitle.setTextColor(Color.BLACK);
                                        mapCheckTitle.setClickable(false);
                                        mapCheckTextLayout.addView(mapCheckTitle);
                                        let mapCheckSubtitle = new TextView(ctx);
                                        mapCheckSubtitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        mapCheckSubtitle.setText(listData.map[i].Subtitle);
                                        mapCheckSubtitle.setClickable(false);
                                        mapCheckTextLayout.addView(mapCheckSubtitle);
                                        mapCheckLayout.addView(mapCheckTextLayout);
                                        mapCheckLayout.setClickable(true);
                                        let index = i;
                                        mapCheckLayout.setOnClickListener(new OnClickListener({
                                            onClick: function() {
                                                mapCheckBoxes[index].setChecked(!mapCheckBoxes[index].isChecked());
                                            }
                                        }));
                                        mainLayout.addView(mapCheckLayout);
                                    }
                                }

                                if (listData.apk.length > 0) {
                                    let apkText = new TextView(ctx);
                                    apkText.setTextColor(Color.BLACK);
                                    if (language === "Korean") apkText.setText("어플리케이션");
                                    else apkText.setText("Applications");
                                    mainLayout.addView(apkText);
                                    for (let i in listData.apk) {
                                        let apkCheckLayout = new LinearLayout(ctx);
                                        apkCheckBoxes[i] = new CheckBox(ctx);
                                        apkCheckBoxes[i].setText("");
                                        apkCheckBoxes[i].setLayoutParams(new LayoutParams(width * 1, height * 2));
                                        apkCheckBoxes[i].setClickable(false);
                                        apkCheckBoxes[i].setOnCheckedChangeListener(updateListener);
                                        apkCheckLayout.addView(apkCheckBoxes[i]);
                                        let apkCheckTextLayout = new LinearLayout(ctx);
                                        apkCheckTextLayout.setOrientation(1);
                                        let apkCheckTitle = new TextView(ctx);
                                        apkCheckTitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        apkCheckTitle.setText(listData.apk[i].Title);
                                        apkCheckTitle.setTextColor(Color.BLACK);
                                        apkCheckTitle.setClickable(false);
                                        apkCheckTextLayout.addView(apkCheckTitle);
                                        let apkCheckSubtitle = new TextView(ctx);
                                        apkCheckSubtitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        apkCheckSubtitle.setText(listData.apk[i].Subtitle);
                                        apkCheckSubtitle.setClickable(false);
                                        apkCheckTextLayout.addView(apkCheckSubtitle);
                                        apkCheckLayout.addView(apkCheckTextLayout);
                                        apkCheckLayout.setClickable(true);
                                        let index = i;
                                        apkCheckLayout.setOnClickListener(new OnClickListener({
                                            onClick: function() {
                                                apkCheckBoxes[index].setChecked(!apkCheckBoxes[index].isChecked());
                                            }
                                        }));
                                        mainLayout.addView(apkCheckLayout);
                                    }
                                }

                                if (listData.other.length > 0) {
                                    let otherText = new TextView(ctx);
                                    otherText.setTextColor(Color.BLACK);
                                    if (language === "Korean") otherText.setText("기타");
                                    else otherText.setText("Others");
                                    mainLayout.addView(otherText);
                                    for (let i in listData.other) {
                                        let otherCheckLayout = new LinearLayout(ctx);
                                        otherCheckBoxes[i] = new CheckBox(ctx);
                                        otherCheckBoxes[i].setText("");
                                        otherCheckBoxes[i].setLayoutParams(new LayoutParams(width * 1, height * 2));
                                        otherCheckBoxes[i].setClickable(false);
                                        otherCheckBoxes[i].setOnCheckedChangeListener(updateListener);
                                        otherCheckLayout.addView(otherCheckBoxes[i]);
                                        let otherCheckTextLayout = new LinearLayout(ctx);
                                        otherCheckTextLayout.setOrientation(1);
                                        let otherCheckTitle = new TextView(ctx);
                                        otherCheckTitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        otherCheckTitle.setText(listData.other[i].Title);
                                        otherCheckTitle.setTextColor(Color.BLACK);
                                        otherCheckTitle.setClickable(false);
                                        otherCheckTextLayout.addView(otherCheckTitle);
                                        let otherCheckSubtitle = new TextView(ctx);
                                        otherCheckSubtitle.setLayoutParams(new LayoutParams(width * 11, height * 1));
                                        otherCheckSubtitle.setText(listData.other[i].Subtitle);
                                        otherCheckSubtitle.setClickable(false);
                                        otherCheckTextLayout.addView(otherCheckSubtitle);
                                        otherCheckLayout.addView(otherCheckTextLayout);
                                        otherCheckLayout.setClickable(true);
                                        let index = i;
                                        otherCheckLayout.setOnClickListener(new OnClickListener({
                                            onClick: function() {
                                                otherCheckBoxes[index].setChecked(!otherCheckBoxes[index].isChecked());
                                            }
                                        }));
                                        mainLayout.addView(otherCheckLayout);
                                    }
                                }

                            } catch (e) {
                                print("Error at " + e.lineNumber + " Reason: " + e);
                            }
                        }
                    }));
                });

                let mainScroll = new ScrollView(ctx);
                mainScroll.setLayoutParams(new LayoutParams(width * 12, height * 8));
                mainScroll.addView(mainLayout);
                layout.addView(mainScroll);
                let controlLayout = new LinearLayout(ctx);
                let startButton = new Button(ctx);
                if (language === "Korean") startButton.setText("다운로드");
                else startButton.setText("Start");
                startButton.setLayoutParams(new LayoutParams(width * 2, height * 2));
                let waiting = [];
                let Downloadcount = 0;
                let updateRunnable = new Runnable({
                    run: function() {
                        try {
                            if (waiting.length <= Downloadcount) return;
                            if (waiting[Downloadcount].autoDownloader.getMax() === 0){
                                if (language === "Korean") nowProgressText.setText("준비 중");
                                else nowProgressText.setText("Readying");
                            }
                            nowProgressBar.setMax(waiting[Downloadcount].autoDownloader.getMax());
                            nowProgressBar.setProgress(waiting[Downloadcount].autoDownloader.getProgress());
                            nowProgressText.setText(Math.floor(waiting[Downloadcount].autoDownloader.getProgress() / 1024 * 10) / 10 + "/" + Math.floor(waiting[Downloadcount].autoDownloader.getMax() / 1024 * 10) / 10 + "(KB)");
                        } catch (e) {
                            print("Error at " + e.lineNumber + " Reason: " + e);
                        }
                    }
                });
                let updateThread = new Thread(new Runnable({
                    run: function() {
                        try {
                            while (!Thread.currentThread().isInterrupted()) {
                                Thread.sleep(50);
                                if (waiting.length <= Downloadcount) break;
                                ctx.runOnUiThread(updateRunnable);
                            }
                        } catch (e) {
                        }
                    }
                }));
                let continueFunction = function() {
                    waiting[Downloadcount].complete = true;
                    Downloadcount++;
                    if (waiting.length > Downloadcount) {
                        waiting[Downloadcount].autoDownloader.download(function(){
                            ctx.runOnUiThread(new Runnable(continueFunction));
                        });
                        entireProgressBar.setMax(waiting.length);
                        entireProgressBar.setProgress(Downloadcount);
                        entireProgressText.setText((Downloadcount) + "/" + waiting.length);
                    } else {
                        updateThread.interrupt();
                        ctx.runOnUiThread(new Runnable({
                            run: function() {
                                try {
                                    entireProgressBar.setProgress(0);
                                    nowProgressBar.setProgress(0);
                                    if (language === "Korean") {
                                        entireProgressText.setText("완료");
                                        nowProgressText.setText("0/0(KB)");
                                        print("다운로드 완료!");
                                    } else {
                                        entireProgressText.setText("Complete");
                                        nowProgressText.setText("0/0(KB)");
                                        print("Successfully Downloaded!");
                                    }
                                } catch (e) {
                                    print("Error at " + e.lineNumber + " Reason: " + e);
                                }
                            }
                        }));
                    }
                }
                startButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {
                            if (listData === null) {
                                if (language === "Korean") print("목록 로딩 중... 잠시만 기다려 주세요!");
                                else print("Loading List... Please Wait!");
                                return;
                            }
                            for (let i in scriptCheckBoxes) {
                                if (scriptCheckBoxes[i].isChecked()) {
                                    waiting.push({
                                        autoDownloader: new AutoDownloader().setUrl(listData.script[i].URL).setPath(sdcard + "/" + listData.script[i].Path).setInstall(true).setForceInstall(true),
                                        complete: false
                                    });
                                }
                            }

                            for (let i in mapCheckBoxes) {
                                if (mapCheckBoxes[i].isChecked()) {
                                    waiting.push({
                                        autoDownloader: new AutoDownloader().setUrl(listData.map[i].URL).setPath(sdcard + "/" + listData.map[i].Path).setInstall(true).setForceInstall(true),
                                        complete: false
                                    });
                                }
                            }

                            for (let i in otherCheckBoxes) {
                                if (otherCheckBoxes[i].isChecked()) {
                                    waiting.push({
                                        autoDownloader: new AutoDownloader().setUrl(listData.other[i].URL).setPath(sdcard + "/" + listData.other[i].Path),
                                        complete: false
                                    });
                                }
                            }

                            for (let i in apkCheckBoxes) {
                                if (apkCheckBoxes[i].isChecked()) {
                                    waiting.push({
                                        autoDownloader: new AutoDownloader().setUrl(listData.apk[i].URL).setPath(sdcard + "/" + listData.apk[i].Path).setInstall(true).setForceInstall(true),
                                        complete: false
                                    });
                                }
                            }
                            if (waiting.length === 0){
                                if (language === "Korean") print("선택된 파일이 없습니다.");
                                else print("No Selected Files.");
                                return;
                            }
                            waiting[Downloadcount].autoDownloader.download(function(){
                                ctx.runOnUiThread(new Runnable(continueFunction));
                            });
                            updateThread.start();
                        } catch (e) {
                            print("Error at " + e.lineNumber + " Reason: " + e);
                        }
                    }
                }));
                controlLayout.addView(startButton);
                let progressLayout = new LinearLayout(ctx);
                progressLayout.setOrientation(1);
                let entireProgressLayout = new LinearLayout(ctx);
                let entireProgressTitle = new TextView(ctx);
                entireProgressTitle.setTextColor(Color.BLACK);
                if (language === "Korean") entireProgressTitle.setText("전체");
                else entireProgressTitle.setText("All");
                entireProgressTitle.setLayoutParams(new LayoutParams(width * 1, height * 1));
                entireProgressTitle.setGravity(Gravity.CENTER);
                entireProgressLayout.addView(entireProgressTitle);
                let entireProgressBar = new ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
                entireProgressBar.setLayoutParams(new LayoutParams(width * 6, height * 1));
                entireProgressLayout.addView(entireProgressBar);
                let entireProgressText = new TextView(ctx);
                entireProgressText.setTextColor(Color.BLACK);
                entireProgressText.setText("0/0");
                entireProgressText.setLayoutParams(new LayoutParams(width * 3, height * 1));
                entireProgressText.setGravity(Gravity.CENTER);
                entireProgressLayout.addView(entireProgressText);
                progressLayout.addView(entireProgressLayout);

                let nowProgressLayout = new LinearLayout(ctx);
                let nowProgressTitle = new TextView(ctx);
                nowProgressTitle.setTextColor(Color.BLACK);
                if (language === "Korean") nowProgressTitle.setText("현재");
                else nowProgressTitle.setText("Now");
                nowProgressTitle.setLayoutParams(new LayoutParams(width * 1, height * 1));
                nowProgressTitle.setGravity(Gravity.CENTER);
                nowProgressLayout.addView(nowProgressTitle);
                let nowProgressBar = new ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
                nowProgressBar.setLayoutParams(new LayoutParams(width * 6, height * 1));
                nowProgressLayout.addView(nowProgressBar);
                let nowProgressText = new TextView(ctx);
                nowProgressText.setTextColor(Color.BLACK);
                nowProgressText.setText("0/0(KB)");
                nowProgressText.setLayoutParams(new LayoutParams(width * 3, height * 1));
                nowProgressText.setGravity(Gravity.CENTER);
                nowProgressLayout.addView(nowProgressText);
                progressLayout.addView(nowProgressLayout);

                controlLayout.addView(progressLayout);

                layout.addView(controlLayout);

                window.setBackgroundDrawable(new ColorDrawable(Color.WHITE));
                window.showAtLocation(ctx.getWindow().getDecorView(), Gravity.CENTER | Gravity.CENTER, 0, 0);
            } catch (e) {
                print("Error at " + e.lineNumber + " Reason: " + e);
            }
        }
    }));
}

function showButton() {
    if (screenWindow !== undefined) return;
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                if (screenWindow !== undefined) return;
                let button = new Button(ctx);
                button.setText(buttonMessage);
                button.setTextColor(Color.BLACK);
                button.setOnClickListener(new OnClickListener({
                    onClick: function(v) {
                        showWindow();
                    }
                }));
                button.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(Height / 8, Height / 8));
                screenWindow = new PopupWindow(button, Height / 8, Height / 8, false);
                screenWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                screenWindow.showAtLocation(ctx.getWindow().getDecorView(), Gravity.CENTER | Gravity.RIGHT, 0, 0);
            } catch (e) {
                print("Error at " + e.lineNumber + ". Reason: " + e);
            }
        }
    }));
}

function removeButton() {
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                if (screenWindow === undefined) return;
                screenWindow.dismiss();
            } catch (e) {
                print("Error at " + e.lineNumber + ". Reason: " + e);
            }
        }
    }));
}

function newLevel() {
    removeButton();
}

function leaveGame() {
    showButton();
}
showButton();

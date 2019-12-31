(function($) {
    function renderTip(template, context) {
        var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
        // ???
        return template.replace(tokenReg, function (word, slash1, token, slash2) {
            if (slash1 || slash2) {
                return word.replace('\\', '');
            }
            var variables = token.replace(/\s/g, '').split('.');
            var currentObject = context;
            var i, length, variable;
            for (i = 0, length = variables.length; i < length; ++i) {
                variable = variables[i];
                currentObject = currentObject[variable];
                if (currentObject === undefined || currentObject === null) return '';
            }
            return currentObject;
        });
    }

    String.prototype.renderTip = function (context) {
        return renderTip(this, context);
    };

    if(getChromeVersion() >= 72){
        let element = new Image();
        Object.defineProperty(element, 'id', {
            get: function () {
                showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000, true);
            }
        });
        console.log('%c', element);
    }else{
        var re = /x/;
        console.log(re);
        re.toString = function() {
            showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000, true);
            return '';
        };
    }

    $(document).on('copy', function (){
        showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000);
    });

    // region 自定义按钮
    $('.waifu-tool .icon-home').on('click', function() {
        window.location.href = 'http://www.sunsiquan.top';
    });

    $('.waifu-tool .icon-bubble2').on('click', function() {
        showHitokoto();
    });

    $('.waifu-tool .icon-cross').on('click', function() {
        showMessage('下次见...（￣︶￣）↗', 1300);
        sessionStorage.setItem('isLive2dClosed', '1');
        window.setTimeout(function() {$('#landlord').hide();}, 1300);
    });
    // endregion

    function initTips(){
        $.ajax({
            cache: true,
            url: `${message_Path}message.json`,
            dataType: "json",
            success: function (result){
                $.each(result.mouseover, function (index, tips){
                    $(tips.selector).mouseover(function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
                });
                $.each(result.click, function (index, tips){
                    $(tips.selector).click(function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
                });
            }
        });
    }
    initTips();

    (function (){
        var text;
        if(document.referrer !== '' && document.referrer.indexOf('sunsiquan') == -1){
            var referrer = document.createElement('a');
            referrer.href = document.referrer;
            text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友！';
            var domain = referrer.hostname.split('.')[1];
            if (domain == 'baidu') {
                text = '嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            }else if (domain == 'so') {
                text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            }else if (domain == 'google') {
                text = '嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            }
        }else {
            if (window.location.href == `${home_Path}`) { //主页URL判断，需要斜杠结尾
                var now = (new Date()).getHours();
                if (now > 23 || now <= 5) {
                    text = '夜深了，早点休息吧 (～﹃～)~zZ';
                } else if (now > 5 && now <= 7) {
                    text = '一日之计在于晨 (*￣∇￣*)';
                } else if (now > 7 && now <= 11) {
                    text = '好好工作，认真学习 (๑•̀ㅂ•́)و✧加油';
                } else if (now > 11 && now <= 14) {
                    text = '吃个午饭，休息一下吧';
                } else if (now > 14 && now <= 17) {
                    text = '下午也要加油鸭 (￣▽￣)"';
                } else if (now > 17 && now <= 19) {
                    text = '夜幕将至，你在想谁？';
                } else if (now > 19 && now <= 23) {
                    text = '今天有没有去健身呢 (･ェ･。)';
                } else {
                    text = 'play with me :)';
                }
            }else {
                // 某个用于优化的插件，将title里面的-会转换成–
                // 虽然长得很像，但它们是不同的字符...
                if (document.title.indexOf('-') === -1 && document.title.indexOf('–') === -1 ) {
                    text = '你好吖！';
                } else {
                   text = '欢迎阅读<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0].split(' – ')[0] + ' 」</span>';
                }
            }
        }
        showMessage(text, 12000);
    })();

    window.setInterval(showHitokoto,30000);

    function showHitokoto(){
        $.getJSON('https://v1.hitokoto.cn/',function(result){
            showMessage(result.hitokoto, 5000);
        });
    }

    function showMessage(text, timeout){
        if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
        //console.log('showMessage', text);
        $('.message').stop();
        $('.message').html(text).fadeTo(200, 1);
        if (timeout === null) timeout = 5000;
        hideMessage(timeout);
    }

    function hideMessage(timeout){
        $('.message').stop().css('opacity',1);
        if (timeout === null) timeout = 5000;
        $('.message').delay(timeout).fadeTo(200, 0);
    }

    function getChromeVersion(){
        let match = window.navigator.userAgent.match(/chrome\/(\d+)/i);
        if(match){
            return +match[1]
        }else{
            return null
        }
    }

})(jQuery)


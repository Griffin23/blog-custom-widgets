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
        if(document.referrer !== ''){
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
                    text = 'night zzz ... ';
                } else if (now > 5 && now <= 7) {
                    text = 'morning ... ';
                } else if (now > 7 && now <= 11) {
                    text = 'morning ... ';
                } else if (now > 11 && now <= 14) {
                    text = 'noon ... ';
                } else if (now > 14 && now <= 17) {
                    text = 'afternoon ... ';
                } else if (now > 17 && now <= 19) {
                    text = 'evening ... ';
                } else if (now > 19 && now <= 21) {
                    text = 'night ... ';
                } else if (now > 21 && now <= 23) {
                    text = 'night ... ';
                } else {
                    text = 'play with me :)';
                }
            }else {
                // text = '欢迎阅读<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
                text = 'welcome here～'
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

    function initLive2d (){
        $('.hide-button').fadeOut(0).on('click', () => {
            $('#landlord').css('display', 'none')
        })
        $('#landlord').hover(() => {
            $('.hide-button').fadeIn(600)
        }, () => {
            $('.hide-button').fadeOut(600)
        })
    }
    initLive2d ();
})(jQuery)


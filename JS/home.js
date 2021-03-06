/**
 * Created by ZTHK10 on 2016/12/6.
 */
$(function () {
    $('html').height($(window).height());
    //rotate tech items
    var t = null;
    var i = 0;

    function move() {
        i++;
        $(".rotate").css({transform: "rotateY(" + (i * (60)) + "deg)"});
        t = setTimeout(move, 3000);
    }

    move();
    $(window).on("blur", function () {
        clearTimeout(t);
        t = null;
    }).on("focus", function () {
        move();
    });

    //slide main side
    function slide() {
        //var t,i=1;
        var flag = true;
        var wh = $(window).height() / 2 - 106;
        var DIV, ICON = $(".main ul.page li");
        $(".main ul.page").css({marginTop: wh});
        function sliding(DIV, ICON, i, direction) {
            //parameter i : index of next page;
            var a, b;
            if (direction == "up") {
                a = "slideDown";
                b = "slideUp"
            } else if (direction == "down") {
                b = "slideDown";
                a = "slideUp"
            }
            ICON.find("span").removeClass("active");
            ICON.eq(i).find("span").addClass("active");
            var thisDIV = $(".slide.slideActive");
            DIV.eq(i).addClass(a);
          
            DIV.eq(i)[0].offsetWidth;
            thisDIV.addClass(b).removeClass("slideActive");
            DIV.eq(i).addClass("slideActive").removeClass(a);
            $(".slideActive").one("transitionend", function () {
                $("." + b).removeClass(b);
                //transition动画结束后，flag为true,允许页面滚动事件的触发。
                flag = true;
            });
            //.emulateTransitionEnd(600)(报错，不知道原因)
        }

        var last = 0;

        function direction(i) {
            DIV = $(".slide");
            last = ICON.find("span.active").parent().index();
            if (i > last) {
                sliding(DIV, ICON, i, "up");
            } else if (i < last) {
                sliding(DIV, ICON, i, "down");
            }
        }

        ICON.click(function () {
            var i = $(this).index();
            direction(i);
        });

        //检验是否在手机显示,若是，则也具有滚轮事件
        if ($(window).width() <=768) {
            $('.sidebar').addClass('slide');
            DIV = $(".slide");
            DIV.eq(0).addClass("slideActive");
            var num = 0, index = 0;
            //创建hammer实例
            var hammer=new Hammer($('body').get(0));
            hammer.get('swipe').set({direction:Hammer.DIRECTION_ALL});
            hammer.on('swipe',function(e){
                console.log(e);
                if(e.deltaY>120){
                    swipe.up()
                }else if(e.deltaY<-120){
                    swipe.down()
                }
            });


            window.onmousewheel = function (e) {
                if (flag) {
                    flag = false;
                    var value = e.wheelDelta ? e.wheelDelta : e.detail;
                    if (value == 120 || value == 3) {
                        index = --index >= 0 ? index : 7;
                        sliding(DIV, ICON, index, "down");
                    } else if (value == -120 || value == -3) {
                        index = ++index < 8 ? index : 0;
                        sliding(DIV, ICON, index, "up");
                    }
                }
            };
            var swipe={
                down: function () {
                    num = ++num < 8 ? num : 0;
                    sliding(DIV, ICON, num, "up");
                },
                up: function () {
                    num = --num >= 0 ? num : 7;
                    sliding(DIV, ICON, num, "down");
                }
            };
        } else {
            $('.sidebar').removeClass('slide');
            DIV = $(".slide");
            $('.slide').eq(0).css('display','block');
            DIV.eq(0).addClass("slideActive");
            ICON.eq(0).find("span").addClass("active");
            //滚轮事件Firefox 使用detail，其余四类使用wheelDelta，detail与wheelDelta只各取两个 值，detail只取±3，wheelDelta只取±120，其中正数表示为向上，负数表示向下。
            window.onmousewheel = function (e) {
                if (flag) {
                    //flag控制一个页面动画结束后再进行第二个页面的滚动。
                    flag = false;
                    last = ICON.find("span.active").parent().index();
                    var i = last;
                    var value = e.wheelDelta ? e.wheelDelta : e.detail;
                    if (value == 120 || value == 3) {
                        i = --i >= 0 ? i : 6;
                    } else if (value == -120 || value == -3) {
                        i = ++i < 7 ? i : 0;
                    }
                    direction(i);
                }
            };
            //click sidebar wrap, then main page jump to "my work"
            $(".sidebar .wrap .rotate>div").click(function () {
                direction(1);
            })

        }


    }

    slide();



});
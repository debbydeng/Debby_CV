/**
 * Created by ZTHK10 on 2016/12/6.
 */
$(function(){
    //rotate tech items
    var t=null;var i=0;
    function move(){
        i++;
        $(".rotate").css({transform:"rotateY("+(i*(60))+"deg)"});
        t=setTimeout(move,3000);
    }
    move();
    $(window).on("blur",function(){
        clearTimeout(t);
        t=null;
    }).on("focus",function(){
       move();
    });

    //slide main side
    function slide(){
        //var t,i=1;
        var flag=true;
        var wh=$(window).height()/2-106;
        var DIV=$(".main>div"),ICON=$(".main ul.page li");
        $(".main ul.page").css({marginTop:wh});
        DIV.eq(0).addClass("slideActive");
        ICON.eq(0).find("span").addClass("active");

        function sliding(DIV,ICON,i,direction){
            //parameter i : index of next page;
            var a,b;
            if(direction=="up"){
                a="slideDown";
                b="slideUp"
            }else if(direction=="down"){
                b="slideDown";
                a="slideUp"
            }
            ICON.find("span").removeClass("active");
            ICON.eq(i).find("span").addClass("active");
            var thisDIV=$(".main>div.slideActive");
            DIV.eq(i).addClass(a);
            DIV.eq(i)[0].offsetWidth;
            thisDIV.addClass(b).removeClass("slideActive");
            DIV.eq(i).addClass("slideActive").removeClass(a);
$(".slideActive").one("transitionend",function(){
    $(".main").find("."+b).removeClass(b);
    //transition动画结束后，flag为true,允许页面滚动事件的触发。
    flag=true;
});
    //.emulateTransitionEnd(600)(报错，不知道原因)
        }
        var last=0;
        function direction(i){
            last=ICON.find("span.active").parent().index();
            if(i>last){
                sliding(DIV,ICON,i,"up");
            }else if(i<last){
                sliding(DIV,ICON,i,"down");
            }
        }

        ICON.click(function(){
            var i=$(this).index();
            direction(i);
        });
//滚轮事件Firefox 使用detail，其余四类使用wheelDelta，detail与wheelDelta只各取两个 值，detail只取±3，wheelDelta只取±120，其中正数表示为向上，负数表示向下。

            window.onmousewheel=function(e){
                if(flag){
                //flag控制一个页面动画结束后再进行第二个页面的滚动。
                flag=false;
                last=ICON.find("span.active").parent().index();
                var i=last;
                var value=e.wheelDelta? e.wheelDelta : e.detail;
                if(value==120||value==3){
                    i=--i>=0? i : 6;
                }else if(value==-120||value==-3){
                    i=++i<7? i : 0;
                }
                direction(i);
            }
        };

        //click sidebar wrap, then main page jump to "my work"
        $(".sidebar .wrap .rotate>div").click(function(){
            direction(1);
        })
    }
    slide();










});
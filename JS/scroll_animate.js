/**
 * Created by ZTHK10 on 2016/11/15.
 */
window.scrollReveal=(function(window){
    var nextId=1;
    var requestAnimFrame=(function(){
        return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback){
                window.setTimeout(callback,1000 / 60);
            }
    }());

    function scrollReveal(options){
        this.options=this.extend(this.defaults,options);
        this.docElem=this.options.elem;
        this.styleBank={};

        if(this.options.init==true) this.init();
    }

    scrollReveal.prototye={
        defaults:{
            after: "0s",
            enter:"bottom",
            move:"24px",
            over:"0.66s",
            easing:"ease-in-out",
            opacity:0,
            complete:function(){},
            viewportFactor:0.33,
            reset:false,
            init:true,
            elem:window.document.documentElement
        },

        init:function(){
            this.scrolled=false;
            var self=this;
            this.elems=Array.prototype.slice.call(this.docElem.querySelectorAll("[data-scroll-reveal]"));
            this.elems.forEach(function(el,i){
                var id=el.getAttribute("data-scroll-reveal-id");
                if(!id){
                    id=nextId++;
                    el.setAttribute("data-scroll-reveal-id",id);
                }
                if(!self.styleBank[id]){
                    self.styleBank[id]=el.getAttribute("style");
                }
                self.update(el);
            });

            var scrollHandler=function(e){
                if(!self.scrolled){
                    self.scrolled=true;
                    requestAnimFrame(function(){
                        self._scrollPage();
                    });
                }
            };

            var resizeHandler=function(){
                if(self.resizeTimeout){
                    clearTimeout(self.resizeTimout);
                }
                function delayed(){
                    self._scrollPage();
                    self.resizeTimeout=null;
                }
                self.resizeTimeout=setTimeout(delayed,200);
            };

            if(this.docElem==window.document.documentElement){
                window.addEventListener("scroll",scrollHandler,false);
                window.addEventListener("resize",resizeHandler,false);
            }else{
                this.docElem.addEventListener("scroll",resizeHandler,false);
            }
        },

        _scrollPage:function(){
            var self=this;
            this.elems.forEach(function(el,i){
                self.update(el);
            });
            this.scrolled=false;
        },
        parseLanguage:function(el){
            var words=el.getAttribute("data-scroll-reveal").split(/[, ]+/),
                parsed={};
            function filter(words){
                var ret=[],
                    blacklist=[
                        "from","the","and","then","but","with"
                    ];
                words.forEach(function(word,i){
                    if(blacklist.indexOf(word)>-1){return}
                    ret.push(word);
                });
                return ret;
            }
            words=filter(words);
            words.forEach(function(word,i){
                switch(word){
                    case "enter":
                        parsed.enter=words[i+1];
                        return;
                    case "after":
                        parsed.after=words[i+1];
                        return;
                    case "wait":
                        parsed.wait=words[i+1];
                        return;
                    case "move":
                        parsed.move=words[i+1];
                        return;
                    case "ease":
                        parsed.move=words[i+1];
                        parsed.ease = "ease";
                        return;
                    case "ease-in":
                        parsed.move=words[i+1];
                        parsed.easing = "ease-in";
                        return;
                    case "ease-in-out":
                        parsed.move=words[i+1];
                        parsed.easing = "ease-in-out";
                        return;
                    case "ease-out":
                        parsed.move = words[i + 1];
                        parsed.easing = "ease-out";
                        return;
                    case "over":
                        parsed.over=words[i+1];
                        return;
                    default:
                        return;
                }
            });
            return parsed;
        },
        update:function(el){
            var that=this;
            var css=this.genCSS(el);
            var style=this.styleBank[el.getAttribute("data-scroll-reveal-id")];
            if(style!=null)style+=";"; else style="";
            if(!el.getAttribute("data-scroll-reveal-initialized")){
                el.setAttribute("style",style+css.initial);
                el.setAttribute("data-scroll-reveal-initialized",true);
            }
            if(!this.isElementInViewport(el,this.options.viewportFactor)){
                if(this.options.reset){
                    el.setAttribute("style",style+css.initial+css.reset);
                }
                return
            }
            if(el.getAttribute("data-scroll-reveal-complete")) return;
            if(this.isElementInViewport(el,this.options.viewportFactor)){
                el.setAttribute("style",style+css.target+css.transition);

                if(!this.options.reset){
                    setTimeout(function(){
                        if(style!=""){
                            el.setAttribute("style",style);
                        }else{
                            el.removeAttribute("style");
                        }
                        el.setAttribute("date-scroll-reveal-complete",true);
                        that.options.complete(el);
                    },css.totalDuration);
                }
                return;
            }
        },

        genCSS:function(el){
            var parsed=this.parseLanguage(el);
            var enter,axis;
            if(parsed.enter){
                if(parsed.enter=="top"||parsed.enter=="bottom"){
                    enter=parsed.enter;
                    axis="y";
                }
                if(parsed.enter=="left"||parsed.enter=="right"){
                    enter=parsed.enter;
                    axis="x";
                }
            }else{
                if(this.options.enter=="top"||this.options.enter=="top"){
                    enter=this.options.enter;
                    axis="y";
                }
                if(this.options.enter=="left"||this.options.enter=="right"){
                    enter=this.options.enter;
                    axis="x";
                }
            }

            if(enter=="top"||enter=="left"){
                if(parsed.move){
                    parsed.move="-"+parsed.move;
                }else{
                    parsed.move="-"+this.options.move;
                }
            }
            var dist=parsed.move||this.options.move,
                dur=parsed.over||this.options.over,
                delay=parsed.after||this.options.after,
                easing=parsed.easing||this.options.easing,
                opacity=parsed.opacity||this.options.opacity;
            var transition="-webkit-transition:-webkit-transform"+dur+" "+easing+" "+delay+", opacity"+dur+" "+easing+" "+de
        }
    }


})(window);
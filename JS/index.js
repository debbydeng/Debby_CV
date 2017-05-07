/**
 * Created by ZTHK10 on 2016/11/29.
 */
$(function(){
    //fireworks Canvas animation
    var flag=1; //detect if first time load the web;
    var cw=$(window).width(),ch=$(window).height();
    var canvas=$("#canvas")[0];
    canvas.width=cw;canvas.height=ch;
    var ctx=canvas.getContext("2d");
    var hue;
    var  fireworks=[],particles=[],req=null;
    var limiterTotal=5,limiterTick=0,timerTotal=80,timerTick=0;
    var mousedown=false;
    var mx, my;
    function random(a,b){
        return Math.random()*(b-a)+a;
    }
    function calculateDistance(x1,y1,x2,y2){
        var difx=x1-x2;
        var dify=y1-y2;
        return Math.sqrt(Math.pow(difx,2)+Math.pow(dify,2));
    }
    function Firework(sx,sy,tx,ty){

        this.x=sx;
        this.y=sy;
        this.sx=sx;
        this.sy=sy;
        this.tx=tx;
        this.ty=ty;
        this.hue=random(0,360);

        this.distancetoTarget=calculateDistance(sx,sy,tx,ty);
        this.distanceTraveled=0;

        this.coordinates=[];
        this.coordinateCount=3;
        while(this.coordinateCount--){
            this.coordinates.push([this.x,this.y]);
        }


        this.angle=Math.atan2(ty-sy,tx-sx);
        this.speed=2;
        this.acceleration=1.05;

        this.brightness=random(50,70);

        this.targetRadius=1;
    }

    Firework.prototype.update=function(index){

        this.coordinates.pop();
        this.coordinates.unshift([this.x,this.y]);

      /**this use to create a circle in target place!
        if(this.targetRadius<8){
            this.targetRadius+=0.3;
        }else{
            this.targetRadius=1;
        }
**/
        this.speed*=this.acceleration;
        var vx=Math.cos(this.angle)*this.speed;
        var vy=Math.sin(this.angle)*this.speed;
        this.distanceTraveled=calculateDistance(this.sx,this.sy,this.x+vx,this.y+vy);

        if(this.distanceTraveled>=this.distancetoTarget){
            hue=this.hue;
            createParticles(this.tx, this.ty);
            fireworks.splice(index,1);

        }else{
            this.x+=vx;
            this.y+=vy;
        }
    };

    Firework.prototype.draw=function(){
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle="hsl("+this.hue+",100%,"+this.brightness+"%)";
        ctx.stroke();


    };

    function createfireworks(){
        var i=10;
        while(i--){
            fireworks.push(new Firework(cw/2,ch,random(0,cw),random(0,ch/2)))
        }
    }

    function Particle(x,y){
        this.x=x;
        this.y=y;
        this.coordinates=[];
        this.coordinateCount=7;
        while(this.coordinateCount--){
            this.coordinates.push([this.x,this.y]);
        }
        this.angle=random(0,Math.PI*2);
        this.speed=random(1,15);
        this.friction=0.95;
        this.gravity=1;
        this.hue=random(hue-20,hue+20);
        this.brightness=random(50,80);
        this.alpha=1;

        this.decay=random(0.015,0.03);
    }
    Particle.prototype.update=function(index){
        this.coordinates.pop();
        this.coordinates.unshift([this.x,this.y]);
        this.speed*=this.friction;
        this.x+=Math.cos(this.angle)*this.speed;
        this.y+=Math.sin(this.angle)*this.speed+this.gravity;
        this.alpha-=this.decay;

        if(this.alpha<=this.decay){

            particles.splice(index,1);
        }
    };
    Particle.prototype.draw=function(){
        ctx. beginPath();
        // move to the last tracked coordinates in the set, then draw a line to the current x and y
        ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
        ctx.lineTo( this.x, this.y );
        ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        ctx.stroke();
    };
    function createParticles(x,y){
        var particleCount=60;
        while(particleCount--){
            particles.push(new Particle(x,y));
        }
    }


    function loop(){
        req= requestAnimationFrame(loop);

        ctx.globalCompositeOperation="destination-out";
        ctx.fillStyle= 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0,0,cw,ch);
        ctx.globalCompositeOperation = 'lighter';

if(flag==1){
    createfireworks();
    flag++
}else{
    if(timerTick>=timerTotal){
        if(!mousedown){
            createfireworks();

            timerTick=0;
        }
    }else{
        timerTick++;
    }
}

        if(limiterTick>=limiterTotal){

            if(mousedown){
                fireworks.push(new Firework(cw/2,ch,mx,my));
                limiterTick=0;
            }
        }else{
            limiterTick++;
        }

        var i=fireworks.length;
        while(i--){
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        var i = particles.length;

        while(i--){
            particles[i].draw();
            particles[i].update(i);
        }



    }
    canvas.addEventListener( 'mousemove', function( e ) {
        mx = e.pageX - canvas.offsetLeft;
        my = e.pageY - canvas.offsetTop;
    });

// toggle mousedown state and prevent canvas from being selected
    canvas.addEventListener( 'mousedown', function( e ) {

        e.preventDefault();
        mousedown = true;
    });

    canvas.addEventListener( 'mouseup', function( e ) {
        e.preventDefault();
        mousedown = false;
    });

    loop();

    $(".enter").click(function(){
        window.location.href="home.html";
    })

    
});
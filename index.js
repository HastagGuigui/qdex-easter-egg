var myGamePiece;
var myObstacles = [];
var myScore;
var myHighscoreElement;
var background;
var backupBG;
var hasStarted = false;

var currentIntScore = 0;
var IntHighscore = 0;
var previousHighscore = 0;

var gameSpeed = 5;
var spawnInterval = 25;

var titleScreen = {
    init : function() {
        myGameArea.start();
        background = new component(myGameArea.canvas.width, myGameArea.canvas.height, "assets/background.png", 0,0, "image", 0, 0)
    },
    update : function() {
        myGameArea.context.fillStyle = "#00000064"
        myGameArea.context.fillRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height)
    
        myGameArea.context.fillStyle = "#ffffff";
        myGameArea.context.textAlign = "center";
        ctx.font = "30px Consolas";
        myGameArea.context.fillText("Qdex's not-so-secret game", myGameArea.canvas.width/2, 100);
        myGameArea.context.fillText("Press SPACE to start", myGameArea.canvas.width/2, 150);
        ctx.font = "20px Consolas";
        myGameArea.context.textAlign = "left";
        myGameArea.context.fillText("Use the arrow keys UP and DOWN to move.", myGameArea.canvas.width*0.01, myGameArea.canvas.height * 0.99);
        ctx.font = "10px Consolas";
        myGameArea.context.textAlign = "right";
        myGameArea.context.fillText("A game by #Guigui", myGameArea.canvas.width * 0.99, myGameArea.canvas.height * 0.99);
    }
}

function startGame() {
    clearInterval(myGameArea.interval);
    if(typeof(Storage) !== "undefined"){
        if(localStorage.getItem("qdexGame") != undefined){
            var output = localStorage.getItem("qdexGame.highscore")
            console.log(output)
            IntHighscore = output
        }else{
            localStorage.setItem("qdexGame.highscore", 0);
        }
    }else{
        var p = document.createElement("P")
        var t = document.createTextNode("Note: your highscore won't be saved due to no Web Storage support. I'm sorry in advance. :(")
        p.appendChild(t);
    }
    myGamePiece = new component(68, 68, "assets/he literally flyin bruh.png", 10, 120, "player", 0, 0, {
        x:10,y:20,width:50,height:28
    });
    previousHighscore = IntHighscore;
    gameSpeed = 5
    spawnInterval = 25
    myGameArea.start();
    background = new component(myGameArea.canvas.width, myGameArea.canvas.height, "assets/background.png", 0,0, "image", 0, 0)
    myScore = new component("30px", "Consolas", "black", myGameArea.canvas.width - 40, 40, "text", 0, 0, {align:"right"});
    myHighscoreElement = new component("12px", "Consolas", "black", myGameArea.canvas.width-40, 70, "text", 0, 0, {align:"right"});
}       

var myGameArea = {
    canvas : document.getElementById("guiGame"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(0,0,this.canvas.width, this.canvas.height)
    }
}

function component(width, height, color, x, y, type, initialSpeedX, initialSpeedY, hitbox) {
    if (!initialSpeedX){
        initialSpeedX = 0
    }
    if (!initialSpeedY){
        initialSpeedY = 0
    }
    if (!hitbox){
        hitbox = {
            x:0,
            y:0,
            width:width,
            height:height,
        }
    }
    this.type = type;
    if (type.startsWith("image") || type == "player" || type == "player.dead"){
        this.image = new Image();
        this.image.src = color;
    }
    this.isDead = false;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = initialSpeedX;
    this.speedY = initialSpeedY;
    this.hitbox = hitbox;
    this.x = x;
    this.y = y;
    this.rotationSpeed = 0;
    this.glitchedColors = [];
    this.update = function(frame) {
        ctx = myGameArea.context;
        let frameWidth = 34;
        let frameHeight = 34;
        switch (this.type) {
            case "player":
                ctx.mozImageSmoothingEnabled = false;  // firefox
                ctx.imageSmoothingEnabled = false;

                // Rows and columns start from 0
                let row = 0;
                let column = Math.round(frame/10%3);

                ctx.drawImage(this.image, column*frameWidth, row*frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
            break;

            case "player.dead":
                ctx.mozImageSmoothingEnabled = false;  // firefox
                ctx.imageSmoothingEnabled = false;
                drawRotated(this.x+(this.width/2), this.y+(this.height/2), ctx, (frame*10)%360, this.width, this.height, this.image, {sx:4*frameWidth, sy:0*frameHeight, sw:frameWidth, sh:frameHeight})
                //ctx.drawImage(this.image, 4*frameWidth, 0*frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
            break;

            case "text":
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.textAlign = hitbox.align || "left";
                ctx.fillText(this.text, this.x, this.y);
            break;

            case "glitch":
                if(myGameArea.frameNo % 4 == 0){
                    this.glitchedColors = [];
                    for (let x = 0; x < 4; x++) {
                        for (let y = 0; y < 4; y++) {
                            var randomInt = Math.floor(Math.random()*16777215);
                            var glitchedColor = "#"+randomInt.toString(16)
                            ctx.fillStyle = glitchedColor;
                            this.glitchedColors.push(glitchedColor)
                            ctx.fillRect(this.x+(x*(this.width/4)), this.y+(y*(this.height/4)), this.width/4, this.height/4)
                        }
                    }
                }else{
                    for (let x = 0; x < 4; x++) {
                        for (let y = 0; y < 4; y++) {
                            var glitchedColor = this.glitchedColors[x*4+y];
                            ctx.fillStyle = glitchedColor;
                            ctx.fillRect(this.x+(x*(this.width/4)), this.y+(y*(this.height/4)), this.width/4, this.height/4)
                        }
                    }
                }

            break;

            case "image":
                //console.log(background.x);
                ctx.mozImageSmoothingEnabled = false;  // firefox
                ctx.imageSmoothingEnabled = false;

                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.image, this.x+this.width, this.y, this.width, this.height);
                if(hasStarted){
                    if(!myGamePiece.isDead){
                        this.x -= Math.floor(gameSpeed/2)-1;
                    }
                    if(this.x < -myGameArea.canvas.width+2){
                        background.x=0;
                    }
                }
            break;

            case "image.static":
                ctx.mozImageSmoothingEnabled = false;  // firefox
                ctx.imageSmoothingEnabled = false;

                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            break;
        
            default:
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            break;
        }
    }
    this.newPos = function() {
        if (this.type != "image"){
            this.x = Math.min(Math.max(this.x+this.speedX,-this.width), myGameArea.canvas.width+this.width);
            if(this.type == "player"){
                this.y = Math.min(Math.max(this.y+this.speedY,0), myGameArea.canvas.height);
                this.hitBottom();
            }else{
                this.y = Math.min(Math.max(this.y+this.speedY,0), myGameArea.canvas.height+this.height);
            }
        }else{
            this.x += this.speedX
            this.y += this.speedY
        }
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x+this.hitbox.x;
        var myright = myleft + (this.hitbox.width);
        var mytop = this.y+this.hitbox.y;
        var mybottom = mytop + (this.hitbox.height);
        var otherleft = otherobj.x + otherobj.hitbox.x;
        var otherright = otherleft + (otherobj.hitbox.width);
        var othertop = otherobj.y + otherobj.hitbox.y;
        var otherbottom = othertop + (otherobj.hitbox.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y, minY, maxY;
    myGameArea.frameNo += 1;
    myGameArea.clear();
    background.update(myGameArea.frameNo);
    if(hasStarted){
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                gameOver();
                localStorage.setItem("qdexGame.highscore", IntHighscore);
                console.log("Saving Highscore... (which is "+IntHighscore+" btw)")
                return;
            } 
        }
        if(!myGamePiece.isDead){
            minY = 10;maxY = 260;
            y = Math.floor(Math.random()*(maxY-minY+1)+minY);

            if (myGameArea.frameNo == 1 || everyinterval(spawnInterval)) {
                x = myGameArea.canvas.width;
                myObstacles.push(new component(20, 20, "green", x, y, "glitch", -gameSpeed, 0));
            }
            if(everyinterval(300)){
                accelerate(1);
                myObstacles.forEach(x=>{
                    x.speedX = -gameSpeed;
                })
            }
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].newPos();
                if(myObstacles[i].x < -4 && myObstacles[i].length > 1){
                    myObstacles = myObstacles.shift();
                }
                myObstacles[i].update();
            }
            currentIntScore = Math.round(myGameArea.frameNo/10);
            if(currentIntScore > IntHighscore){
                IntHighscore = currentIntScore;
            }
            myScore.text="SCORE: " + currentIntScore;
            myScore.update(myGameArea.frameNo);
            myHighscoreElement.text = "HIGHSCORE: "+IntHighscore;
            myHighscoreElement.update(myGameArea.frameNo);
            myGamePiece.newPos();
            myGamePiece.update(myGameArea.frameNo);
        }else{
            gameOver()
        }
    }else{
        titleScreen.update();
    }
}

function drawRotated(x, y, context, degrees, width, height, image, {sx,sy,sw,sh}){
    if(!width){width = image.width}
    if(!height){height = image.height}
    if(!sx){sx = 0};
    if(!sy){sy = 0};
    if(!sw){sw = width};
    if(!sh){sh = height};
    context.translate(x,y);

    context.rotate(degrees*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    context.drawImage(image,sx,sy,sw,sh,-width/2,-height/2,width,height);

    context.setTransform(1,0,0,1,0,0);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    gameSpeed += n;
    spawnInterval -= Math.round(n+(gameSpeed/15))
    spawnInterval = Math.max(spawnInterval, 8)
    console.log("its getting faster (speed = "+gameSpeed+", spawn interval = "+spawnInterval+") because it's "+myGameArea.frameNo);
}

function gameOver() {
    myGamePiece.isDead = true;
    myGamePiece.type = "player.dead";
    myGamePiece.speedX = -5
    myGamePiece.speedY = 2.5
    myGamePiece.update(myGameArea.frameNo);
    myScore.update();
    myHighscoreElement.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
    }
    myGameArea.context.fillStyle = "#00000064"
    myGameArea.context.fillRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height)

    myGameArea.context.fillStyle = "#ffffff";
    myGameArea.context.textAlign = "center";
    ctx.font = "30px Consolas";
    myGameArea.context.fillText("Game over!", myGameArea.canvas.width/2, 50);
    myGameArea.context.fillText("Final score: "+currentIntScore+" points", myGameArea.canvas.width/2, 100);
    if(IntHighscore > previousHighscore){
        ctx.font = "15px Consolas";
        myGameArea.context.fillText("NEW HIGHSCORE !",myGameArea.canvas.width*0.625, 120)
    }
    ctx.font = "25px Consolas";
    myGameArea.context.fillText("Press SPACE to continue", myGameArea.canvas.width/2, myGameArea.canvas.height*0.75);
    myGamePiece.newPos();
}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "Down":
        case "ArrowDown":
            myGamePiece.speedY = 5;
        break;

        case "Up":
        case "ArrowUp":
            myGamePiece.speedY = -5;
        break;

        case " ":
            if(hasStarted == false){
                hasStarted = true;
                startGame();
            }else {
                if(myGamePiece.isDead){
                    myGamePiece.isDead = false;
                    myGamePiece.type = "player";
                    myObstacles = [];
                    myGameArea.frameNo = 0;
                    background.x = 0;
                    gameSpeed = 5;
                    spawnInterval = 25;
                    myGamePiece.x = 10;
                    myGamePiece.y = 120;
                    myGamePiece.speedX = 0;
                    myGamePiece.speedY = 0;
                    previousHighscore = IntHighscore
                    //startGame();
                }
            }
        break;
    
        default:
            break;
    }
})

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case "Down":
        case "ArrowDown":
        case "Up":
        case "ArrowUp":
            myGamePiece.speedY = 0
        break;
    
        default:
        break;
    }
})

//this is literally my first ever game in canvas sorry in advance
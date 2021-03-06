var fimDeJogo, fimimg, reinicioimg, restart, restartimg;
var trex, trex_correndo, trex_parado;
var solo, soloimg;
var soloinvisivel;
var nuvemimg;
var pontuacao = 0;
var tempoSomFim0 = 60;
var Obs_1, Obs_2, Obs_3, Obs_4, Obs_5, Obs_6;
var somSalto, somFim, somPonto;
var soloVx0 = -7;
var delGrav = 0.5;

var JOGAR = 1;
var ENCERRAR = 0;
var estado = JOGAR;



function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_parado = loadAnimation("trex_collided.png");
  soloimg = loadImage("ground2.png");
  nuvemimg = loadImage("cloud.png");
  Obs_1 = loadImage("obstacle1.png");
  Obs_2 = loadImage("obstacle2.png");
  Obs_3 = loadImage("obstacle3.png");
  Obs_4 = loadImage("obstacle4.png");
  Obs_5 = loadImage("obstacle5.png");
  Obs_6 = loadImage("obstacle6.png");

  fimimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");

  somSalto = loadSound("jump.mp3");
  somFim = loadSound("die.mp3");
  somPonto = loadSound("checkPoint.mp3");
}

function setup() {
  
  createCanvas(windowWidth, 200);//windowHeight
  //height, width -> essas são criadas junto ao canvas e armazenam a altura e largura, respectivamente do canvas

  //criar grupos para as nuvens e obstáculos:
  grupoNuvens = createGroup();
  grupoObstaculos = createGroup();

  //texto de Fim de jogo:
  fimDeJogo = createSprite(width/2, 100);
  fimDeJogo.addImage(fimimg);
  fimDeJogo.scale = 0.5;
  fimDeJogo.visible = false;

  restart = createSprite(width/2, 150);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;

  //criar um sprite do trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("runing", trex_correndo);
  trex.addAnimation("parado", trex_parado);
  trex.scale = 0.5;
  //trex.debug = true;
  //trex.setCollider("rectangle", 0, 0, trex.width+200, trex.height);

  trex.setCollider("circle", 0, 0, 40);

  //criar uma sprite para o solo
  solo = createSprite(200, 195, 400, 20);
  solo.addImage(soloimg);
  solo.velocityX = soloVx0;

  //criar solo invisivel
  soloinvisivel = createSprite(200, 200, 400, 5);

  //console.log("OI"+" "+"Mundo");
}

function draw() {
  background("white");
  // console.log("este é o estado: " + estado);
  
  if (estado === JOGAR) {
    geranuvem();
    geraObstaculos();
    
    // pontuacao:
    pontuacao = pontuacao + Math.round(frameRate()/60) ;    

    // nível:
    solo.velocityX = soloVx0 - (3 * pontuacao)/500;
    tempoSomFim = tempoSomFim0;
  } else {
    trex.changeAnimation("parado");
    solo.velocityX = 0;
    
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);    
    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);

    fimDeJogo.visible = true;
    restart.visible = true;
    fimDeJogo.depth = grupoNuvens.depth + 10;
    restart.depth = grupoNuvens.depth + 10;
    tempoSomFim = tempoSomFim - Math.round(frameRate()/60);
  }
  if (grupoObstaculos.isTouching(trex)) {
    
    estado = ENCERRAR;
    //trex.velocityY = -10;
    //somSalto.play();
    if (tempoSomFim > 0) {
      //somFim.play();
      //console.log(tempoSomFim);
    }
  }
  if((mousePressedOver(restart)|| touches.length >0)){
    //console.log("reiniciar o jogo");
    touches = [];
    reset();
  }

  if (pontuacao > 0 && pontuacao % 500 === 0) {
    somPonto.play();
    solo.velocityX = solo.velocityX - 1;
    delGrav = delGrav + 0.05;
  }
  

  //controle de salto do trex
  if ((keyDown("space")|| touches.length >0)&& trex.y >= 160) {
    trex.velocityY = -10;
    somSalto.play();
  }
  //gravidade
  trex.velocityY = trex.velocityY + delGrav;
  console.log(touches)
  //colisao com o soloinvisivel
  trex.collide(soloinvisivel);
  soloinvisivel.visible = false;

  //reinicia solo => solo infinito:
  if (solo.x < 0) {
    solo.x = solo.width / 2;
  }

  drawSprites();
  text("Pontuação: " + pontuacao + " seg", width*0.9, 20);
}

function reset(){
  
  pontuacao = 0;
  
  fimDeJogo.visible = false;
  restart.visible = false;
  
  grupoNuvens.destroyEach();
  grupoObstaculos.destroyEach();
  
  trex.changeAnimation("runing");
  
  estado = JOGAR;
  solo.velocityX = soloVx0;
  
  
  
}
function geranuvem() {
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(width+1, 150, 40, 10);
    nuvem.velocityX = -3;

    //tempo de vida:
    nuvem.lifetime = Math.abs(width / nuvem.velocityX);

    //adiona a imagem:
    nuvem.addImage(nuvemimg);

    //adiciona posição aleatória:
    nuvem.y = Math.round(random(1, 125));

    //dimensiona:
    //nuvem.scale = 0.4;
    nuvem.scale = random(0.25, 0.6);

    //profundidade:
    //trex.depth = nuvem.depth + 10;
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoNuvens.add(nuvem);
     
  }
}

function geraObstaculos() {
  if (frameCount % 60 === 0) {
    var obstaculo = createSprite(width+1, 178, 10, 40);
    obstaculo.velocityX = solo.velocityX;

    var tipoObstaculo = Math.round(random(1, 6));

    switch (tipoObstaculo) {
      case 1:
        obstaculo.addImage(Obs_1);
        break;
      case 2:
        obstaculo.addImage(Obs_2);
        break;
      case 3:
        obstaculo.addImage(Obs_3);
        break;
      case 4:
        obstaculo.addImage(Obs_4);
        break;
      case 5:
        obstaculo.addImage(Obs_5);
        break;
      case 6:
        obstaculo.addImage(Obs_6);
        break;
    }

    obstaculo.scale = 0.5;
    //obstaculo.debug = true;
    obstaculo.lifetime = Math.abs(width / obstaculo.velocityX);
    grupoObstaculos.add(obstaculo);
    obstaculo.depth = restart.depth-1;
  }
  
  
}

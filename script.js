// ===============================
// PEGUE O OSSO - SCRIPT
// PARTE 1
// ===============================

const gameArea = document.getElementById("gameArea");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const recordEl = document.getElementById("record");

const finalScore = document.getElementById("finalScore");
const message = document.getElementById("message");

const startScreen = document.getElementById("startScreen");
const gameOver = document.getElementById("gameOver");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const dog = document.getElementById("dog");

let score = 0;
let time = 30;

let gameRunning = false;

let spawnSpeed = 1000;
let fallSpeed = 5;

let timerInterval;
let spawnInterval;

const goodItems = [

    {
        emoji:"🦴",
        points:1
    },

    {
        emoji:"🍖",
        points:2
    },

    {
        emoji:"🧀",
        points:3
    },

    {
        emoji:"⭐",
        points:5
    }

];

const badItems = [

    {
        emoji:"💣",
        points:-3
    },

    {
        emoji:"🥦",
        points:-1
    },

    {
        emoji:"🌶️",
        points:-2
    }

];

recordEl.textContent = localStorage.getItem("recordMercadoPet") || 0;

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

function startGame(){

    document.querySelectorAll(".item").forEach(item=>item.remove());

    score = 0;
    time = 30;

    scoreEl.textContent = score;
    timerEl.textContent = time;

    spawnSpeed = 1000;
    fallSpeed = 5;

    gameRunning = true;

    startScreen.classList.add("hidden");
    gameOver.classList.add("hidden");

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    timerInterval = setInterval(updateTimer,1000);

    spawnInterval = setInterval(createItem,spawnSpeed);

}// ===============================
// PARTE 2
// ===============================

function updateTimer(){

    if(!gameRunning) return;

    time--;

    timerEl.textContent = time;

    if(time===20){

        spawnSpeed=800;
        clearInterval(spawnInterval);
        spawnInterval=setInterval(createItem,spawnSpeed);

    }

    if(time===10){

        spawnSpeed=600;
        fallSpeed=4;

        clearInterval(spawnInterval);
        spawnInterval=setInterval(createItem,spawnSpeed);

    }

    if(time<=0){

        endGame();

    }

}

function createItem(){

    if(!gameRunning) return;

    const item=document.createElement("div");

    item.classList.add("item");

    let data;

    if(Math.random()<0.75){

        data=goodItems[Math.floor(Math.random()*goodItems.length)];
        item.classList.add("good");

    }else{

        data=badItems[Math.floor(Math.random()*badItems.length)];
        item.classList.add("bad");

    }

    item.dataset.points=data.points;

    item.innerHTML=data.emoji;

    item.style.left=Math.random()*330+20+"px";

    item.style.animationDuration=fallSpeed+"s";

    item.addEventListener("click",collectItem);

    item.addEventListener("animationend",()=>{

        item.remove();

    });

    gameArea.appendChild(item);

}

function collectItem(e){

    if(!gameRunning) return;

    const item=e.currentTarget;

    dog.classList.add("jump");

    setTimeout(()=>{

        dog.classList.remove("jump");

    },150);

    const pts=parseInt(item.dataset.points);

    score+=pts;

    if(score<0){

        score=0;

    }

    scoreEl.textContent=score;

    showPoints(item,pts);

    item.remove();

}// ===============================
// PARTE 3
// ===============================

function showPoints(item, pts){

    const pop=document.createElement("div");

    if(pts>=0){

        pop.className="plus";
        pop.innerHTML="+"+pts;

    }else{

        pop.className="minus";
        pop.innerHTML=pts;

    }

    pop.style.left=item.offsetLeft+"px";
    pop.style.top=item.offsetTop+"px";

    gameArea.appendChild(pop);

    setTimeout(()=>{

        pop.remove();

    },800);

}

function endGame(){

    gameRunning=false;

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    document.querySelectorAll(".item").forEach(item=>{

        item.remove();

    });

    finalScore.textContent=score;

    let texto="";

    if(score<15){

        texto="🐶 Continue treinando!";

    }else if(score<30){

        texto="👏 Muito bem!";

    }else if(score<50){

        texto="🎉 Excelente!";

    }else{

        texto="🏆 Você é um Mestre do Mercado Pet!";

    }

    message.innerHTML=texto;

    const record=parseInt(localStorage.getItem("recordMercadoPet"))||0;

    if(score>record){

        localStorage.setItem("recordMercadoPet",score);

        recordEl.textContent=score;

    }

    gameOver.classList.remove("hidden");

    if(typeof confetti==="function"){

        confetti({

            particleCount:180,
            spread:120,
            origin:{y:0.6}

        });

    }

}// ===============================
// PARTE 4
// ===============================

// Ajusta a posição dos itens para telas menores
window.addEventListener("resize", () => {

    document.querySelectorAll(".item").forEach(item => {

        if(parseInt(item.style.left) > gameArea.clientWidth - 50){

            item.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";

        }

    });

});


// Efeito visual quando pega item
gameArea.addEventListener("click", function(e){

    if(!gameRunning) return;

    if(e.target === gameArea){

        gameArea.classList.add("flash");

        setTimeout(()=>{

            gameArea.classList.remove("flash");

        },300);

    }

});


// Impede menu de seleção no celular
document.addEventListener("contextmenu", function(e){

    e.preventDefault();

});


// Evita zoom acidental no celular
document.addEventListener("touchstart", function(e){

    if(e.touches.length > 1){

        e.preventDefault();

    }

},{passive:false});


// Inicializa recorde
(function(){

    const savedRecord = localStorage.getItem("recordMercadoPet");

    if(savedRecord){

        recordEl.textContent = savedRecord;

    }

})();// ===============================
// PARTE 5 - FINALIZAÇÃO
// ===============================


// Limpa o jogo quando fechar ou recarregar a página
window.addEventListener("beforeunload",()=>{

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

});


// Ajuste de dificuldade progressiva
setInterval(()=>{

    if(gameRunning){

        if(spawnSpeed > 400){

            spawnSpeed -= 50;

            clearInterval(spawnInterval);

            spawnInterval=setInterval(createItem,spawnSpeed);

        }

    }

},5000);


// Sons opcionais (sem arquivo externo)
// Cria um pequeno efeito usando o navegador

function playClickSound(){

    try{

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const oscillator = audioContext.createOscillator();

        const gain = audioContext.createGain();

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.frequency.value=500;

        gain.gain.value=0.05;

        oscillator.start();

        oscillator.stop(audioContext.currentTime+0.08);

    }catch(e){}

}


// Adiciona som ao pegar item
document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("item")){

        playClickSound();

    }

});


// Mensagem inicial no console
console.log("🐶 Mercado Pet - Pegue o Osso carregado com sucesso!");

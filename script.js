// ===============================
// PEGUE O OSSO - SCRIPT COMPLETO
// ===============================

// Aguarda o HTML carregar completamente para evitar erros de elementos nulos
document.addEventListener("DOMContentLoaded", () => {
    
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
        { emoji: "🦴", points: 1 },
        { emoji: "🍖", points: 2 },
        { emoji: "🧀", points: 3 },
        { emoji: "⭐", points: 5 }
    ];

    const badItems = [
        { emoji: "💣", points: -3 },
        { emoji: "🥦", points: -1 },
        { emoji: "🌶️", points: -2 }
    ];

    // Inicialização segura do recorde
    if (recordEl) {
        recordEl.textContent = localStorage.getItem("recordMercadoPet") || 0;
    }

    // Eventos de clique nos botões
    if (startButton) startButton.addEventListener("click", startGame);
    if (restartButton) restartButton.addEventListener("click", startGame);

    function startGame() {
        // Remove itens antigos se existirem
        document.querySelectorAll(".item").forEach(item => item.remove());

        score = 0;
        time = 30;

        scoreEl.textContent = score;
        timerEl.textContent = time;

        spawnSpeed = 1000;
        fallSpeed = 5;

        gameRunning = true;

        // Esconde as telas inicial e final
        startScreen.classList.add("hidden");
        gameOver.classList.add("hidden");

        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        timerInterval = setInterval(updateTimer, 1000);
        spawnInterval = setInterval(createItem, spawnSpeed);
    }

    function updateTimer() {
        if (!gameRunning) return;

        time--;
        timerEl.textContent = time;

        if (time === 20) {
            spawnSpeed = 800;
            clearInterval(spawnInterval);
            spawnInterval = setInterval(createItem, spawnSpeed);
        }

        if (time === 10) {
            spawnSpeed = 600;
            fallSpeed = 4;
            clearInterval(spawnInterval);
            spawnInterval = setInterval(createItem, spawnSpeed);
        }

        if (time <= 0) {
            endGame();
        }
    }

    function createItem() {
        if (!gameRunning) return;

        const item = document.createElement("div");
        item.classList.add("item");

        let data;
        if (Math.random() < 0.75) {
            data = goodItems[Math.floor(Math.random() * goodItems.length)];
            item.classList.add("good");
        } else {
            data = badItems[Math.floor(Math.random() * badItems.length)];
            item.classList.add("bad");
        }

        item.dataset.points = data.points;
        item.innerHTML = data.emoji;

        // Medida de segurança caso o container do jogo ainda não tenha largura definida
        const areaWidth = gameArea.clientWidth || 350; 
        const itemWidth = 50;
        const randomX = Math.random() * (areaWidth - itemWidth);
        
        item.style.left = Math.max(10, randomX) + "px";
        item.style.animationDuration = fallSpeed +"s";

        item.addEventListener("click", collectItem);
        item.addEventListener("animationend", () => {
            item.remove();
        });

        gameArea.appendChild(item);
    }

    function collectItem(e) {
        if (!gameRunning) return;

        const item = e.currentTarget;

        dog.classList.add("jump");
        setTimeout(() => {
            dog.classList.remove("jump");
        }, 150);

        const pts = parseInt(item.dataset.points);
        score += pts;

        if (score < 0) {
            score = 0;
        }

        scoreEl.textContent = score;
        showPoints(item, pts);
        item.remove();
    }

    function showPoints(item, pts) {
        const pop = document.createElement("div");

        if (pts >= 0) {
            pop.className = "plus";
            pop.innerHTML = "+" + pts;
        } else {
            pop.className = "minus";
            pop.innerHTML = pts;
        }

        pop.style.left = item.offsetLeft + "px";
        pop.style.top = item.offsetTop + "px";

        gameArea.appendChild(pop);

        setTimeout(() => {
            pop.remove();
        }, 800);
    }

    function endGame() {
        gameRunning = false;

        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        document.querySelectorAll(".item").forEach(item => {
            item.remove();
        });

        finalScore.textContent = score;

        // Mensagem de Parabéns com os cupons de desconto (estilo inline para garantir layout limpo)
        let texto = `
            <div style="line-height: 1.5; margin: 15px 0;">
                <h3 style="color: #2ecc71; font-weight: bold; margin-bottom: 8px;">🎉 PARABÉNS! 🎉</h3>
                <p style="font-size: 0.95rem; font-weight: bold; margin-bottom: 10px; color: #333;">
                    Você ganhou um cupom de:
                </p>
                <div style="background: #f7f9f6; border: 1px dashed #8ca47d; border-radius: 8px; padding: 10px; display: inline-block; text-align: left; margin-bottom: 10px;">
                    <span style="display: block; margin-bottom: 5px;">💳 <strong>5% de desconto</strong> em cartões</span>
                    <span style="display: block;">💵 <strong>10% de desconto</strong> no Pix ou dinheiro</span>
                </div>
                <p style="font-size: 0.9rem; font-weight: bold; color: #ff9f43; margin-top: 5px;">
                    🐾 Em qualquer produto da loja!
                </p>
            </div>
        `;

        message.innerHTML = texto;

        const record = parseInt(localStorage.getItem("recordMercadoPet")) || 0;
        if (score > record) {
            localStorage.setItem("recordMercadoPet", score);
            recordEl.textContent = score;
        }

        gameOver.classList.remove("hidden");

        if (typeof confetti === "function") {
            confetti({
                particleCount: 180,
                spread: 120,
                origin: { y: 0.6 }
            });
        }
    }

    // Ajusta a posição dos itens para telas menores
    window.addEventListener("resize", () => {
        document.querySelectorAll(".item").forEach(item => {
            const areaWidth = gameArea.clientWidth || 350;
            if (parseInt(item.style.left) > areaWidth - 50) {
                item.style.left = Math.random() * (areaWidth - 50) + "px";
            }
        });
    });

    // Efeito visual de erro ao clicar no vazio
    gameArea.addEventListener("click", function (e) {
        if (!gameRunning) return;
        if (e.target === gameArea) {
            gameArea.classList.add("flash");
            setTimeout(() => {
                gameArea.classList.remove("flash");
            }, 300);
        }
    });

    // Impedir menus no celular
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("touchstart", function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Dificuldade progressiva
    setInterval(() => {
        if (gameRunning) {
            if (spawnSpeed > 400) {
                spawnSpeed -= 50;
                clearInterval(spawnInterval);
                spawnInterval = setInterval(createItem, spawnSpeed);
            }
        }
    }, 5000);

    // som nativo
    function playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.frequency.value = 500;
            gain.gain.value = 0.05;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.08);
        } catch (e) {}
    }

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("item")) {
            playClickSound();
        }
    });

    console.log("🐶 Mercado Pet - Pegue o Osso carregado com sucesso!");
});
document.addEventListener('DOMContentLoaded', () => {
    const clickMeButton = document.getElementById('click-me');
    const runner = document.getElementById('runner');
    const oldLady = document.getElementById('old-lady');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const fraseDisplay = document.getElementById('frase');
    let runnerPositionX = 50;
    let runnerPositionY = 550;
    let oldLadyPositionX = 750;
    let oldLadyPositionY = 550;
    let runnerDirection = 'right';
    let oldLadyDirection = 'up';
    let interval;
    let timer;
    let fraseTimer;
    let timeLeft = 20;
    let score = 0;

    const frases = [
        "Senhora!", 
        "Volta aqui, senhora!", 
        "Fala uma palavrinha com a gente!", 
        "Espera aí, senhora!", 
        "Só uma palavrinha, senhora!", 
        "Senhora, por favor!", 
        "Senhora, não fuja!", 
        "Senhora, só um minuto!", 
        "Senhora, precisamos falar com você!", 
        "Senhora, volte aqui!"
    ];

    function getRandomPosition() {
        const x = Math.random() * 750; // Largura do container menos a largura do texto
        const y = Math.random() * 550; // Altura do container menos a altura do texto
        return { x, y };
    }

    function getRandomAngle() {
        return Math.random() * 90 - 45; // Ângulo entre -45 e 45 graus
    }

    function showRandomFrase() {
        const frase = frases[Math.floor(Math.random() * frases.length)];
        const { x, y } = getRandomPosition();
        const angle = getRandomAngle();

        fraseDisplay.textContent = frase;
        fraseDisplay.style.left = `${x}px`;
        fraseDisplay.style.top = `${y}px`;
        fraseDisplay.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        fraseDisplay.style.opacity = 1;

        setTimeout(() => {
            fraseDisplay.style.opacity = 0;
        }, 2500); // Fade out após 2.5 segundos
    }

    fraseTimer = setInterval(showRandomFrase, 3000);

    function startGame() {
        clickMeButton.style.display = 'none';
        runner.style.display = 'block';
        oldLady.style.display = 'block';
        timerDisplay.textContent = `Tempo: ${timeLeft}`;
        scoreDisplay.textContent = `Senhoras Capturadas: ${score}`;

        interval = setInterval(() => {
            moveCharacter(oldLady, oldLadyDirection, 'oldLady');

            if (checkCollision(runner, oldLady)) {
                score++;
                scoreDisplay.textContent = `Senhoras Capturadas: ${score}`;
                resetOldLady();
                if (score >= 3) {
                    clearInterval(interval);
                    clearInterval(timer);
                    clearInterval(fraseTimer);
                    alert('Você ganhou o jogo!');
                    resetGame();
                }
            }
        }, 100);

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Tempo: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                clearInterval(timer);
                clearInterval(fraseTimer);
                alert('A senhora escapou!');
                resetGame();
            }
        }, 1000);

        fraseTimer = setInterval(() => {
            fraseDisplay.textContent = frases[Math.floor(Math.random() * frases.length)];
        }, 3000);
    }

    function moveCharacter(character, direction, type) {
        if (type === 'runner') {
            if (direction === 'right') {
                runnerPositionX += 25;
            } else if (direction === 'left') {
                runnerPositionX -= 25;
            } else if (direction === 'up') {
                runnerPositionY -= 25;
            } else if (direction === 'down') {
                runnerPositionY += 25;
            }
            character.style.left = `${runnerPositionX}px`;
            character.style.top = `${runnerPositionY}px`;
            checkBounds('runner');
        } else {
            if (direction === 'right') {
                oldLadyPositionX += 15;
            } else if (direction === 'left') {
                oldLadyPositionX -= 15;
            } else if (direction === 'up') {
                oldLadyPositionY -= 15;
            } else if (direction === 'down') {
                oldLadyPositionY += 15;
            }
            character.style.left = `${oldLadyPositionX}px`;
            character.style.top = `${oldLadyPositionY}px`;
            checkBounds('oldLady');
        }
    }

    function checkBounds(type) {
        if (type === 'runner') {
            if (runnerPositionX >= 750 && runnerDirection === 'right') {
                runnerDirection = 'up';
                runnerPositionX = 750; // Corrige a posição para não ultrapassar a borda
            } else if (runnerPositionY <= 0 && runnerDirection === 'up') {
                runnerDirection = 'left';
                runnerPositionY = 0; // Corrige a posição para não ultrapassar a borda
            } else if (runnerPositionX <= 0 && runnerDirection === 'left') {
                runnerDirection = 'down';
                runnerPositionX = 0; // Corrige a posição para não ultrapassar a borda
            } else if (runnerPositionY >= 550 && runnerDirection === 'down') {
                runnerDirection = 'right';
                runnerPositionY = 550; // Corrige a posição para não ultrapassar a borda
            }
        } else {
            if (oldLadyPositionY <= 0 && oldLadyDirection === 'up') {
                oldLadyDirection = 'left';
                oldLadyPositionY = 0; // Corrige a posição para não ultrapassar a borda
            } else if (oldLadyPositionX <= 0 && oldLadyDirection === 'left') {
                oldLadyDirection = 'down';
                oldLadyPositionX = 0; // Corrige a posição para não ultrapassar a borda
            } else if (oldLadyPositionY >= 550 && oldLadyDirection === 'down') {
                oldLadyDirection = 'right';
                oldLadyPositionY = 550; // Corrige a posição para não ultrapassar a borda
            } else if (oldLadyPositionX >= 750 && oldLadyDirection === 'right') {
                oldLadyDirection = 'up';
                oldLadyPositionX = 750; // Corrige a posição para não ultrapassar a borda
            }
        }
    }

    function checkCollision(runner, oldLady) {
        const runnerRect = runner.getBoundingClientRect();
        const oldLadyRect = oldLady.getBoundingClientRect();

        return (
            runnerRect.left < oldLadyRect.right &&
            runnerRect.right > oldLadyRect.left &&
            runnerRect.top < oldLadyRect.bottom &&
            runnerRect.bottom > oldLadyRect.top &&
            runnerDirection !== getOppositeDirection(oldLadyDirection) // Verifica se o runner está atrás da senhora
        );
    }

    function getOppositeDirection(direction) {
        switch(direction) {
            case 'right': return 'left';
            case 'left': return 'right';
            case 'up': return 'down';
            case 'down': return 'up';
        }
    }

    function resetOldLady() {
        // Faz a senhora surgir mais à frente no sentido anti-horário
        switch(oldLadyDirection) {
            case 'up':
                oldLadyPositionX -= 100;
                break;
            case 'left':
                oldLadyPositionY += 100;
                break;
            case 'down':
                oldLadyPositionX += 100;
                break;
            case 'right':
                oldLadyPositionY -= 100;
                break;
        }
        
        // Ajusta as posições se estiverem fora dos limites
        if (oldLadyPositionX < 0) oldLadyPositionX += 800;
        if (oldLadyPositionX > 750) oldLadyPositionX -= 800;
        if (oldLadyPositionY < 0) oldLadyPositionY += 600;
        if (oldLadyPositionY > 550) oldLadyPositionY -= 600;

        oldLady.style.left = `${oldLadyPositionX}px`;
        oldLady.style.top = `${oldLadyPositionY}px`;
    }

    function resetGame() {
        runnerPositionX = 50;
        runnerPositionY = 550;
        oldLadyPositionX = 750;
        oldLadyPositionY = 550;
        runnerDirection = 'right';
        oldLadyDirection = 'up';
        runner.style.left = `${runnerPositionX}px`;
        runner.style.top = `${runnerPositionY}px`;
        oldLady.style.left = `${oldLadyPositionX}px`;
        oldLady.style.top = `${oldLadyPositionY}px`;
        runner.style.display = 'none';
        oldLady.style.display = 'none';
        clickMeButton.style.display = 'block';
        timeLeft = 20;
        score = 0;
        fraseDisplay.textContent = ''; // Limpa a frase ao resetar o jogo
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            moveCharacter(runner, runnerDirection, 'runner');
        }
    });

    clickMeButton.addEventListener('click', startGame);

    console.log('ZueraWare iniciado!');
});
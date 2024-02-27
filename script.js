const gameBoard = document.getElementById('game-arena')
const userScore = document.getElementById('score')
const userHighScore = document.getElementById('high-score')
const instructionText = document.getElementById('instruction-txt')
const logo = document.getElementById('logo')

const gridSize = 20;
let snake = [{x:10, y:10}]
let food = generateFood()
let direction = 'right'
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highscore = 0;


//for drawing the snake and food and gamemap
function draw(){
    gameBoard.innerHTML = ''
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment)
        gameBoard.appendChild(snakeElement)
    });
}

//for creating cube of snake and food
function createGameElement(tag, className){
    const element = document.createElement(tag)
    element.className = className;
    return element;
}

//for setting the position of snake and food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y
}

//draw food
function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div', 'food')
        setPosition(foodElement, food)
        gameBoard.appendChild(foodElement);
    }
}

//for generating the food randomly on map
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//for creating the moving illusion for snake
function moveSnake(){
    const head = { ...snake[0] }
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        food = generateFood()
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}

//key press event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
            case 'ArrowLeft':
                direction = 'left'
                break;
        }
    }
}

document.body.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 7;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 5
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -=3
    }else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 2;
    }
}

function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay)

}


function checkCollision(){
    const head = snake[0]

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let i=1; i< snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updatehighScore();
    stopGame();
    snake = [{x: 10, y:10}];
    updateScore();
    food = generateFood();
    direction = 'right'
    gameSpeedDelay = 200;
    userScore();
}

function stopGame(){
    gameBoard.innerHTML = ''
    clearInterval(gameInterval)
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateScore(){
    const score = snake.length - 1
    userScore.textContent = `Score: ${score.toString().padStart(2, '0')}`
}

function updatehighScore() {
    const score = snake.length - 1
    if(score > highscore){
        highscore = score;
        userHighScore.textContent = `High Score: ${highscore.toString().padStart(2, '0')}`
    }
}
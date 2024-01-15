const app = document.querySelector('#game');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
app.append(canvas);

InitiateGame();

function InitiateGame() {
    let speedX = 0;
    let speedY = 0;
    let MIN_DISTANCE_TO_HOLE = 50;
    let score = 0;
    let time = 60;
    let gameover = false;

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.style.background = '#333';

    window.addEventListener('resize', () => {
        ctx.canvas.height = window.innerHeight;
        ctx.canvas.width = window.innerWidth;
        MIN_DISTANCE_TO_HOLE = Math.min([ctx.canvas.height/5, ctx.canvas.width/5])
    });

    window.addEventListener('deviceorientation', onDeviceMove)

    let ball = {
        x: 0,
        y: 0,
        size: 20,
        color: '#aaa',
        type: 'ball'
    }

    ball.x = Math.random() * ((ctx.canvas.width - ball.size) - ball.size) + ball.size;
    ball.y = Math.random() * ((ctx.canvas.height - ball.size) - ball.size) + ball.size;
    console.log(ball);

    let hole = {
        x: 0,
        y: 0,
        size: ball.size + 20,
        color: '#ff03',
        type: 'hole'
    }

    GenerateHole();

    function GenerateHole() {
        while(true) {
            hole.x = Math.random() * ((ctx.canvas.width - hole.size) - hole.size) + hole.size;
            hole.y = Math.random() * ((ctx.canvas.height - hole.size) - hole.size) + hole.size;
            if((hole.x > ball.x+MIN_DISTANCE_TO_HOLE || hole.x < ball.x-MIN_DISTANCE_TO_HOLE) && (hole.y > ball.y+MIN_DISTANCE_TO_HOLE || hole.y < ball.y-MIN_DISTANCE_TO_HOLE)) break;
            console.log('x');
        }
    }
    
    function Draw(item) {
        // Ball out of bonds
        if (item.type == 'ball') {
            if ((item.x + speedX) > ctx.canvas.width - item.size) item.x = ctx.canvas.width - item.size;
            else if ((item.x + speedX) < 0 + item.size) item.x = item.size;
            else item.x = item.x + speedX;
    
            if ((item.y + speedY) > ctx.canvas.height - item.size) item.y = ctx.canvas.height - item.size;
            else if ((item.y + speedY) < 0 + item.size) item.y = item.size;
            else item.y = item.y + speedY;
        }

        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.closePath();
       
    }

    function CheckHit() {
        let dx = Math.abs(hole.x - ball.x);
        let dy = Math.abs(hole.y - ball.y);
        var distance = Math.sqrt((dx * dx) + (dy * dy));
        console.log(`${dx} | ${dy} | ${distance}`)
        if (distance <= Math.abs(hole.size-ball.size)) {
            GenerateHole();
            score++;
        }
    }

    function onDeviceMove(event) {
        // gamma: left right, beta: up down
        let beta = event.beta;
        let gamma = event.gamma;
        let lowSpeed = 1;
        let highSpeed = 2;

        speedX = gamma/45;
        speedY = beta/45;
    }

    function animate() {
        requestAnimationFrame(animate)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameover) {
            Draw(ball);
            CheckHit();
            Draw(hole);
            DrawUI();
        } else {
            DrawGameover();   
        }
    }

    function DrawUI() {
        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`Score: ${score}`, 10, 50);
        ctx.fillText(`Time left: ${time}`, 10, 82);
        ctx.closePath();
    }
    let timeInterval = setInterval(() => {
        time--;
        if (time <= 0) gameover = true;
    }, 1000);

    function DrawGameover() {
        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`Game Over!`, ctx.canvas.width/2, ctx.canvas.height/2-16);
        ctx.fillText(`Score: ${score}`, ctx.canvas.width/2, ctx.canvas.height/2+16);
        ctx.closePath();
    }
    requestAnimationFrame(animate)
}



// window.addEventListener('deviceorientation', onDeviceMove);

// const boardSize = 300 - 20;
// console.log(boardSize);

// let ballX = 0;
// let ballY = 0;

// function onDeviceMove(event) {
//     setInterval(() => {
//         UpdateBallCoordinates(event.beta, event.gamma);
//         animate()
//         console.log('xd')
//     }, 16);
// }

// function animate() {
//     const ball = document.querySelector('#ball');
//     ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
// }

// requestAnimationFrame(animate)

// function UpdateBallCoordinates(beta, gamma) {
//     //beta 180 gd, gamma 90 lp
    
//     if (beta > 20) {
//         console.log(beta)
//         if (ballY+2 <= boardSize) {
//             ballY +=2;
//         } else if (ballY+1 <= boardSize) {
//             ballY +=1;
//         }
//     } else if (beta > 10) {
//         if (ballY+1 <= boardSize) {
//             ballY +=1;
//         }
//     } else if (beta < -20) {
//         if (ballY-2 >= 0) {
//             ballY -=2;
//         } else if (ballY-1 >= 0) {
//             ballY -=1;
//         }
//     } else if (beta < -10) {
//         if (ballY-1 >= 0) {
//             ballY -=1;
//         }
//     }

//     if (gamma > 20) {
//         console.log(gamma)
//         if (ballX+2 <= boardSize) {
//             ballX +=2;
//         } else if (ballX+1 <= boardSize) {
//             ballX +=1;
//         }
//     } else if (gamma > 10) {
//         if (ballX+1 <= boardSize) {
//             ballX +=1;
//         }
//     } else if (gamma < -20) {
//         if (ballX-2 >= 0) {
//             ballX -=2;
//         } else if (ballX-1 >= 0) {
//             ballX -=1;
//         }
//     } else if (gamma < -10) {
//         if (ballX-1 >= 0) {
//             ballX -=1;
//         }
//     }
// }
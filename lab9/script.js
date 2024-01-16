const app = document.querySelector('#app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
app.append(canvas);

InitiateApp();

function InitiateApp() {
    const MIN_SPACE_BETWEEN = 50;
    const POINT_SIZE = 5;
    const AVG_SPEED = 1;
    const MIN_SPEED = .2;
    const SPEED_DISPROPORTION = 2;
    const DRAW_POINT_COUNT = true;
    const CONNECT_IF_CLOSE = true;
    const LIMIT_FPS = true;
    const FPS_MAX = 60;
    const DISTANCE_TO_CONNECT = 150;
    let paused = true;
    let lastRenderTime;
    let fps;

    let point_count = 50;
    let points = [];

    window.addEventListener('resize', () => {
        ctx.canvas.height = window.innerHeight;
        ctx.canvas.width = window.innerWidth;
        MIN_DISTANCE_TO_HOLE = Math.min([ctx.canvas.height/5, ctx.canvas.width/5])
    });

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.style.background = '#333';

    AddControls();

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawPoints();
        if (CONNECT_IF_CLOSE) DrawProximityLine();
        if (DRAW_POINT_COUNT) DrawPointCount();
        DrawFPS();
    }

    function DrawPoints() {
        UpdatePointCount();

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            DrawPoint(point);
        }

        function DrawPoint(point) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.closePath();
            if(!paused) UpdatePointPosition(point);
        }

        function UpdatePointPosition(point) {
            if ((point.x + point.speedX) > ctx.canvas.width - point.size) {
                point.x = ctx.canvas.width - point.size;
                point.speedX *= -1;
            }
            else if ((point.x + point.speedX) < 0 + point.size) {
                point.x = point.size;
                point.speedX *= -1;
            }
            else point.x += point.speedX;

            if ((point.y + point.speedY) > ctx.canvas.height - point.size) {
                point.y = ctx.canvas.height - point.size;
                point.speedY *= -1;
            }
            else if ((point.y + point.speedY) < 0 + point.size) {
                point.y = point.size;
                point.speedY *= -1;
            }
            else point.y += point.speedY;
        }
    }

    function DrawProximityLine() {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];

            for (let j = 0; j < points.length; j++) {
                const target = points[j];
                if (point == target) continue;
                
                if(IsClose(point, target)) {
                    DrawLine(point, target);
                }
            }            
        }

        function DrawLine(point, target) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = '#aaa';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }

        function IsClose(point, target) {
            let dx = Math.abs(target.x - point.x);
            let dy = Math.abs(target.y - point.y);
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            
            if (distance <= DISTANCE_TO_CONNECT) return true;
            return false;
        }
    }

    function DrawPointCount() {
        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`Ball count: ${point_count}`, 10, 50);
        ctx.closePath();
    }

    function DrawFPS() {
        if(!lastRenderTime) {
            lastRenderTime = Date.now();
            fps = 0;
            return;
        }
        delta = (Date.now() - lastRenderTime)/1000;
        lastRenderTime = Date.now();
        fps = Math.floor(1/delta);

        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`FPS: ${fps}`, 10, 82);
        ctx.closePath();
    }

    function UpdatePointCount() {
        if (point_count > points.length) {
            for (let i = 0; i < point_count - points.length; i++) {
                GeneratePoint();
            }
        }
        
        if (point_count < points.length) {
            for (let i = 0; i < points.length - point_count; i++) {
                RemovePoint();
            }
        }

        if(!paused && LIMIT_FPS) {
            if(fps < FPS_MAX) {
                point_count--;
            }
            if(fps > FPS_MAX) {
                point_count++;
            }
        }

    }

    function GeneratePoint() {
        let point = {
            size: POINT_SIZE,
            x: 0,
            y: 0,
            speedX: 0,
            speedY: 0,
            color: '#fff3'
        }
        while (point.speedX < MIN_SPEED && point.speedX > -MIN_SPEED) {
            point.speedX = Math.random() * ((AVG_SPEED + SPEED_DISPROPORTION) - (AVG_SPEED - SPEED_DISPROPORTION)) + (AVG_SPEED - SPEED_DISPROPORTION);
        }

        while (point.speedY < MIN_SPEED && point.speedY > -MIN_SPEED) {
            point.speedY = Math.random() * ((AVG_SPEED + SPEED_DISPROPORTION) - (AVG_SPEED - SPEED_DISPROPORTION)) + (AVG_SPEED - SPEED_DISPROPORTION);
        }

        point.x = Math.random() * ((ctx.canvas.width - point.size) - point.size) + point.size;
        point.y = Math.random() * ((ctx.canvas.height - point.size) - point.size) + point.size;
        points.push(point);
    }

    function RemovePoint() {
        points.pop();
    }

    function AddControls() {
        const start = document.createElement('button');
        const restart = document.createElement('button');

        start.innerText = 'START';
        restart.innerText = 'RESTART';

        start.style.position = 'absolute';
        restart.style.position = 'absolute';
        start.style.top = '20px';
        start.style.right = '200px';
        restart.style.top = '20px';
        restart.style.right = '120px';

        start.addEventListener('click', () => paused = false);
        restart.addEventListener('click', () => {
            points = [];
            paused = true;
        })

        app.append(start, restart);
    }

    requestAnimationFrame(animate)
}
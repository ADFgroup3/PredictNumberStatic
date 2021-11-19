window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //背景を設定（ないと透過pngになっちゃう）
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //x, yの現在地を設定
    const lastP = { x : null, y : null };

    let isDrag = false;

        //書く処理（主要部）
        function draw(x, y){
            if(!isDrag){
                return;
            }
        //ライン指定
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 25;
        ctx.strokeStyle = "black";
        if (lastP.x === null || lastP.y === null){
            ctx.moveTo(x, y);
        } else {
            ctx.moveTo(lastP.x, lastP.y);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        lastP.x = x;
        lastP.y = y;   
    }

    //クリアボタンの処理
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    //書き始め
    function dragStart(e){
        ctx.beginPath();
        isDrag = true;
    }

    //書き終わり
    function dragEnd(e){
        ctx.closePath();
        isDrag = false;
        lastP.x = null;
        lastP.y = null;
    }

    //各ボタン、キャンバスにイベントを指定
    const clearBtn = document.getElementById("clear");
    clearBtn.addEventListener("click", clear);
    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mouseup", dragEnd);
    canvas.addEventListener("mouseout", dragEnd);
    canvas.addEventListener("mousemove", (e) => {
        draw(e.layerX, e.layerY);
    });
});

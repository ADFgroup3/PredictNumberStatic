window.addEventListener("load", () => {
    //DOMツリーが構築され次第実行（サイトが表示される直前に実行）
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //背景を設定（ないと透過pngになっちゃう）
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //x, yの現在地を設定
    const lastP = { x : null, y : null };

    let isDrag = false;

    //書く処理(メイン)
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

    const canvasP = canvas.getBoundingClientRect();
    canvas.addEventListener("touchstart", dragStart);
    canvas.addEventListener("touchend", dragEnd);
    canvas.addEventListener("touchcancel", dragEnd);
    canvas.addEventListener("touchmove", (e) => {
        let deltaX = e.touches[0].pageX - canvasP.left;
        let deltaY = e.touches[0].pageY - canvasP.top;
        draw(deltaX, deltaY);
    });
});

//submitボタンが押されたときの処理
function CanvasToImage(){
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL('image/png').replace(/^.*,/, '');

    //隠し要素に値を代入
    document.getElementById("img").value = dataURL;
    
    //B64型式の画像を表示
    console.log(dataURL);
}

window.addEventListener("load", () => {
    //DOMツリーが構築され次第実行（サイトが表示される直前に実行）
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //背景を設定（ないと透過pngになっちゃう）
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //x, yの現在地を設定
    const lastP = { x : null, y : null };
    const frameP = { x0 : null, y0 : null, x1: null, y1: null}

    let isDrag = false;

    //書く処理(メイン)
    function draw(x, y){
        if(!isDrag){
            return;
        }
        //クロップ用の枠の座標を取得
        const radius = 30;
        if(frameP.x1 === null){
            frameP.x0 = x - radius;
            frameP.y0 = y - radius;
            frameP.x1 = x + radius;
            frameP.y1 = y + radius;
        }else{
            if(frameP.x0 > x - radius){
                frameP.x0 = x - radius;
            }else if(frameP.x1 < x + radius){
                frameP.x1 = x + radius;
            }
            if(frameP.y0 > y - radius){
                frameP.y0 = y - radius;
            }else if(frameP.y1 < y + radius){
                frameP.y1 = y + radius;
            }
        }
        //ライン指定
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 30;
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
        frameP.x0 = null;
        frameP.y0 = null;
        frameP.x1 = null;
        frameP.y1 = null;
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
    //スマホでタッチした時の処理
    const canvasP = canvas.getBoundingClientRect();
    canvas.addEventListener("touchstart", dragStart);
    canvas.addEventListener("touchend", dragEnd);
    canvas.addEventListener("touchcancel", dragEnd);
    canvas.addEventListener("touchmove", (e) => {
        let deltaX = e.touches[0].pageX - canvasP.left;
        let deltaY = e.touches[0].pageY - canvasP.top;
        draw(deltaX, deltaY);
    });
    function CanvasToImage(){
        //クロップの位置を中心に調整
        const lengthX = frameP.x1 - frameP.x0;
        const lengthY = frameP.y1 - frameP.y0;
        if(lengthX > lengthY){
            frameP.y1 = lengthY / 2 + frameP.y0 + lengthX / 2;
            frameP.y0 = lengthY / 2 + frameP.y0 - lengthX / 2;
        }else{
            frameP.x1 = lengthX / 2 + frameP.x0 + lengthY / 2;
            frameP.x0 = lengthX / 2 + frameP.x0 - lengthY / 2;
        }
        //描画パスを作成
        const newPath = new Path2D();
        newPath.rect(frameP.x0, frameP.y0, frameP.x1 - frameP.x0, frameP.y1 - frameP.y0);
        //隠し要素のcanvasを取得
        const hiddenCanvas = document.getElementById("hiddenCanvas");
        const hiddenCtx = hiddenCanvas.getContext("2d");
        const clopWidth = frameP.x1 - frameP.x0;
        const clopHeight = frameP.y1 - frameP.y0;
        hiddenCanvas.width = clopWidth;
        hiddenCanvas.height = clopHeight;
        //画像をクロップして隠しcanvasに描画
        const rawImage = new Image();
        rawImage.src = canvas.toDataURL('image/png');
        rawImage.onload = () => {
            hiddenCtx.drawImage(rawImage, frameP.x0, frameP.y0, clopWidth, clopHeight, 0, 0, clopWidth, clopHeight);
        }
        //描画した画像をデータ化
        const dataURL = hiddenCanvas.toDataURL('image/png').replace(/^.*,/, '');
        //隠し要素に値を代入
        document.getElementById("img").value = dataURL;
        //B64型式の画像を表示
        console.log(dataURL);
        //パスをリセット
        Path = newPath;
    }
    document.getElementById("execute").addEventListener("click", CanvasToImage);
});



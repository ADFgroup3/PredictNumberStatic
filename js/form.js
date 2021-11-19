function CanvasToImage(){
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL('image/png').replace(/^.*,/, '');

    //隠し要素に値を代入
    document.getElementById("img").value = dataURL;
}
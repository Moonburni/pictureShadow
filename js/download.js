function download(canvasImg, img, quality = 0.97) {

    let name = img.name.split('.')[0];
    let format = img.name.split('.')[1];

    function downloadImg(url, fullName) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', fullName);
        anchor.click();
    }

    function changeImage() {
        const canvas = document.createElement('canvas');
        canvas.width = canvasImg.width;
        canvas.height = canvasImg.height;
        const context = canvas.getContext('2d');
        context.filter = getComputedStyle(canvasImg).filter;
        img.setAttribute('crossOrigin', 'anonymous');
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL(`image/${format}`, quality);
        return {
            url,
            then: (cb) => {
                cb(url)
            },
            download: () => {
                downloadImg(url, `${name}.${format}`)
            }
        }
    }

    return {
        changeImage: changeImage()
    }
}

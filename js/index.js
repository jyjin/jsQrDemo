/**********************************************************************
 *
 * @author: jyjin
 * @data  : 2016.8.9
 * @remark: CHECK QRCODE
 *          1.success:return qr value
 *          2.failed : return ''
 *
 ***********************************************************************/
(function() {
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var animateId;


    var width = parseInt(canvas.style.width);
    var height = parseInt(canvas.style.height);
    canvas.width = width;
    canvas.height = height;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function getBase64Data(src, callback) {
        var type = src.indexOf('.png') != -1 ? 'png' : 'jpeg';
        var image = new Image();
        image.src = src;
        image.onload = function() {
            setCanvas(image);
            context.drawImage(image, 0, 0, width, height);
            var dataURL = canvas.toDataURL("image/" + type);
            // dataURL = dataURL.replace("data:image/" + type + ";base64,", "");
            if (callback) callback(dataURL);
        }
    }

    function setCanvas(image) {
        width = image.width;
        height = image.height;
        $('#canvas').css({
            width: width,
            height: height
        })
        canvas.width = width;
        canvas.height = height;
    }

    function isQRImg(src) {
        var image = new Image();
        image.src = src;
        image.crossOrigin = '';
        image.onload = function() {
            setCanvas(image);
            context.drawImage(image, 0, 0, width, height);
            var imageData = context.getImageData(0, 0, width, height);
            var decoded = jsQR.decodeQRFromImage(imageData.data, imageData.width, imageData.height);
            if (decoded) {
                $('h2').html('检测结果：' + decoded);
            } else {
                $('h2').html('检测结果：' + '未检测到二维码');
            }
        }
    }

    function successCallback(stream) {
        if (window.webkitURL) {
            video.src = window.webkitURL.createObjectURL(stream);
        } else if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = stream;
        }
    }

    function errorCallback() {}

    function tick() {
        animateId = requestAnimationFrame(tick);
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Load the video onto the canvas
            context.drawImage(video, 0, 0, width, height);
            // Load the image data from the canvas
            var imageData = context.getImageData(0, 0, width, height);
            var decoded = jsQR.decodeQRFromImage(imageData.data, imageData.width, imageData.height);
            if (decoded) {
                $('h2').html('检测结果：' + decoded);
            } else {
                $('h2').html('检测结果：' + '未检测到二维码');
            }
        }
    }

    function scanQR() {
        width = 640;
        height = 480;
        $('#canvas').css({
            width: width,
            height: height
        })
        canvas.width = width;
        canvas.height = height;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            }, successCallback, errorCallback);
            animateId = requestAnimationFrame(tick);
        }

    }

    function cancelScanQR() {
        // navigator.getUserMedia({ video: false }, successCallback, errorCallback);
        window.cancelAnimationFrame(animateId);
    }


    $(function() {
        $('#file').change(function(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                // console.log(e.target.result)
                // $('img').attr('src',e.target.result);
                isQRImg(e.target.result)
            }
        })

        $('#btn1').click(function() {
            scanQR();
        })
        $('#btn2').click(function() {
            cancelScanQR();
        })
        $('#btn3').click(function() {
            var src = $('#src').val();
            isQRImg(src)
        })
    })

})()

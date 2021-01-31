// 个人中心 =>更换头像
//功能：更改图片 更新图片

$(function() {
    //1.获取图片
    const $image = $('#image')

    //2.初始化裁剪区域
    $image.cropper({
        //指定长宽比
        aspectRatio: 1 / 1,
        crop: function(event) {
            // console.log(event.detail.x); //裁剪框的坐标
            // console.log(event.detail.y); //裁剪框的坐标
        },
        //指定预览区
        preview: '.img-preview'
    });

    //3.点击上传按钮，上传图片
    $('#upload-btn').click(function() {
        //3.1 手动触发文件框的点击事件
        $('#file').click()
    })

    //4.监听文件框状态改变事件change:file,checkbox,select
    $('#file').change(function() {
        // 4.1获取用户上传的文件列表
        // console.log(this.files); //伪数组

        //判断用户是否上传
        if (this.files.length == 0) return

        //把文件转成url地址的形式
        const imgURL = URL.createObjectURL(this.files[0])
            // console.log(imgURL);

        //替换裁剪区的图片
        // $image.cropper('replace', imgURL)//方案二
        $image.cropper('destroy').prop('src', imgURL).cropper({
            //指定长宽比
            aspectRatio: 1 / 1,
            //指定预览区，提供元素的选择器
            preview: '.img-preview'
        })
    })

    //5.点击确定，上传图片到服务器
    $('#save-btn').click(function() {
        //5.1 获取裁剪后图片的base64 格式
        const dataURL = $image.cropper('getCroppedCanvas', {
            //限制图片宽高
            width: 100,
            height: 100
        }).toDataURL('image/png')

        // console.log(dataURL);

        // 5.2 手动构建查询参数：在浏览器中，可以使用URLSearchParams API，如下所示：
        // const params = new URLSearchParams();
        // params.append('param1', 'value1');
        // params.append('param2', 'value2');
        // axios.post('/foo', params);
        const search = new URLSearchParams();
        search.append('avatar', dataURL);

        //5.3 发送请求，提交到服务器
        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);
            // 5.4 判断失败
            if (res.status !== 0) return layer.msg('上传失败！')

            window.parent.getUserInfo()
        })
    })

})
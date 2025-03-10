# 大文件上传

**步骤**

1. 选择文件  input file
2. 拿到选择的文件 file.value(File类型的文件，new File()的实例)
   对文件进行切片为一个个的chunk（file -> slice -> chunk(blob对象)），切片对象
3. 将每个chunk添加到formData
4. 将formData传递给后端
5. 后端接受formData并保存文件的基本信息（size,name,type）和文件
6. 后端将每个chunk保存到相应的文件夹
7. 单个chunk上传完成
8. 等所有的chunk都上传完成后，合并文件
9. 如是MP4文件，将mp4文件分割为m3u8格式的chunk(hls)
10. 保存到后端的静态资源文件夹
11. 返回前端资源url
12. 播放器获取每个切片播放




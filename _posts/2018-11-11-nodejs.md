# 如何读取文件 #

![](./imgs/2018-11-09_212940.png)

# 写入文件 #

`var fs = require('fs');

fs.writeFile('./data/你好.md','大家好，我是大师兄！',function(error){
	console.log('文件写入成功！！！！')
})
`
# 简单的http服务器 #

`	var http = require('http')

	var server = http.createServer()

	server.on('request',function(request,response){
	
	var url = request.url;
	// response.end(url)
	if(url==='/login'){
		
	response.end('welcome!login');
	}else if(url=='/register'){
		
		response.end('register');
	}else if(url=='/hellow'){
		
		response.end('hahah');
	}else{
		response.end('404 not found');
	}
	})

	server.listen(3000,function(){
	console.log('服务服务器启动成功,可以通过http://127.0.0.1:3000/来进行访问')
	})`
**相应内容只能是二进制数据或者字符串,其他的都不行**

# nodejs中的一些核心模块 #

![](imgs/2018-11-10_121822.png)

**require()模块之间的互相访问exports()**

![](imgs/2018-11-10_123815.png)


## http的默认端口号 ##

![](imgs/2018-11-10_234605.png)

## 相应头内容 ##

![](imgs/2018-11-11_000243.png)

## 更具服务器请求的数据,返回文件中的内容 ##

![](imgs/2018-11-11_001758.png)

**不同的资源对应的Content-Type是不一样的,图片类型的资源不需要指定编码,一般只为字符数据指定编码**

# 关于代码风格中的分号 ; 问题 #

![](imgs/2018-11-11_005314.png)


在ES6的语法中,字符串 ``的拼接中,可以用${}来引用变量.




















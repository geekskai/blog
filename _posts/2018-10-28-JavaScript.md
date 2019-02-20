---
layout:     post
title:      最全的JavaScript基础详解
subtitle:   JavaScript基础 进阶
date:       2018-10-28 11:04:11
author:     gankai
header-img: img/JavaScript.jpg
catalog: true
tags:
    - git
    - 函数式编程
    - 开源框架
---
# JavaScript基础 #
1.什么情况下是undifind:变量声明了,但是没有定义.
如果一个undifind的数和一个数字进行计算,结果是:NaN,即not a number,不是一个数字,也没有什么意义.

	isNaN()			// 意思是:括号中的数字   是不是  不是  一个数字  ?
	isNaN(10)     	// 结果:false

2.如何获取一个变量的数据类型?

(1) 使用typeof 获取变量的类型:

	1.typeof 变量名
	2.typeof(变量名)

	var numb=10;
	console.log(typeof numb); // number

(2) js中的进制!

	var num=10;			// 十进制
	var num=012;		//八进制
	var num=0X123		//十六进制

(3) 数字范围类型有范围

	console.log(Number.MAX_VALUE);	//数字的最大值

**不要用小数去验证小数,其中有个bug**

(4) **伪数组:**  `arguments`

![](imgs/arguments.png)

function f1(){
	coneole.log('xxxxxx')
}
	f1()					// f1指的是函数名,存储的是f1中的所有代码,
比如:console.log(f1)		

结果是:

	f f1(){
	coneole.log('xxxxxx')
	 }


# 匿名函数 #

## 匿名函数不能直接调用 ##

	var f2=function (){					//函数表达式
		console.log("xxxxxx");
	};

**将匿名函数直接赋值给f2了,解决了匿名函数不能直接用的问题!**

匿名函数的调用:

	f2();  

特殊:f1()  小括号前是函数的代码;

## f1()  同理想到---->      (函数代码)()   ----->(function(){console.log("xxxx")};)() ##

## 函数的自调用(只能使用一次): ##

![](imgs/func-self.png)


把一个函数给一个变量,此时形成了一个函数表达式!		--> var 变量=匿名函数
*注意:*函数表达式后面赋值结束后,一定要有分号 !


函数名();  // 函数的调用

# 回调函数 #

**函数可以作为参数使用,如果一个函数作为参数,那么,我们说这个参数(函数)可以叫做, 回调函数;
只要看到一个函数作为参数使用了,那就是回调函数!**

**1.js没有块级作用域(函数除外);**
**2.隐式全局变量:没有用var声明的变量,叫做隐式全局变量.**

	function f1(){
		num=100;// 这是个隐式全局变量,外面也可以访问
	}
**3.全局变量是不能被删除的,隐式全局变量是可以被删除的,定义变量使用var是不会被删除的,没有var是可以删除的.**
**4.函数调用之前,会把函数的声明提升到这个函数作用域的上面, **

## 预解析 ##
js解析器在执行js代码的时候,分为两个过程,预解析过程和执行过程.

1. 把变量的声明提升到当前作用域的最前面,只会提升声明,不会提升赋值;
2. 把函数的声明提升到当前作用域的最前面,只会提升声明,不会提升调用;
3. 先提升var,在提升function;

预解析中,变量的提升只会在当前的作用域中提升,提前在当前的作用域的最上面,函数中的变量只会提升到函数的作用域的最前面,不会出去.


	f1();	// 调用 -->函数调用之前,会把函数的声明提升到这个函数作用域的上面
	var num=20;	//这个变量的声明会提升到变量的使用之前.---->也就是说声明在前,赋值在后(预解析).
	function f1() {
		console.log(num)
		var num =10;
	};

面向过程:凡事都要其力亲为,每件事情的具体过程都要知道,**注重的是过程**.(单身)
面向对象:根据需求找对象,所有的事情都要对象来做,**注重的是结果**.(对象)

创建一个对象:

	var obj=new Object();		//Object是系统的构造函数
	obj.name=gankai;		//直接可以声明属性
	obj.say=function (){console.log("xxxx");};  //直接声明方法,匿名的.
	obj.say();

函数和构造函数的区别:构造函数的名字首字母是大写的,普通函数不是;

# 自定义构造函数 #

![](imgs/functions.png)

	var Person(name, age){		// 构造函数
		this.name=name;
		this.age=age;
		this.play=function () {
			console.log("xxxxx");
		};
	}

	var per=new Person("张三",29);
创建一个对象,实例化一个对象,并且初始化,
 	var  per =new Person("小米",20);
做了四件事:

1. 在内存中开辟了空间,存储了新的对象,
2. 把this设置为当前对象,
3. 设置对象的属性和方法值,
4. 返回创建后的新对象

可以用 obj instanceof Person  来判断对象的所属类型

用字面量形式创建对象,

	var obj={};				// 缺点是:一次性使用!

另一种方式设置和获取对象的属性和方法

![](imgs/obj-other.png)

## 如何变量对象? ##

变量对象,不能通过for循环来变量,对象是无序的.
	下面中,key是一个变量,这个变量中存储的是该对象的所有的属性的名字,
	for(var key in obj){
		console.log(obj[key]);		//输出所有对象的属性的名字
	};

**值类型传递的数据是值传递 引用类型传递的是地址**

## js学习中的三种对象 ##

1. 内置对象;--------js系统自带的对象
2. 自定义对象;------自己定义的
3. 浏览器对象

参考MDN 离线文档

[https://developer.mozilla.org/zh-CN/](https://developer.mozilla.org/zh-CN/ "MDN文档离线手册")


字符串的不可变性

![](imgs/Str.png)

原因是:str的指向发生了改变,只有一个str!

![](imgs/strs.png)

## 数组的几个要记住的方法 ##

![](imgs/arry-rember.png)

1. .push(值);--->把值追加到数组中,所追加的数放到最后,返回值是追加之后的数组的长度,
2. .pop();------>删除数组中的最后一个元素,返回值就是删除的这个元素的值;
3. .shift();---->删除数组中的第一个元素,返回值就是删除的这个元素的值;
4. .unshift();-->向数组的第一个元素的前面插入一个新的元素,返回值是插入之后的数组的长度;
5. .map(函数);--->数组中的每个元素都要执行这个函数,把执行后的结果重新全部的放在一个新的数组中返回

## 基本包装类 ##
![](imgs/flag.png)

**一个需要注意的问题:函数f加不加括号的问题**

![](imgs/btn.png)

图中,f2后面没有加(),是将f2的代码放在onclick中让onclick去执行,如果是f2(),则是f2自己这个函数去执行,直接执行了.

for循环是在页面加载的时候执行的,事件是在触发的时候执行的!

**disabled====>禁用的;readonly======>只读的**

对于网页的开关灯,给body标签设置添加一个class属性的style样式为black就行了,而且,document.body可以直接获得body对象;


----------
## 阻止超链接默认跳转的几种方法 ##

![](imgs/a-private.png)

第三种写法
![](imgs/a-three.png)

**区别是第三种方法是将代码直接给onclick事件,第二种方法是onclick事件去执行f1函数**

## 获取元素的方式 ##
1. 根据ID属性获取元素,返回来的是一个对象,
	document.getElementById("id")
2. 根据标签名字获取元素,返回来的是一个数组,里面保存了多个DOM对象
	document.getElementById("标签名字")
3. 根据name属性的值获取元素,返回来的是一个伪数组,里面保存了多个DOM的对象,
 document.getElementByName("name的属性值")
4. 根据class 的样式名字来获取元素,返回来的是一个伪数组,里面保存了多个DOM的对象,
	document.getElementByClassName("类名")
5. 根据选择器获取元素,返回来的是一个元素对象.
	document.querySelect("选择器的名字比如:#id")
6. 根据选择去获取元素,返回来的是一个伪数组,里面保存了多个DOM对象,

**如果一个属性在浏览器中不支持,那么这个属性的类型就是undefined**

## 如何判断浏览器的兼容性? ##
![](imgs/ie.png)

在脚本`<script>`标签中定义这个方法,就可以直接用了!

## 如何给标签设置自定义属性? ##

在html标签中,添加的自定义的属性,如果想要获取这个属性的值,需要使用getAttribute("自定义属性的名字"),才能获取到这个属性的值.

![](imgs/DOM-obj.png)

**设置自定义属性:**

![](imgs/DOM-attribute.png)

**移出某个标签的自定义的属性 removeAttribute('scope')**

![](imgs/remove-attribute.png)

**tab切换模块=======>原理是排他性**  

思路:

![](imgs/setindex.png)

**根据上面tab的index索引,下面的对应的div改变颜色!**

![](imgs/other-current.png)

# 什么是节点(node) #


答案是:标签,属性 ,文本(文字 空格 换行 )

概念:
文档:document
元素:页面中的所有标签,元素
节点:页面中的所有内容(标签,属性,文本(文字,空格,回车换行))
根元素:html标签

**节点的属性**


1. 可以使用标签元素点出来,属性节点点出来,
2. nodetype,节点的类型,1-->节点,2--->属性,3--->文本
3. nodename,节点的名字,标签节点--->大写的标签名字,属性节点--->小写的属性名字,文本节点---->#text
4. nodevalue,节点的值:标签节点---null,属性节点---属性值,文本节点---文本内容.


**单复选框的全选和单选**

思路:

![](imgs/checkout.png)

元素创建的三种方式:
1. document.write("标签的代码内容")------>会覆盖页面上的所有内容.
2. 对象.innerHTML='标签及代码';document.body.innerHTML="<p>这是一个p标签</p>"
3. document.createElement();

用原生DOM,注册一个鼠标点击事件,document.getElementById("标签的Id").onclick=function(){写鼠标点击后的代码}

**如果是循环的方式添加事件,循环中的函数,推荐用命名函数,如果不是循环的方式添加事件,推荐用匿名函数.****也就是说,循环中,最好是用命名函数比较好,这样可以节省空间.

![](imgs/on-mouseover.png)

**百度新闻免费代码**

*标签的css样式和DOM的css样式*

![](imgs/CSSborder.png)

图中的tableObj.border='1',是标签自带的border,给标签添加css属性,这样整个table标签中的tr 和td都有border属性,但是如若是tableObj.style.border='1px solid red' 这样是DOM属性,只有table有属性,table中的tr和td没有border属性.

点击一次只创建一个按钮!
**思路1:有则删除,无则创建**

看一下区别:
![](imgs/create-button.png)

这样的创建是,边创建,边删除(效率不是太好).

**思路2:不存在,就创建,存在就维持原样,不做任何操作**

![](imgs/createbButton.png)

# 如何为一个元素标签绑定多个事件? #

![](imgs/addEventListenner.png)

注意:对于IE8,可以用这个对象.attachEvent("有on的事件类型",事件处理函数),这个只有IE8支持

## 为任意元素,绑定任意事件##

![](imgs/attach-events.png)

**方法和函数的区别:**方法需要通过对象点才能调用执行(对象.sayHi();),函数可以直接使用(sayHello();)

*一句话,方法是有人调,函数是没有人调.*

# 为对象添加多个点击事件 #

## 绑定事件的区别 ##

![](imgs/different-event.png)

# 解绑事件 #

## 如何解绑事件? ##
用什么样的方式绑定事件,就应该用什么样的方式解绑事件,

1. 解绑事件,==>对象.on事件名字=null,-------->解绑事件,
2. 解绑事件,==>对象.removeEventListenner('没有on的事件类型',命名函数,false);
3. 解绑事件,==>detachEvent('on事件类型',命名函数)

**为任意的元素,解绑对应的事件**

![](imgs/deattach-event.png)

# 事件冒泡 #

如何设置阻止事件冒泡的事件.

![](imgs/stop-bubble.png)

事件的三个阶段:
1. 事件捕获阶段-->从外向里(true)
2. 事件目标阶段
3. 事件冒泡阶段-->从里向外(false)

![](imgs/event-add.png)

![](imgs/event-bubble.png)

## 为同一元素绑定多个不同事件,指向相同的事件处理函数 ##

![](imgs/more-attach-events.png)

**类似百度搜索的联想输入框**

项目目录URL:./Projects/js_demo

# 浏览器事件 #

window.onload=function(){};//页面加载的时候,触发的事件,
window.onunload=function(){};//页面关闭之后,触发的事件,
window.onbeforeunload=function(){};//页面关闭之前触发的事件,

## location对象 ##

location对象的属性和方法
![](imgs/location.png)

几种需要记住的属性和方法

![](imgs/location-href.png)

## history的一些属性(了解) ##

history.back()//页面后退
history.forward()//页面前进
history.go()// 输入你想进入的地址

扩展:

	(一):window.navigator.userAgent		// 用于判断浏览器的参数

	结果:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36

	(二):window.navigator.platform      // 可以判断浏览器所在的平台的系统平台类型
	结果:w32

**定时器的开始和结束**

![](imgs/interval.png)

## 一些案例 -->摇起来##

![](imgs/demo-random.png)

**点击鼠标移动div**

![](imgs/2018-07-21_102922.png)

备注:用 my$('dv').style.left,这个方法,只能获取到div这个标签属性中的left,获取不到在`<style>`这个标签中定义的left,所有用offsetLeft,这个方法,都可以获取到.

**封装动画函数**

![](imgs/2018-07-21_120849.png)
为了让定时器只启动一次,在启动定时器的时候,先清理定时器.

# 完整轮播图webapi第五天 #
## offset系列 ##

扩展:克隆,

![](imgs/2018-07-21_225932.png)

谁调用这个克隆的方法,谁就被克隆.

**图片跟着鼠标移动**

![](imgs/2018-07-22_003141.png)


----------

# 第六章#

## 1.scrool 系列 ##

相关介绍如下:

![](imgs/2018-07-22_101055.png)

div.scrollHeight,这个是卷出去的距离.即,卷出div的距离.

获取任意一个元素的任意一个属性的当前值

![](imgs/2018-07-22_161314.png)

变速动画函数,封装,任意多个属性,和回调函数,及层级,还有透明度!

	function animate(element, json, fn) {
    clearInterval(element.timeId);//清理定时器
    //定时器,返回的是定时器的id
    element.timeId = setInterval(function () {
      var flag = true;//默认,假设,全部到达目标
      //遍历json对象中的每个属性还有属性对应的目标值
      for (var attr in json) {
        //判断这个属性attr中是不是opacity
        if (attr == "opacity") {
          //获取元素的当前的透明度,当前的透明度放大100倍
          var current = getStyle(element, attr) * 100;
          //目标的透明度放大100倍
          var target = json[attr] * 100;
          var step = (target - current) / 10;
          step = step > 0 ? Math.ceil(step) : Math.floor(step);
          current += step;//移动后的值
          element.style[attr] = current / 100;
        } else if (attr == "zIndex") { //判断这个属性attr中是不是zIndex
          //层级改变就是直接改变这个属性的值
          element.style[attr] = json[attr];
        } else {
          //普通的属性
          //获取元素这个属性的当前的值
          var current = parseInt(getStyle(element, attr));
          //当前的属性对应的目标值
          var target = json[attr];
          //移动的步数
          var step = (target - current) / 10;
          step = step > 0 ? Math.ceil(step) : Math.floor(step);
          current += step;//移动后的值
          element.style[attr] = current + "px";
        }
        //是否到达目标
        if (current != target) {
          flag = false;
        }
      }
      if (flag) {
        //清理定时器
        clearInterval(element.timeId);
        //所有的属性到达目标才能使用这个函数,前提是用户传入了这个函数
        if (fn) {
          fn();
        }
      }
      //测试代码
      console.log("目标:" + target + ",当前:" + current + ",每次的移动步数:" + step);
    }, 20);
    }

[code/webapi/第六章/04源代码/11变速动画函数封装增加任意多个属性和回调函数及层级还有透明度.html](code/webapi/第六章/04源代码/11变速动画函数封装增加任意多个属性和回调函数及层级还有透明度.html)

## 旋转木马 ##

复习:arr.unshift("x")//向数组最前面添加一个x ;

arr.pop()//将数组的最后一个元素删除并返回这个删除的元素;

arr.shift("x")// 删除数组中的第一个元素,并返回这个被删除的元素;

arr.push("x")向数组最后添加一个元素'x'

## clinet系列 ##

![](imgs/2018-07-22_220735.png)

clinet系列:可视区域 简介如下图:

![](imgs/2018-07-22_221117.png)

图片跟着鼠标移动(鼠标移动事件)

![](imgs/even.png)

# 第七章 #

1. offset系列
2. scroll系列
3. client系列

![](imgs/2018-07-22_224231.png)
![](imgs/2018-07-22_224324.png)

**插入: for/in 循环的一些注意事项,这个循环是用来更方便的遍历对象属性成员:**

	var obj={x:1,y:2,z:3};

	for(var i in obj){
		console.log(obj[i])		
	};
	输出结果:1 2 3



	var obj={x:1,y:2,z:3};
	var arr=[] ,i=0;
	for(arr[i++] in obj);
	输出结果:arr ["x", "y", "z"]

for/in 循环不会遍历对象的所有属性,只有'可枚举的'属性才会被遍历到,对于稀疏数组中的属性,无法遍历出来,对象可以继承其他对象的属性,那些继承的自定义属性名,也可以遍历出来.

arr.unshift('xx'),是向前添加一个'xx'元素,并返回数组的长度


测试:

	var  arr=[{name:'张三',age:23,address:'深圳'},{name:'李四',age:33,address:'北京'}];

	arr.map(fuction(e){return e.name;});

## 图片跟着鼠标飞行 ##


  //图片跟着鼠标飞,可以在任何的浏览器中实现

  //window.event和事件参数对象e的兼容

  //clientX和clientY单独的使用的兼容代码

  //scrollLeft和scrollTop的兼容代码

  //pageX,pageY和clientX+scrollLeft 和clientY+scrollTop

//把代码封装在一个函数

 //把代码放在一个对象中

	var evt={
    //window.event和事件参数对象e的兼容
    getEvent:function (evt) {
      return window.event||evt;
    },
    //可视区域的横坐标的兼容代码
    getClientX:function (evt) {
      return this.getEvent(evt).clientX;
    },
    //可视区域的纵坐标的兼容代码
    getClientY:function (evt) {
      return this.getEvent(evt).clientY;
    },
    //页面向左卷曲出去的横坐标
    getScrollLeft:function () {
      return window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft||0;
    },
    //页面向上卷曲出去的纵坐标
    getScrollTop:function () {
      return window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop||0;
    },
    //相对于页面的横坐标(pageX或者是clientX+scrollLeft)
    getPageX:function (evt) {
      return this.getEvent(evt).pageX? this.getEvent(evt).pageX:this.getClientX(evt)+this.getScrollLeft();
    },
    //相对于页面的纵坐标(pageY或者是clientY+scrollTop)
    getPageY:function (evt) {
      return this.getEvent(evt).pageY?this.getEvent(evt).pageY:this.getClientY(evt)+this.getScrollTop();
    }

	 };
  //最终的代码

  	document.onmousemove=function (e) {
    my$("im").style.left=evt.getPageX(e)+"px";
    my$("im").style.top=evt.getPageY(e)+"px";
  	};

如果点击a标签不做任何跳转,可以这样做

	<a href="javascript:void(0);"></a>

可以设置点击的时候,返回false,阻止a标签的默认跳转,和阻止事件冒泡

![](imgs/2018-07-31_002724.png)

设置鼠标移动的时候,文字不被选中:

window.getSelection?window.getSelection.removeAllRanges():document.selection.empty();

元素隐藏的不同方式:

隐藏div

1. 不占位置:document.getElementById('id').style.display='none';
2. 占位置的:document.getElementById('id').style.visibility="hidden";

字符串的不可变性质:

var str= 'qbsdfs';
str[1]=A;
console.log(str);//结果还是: qbsdfs,
原样是:字符串的指向改变了,但是值没有改变

var str= 'qbsdfs';
str='456';
console.log(str);
结果是:456;
原来指向字符串:qbsdfs,现在指向456,但是内存没有改变,如果指向变多,大量的开辟储存空间,内存消耗大.

## 原形对象的相关知识: ##

![](imgs/2018-08-04_221038.png)

原形的简单方法,手动修改原形构造器的指向,
![](imgs/2018-08-04_224939.png)

原形中的方法可以相互调用

**实例对象中所使用的方法和属性,先在实例中查找,找到了,则直接使用,找不到,则去实例对象的__protot__所指向的原形对象prototype中查找,找到了则使用,找不到则报错**

为系统内置对象添加原形方法,

例如:Array.prototype.sayHi=function(){
console.log(this+"呵呵")
}

 var arr='xxx';
arr.sayHi();

**局部变量变成全局变量,**

![](imgs/2018-08-04_232554.png)



# 原形和原形链之间的关系 #

![](imgs/2018-08-19_161040.png)

**实例对象的原形__proto__指向的是该对象所在的构造函数的原形对象**

**构造函数的原形对象(prototype)的指向如果改变了,实例对象的原形(__proto__)指向也会发生改变,原形的指向是可以发生改变的.**

**实例对象和原形对象之间的关系是通过__proto__原形来链接起来的,这个关系就是原形链.**

** 当试图从一个对象中找到某个属性的时候,如果这个对象本身没有这个属性,那么会去这个对象的__proto__属性的值中查找(也就是这个对象的构造函数的prototype属性中查找),因为这个原型属性的值是一个对象(原型对象),既然是原型对象,那么只要是对象那么肯定会有构造函数,这个构造函数肯定会有prototype这个属性,然后这个prototype属性的值也是对象,以此类推,一直查找!**

`let obj ={} obj.__proto__ === Object.prototype`

<b>所有引用类型的隐式原型对象(`__proto__`)完全等于这个引用类型对象的构造函数的显示原型对象(`prototype`) </b>
![](imgs/2018-08-19_164244.png)

## 原形的继承 ##

![](imgs/2018-08-19_183728.png)

## 函数声明和函数表达式的区别 ##

![](imgs/2018-08-19_231231.png)

函数的声明:
function foo(){
};

函数表达式:
var foo =function(){
};
## 函数中的一些对象 ##

![](imgs/2018-08-25_092427.png)

## 函数作为返回值以及函数作为参数的作用地方 ##

![](imgs/2018-08-25_173752.png)

![](imgs/2018-08-25_173904.png)

**预解析**

所谓的预解析,就是在浏览器进行解析代码之前,将变量的声明或者函数的声明提升到该作用域的最上面

instanceof 是用来判断引用类型属于那个构造函数的方法

// 变量的提升
console.log(num)    //结果出现undefined
var num =200;

//函数的声明被提前了
f1();
function f1(){
	console.log('这个函数能执行 ')		
}


f2();
var f2=funcrion(){
console.log('不能执行到这来');
}

**重要:函数和变量的声明能提升,也就是能进行预解析,但是`赋值`不能进行预解析,如果出现undefined,说明这个函数或者变量已经进行了声明,但是没有进行赋值.**

# 闭包的作用,概念,作用,优点和缺点 #

**一个函数的作用域,是在他定义的时候确定的,并不是在他执行的时候确定的**

闭包的使用场景
1.函数作为返回值;
2.函数作为参数传递.

**1.**
`function Fu (){
  var a = 100 ;
  return function (){
    console.log(a)  // a 属于自由变量 会去父级作用域找
  }
  }
var a=200
var f=Fu();
f();  //  100  
  `

**2.**

`
function Fu(){
  var a = 100;
  return function (){
    //函数是在这时候声明定义的,那么这个a 就是这里作用域中的a 这个就是闭包;
    console.log(a)  // a 属于自由变量 会去父级作用域找
  }
}
var f = Fu();
function Fu2 (fu){
  var a = 200 ;
  fu();
}
Fu2(f);//  100
`

![](imgs/2018-08-26_110305.png)

## 沙箱 ##

![](imgs/2018-08-26_123448.png)

## 递归求和  ##

![](imgs/2018-08-26_124028.png)

## 浅拷贝 ##

![](imgs/2018-08-26_180051.png)

## 深拷贝 ##

![](imgs/2018-08-26_180823.png)

# 正则表达式 #

 ^ 表示的是	以什么开始,或者是取非(反),

![](imgs/2018-08-27_000211.png)

# 创建正则表达式的2种方式 #

![](imgs/2018-08-28_230939.png)

![](imgs/2018-08-28_231117.png)

在浏览器中输入: escape('你好'); 可以将中文转换为字符编码
同时用unescape('%u4F60%u597D')可以将字符编码转换成中文

![](imgs/2018-08-28_233756.png)

**封装正则表达式**

![](imgs/2018-08-28_235442.png)

![](imgs/2018-08-28_235958.png)

![](imgs/2018-08-29_000849.png)

g是全局替换,i是忽略大小写

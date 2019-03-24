---
layout:     post
title:      Interview-summary
subtitle:   Record the topics encountered during the interviews these days.
date:       2019-3-21 20:59:21
author:     gankai
header-img: img/timg-2019-3-21.jpg
catalog: true
tags:
   - JavaScript
   - css
   - html
   - http协议
---

# 每天进步一点点,赢在别人休息时!

我的答案可能不是那么准确,如过各位伙伴有更好的答案,欢迎批评指正,欢迎大家提issues!

####  什么是闭包?

`我的答案是:`闭包其实就是作用域内的函数,就是链接内部函数和外部函数之间的桥梁.

`闭包的官方解释是：  闭包是指有权访问另一个函数作用域中的变量的函数。`  

####  js为什么是单线程的?

`我的答案是:`js最初设计的时候,就是做浏览器页面交互的,如果是多线程的,可能存在同一时间,两个进程同时操作同一个dom的情况,一个操作对这个dom进行编辑,另一个进程同时进行删除,同时下发两个指令,那么浏览器应该怎么操作,听谁的?
[链接](https://www.cnblogs.com/langzianan/p/8403330.html)
####  当一个页面数据比较多的时候,出现滚动条的时候,你怎么优化这个页面?
`我的答案是:`面试官的答案是:当页面数据比较多会出现滚轮的时候,你要考虑的是,当用户滚动滚轮,你应该想得到,哪些数据我要立马向后台请求过来的,或者说提前缓存过来的,哪些事件需要立刻绑定上去的,以及对于已经滚动出去的页面,怎样清理内存空间,取消绑定事件等操作.
我的答案是:把多个http请求归纳为一个,以便减少通讯消耗的时间.重写请求数据的方法,去除无用的操作;分发异步执行多个任务,然后统一返回,去除同步执行代码消耗的时间;对于一些耗时较长的逻辑加缓存;
总结:请求优化,资源优化,以及缓存;

####  CSS选择符有哪些?哪些属性可以继承?优先级算法如何计算?内联和!important哪个优先级高?
`我的答案是:`通用(`*`),id(#),类别(.),标签(tag),后代(>),子代(div p),群组(ul,ul),相邻同胞(p+span),伪类(a:hover),属性([attr]);

####  行内元素有哪些？块级元素有哪些？ 空(void)元素有那些?
`我的答案是:`行内元素有 a b i input img label textarea span strong  select;
块级元素:div dir dl form h1-h6 hr menu ol ul p  
空元素:br hr input img link meta
继承:css继承一般是指文本方面的继承 ,盒子模型相关的基本上没有继承的;
块级元素可以继承的:text-indent;text-aline;行级别元素可以继承的:lettter-spacing,world-spacing,line-height,color,font相关
####  什么是doctype?
`我的答案是:`百度百科:doctype标签是一种标准通用标记语言的文档类型申明,它的目的是告诉通用标准语言解析器,它应该使用什么样的文档类型定义来解析文档.  
####  至少写2种css hack
`我的答案是:`只有IE6能识别的`_`例如:`_background-color:red;`;`*`IE6和IE7能识别,IE8和Firefox不能识别;

         lt   小于
    　　 gt　 大于
    　　 gte  大于或等于
    　　 lte  小于或等于
    　　 ！   非

1.条件hack:

    <!--[if lt IE 7]>    // 小于IE7的
    html代码
    <![endif]-->

2.属性级别的hack:

      #test{
        color:#c30; /* For Firefox */
        color:red\0; /* For Opera */
        color:yellow\9; /* For IE8+ */
        *color:blue; /* For IE7 */
        _color:#ccc; /* For IE6 */
      }

3.选择符级别的hack

`*` html .test{
  color:red;   /* For IE6 and earlier */
}

`*` `+` html `.`test{
  color:red;  // For IE7
}
.test:lang(zh-cn){
  color:red;  // for IE8+ and not IE
}
.test:nth-child(1){
  color:red;  // for IE9+ and not IE
}  
**

####  如何让一个div水平垂直居中?

      <div class='outer'>
        <div class='inner'></div>
      </div>

css:

        .outer{
          width:300px;
          height:300px;
          position:relative;
          overflow:auto
        }
        .inner{
          width:130px;
          height:130px;
          position:absolute;
          maigin:auto;
        }

####  以下代码执行后,弹窗中依次弹出的内容是什么?请说明为什么?
          +
          function () {
            alert(a)
            a()
            var a = function () {
                console.log('1')
            }

            function a() {
                console.log('2')
            }
            alert(a)
            a()
            var d = c = a
          }()
          alert(d)
          alert(c)

`我的答案是:`考察闭包和变量的提升的,依次出现的内容是:

==> function a (){
  console.log('2')
}

==> 2

==> function (){
  console.log('1')
}

==> 1

==> VM49:16 Uncaught ReferenceError: d is not defined
    at <anonymous>:16:17

`注意`:其中变量c是全局变量,若将alert(d)注释掉,alert(c)将会打印出函数1

#### 以下代码有什么问题,请说出改进的方法?

    for (var i = 0; i < 10; i++) {
        document.body.innerHTML += '<li></li>'
    }

`我的答案是:`

    var html = ''
    for (var i = 0; i < 10; i++) {
        html += '<li></li>'
    }
    document.body.innerHTML = html

#### 什么是CDN,请说明使用CDN的好处?


####  css是什么?css盒子模型有哪些属性?  

`我的答案是:`:css中文叫做层叠样式表,盒子模型分为IE模型和标准w3模型两种,W3盒子模型中的属性width,height 不包括:border和padding,而IE盒子模型中的width和height包括了 border和padding   

`box-sizing`相关:

    标准w3盒模型: content-box  
    IE盒模型:border-box

####  你开发的项目一般是在哪个浏览器上,他们的内核是什么?你是如何优化的?

`我的答案是:`一般是在chrome和IE浏览器上比较多,


####  px和em的区别?
####  src和href的区别?
####  display:none和visibility: hidden的区别?
####  同步和异步的区别,他们的作用是什么?
####  如何截取一个URL = https://www.baidu.com/index.php?id=1&code=2中的参数?
####  什么是ajax,交互是什么?手写一个ajxa
####  <meta http-equiv="X-UA-Compatible" content="ie=edge">这句话的意思是什么?
####  jQuery如何增加 删除 修改 移动元素或者属性?
####  你常用的库有哪些?他们有哪些特点?
####  手写一个闭包
####  js的基本类型有哪些?
####  如果你的工程会在不同分辨率上显示,你会怎么处理?
####  原生js实现斐波那契数列。
####  setTimeout 和setInterval 的区别
####  什么是跨域,为什么话发生跨域,如何解决?
####  cookie有哪些优点?

## 算法题目:

####  请写一个冒泡排序

####  用push手写一个快速排序

####  统计一个字符串出现最多的字母

####  list是一个1~100之间的数组,如何让他依次打印出来?如果list是无序的如何让他有序排列?

## 逻辑题

#####  有2个桶,第一个桶中装的是蓝色油漆,第二个桶装的是红色油漆,假设这两个桶中的油漆,除了颜色不一样,其他的都一样,现在我用勺子,从蓝色桶中舀一勺蓝色油漆,放入装有红色油漆的桶中,然后搅拌,让他们充分混合均匀,然后再用勺子从红色油漆桶中舀一勺混合后的油漆,放入装有蓝色油漆的桶中,最后

`问:`
1. 是蓝色油漆桶中的蓝色油漆多,还是红色油漆桶中的红色油漆多,为什么?
2. 蓝色油漆桶中: blue =  蓝色油漆/红色油漆 , 红色油漆桶中:red = 红色油漆/蓝色油漆,最后blue和red的值相比较,结果是什么?

`分析:`

更具题目中的信息可知:刚开始的时候,两桶油漆除了颜色不同,其他的都一样,可知:

假设初始的时候,蓝色油漆桶和红色油漆桶的中容量都是  `i`

从蓝色油漆桶中舀一勺蓝色油漆,假设这一勺蓝色油漆的容量为x,放入红色油漆桶中,混合均匀后:

此时,蓝色油漆桶中的蓝色油漆为: `i-x`

红色油漆桶中的油漆是红蓝混合的: `i + x`

此时:又从红色油漆桶(这时候里面的油漆是红蓝混合的)中舀一勺油漆,容量也是i,放入蓝色油漆桶中,混合后:

此时: 蓝色油漆桶中的油漆(也是红蓝混合的)为:`(i-x) + x`   

红色油漆桶中的油漆(也是红蓝混合的)为: `i+x - x`

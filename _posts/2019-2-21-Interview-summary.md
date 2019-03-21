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

<h1> 每天进步一点点,赢在别人休息时, 励志前行,未来可期!</h1>

* 说一下闭包?
`答案:`
      闭包其实就是作用域内的函数,就是链接内部函数和外部函数之间的桥梁.
### js为什么是单线程的?
`答案:`js最初设计的时候,就是做浏览器页面交互的,如果是多线程的,可能存在同一时间,两个进程同时操作同一个dom的情况,一个操作对这个dom进行编辑,另一个进程同时进行删除,同时下发两个指令,那么浏览器应该怎么操作,听谁的?
[链接](https://www.cnblogs.com/langzianan/p/8403330.html)
<li>当一个页面数据比较多的时候,出现滚动条的时候,你怎么优化这个页面?</li>
`答案:`面试官的答案是:当页面数据比较多会出现滚轮的时候,你要考虑的是,当用户滚动滚轮,你应该想得到,哪些数据我要立马向后台请求过来的,或者说提前缓存过来的,哪些事件需要立刻绑定上去的,以及对于已经滚动出去的页面,怎样清理内存空间,取消绑定事件等操作.
我的答案是:把多个http请求归纳为一个,以便减少通讯消耗的时间.重写请求数据的方法,去除无用的操作;分发异步执行多个任务,然后统一返回,去除同步执行代码消耗的时间;对于一些耗时较长的逻辑加缓存;
总结:请求优化,资源优化,以及缓存;

<li>CSS选择符有哪些?哪些属性可以继承?优先级算法如何计算?内联和!important哪个优先级高?</li>
`答案:`
通用(*),id(#),类别(.),标签(tag),后代(>),子代(div p),群组(ul,ul),相邻同胞(p+span),伪类(a:hover),属性([attr])
<li>行内元素有哪些？块级元素有哪些？ 空(void)元素有那些?</li>
`答案:`行内元素有 a b i input img label textarea span strong  select;
块级元素:div dir dl form h1-h6 hr menu ol ul p  
空元素:br hr input img link meta
继承:css继承一般是指文本方面的继承 ,盒子模型相关的基本上没有继承的;
块级元素可以继承的:text-indent;text-aline;行级别元素可以继承的:lettter-spacing,world-spacing,line-height,color,font相关
<li>什么是doctype?</li>
`答案:`百度百科:doctype标签是一种标准通用标记语言的文档类型申明,它的目的是告诉通用标准语言解析器,它应该使用什么样的文档类型定义来解析文档.  
<li>至少写2种css hack</li>
<li>如何让一个div水平垂直居中?</li>
<li>css是什么?css盒子模型有哪些属性?</li>
<li>你开发的项目一般是在哪个浏览器上,他们的内核是什么?你是如何优化的?</li>
<li>px和em的区别?</li>
<li>src和href的区别?</li>
<li>display:none和visibility: hidden的区别?</li>
<li>同步和异步的区别,他们的作用是什么?</li>
<li>如何截取一个URL = https://www.baidu.com/index.php?id=1&code=2中的参数?</li>
<li>什么是ajax,交互是什么?手写一个ajxa</li>
<li><meta http-equiv="X-UA-Compatible" content="ie=edge">这句话的意思是什么?</li>
<li>jQuery如何增加 删除 修改 移动元素或者属性?</li>
<li>你常用的库有哪些?他们有哪些特点?</li>
<li>手写一个闭包</li>
<li>js的基本类型有哪些?</li>
<li>如果你的工程会在不同分辨率上显示,你会怎么处理?</li>
<li>原生js实现斐波那契数列。</li>
<li>setTimeout 和setInterval 的区别</li>
<li>什么是跨域,为什么话发生跨域,如何解决?</li>
<li>cookie有哪些优点?</li>

<h4>算法题目:</h4>

<li>请写一个冒泡排序</li>
<li>用push手写一个快速排序</li>

<li>统计一个字符串出现最多的字母</li>

<li>list是一个1~100之间的数组,如何让他依次打印出来?如果list是无序的如何让他有序排列?</li>

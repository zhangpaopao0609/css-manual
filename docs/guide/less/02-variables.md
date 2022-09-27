---
page: true
title: overview
outline: deep
returnToTop: true
---

# 变量

变量：定义一个常用值

## 1. 概览

在样式表中使用某个值数十次甚至数百次的情况并不少见，如下：

```less
a,
.link {
  color: #428bca;
}
.widget {
  color: #fff;
  background: #428bca;
}
```

变量使得能够在某一处来控制这些值，这样会让我们的代码更易于维护，定义变量的方式非常简单，`@xxxx` 即可，即在字符串前加上 `@` 符号来进行声明。

```less
// 变量
@link-color: #428bca;
@link-color-hover: darken(@link-color, 10%);

// 用法
a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}
```

生成的结果如下：

```css
a,
.link {
  color: #428bca;
}
a:hover {
  color: #3071a9;
}
.widget {
  color: #fff;
  background: #428bca;
}
```

## 2. 变量插值

上面的例子使用了变量来控制 CSS 规则中的值，除此之外，变量还可以在其他地方使用，例如选择器名称、属性名称、URL 和 `@import` 语句。

1. 选择器

   ```less
   // 变量
   @my-selector: banner;

   // 用法
   .@{my-selector} {
     font-weight: bold;
     line-height: 40px;
     margin: 0 auto;
   }
   ```

   生成的结果如下：

   ```css
   .banner {
     font-weight: bold;
     line-height: 40px;
     margin: 0 auto;
   }
   ```

2. urls

   ```less
   // 变量
   @images: '../img';

   // 用法
   body {
     color: #444;
     background: url('@{images}/white-sand.png');
   }
   ```

   生成的结果如下：

   ```css
   body {
     color: #444;
     background: url('../img/white-sand.png');
   }
   ```

3. import 表达式

   ```less
   // 变量
   @variables: './variables';

   // 用法
   @import '@{variables}/index.less';
   ```

4. 属性

   ```less
   @property: color;

   .widget {
     @{property}: #0ee;
     background-@{property}: #999;
   }
   ```

   生成的结果如下：

   ```css
   .widget {
     color: #0ee;
     background-color: #999;
   }
   ```

## 3. 用变量定义变量

在 Less 中，您可以使用一个变量来定义另一个变量。

写法 1：

```less
@primary: green;

.section {
  @color: @primary;

  .element {
    color: @color;
  }
}
```

生成的结果如下：

```css
.section .element {
  color: green;
}
```

写法 2：

```less
@primary: green;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}
```

生成的结果如下：

```css
.section .element {
  color: green;
}
```

> 我个人觉得写法 1 更容易理解

## 4. 懒声明

变量不必非得在使用前声明，也就是说，在使用这个变量前，这个变量可以没有被声明，可以后置声明。

> 这跟 es6 前的 js 一样，用 var 声明的变量可以后置，但我个人觉得这样真的不好，代码混乱不说，还容易出错

下面均为有效的 less 代码

```less
.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;
```

```less
.lazy-eval {
  width: @var;
  @a: 9%;
}

@var: @a;
@a: 100%;
```

上面两段代码都是有效的，且结果均如下：

```css
.lazy-eval {
  width: 9%;
}
```

当同一个变量被定义多次时，使用变量，会从当前范围从下往上查找，将使用最后一个定义的变量，也就是后一个定义会覆盖前一个定义。 这和 css 很类似，后一个属性会覆盖前一个。

例如：

```less
@var: 0;
.class {
  @var: 1;
  .brass {
    @var: 2;
    width: @var;
    @var: 3;
  }
  width: @var;
}
```

生成的结果为：

```css
.class {
  width: 1;
}
.class .brass {
  width: 3;
}
```

本质上，每个作用域范围都有一个“最终”值，浏览器中的属性也是如此，例如使用自定义属性的示例：

```css
.header {
  --color: white;
  color: var(--color); /* 最终 color 将为 black */
  --color: black;
}
```

这意味着，Less 变量的行为与 CSS 非常相似。

## 5. 属性作为变量

可以直接使用 `$propName` 语法轻松地将属性视为变量。 示例如下：

```less
.widget {
  color: #efefef;
  background-color: $color;
}
```

这里使用 `$color` 作为变量，对应的值

生成的结果为：

```less
.widget {
  color: #efefef;
  background-color: #efefef;
}
```

当然，与变量一样，属性变量在查找时，同样是按照最后一个定义会覆盖前面所有定义的原则。

```less
.block {
  color: red;
  .inner {
    background-color: $color;
  }
  color: blue;
}
```

生成的结果为：

```less
.block {
  color: red;
  color: blue;
}
.block .inner {
  background-color: blue;
}
```

---
page: true
title: Detached Rulesets
outline: deep
returnToTop: true
---

# 变量规则集

将规则集赋值给变量

> 以下称为变量规则集

## 1. 概述

Less 支持将规则集赋值给变量，如此可以更灵活便捷的使用规则集。

示例如下：

```less
// 规则集赋值给变量
@detached-ruleset: {
  background: red;
}; // 3.5 以后分号可选

// 使用
.top {
  @detached-ruleset();
}
```

生成的结果如下：

```css
.top {
  background: red;
}
```

使用变量规则集时必须添加括号（除了查找属性值外）。

除了直接使用外，还可以在 mixin 中做为参数进行传递。

```less
.desktop-and-old-ie(@rules) {
  @media screen and (min-width: 1200px) {
    @rules();
  }
  html.lt-ie9 & {
    @rules();
  }
}

header {
  background-color: blue;

  .desktop-and-old-ie({
    background-color: red;
  });
}
```

生成的结果如下：

```css
header {
  background-color: blue;
}
@media screen and (min-width: 1200px) {
  header {
    background-color: red;
  }
}
html.lt-ie9 header {
  background-color: red;
}
```

如果变量规则集中包含了 mixin，那么调用后，其中所有的 mixin 都能被当前层级调用，但是，变量不可以。

```less
// 变量对应的规则集中包含 mixin
@detached-ruleset: {
  .mixin() {
    color: blue;
  }
};

// 调用后，可以使用其中的 mixin
.caller {
  @detached-ruleset();
  .mixin();
}
```

生成的结果如下：

```css
.caller {
  color: blue;
}
```

变量不会返回

```less
@detached-ruleset-1: {
  @color: blue;
};

.caller {
  @detached-ruleset-1();
  // color: @color; // variable @color is undefined
}
```

## 2. 作用域

> 这里文档中还有作用域这一小节，但我发现存在一些问题，待考证后再来写一些小结

## 3. 属性/变量访问器

### 3.1 查找

从 Less 3.5 开始，您可以使用属性/变量访问器从变量对应的规则集中选择值。

```less
@config: {
  option1: true;
  option2: false;
};

.mixin() when (@config[option1] = true) {
  selected: value;
}

.box {
  .mixin();
}
```

生成的结果如下：

```css
.box {
  selected: value;
}
```

如果查找返回的是另一个分离的规则集，则可以使用第二次查找来获取该值。

```less
@config: {
  @colors: {
    primary: blue;
  };
};

.box {
  color: @config[ @colors][primary];
}
```

### 3.2 查找中的变量

```less
@config: {
  @dark: {
    primary: darkblue;
  };
  @light: {
    primary: lightblue;
  };
};

.box {
  @lookup: dark;
  color: @config[ @@lookup][primary];
}
```

生成的结果如下：

```css
.box {
  color: darkblue;
}
```

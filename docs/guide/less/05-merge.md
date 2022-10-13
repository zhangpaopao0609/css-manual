---
page: true
title: extend
outline: deep
returnToTop: true
---

# Merge

## 1. 概述

用于合并属性，合并实现了将同一个属性的多个值进行聚合，两种方式聚合，用逗号或者空格。

在使用如 `background`、`transform` 之类的属性时，合并非常有用。

## 2. 逗号

在需要合并的属性后添加 `+`，这样，最终生成的属性值就是用逗号聚合起来的。

```less
.mixin() {
  box-shadow+: inset 0 0 10px #555;
}
.myclass {
  .mixin();
  box-shadow+: 0 0 20px black;
}
```

生成的结果如下：

```css
.myclass {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}
```

## 3. 空格

在需要合并的属性后添加 `+_`，这样，最终生成的属性值就是用空格聚合起来的。

```less
.mixin-1() {
  transform+_: scale(2);
}
.myclass-1 {
  .mixin-1();
  transform+_: rotate(15deg);
}
```

生成的结果如下：

```css
.myclass-1 {
  transform: scale(2) rotate(15deg);
}
```

要实现合并，必须要在所有需要合并的属性后添加 `+` 或者 `+_`。

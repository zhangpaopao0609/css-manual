---
page: true
title: extend
outline: deep
returnToTop: true
---

# Extend

## 1. 概述

Extend 是一个 Less 伪类，实现对当前层级规则的扩展。

```less
nav ul {
  &:extend(.inline);
  background: blue;
}
```

在上面的规则集中，`:extend` 选择器会将 `.inline` 的规则应用到”扩展选择器”即 `nav ul`上。同时， `nav ul` 本身的规则会保持原样。

如下所示：

```less
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}
```

生成的结果如下：

```css
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
```

## 2. 语法

`extend` 看起来像一个伪类，可以直接附加到选择器上，也可以在规则集中使用，还支持一个可选的关键字 `all`。
示例如下：

```less
// 方式 1：直接附加在选择器上
.a:extend(.b) {
  color: red;
}

// 方式 2：在规则集中使用
.a {
  &:extend(.b);
  color: red;
}

// 上面两种方式效果完全一致
```

关键字 `all` 的使用

```less
.c:extend(.d all) {
  // 扩展 `.d` 的所有相关选择器，例如 `.x.d` 或 `.d.x`
  color: red;
}
.c:extend(.d) {
  // 仅扩展选择器 `.d`
  color: red;
}
```

**当然，它也可以包含一个或多个要扩展的类，用逗号分隔**，示例如下：

```less
.e:extend(.f) {
  color: red;
}
.e:extend(.g) {
  color: red;
}

// 和上面两个得到的结果完全一致
.e:extend(.f, .g) {
  color: red;
}
```

## 3. 附加到选择器上

附加到选择器的 Extend 看起来像一个普通的伪类，选择器作为参数，同时一个选择器可以包含多个扩展子句，但所有扩展都必须位于选择器的末尾。

- 在选择器之后: `pre:hover:extend(div pre)`
- 选择器和扩展之间可以有空格：`pre:hover :extend(div-pre)`
- 允许多个扩展：`pre:hover:extend(div pre):extend(.bucket tr)`，其实这个与 `pre:hover:extend(div pre, .bucket tr)` 效果完全相同
- 扩展必须是最后一个，因此这是不允许的：`pre:hover:extend(div pre).nth-child(odd)`

如果规则集包含多个选择器，则其中任何一个都可以扩展，示例如下：

```less
// 附加到选择器
.bag {
  border: 1px solid;
}

.bucket {
  margin: 10px;
}

.show {
  display: block;
}

.big-division:extend(.bag),
.big-bag:extend(.bag, .show),
.big-bucket:extend(.bucket):extend(.show) {
  color: red;
}
```

生成的结果如下：

```css
.bag,
.big-division,
.big-bag {
  border: 1px solid;
}
.bucket,
.big-bucket {
  margin: 10px;
}
.show,
.big-bag,
.big-bucket {
  display: block;
}
.big-division,
.big-bag,
.big-bucket {
  color: red;
}
```

## 4. 在规则集中使用

除了附在在选择器后面，还可以直接在规则集中使用，父选择器也是支持的，如：`&:extend(selector)`，而且，放入规则集后，这个规则集对应的所有选择器都将被扩展（一种快捷方式）。

```less
.ru {
  top: 10;
}

pre:hover,
.some-class {
  &:extend(.ru);
  left: 20;
}

// 和上面写法完全一致
pre:hover:extend(.ru),
.some-class:extend(.ru) {
  left: 20;
}
```

生成的结果如下：

```css
.ru,
pre:hover,
.some-class {
  top: 10;
}
pre:hover,
.some-class {
  left: 20;
}
```

## 5. 扩展嵌套选择器

Extend 能够匹配嵌套选择器。以下更少：

```less
.bucket {
  tr {
    // 嵌套的选择器
    color: blue;
  }
}
.some-class:extend(.bucket tr) {
  border: 1px;
}
```

生成的结果如下：

```css
.bucket tr,
.some-class {
  color: blue;
}
.some-class {
  border: 1px;
}
```

而且，扩展最终使用的是 css，而不是原来的 less。

```less
.bucket {
  tr & {
    color: blue;
  }
}
.some-class:extend(tr .bucket) {
  border: 1px;
}
```

生成的结果如下：

```css
tr .bucket,
.some-class {
  color: blue;
}
.some-class {
  border: 1px;
}
```

## 6. 精确匹配

在默认情况下，`:extend(selector)` 会去精确匹配选择器，也就是需要完全相同才会匹配。

```less
.a.class,
.class.a,
.class > .a {
  color: blue;
}
.test {
  border: 1px;
}
```

虽然在选择器中，`*.class` 和 `.class` 相等，但是 `extend` 不会匹配：

```less
*.class {
  color: blue;
}

// 匹配不到任何选择器
.noStar:extend(.class) {
  border: 1px;
}
```

伪类的顺序也很重要。选择器 `link:hover:visited` 和 `link:visited:hover` 的确是匹配同一组元素，但`extend` 不会匹配上：

```less
link:hover:visited {
  color: blue;
}

// 匹配不到任何选择器
.selector:extend(link:visited:hover) {
  border: 1px;
}
```

## 7. `nth` 表达式

在选择器中，表达式 `1n+3` 和 `n+3` 是等效的，但 `extend` 却不会匹配到它们：

```less
:nth-child(1n + 3) {
  color: blue;
}

// 匹配不到任何选择器
.child:extend(:nth-child(n + 3)) {
}
```

## 8. 属性选择器

有意思的是，属性选择器中的引号类型是无关紧要的

```less
[title='identifier'] {
  color: blue;
}
[title='identifier'] {
  color: blue;
}
[title='identifier'] {
  color: blue;
}

.noQuote:extend([title='identifier']) {
  border: 1px;
}
.singleQuote:extend([title='identifier']) {
  border: 1px;
}
.doubleQuote:extend([title='identifier']) {
  border: 1px;
}
```

生成的结果如下：

```css
[title='identifier'],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}
[title='identifier'],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}
[title='identifier'],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}
.noQuote {
  border: 1px;
}
.singleQuote {
  border: 1px;
}
.doubleQuote {
  border: 1px;
}
```

## 9. `all` 关键词

当在扩展参数后指定 `all` 关键字时，意味着告诉 Less 将该选择器作为另一个选择器的一部分进行匹配。匹配到的部分会进行替换，从而生成一个新的选择器。示例如下：

```less
a.b.test,
.test.c {
  color: orange;
}
.test {
  &:hover {
    color: green;
  }
}

.replacement:extend(.test all) {
  border: 1px;
}
```

生成的结果如下：

```css
a.b.test,
.test.c,
a.b.replacement,
.replacement.c {
  color: orange;
}
.test:hover,
.replacement:hover {
  color: green;
}
.replacement {
  border: 1px;
}
```

## 10. 变量

`extend` 不会和任何变量进行匹配，若选择器包含变量，会直接忽略。

```less
@variable: .bucket;
@{variable} {
  color: blue;
}
// 匹配不到任何选择器
.some-class:extend(.bucket) {
  border: 1px;
}
```

```less
.bucket {
  color: blue;
}

@variable: .bucket;
// 匹配不到任何选择器
.some-class:extend(@{variable}) {
  border: 1px;
}
```

> 官网指出：选择器使用变量时，是可以正常匹配的。但是我实验过后，发现是不能的，这里留待考究。

## 11. `@media` 中使用 `:extend`

`@media` 中的 `:extend` 仅匹配当前 `@media` 中的选择器。

```less
@media print {
  // 成功匹配
  .screenClass:extend(.selector) {
    left: 1;
  }
  // 同一个 media 中的选择器，匹配
  .selector {
    color: black;
  }
}
// 规则集在顶层，内层 extend 会忽略
.selector {
  color: red;
}

@media screen {
  // 规则集在另一 media 中，仅会被当前 media 中的 extend 匹配
  .selector {
    color: blue;
  }
}
```

生成的结果如下：

```css
@media print {
  .screenClass {
    left: 1;
  }
  .selector,
  .screenClass {
    color: black;
  }
}
.selector {
  color: red;
}
@media screen {
  .selector {
    color: blue;
  }
}
```

注意，同一个 `@media` 中嵌套的 `@media` 内的选择器也不会匹配

```less
@media screen {
  // 匹配不到任何选择器
  .screenClass:extend(.selector) {
    left: 1;
  }
  @media (min-width: 1023px) {
    // 选择器在嵌套的 media 中，无法匹配
    .selector {
      color: blue;
    }
  }
}
```

顶层的 extend 会去匹配所有层级的选择器

```less
@media screen {
  .selector-t {
    color: blue;
  }
  @media (min-width: 1023px) {
    .selector-t {
      color: blue;
    }
  }
}

// 顶层的 extend 会去匹配所有层级的选择器
.topLevel:extend(.selector-t) {
  left: 1;
}
```

生成的结果如下：

```css
@media screen {
  .selector-t,
  .topLevel {
    color: blue;
  }
}
@media screen and (min-width: 1023px) {
  .selector-t,
  .topLevel {
    color: blue;
  }
}
.topLevel {
  left: 1;
}
```

## 12. 重复检测

目前没有做重复检测如下：

```less
.alert-info,
.widget {
  left: 1;
}

.alert:extend(.alert-info, .widget) {
  top: 2;
}
```

生成的结果如下：

```css
.alert-info,
.widget,
.alert,
.alert {
  left: 1;
}
.alert {
  top: 2;
}
```

## 13. 使用示例

### 13.1 经典用例

典型的用例是避免重复写规则集。

比如：

```less
.animal {
  background-color: black;
  color: white;
}
```

如果期望覆盖 `animal` 的背景色，有两种方式：

第一种：改变 HTML，写两个类

```html
<a class="animal bear">熊</a>
```

```less
.animal {
  background-color: black;
  color: white;
}
.bear {
  background-color: brown;
}
```

第二种：使用 extend

```html
<a class="bear">熊</a>
```

```less
.animal {
  background-color: black;
  color: white;
}
.bear {
  &:extend(.animal);
  background-color: brown;
}
```

### 13.2 减小 CSS 体积

使用 mixins 非常方便，但 mixins 会将所有属性都复制到选择器中，这可能会导致不必要的重复。

因此，可以使用 `extends` 来替换 mixin 将选择器移动到希望使用的属性上，从而减少生成的 CSS。

来看一个示例对比：

1. 使用 mixin

```less
.my-inline-block() {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  .my-inline-block;
}
.thing2 {
  .my-inline-block;
}
```

生成的结果如下：

```css
.thing1 {
  display: inline-block;
  font-size: 0;
}
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

2. 使用 extends

```less
.my-inline-block {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  &:extend(.my-inline-block);
}
.thing2 {
  &:extend(.my-inline-block);
}
```

生成的结果如下：

```css
.my-inline-block,
.thing1,
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

### 13.3 样式组合

一个更高级的用法是，当选择器比较复杂时（此时 mixin 已经无法实现了，因为 mixin 只能和简单的选择器使用），又需要对规则集进行复用，那么便可以使用 `extends`。

```less
li.list > a {
  line-height: 20px;
}
button.list-style {
  &:extend(li.list > a);
}
```

生成的结果如下：

```css
li.list > a,
button.list-style {
  line-height: 20px;
}
```

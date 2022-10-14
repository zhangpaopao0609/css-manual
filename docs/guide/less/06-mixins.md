---
page: true
title: extend
outline: deep
returnToTop: true
---

# Mixins

## 1. 概述

Mixins 实现将规则集混合到另一个规则集中

混合时，可以使用任意的选择器，类、id 均可。

```less
.a,
#b {
  color: red;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}
```

生成的结果如下：

```css
.a,
#b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
```

在现有的版本中，mixin 在使用时圆括号是可选的，在之后的版本中，将移除这个可选特性，即使用时需要加上圆括号。

```less
.a();
.a; // 现在可用，但将移除
.a (); // 不能添加空格
```

## 2. 带括号的 mixin

如果期望的是，仅仅创建一个 mixin，但不希望该 mixin 最终出现在生成到 css 中，做法很简单，只需要 mixin 的声明定义后加上括号即可。

> 相应的也就是，如果不加上括号，那么最终就会输出到 css 中

```less
.my-mixin {
  color: black;
}
.my-other-mixin() {
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}
```

生成的结果如下：

```css
.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```

## 3. 包含选择器

mixin 中不仅可以包含属性，还可以包含选择器。

```less
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}
button {
  .my-hover-mixin();
}
```

生成的结果如下：

```css
button:hover {
  border: 1px solid red;
}
```

## 4. 命名空间

使用命名空间可以让我们更加灵活的使用 mixin。

```less
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer.inner();
}
```

需要注意的是：在旧版本中，Less 允许使用 `>` 和空格来使用命名空间，这种使用方式已经废弃掉了。因此，使用时直接接 mixin 即可。

```less
#outer > .inner(); // 废弃
#outer .inner(); // 废弃
#outer.inner(); // 正确使用方式
```

同时呢，命名空间还可以最大程度地减少 mixin 与其它三方库冲突，也可以理解为这是一种组织 mixin 的最佳实践。

```less
#my-library {
  .my-mixin() {
    color: black;
  }
}
// 使用
.class {
  #my-library.my-mixin();
}
```

## 5. 命名空间守卫

如果名称空间具有保护，则仅当保护条件返回 true 时，才会使用它定义的 mixin。

示例如下， 此时 `@mode: huge;` 那么只有 `#A` 才生效，`#B` 是无效的，所以，当使用 `#B.mixin()` 时，会出现 `#B.mixin is undefined` 的错误。

```less
@mode: huge;

#A when (@mode = huge) {
  .mixin() {
    color: red;
  }
}

#B when (@mode = mini) {
  .mixin() {
    border: 1px;
  }
}

.my {
  #A.mixin();
  // #B.mixin(); // #B.mixin is undefined
}
```

生成的结果如下：

```css
.my {
  color: red;
}
```

此外，名称空间守护除了直接应用在命名空间上之外，还可以直接用在 mixin 上，效果一样，都不会生效。不同之处在于，应用在命名空间上会报错，而应用在 mixin 上不会。

```less
#C {
  .mixin() when (@mode = mini) {
    top: 1;
  }
}

.me {
  #C.mixin();
}
```

生成的结果如下：

```css
.me {
  left: 2;
}
```

## 6. `!important` 关键字

使用 mixin 时，如果在 mixin 后添加了 `!important` 关键字，那么这个 mixin 下的所有属性都会添加上 `!important` 关键字。

```less
.foo (@bg: #f5f5f5; @color: #900) {
  background: @bg;
  color: @color;
}
.unimportant {
  .foo();
}
.important {
  .foo() !important;
}
```

生成的结果如下：

```css
.unimportant {
  background: #f5f5f5;
  color: #900;
}
.important {
  background: #f5f5f5 !important;
  color: #900 !important;
}
```

## 7. 参数

### 7.1 如何传递参数

mixin 可以接收参数，直接在使用时传递即可。

```less
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

#header {
  .border-radius(4px);
}
.button {
  .border-radius(6px);
}
```

生成的结果如下：

```css
#header {
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.button {
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}
```

还可以定义参数的默认值：

```less
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

header {
  .border-radius();
}
```

生成的结果如下：

```css
header {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
```

### 7.2 参数分隔符

目前，参数分隔符有两个：逗号和分号。

最初时，参数仅仅由逗号进行分隔，后来添加了分号，目的是用以支持将用逗号分隔的参数列表传递给单个参数。

- `.name(1, 2, 3; something, else)`： 代表两个参数，每个参数是用逗号分隔的列表
- `.name(1, 2, 3)`：代表三个参数
- `.name(1, 2, 3;)`：代表一个参数，参数是用逗号分隔的列表
- `.name(@param1: red, blue;)`：代表接收一个参数，参数的默认值为 `red, blue`
- 从 Less 4.0 开始，支持 `~()` 来包裹列表，如 `.name(@param1: ~(red, blue))`。

### 7.3 mixin 重载

相同名称、相同参数的多个 mixin 在 Less 中都是合法的，使用时都生效，会将对应的所有 mixin 全部混合在一起。如果使用 mixin 时传递了参数, 那么会将所有接口此参数的 mixin 混合在一起：

```less
.mixin-o(@color) {
  color-1: @color;
}
.mixin-o(@color, @padding: 2) {
  color-2: @color;
  padding-2: @padding;
}
.mixin-o(@color, @padding, @margin: 2) {
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}
.some .selector div {
  .mixin-o(#008000);
}
```

生成的结果如下：

```css
.some .selector div {
  color-1: #008000;
  color-2: #008000;
  padding-2: 2;
}
```

### 7.4 命名参数

通常情况下，mixin 在使用时，参数是按照顺序引用的，但可以通过指定参数名来传递对应的参数，这样，参数就可以不按照顺序传递，

```less
.mixin(@color: black; @margin: 10px; @padding: 20px) {
  color: @color;
  margin: @margin;
  padding: @padding;
}
.class1 {
  .mixin(@margin: 20px; @color: #33acfe);
}
.class2 {
  .mixin(#efca44; @padding: 40px);
}
```

生成的结果如下：

```css
.class1 {
  color: #33acfe;
  margin: 20px;
  padding: 20px;
}
.class2 {
  color: #efca44;
  margin: 10px;
  padding: 40px;
}
```

### 7.5 `@arguments` 变量

`@arguments` 在 mixin 中有特殊的含义，它包含在调用 mixin 时传递的所有参数。当希望一次性使用所有参数时，这将非常有用：

> 这与 js 中 arguments 完全一致，只是现在已经不推荐使用了

```less
.box-shadow(@x: 0, @y: 0, @blur: 1px, @color: #000) {
  -webkit-box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  box-shadow: @arguments;
}
.big-block {
  .box-shadow(2px, 5px);
}
```

生成的结果如下：

```css
.big-block {
  -webkit-box-shadow: 2px 5px 1px #000;
  -moz-box-shadow: 2px 5px 1px #000;
  box-shadow: 2px 5px 1px #000;
}
```

### 7.6 高级参数和 `@rest` 变量

当参数的个数不确定时，可以使用 `...`，这样，未被指定的剩余参数可以成功接收，同时还可以将这些参数指定为 `@rest` 变量

> 这与 js 中剩余参数完全一致

```less
.mixin(...) {
} // 可接收任意个数参数
.mixin(@a: 1, ...) {
}
.mixin(@a, ...) {
}
```

使用 `@rest` 变量

```less
.mixin(@a, @rest...) {
  // @rest 变量包含除 @a 以外的参数
  // @arguments 变量包含所有参数
}
```

## 8. 模式匹配

有时，在使用 mixin 时希望根据传递给它的获取到对应的规则。这就需要模式匹配，比如以下示例，希望根据 `@switch` 的值来获取不同的 mixin:

```less
.mixin(@s, @color) {
  ...;
}

.class {
  .mixin(@switch, #888);
}
```

要想实现这个目的，先来定义几个 mixin:

```less
.mixin(dark, @color) {
  color: darken(@color, 10%);
}
.mixin(light, @color) {
  color: lighten(@color, 10%);
}
.mixin(@_, @color) {
  display: block;
}
```

假设此时 `@switch: light;`：

```less
@switch: light;

.class {
  .mixin(@switch, #888);
}
```

那么，最终得到的结果为：

```css
.class {
  color: #a2a2a2;
  display: block;
}
```

假设此时 `@switch: dark;`：

那么，最终得到的结果为：

```css
.class {
  color: #6f6f6f;
  display: block;
}
```

以下是是上述代码匹配的过程：

- 第一个 mixin 不匹配，因为它第一个参数为 dark
- 第二个 mixin 匹配，因为它第一个参数为 light
- 第三个 mixin 匹配，因为它接收任何值

mixin 的参数如果是变量，那么匹配任意值，如果是非变量，那么仅匹配与这个值完全相同的值。

## 9. 将 mixin 用作函数

调用 mixin 时，获取属性和变量

### 9.1 属性/值访问器

从 Less 3.5 开始，支持使用属性/变量访问器 mixin 中获取属性和变量。

```less
.average(@x, @y) {
  @result: ((@x + @y) / 2);
}

div {
  // 调用 mixin 然后通过属性名 `@result` 获取对应的值
  padding: .average(16px, 50px) [ @result];
}
```

生成的结果如下：

```css
div {
  padding: 33px;
}
```

### 9.2 值覆盖

如果匹配到多个 mixin，则会计算并合并所有规则，并返回具有该标识符的最后一个匹配值。

```less
// library.less
#library() {
  .mixin() {
    prop: foo;
  }
}

// customize.less
@import 'library';
#library() {
  .mixin() {
    prop: bar;
  }
}

.box {
  my-value: #library.mixin[prop];
}
```

生成的结果如下：

```css
.box {
  my-value: bar;
}
```

### 9.3 未命名

如果没有在 `[@lookup]` 中指定查找值，那么将直接获取最后一个值。

```less
.average-2(@x, @y) {
  @result-1: ((@x + @y) / 2);
  @result-2: ((@x + @y) / 3);
}

.div-2 {
  padding: .average-2(16px, 50px) [];
}
```

```css
.div-2 {
  padding: 22px;
}
```

## 10. 递归

在 Less 中，mixin 可以自调用。

当与守卫和模式结合使用时，递归的 mixin 可以用来创建各种迭代/循环结构。

```less
.loop(@counter) when (@counter > 0) {
  .loop((@counter - 1));
  width: (10px * @counter);
}

div {
  .loop(5);
}
```

生成的结果如下：

```css
div {
  width: 10px;
  width: 20px;
  width: 30px;
  width: 40px;
  width: 50px;
}
```

使用递归循环生成 CSS 网格类：

```less
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
```

生成的结果如下：

```css
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

## 11. mixin 守卫

### 11.1 概述

当期望进行条件匹配时， mixin 守卫相当有用。为了尽可能接近 CSS 的声明习惯，Less 参照 `@media`，通过守卫来实现条件而不是 `if/else`。

来看一个示例：

```less
.mixin(@a) when (lightness(@a) >= 50%) {
  background-color: black;
}
.mixin(@a) when (lightness(@a) < 50%) {
  background-color: white;
}
.mixin(@a) {
  color: @a;
}
```

`when` 是一个关键字，它引入了一个守卫机制。现在，如果我们运行以下代码：

```less
.class1 {
  .mixin(#ddd);
}
.class2 {
  .mixin(#555);
}
```

那么最终得到的结果为：

```css
.class1 {
  background-color: black;
  color: #ddd;
}
.class2 {
  background-color: white;
  color: #555;
}
```

### 11.2 比较运算符

比较运算符的完整列表是：`>、>=、=、=<、<`，此外，还支持关键字 `true`，因此，下面这两个 mixin 等效：

```less
.truth(@a) when (@a) {
  ...;
}
.truth(@a) when (@a = true) {
  ...;
}
```

任何非 `true` 的均为否：

```less
.class {
  .truth(40); // 不会匹配到上述任何 mixin
}
```

同时，既可以参数之间比较，也可以非参数之间比较

```less
@media: mobile;

.mixin(@a) when (@media = mobile) {
  ...;
}
.mixin(@a) when (@media = desktop) {
  ...;
}

.max(@a; @b) when (@a > @b) {
  width: @a;
}
.max(@a; @b) when (@a < @b) {
  width: @b;
}
```

### 11.3 逻辑运算符

1. `and`
   `and` 的两侧结果均为 `true` 时结果才为 `true`.

```less
.mixin(@a) when (isnumber(@a)) and (@a > 0) {
  ...;
}
```

2. `,`
   使用用逗号来模拟逻辑或，只要其中一个结果为 `true`，则最终结果为 `true`。

```less
.mixin(@a) when (@a > 10), (@a < -10) {
  ...;
}
```

3. `not`
   逻辑非，结果为 `true`时，最终结果为 `false`，反之。

```less
.mixin(@b) when not (@b > 0) {
  ...;
}
```

### 11.4 类型检查

要进行类型匹配，可以使用 `is` 函数

```less
.mixin(@a; @b: 0) when (isnumber(@b)) {
  ...;
}
.mixin(@a; @b: black) when (iscolor(@b)) {
  ...;
}
```

以下是基本的类型检查函数：

- `iscolor`
- `isnumber`
- `isstring`
- `iskeyword`
- `isurl`

如果要检查一个值除了是一个数字外，还是否以特定的单位结尾，可以使用以下方法：

- `ispixel`
- `ispercentage`
- `isem`
- `isunit`

## 12. 别名

### 12.1 mixin 调用结果赋值给变量

mixin 调用结果可以赋值给变量

```less
#theme.dark.navbar {
  .colors(light) {
    primary: purple;
  }
  .colors(dark) {
    primary: black;
    secondary: grey;
  }
}

.navbar {
  @colors: #theme.dark.navbar.colors(dark);
  background: @colors[primary];
  border: 1px solid @colors[secondary];
}
```

生成的结果如下：

```css
.navbar {
  background: black;
  border: 1px solid grey;
}
```

### 12.2 变量调用

mixin 的调用结果赋值给变量后，变量可以进行调用

```less
#library() {
  .colors() {
    background: green;
  }
}
.box {
  @alias: #library.colors();
  @alias();
}
```

生成的结果如下：

```css
.box {
  background: green;
}
```

需要注意的是，与直接使用 mixin 不同的是，当把 mixin 赋值给变量时，mixin 必须要添加括号，否者无效

```less
#library() {
  .colors() {
    background: green;
  }
}
.box {
  @alias: #library.colors;
  @alias(); // ERROR: @alias 无法调用
}
```

这是因为在将 mixin 赋值给变量时，如果不调用，此时 Less 是无法确定的，因为在 Less 3.5 以后，变量可以直接用在选择器上：

```less
.box {
  @alias: #library.colors;
  @{alias} {
    a: b;
  }
}
```

以上生成的结果如下：

```css
.box #library.colors {
  a: b;
}
```

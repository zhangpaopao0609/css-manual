---
page: true
title: overview
outline: deep
returnToTop: true
---

Less（Leaner Style Sheets）是 CSS 可向后兼容的扩展。因为 Less 和 CSS 很像，同时 Less 仅是对 CSS 进行一些便捷性的扩展，所以学习它很容易。

Less 到底为 CSS 添加了些什么？这里做快速的概述。

# 1. 变量 {#variables}

less 支持变量，变量用 `@` 作为前缀进行声明，如下:

```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

对应的 css 将是如下结果：

```less
#header {
  width: 10px;
  height: 20px;
}
```

# 2. Mixins {#mixins}

Mixins 是一种将包含一组属性的 css 规则集的所有规则 ”混合“ 到另一个 css 规则集中。如下示例：

> 可以理解为一种复用规则集的方式

现有 `.bordered` 规则集：

```scss
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

期望这个规则集能够直接在其它的规则集里面使用。很简单，只需要将规则集的类名直接放到对应的规则集里即可，如下：

> 除了类名，id 名也可以作为 mixins

```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

对应的 css 将是如下结果：

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#menu a {
  color: #111;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
.post a {
  color: red;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

可以看到，`.bordered` 对应的规则全部都混合到了对应的规则集中，很好的实现了复用规则集。

# 3. 嵌套 {#nesting}

Less 支持使用嵌套来代替级联，假设我们有以下 CSS：

```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

可以看到，这里使用了两个后代选择器，重复的写了两遍 `#header`。在 Less 中，可以使用嵌套的方式来便捷的实现，上面的代码可以写成如下：

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

这样代码不仅更简洁，同时还带有了层级结构，这个层级结构还能简介的表达出 HTML 的部分结构。

除此之外，嵌套之下，还可以使用 `&` 表示当前的父级选择器，例如：

```less
.item {
  color: #fff;

  &--active {
    color: #ccc;
  }
}
```

此时的 `&` 代表 `.item`，因此生成的 css 如下

```css
.item {
  color: #fff;
}
.item--active {
  color: #ccc;
}
```

# 4. @规则的嵌套和冒泡 {#@-rule}

> 什么是 @规则，其实就是诸如 `@media` `@supports` 一类的规则

@media 或 @supports 等规则同样支持嵌套，方式与选择器相同。

嵌套的@规则将提升到顶层，提升之后，在同一规则集中的其它规则的相对顺序将保持不变。 这在 Less 中称为冒泡。例如：

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

生成的 css 如下，可以看到，所有的 `@media` 都提升到了顶层，同时，对应的顺序也是保持不变的。

```css
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

# 5. 运算符 {#operations}

1. 基础运算符

   支持 `+ - * /` 运算符，支持对任何数字、颜色值或变量进行运算。

   同时，在使用 `+ -`运算前，还会对数字所带的单位进行转换，如果支持转换，会将单位转换再进行运算，例如 `1dm + 10cm + 100mm`，得到的结果为 `3dm`，如果不支持转换，那么将直接对数字进行运算并将其单位设置为 `px`，例如 `1cm + 2%`，得到的结果为 `3px`。

   ```less
   // 单位可转换时，会将其转换后相加
   @conversion-1: 5cm + 10mm; // 结果为 6cm
   @conversion-2: 2 - 3cm - 5mm; // 结果为 -1.5cm

   // 单位不可转换时
   @incompatible-units: 2 + 5px - 3cm; // 结果为 4px

   // example with variables
   @base: 5%;
   @filler: @base * 2; // result is 10%
   @other: @base + @filler; // result is 15%
   ```

   `/ *` 运算符不会进行单位转换，因为在大多数情况下转换是没有意义的 ，Less 将直接对数字进行操作，并将 “已明确声明的单位” 作用于结果，如下：

   ```less
   @base: 2cm * 3mm; // 结果为 6cm
   ```

   还支持颜色值的算术运算：

   ```less
   @color: (#224488 / 2); // 结果为 #112244
   background-color: #112244 + #111; // 结果为 #223355
   ```

   > 因为 #111 的完整表达为 #111111

   从 Less 4.0 开始，使用 `/` 运算符时需要添加括号，否者将不会进行运算。

   ```less
   @color: #222 / 2; // 结果为 `#222 / 2`，不会进行运算
   background-color: (#ffffff / 16); // 结果为 #101010
   ```

   > 因为 #FFFFFF 为 HEX 值，FF / 16 就为 10

2. calc() 表达式

   Less 支持 `calc()` 表达式，同时为了兼容 CSS，`calc()` 不会进行运算，但支持变量。

   ```less
   @var: 50vh/2;
   width: calc(50% + (@var - 20px)); // 结果为 calc(50% + (25vh - 20px))
   ```

# 6. 转义 {#escaping}

Less 支持直接使用字符串作为属性值或者变量值，仅需要用引号将字符串包裹起来并在前面加上 `~` ，如： `~"anything"` 或 `~'anything'`，这样 `anything` 将原样使用。

```less
@min768: ~'(min-width: 768px)';
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

结果如下：

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

从 Less 3.5 开始，还可如下简写：

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

从 Less 3.5 开始，许多之前需要 “引号” 的情况都不需要了。

# 7. 函数 {#function}

Less 提供了大量的函数，可用于转换颜色、操作字符串和进行数学运算等。

可以直接在 Less 中使用，无需引入，如下使用，具体的函数作用不在这里进行说明，后续会有单独的章节：

```less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```

结果如下：

```css
.class {
  width: 50%;
  color: #f6430f;
  background-color: #f8b38d;
}
```

# 8. 命名空间和访问器 {#namespaces}

有时，为了更好的组织、管理或者分发，可能希望对 mixin 规则集进行分组。 在 Less 中可以很简单地做到这一点。

例如，期望在 `#bundle` 下封装一些 mixin 和变量，以供复用或分发：

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab {
    ...;
  }
  .citation {
    ...;
  }
}
```

Now if we want to mixin the `.button` class in our `#header a`, we can do:

假设期望在 `#header a` 中混合  `.button`  这个规则集，可以直接调用 `#bundle.button()`,如下：

```less
#header a {
  color: orange;
  #bundle.button(); // 也可以写成 #bundle > .button
}
```

如此，生成结果如下：

```css
#header a {
  color: orange;
  display: block;
  border: 1px solid black;
  background-color: grey;
}
#header a:hover {
  background-color: white;
}
```

注意：如果不希望它 `#bundle` 出现在您的 CSS 输出中，请务必在命名空间后加上 `()`，即 `#bundle()`。

# 9. Map {#map}

从 Less 3.5 开始，minxs 和规则集还支持使用映射，如下：

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

结果如下：

```css
.button {
  color: blue;
  border: 1px solid green;
}
```

# 10. 作用域 {#scope}

Less 中的作用域与 CSS 中的作用域非常相似。 使用变量或者 mixin 时，会先查找最近的作用域，则查找父作用域。

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}
```

与 CSS 自定义属性一样，mixin 和变量定义不用非得放在引用它们的行之前。 所以下面的 Less 代码和前面的例子是一样的：

> 其实个人觉得这样挺不好的，推荐还是放在顶行

```less
@var: red;

#page {
  #header {
    color: @var; // white
  }
  @var: white;
}
```

# 11. 注释 {#comment}

单行和多行注释都支持：

```less
/* 多行
 * 注释 
*/
@var: red;

// 单行注释
@var: white;
```

# 12. import {#import}

完美地支持 `import`， 支持导入 `.less .css` 文件，导入 Less 文件时，其中的所有变量都将直接可用。 当导入 Less 文件时，` .less` 文件扩展名可选。

```less
@import 'library'; // library.less
@import 'typo.css';
```

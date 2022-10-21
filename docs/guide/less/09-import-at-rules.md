---
page: true
title: import
outline: deep
returnToTop: true
---

# import

## 1. 概述

从其他样式表导入样式

基础语法：

```less
@import 'this-is-valid.less';
```

CSS 同样支持导入（import），在 css 中，import 比如出于最顶部，也就是所有规则之前。Less 同样支持导入，但 Less 并不限制 `@import` 所在的位置。

例如：

```less
.foo {
  background: #900;
}
@import 'this-is-valid.less';
```

## 2. 文件扩展名

根据文件扩展名，导入时会对文件做相应地处理：

- 如果文件的扩展名是 `.css`，保持原样
- 除 `.css` 扩展名外的所有，都将视为 `.less` 文件导入
- 如果没有扩展名，同样视为 `.less` 文件导入

```less
@import 'foo'; // 视为 foo.less 导入
@import 'foo.less'; // 视为 foo.less 导入
@import 'foo.php'; // 视为 foo.less 导入
@import 'foo.css'; // 保持原样
```

**当然，这是默认的行为，下面的方式可用于覆盖此行为。**

## 3. import 扩展选项

在引入时，Less 还额外提供了几个扩展，为引用外部文件提供更大的灵活性

语法：`@import (keyword) "filename";`

已实施以下导入选项：

- `reference`：使用 less 文件但不输出在最终的文件中
- `inline`：输出到最终的文件中但不处理它
- `less`：无论文件扩展名如何，都将其视为 Less 文件
- `css`: 无论文件扩展名如何，都将其视为 css 文件
- `once`: 仅导入一次（默认行为）
- `multiple`: 导入多次
- `optional`: 文件不存在时不报错，继续编译

每个 `@import` 均可以添加多个关键字，使用逗号分隔即可：

示例：`@import (optional, reference) "foo.less";`

### 3.1 reference

使用 `@import (reference)` 导入外部文件时，仅会将引用的样式编译到最终的输出中。

示例：`@import (reference) "foo.less";`

实际上，使用 `reference` 后，除非样式作为 mixin 或 extend 被使用，否则均不会输出在最终的 css 中。

此外，`reference` 会根据使用的方式（mixin 或 extend）产生不同的结果：

- `extend`：扩展选择器时，仅扩展后的样式会输出，其它的均不会。
- `mixins`：当样式作为 mixin 引用时，仅规则会输出，其它均不会。

### 3.2 inline

可以使用 `@import（inline）` 导入外部文件，但不对其做任何处理。

示例：`@import (inline) "not-less-compatible.css";`

有的 CSS 可能 Less 并不完全兼容，此时就可以使用 `inline`；虽然 Less 已支持大多数已知的标准 CSS，但仍然存在部分不兼容的，并且，在不改动 CSS 的情况下，Less 不支持所有已知的 CSS hack。

这样，可以使用 `inline` 来将文件输出在最终结果中且不对其做任何处理。

### 3.3 less

`@import（less）` ：不管文件扩展名是什么，都视为 Less 文件，

### 3.4 css

`@import（css）` ：不管文件扩展名是什么，都视为 css 文件。这意味着 import 语句将保持原样。

示例：

```less
@import (css) 'foo.less';
```

输出的结果如下：

```css
@import 'foo.less';
```

### 3.5 once

`@import` 的默认行为。这意味着相同的文件只会导入一次，该文件的后续导入语句将被忽略。

```less
@import (once) 'foo.less';
@import (once) 'foo.less'; // 会忽略
```

### 3.6 multiple

使用 `@import (multiple)` 可以改变 `once` 的默认行为，与 `once` 相反，相同的文件重复导入时会重复输出。

```less
// file: foo.less
.a {
  color: green;
}
// file: main.less
@import (multiple) 'foo.less';
@import (multiple) 'foo.less';
```

输出的结果如下：

```css
.a {
  color: green;
}
.a {
  color: green;
}
```

### 3.7 optional

默认情况下，如果导入的文件不存在时，会抛出 `FileError` 并停止编译。此时，使用 `@import（optional）` 可以改变这个行为，仅当文件存在时才导入。

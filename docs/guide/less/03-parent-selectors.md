---
page: true
title: parent selectors
outline: deep
returnToTop: true
---

# 父选择器

## 1. 基础用法

直接使用 `&` 来引用父选择器

`&` 运算符在嵌套规则中代表着父选择器，在嵌套类和伪类下最为常用：

> 我个人觉得，在伪类和使用 [BEM](https://getbem.com/) 规则时，相当好用

如下伪类：

```less
a {
  color: blue;
  &:hover {
    color: green;
  }
}
```

生成的结果如下：

```css
a {
  color: blue;
}

a:hover {
  color: green;
}
```

如果上述示例中没有 `&`，那么生成的结果为 `a :hover` 规则（一个后代选择器，也就是 `a` 标签内的 `:hover` 元素），而这通常并不是我们所希望的结果。

`&` 运算符有多种用途。 例如，`&` 的另一个典型用法是生成重复的类名：

```less
.button {
  &-ok {
    background-image: url('ok.png');
  }
  &-cancel {
    background-image: url('cancel.png');
  }

  &-custom {
    background-image: url('custom.png');
  }
}
```

生成的结果如下：

```css
.button-ok {
  background-image: url('ok.png');
}
.button-cancel {
  background-image: url('cancel.png');
}
.button-custom {
  background-image: url('custom.png');
}
```

## 2. 多次使用 `&`

`&` 可以在一个选择器中出现多次，这样可以很好地在一个选择其中重复引用父选择器。

```less
.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &,
  &ish {
    color: cyan;
  }
}
```

生成的结果如下：

```css
.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link,
.linkish {
  color: cyan;
}
```

需要注意的是，`&` 代表着当前层级下所有的父选择器，而不仅仅是最近的，如下示例：

```less
.grand {
  .parent {
    & > & {
      color: red;
    }

    & & {
      color: green;
    }

    && {
      color: blue;
    }

    &,
    &ish {
      color: cyan;
    }
  }
}
```

生成的结果如下：

```css
.grand .parent > .grand .parent {
  color: red;
}
.grand .parent .grand .parent {
  color: green;
}
.grand .parent.grand .parent {
  color: blue;
}
.grand .parent,
.grand .parentish {
  color: cyan;
}
```

## 3. 更改选择器顺序

将 `&` 放置在选择器之后可以实现更改选择器的顺序，当需要在所使用的父选择器之前添加选择器时非常有用。如下所示，希望在 `.no-borderradius` 情形下使用 `.header .menu` 选择器：

```less
.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-image: url('images/button-background.png');
    }
  }
}
```

选择器 `.no-borderradius &` 生成的结果为 `.no-borderradius .header .menu`：

```css
.header .menu {
  border-radius: 5px;
}
.no-borderradius .header .menu {
  background-image: url('images/button-background.png');
}
```

## 4. 组合

在逗号分隔的列表中，`&` 会生成每个选择器的所有可能排列：

```less
p,
li {
  border-top: 2px dotted #366;
  & + & {
    border-top: 0;
  }
}
```

这样将生成所有的可能组合：

```css
p,
li {
  border-top: 2px dotted #366;
}
p + p,
p + li,
li + p,
li + li {
  border-top: 0;
}
```

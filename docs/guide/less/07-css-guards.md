---
page: true
title: css guards
outline: deep
returnToTop: true
---

# CSS Guards

选择器守卫

与 mixin 守卫一样，同样支持选择器守卫，其实，本质上，选择器守卫就是 mixin 守卫的语法糖，相当于立即执行的 mixin 守卫

在 1.5.0 之前，这样来实现选择器守卫：

```less
.my-optional-style() when (@my-option = true) {
  button {
    color: white;
  }
}
.my-optional-style();
```

现在，可以直接使用选择器守卫

```less
button when (@my-option = true) {
  color: white;
}
```

还可以结合 `&` 来使用对多个选择器进行守卫

```less
& when (@my-option = true) {
  button {
    color: white;
  }
  a {
    color: blue;
  }
}
```

当然，还可以直接使用 `if` 来实现，如下：

```less
@dr: if(@my-option = true, {
  button {
    color: white;
  }
  a {
    color: blue;
  }
});
@dr();
```

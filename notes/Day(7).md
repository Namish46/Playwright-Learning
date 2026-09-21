# D7 — Locator Practice on a Real Website

## 1. Objective

The goal of D7 was to apply the CSS Selector and XPath concepts learned in D5 and D6 to a real web application.

For practice, I used the OrangeHRM demo application:

`https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`

The main focus was:

* Inspecting elements using browser DevTools
* Understanding the HTML structure
* Identifying useful attributes
* Creating CSS/XPath locators
* Choosing between multiple possible locators
* Understanding direct child `/` vs descendant `//`
* Handling dynamic IDs
* Avoiding unnecessary or fragile locators

---

# 2. Inspecting an Element

When creating an automation script, we first need to identify the element in the webpage.

A common process is:

1. Open the webpage.
2. Open browser DevTools.
3. Use the element inspector.
4. Inspect the HTML.
5. Identify attributes such as:

   * `id`
   * `name`
   * `class`
   * `type`
   * `placeholder`
   * visible text
   * `data-testid` or other test-specific attributes
6. Choose a locator that is stable, unique, meaningful, and readable.

The goal is **not simply to find any locator that works**.

The goal is to find a locator that is less likely to break when the application changes.

---

# 3. Username Field

Example HTML:

```html
<input
    class="oxd-input oxd-input--active"
    name="username"
    placeholder="Username"
    autofocus="">
```

Possible locators:

### XPath using `name`

```xpath
//input[@name="username"]
```

### XPath using placeholder

```xpath
//input[@placeholder="Username"]
```

### CSS using `name`

```css
input[name="username"]
```

The preferred locator in this exercise was:

```xpath
//input[@name="username"]
```

### Why?

The `name` attribute is meaningful and directly identifies the purpose of the input.

There is no need to navigate through its parent `<div>` when the input itself already has a useful attribute.

---

# 4. Password Field

Example HTML:

```html
<input
    class="oxd-input oxd-input--active"
    type="password"
    name="password"
    placeholder="password">
```

A good locator is:

```xpath
//input[@name="password"]
```

Another possible locator:

```xpath
//input[@type="password"]
```

However, `name="password"` is more meaningful when it is unique.

### Important lesson

Do not assume an attribute is an `id`.

For example:

```html
name="password"
```

is a `name` attribute, not an ID.

Therefore:

❌ Wrong:

```xpath
//input[@id="password"]
```

✅ Correct:

```xpath
//input[@name="password"]
```

---

# 5. Login Button

Example HTML:

```html
<button
    type="submit"
    class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button">
    Login
</button>
```

Possible XPath locators:

```xpath
//button[@type="submit"]
```

```xpath
//button[text()="Login"]
```

Possible CSS:

```css
button[type="submit"]
```

For this page, both `type="submit"` and the visible text `Login` can work.

### Important consideration

If there are multiple submit buttons on a page:

```xpath
//button[@type="submit"]
```

could match more than one element.

In such a situation, a more specific locator may be better.

For this particular login page:

```xpath
//button[text()="Login"]
```

is readable because the button's visible purpose is clearly "Login".

---

# 6. Forgot Password Link/Text

Example HTML:

```html
<p class="oxd-text oxd-text--p orangehrm-login-forgot-header">
    Forgot your password?
</p>
```

Possible XPath:

```xpath
//p[text()="Forgot your password?"]
```

Possible CSS:

```css
.oxd-text.oxd-text--p.orangehrm-login-forgot-header
```

The XPath used in the exercise was:

```xpath
//p[text()="Forgot your password?"]
```

### Important lesson about CSS classes

In CSS, multiple classes are written with dots and **no spaces**:

```css
.oxd-text.oxd-text--p.orangehrm-login-forgot-header
```

The spaces are important because:

```css
.a.b
```

means an element having both classes.

Whereas:

```css
.a .b
```

means an element with class `b` inside an element with class `a`.

---

# 7. Parent → Child vs Descendant

Example:

```html
<div class="orangehrm-login-forgot">
    <p>Forgot your password?</p>
</div>
```

The `<p>` is directly inside the `<div>`.

### Direct child `/`

```xpath
//div[@class="orangehrm-login-forgot"]/p
```

This means:

> Find the `p` that is a direct child of this `div`.

### Descendant `//`

```xpath
//div[@class="orangehrm-login-forgot"]//p
```

This means:

> Find a `p` anywhere inside this `div`, even if there are other elements between them.

For example:

```html
<div>
    <section>
        <p>Forgot your password?</p>
    </section>
</div>
```

This would work:

```xpath
//div//p
```

But this would not:

```xpath
//div/p
```

because `<p>` is not a direct child of `<div>`.

### Key rule

```text
/   → direct child
//  → descendant at any level
```

---

# 8. OrangeHRM Footer Link

Example HTML:

```html
<a href="http://www.orangehrm.com" target="_blank">
    OrangeHRM, Inc
</a>
```

A simple XPath is:

```xpath
//a[text()="OrangeHRM, Inc"]
```

This uses the visible text of the link.

When the text is unique and stable, text-based XPath can be a readable choice.

---

# 9. Dynamic IDs

During practice, we also used an example where IDs were generated dynamically.

Example:

```html
<div class="login-form">
    <input id="username-92831" name="username" placeholder="Username">

    <input
        id="password-47291"
        name="password"
        type="password"
        placeholder="Password">

    <button id="submit-login-83921" type="submit">
        Login
    </button>
</div>
```

The numbers in the IDs may change.

For example:

```text
username-92831
username-47281
username-12345
```

If the changing part is predictable, XPath `starts-with()` can be used.

### Username

```xpath
//input[starts-with(@id,"username-")]
```

### Password

```xpath
//input[starts-with(@id,"password-")]
```

### Login button

```xpath
//button[starts-with(@id,"submit-login-")]
```

---

# 10. `starts-with()` Syntax

The correct XPath syntax is:

```xpath
starts-with(@attribute, "value")
```

Example:

```xpath
//input[starts-with(@id,"username-")]
```

Meaning:

> Find an input whose `id` starts with `username-`.

---

# 11. Prefer Meaningful Attributes When Available

Even if a dynamic ID can be handled with `starts-with()`, another attribute may be better.

For example:

```html
<input
    id="username-92831"
    name="username"
    placeholder="Username">
```

Both could work:

```xpath
//input[starts-with(@id,"username-")]
```

and:

```xpath
//input[@name="username"]
```

If `name="username"` is stable and unique, it is generally preferable because it directly describes the element.

### Locator thinking

Do not ask only:

> "Can I locate this element?"

Also ask:

> "Which locator is most stable, meaningful, unique, readable, and resilient?"

---

# 12. Multiple Possible Locators

The same element can often be located in several ways.

For example:

```html
<input
    name="username"
    placeholder="Username"
    class="input-field">
```

Possible locators:

```xpath
//input[@name="username"]
```

```xpath
//input[@placeholder="Username"]
```

```xpath
//input[@class="input-field"]
```

The fact that all three work does **not** mean they are equally good.

We should consider:

* Is the attribute stable?
* Is it unique?
* Is it meaningful?
* Is it likely to change?
* Is it easy to understand?
* Is it unnecessarily dependent on the DOM structure?

---

# 13. Avoid Unnecessary Parent Traversal

Suppose we have:

```html
<div class="login-form">
    <input name="username">
</div>
```

We could write:

```xpath
//div[@class="login-form"]/input[@name="username"]
```

But if this already uniquely identifies the input:

```xpath
//input[@name="username"]
```

is simpler.

### General principle

Use the simplest reliable locator.

Do not add unnecessary DOM relationships just to make the XPath longer.

---

# 14. Common Mistakes Corrected During D7

### Mistake 1 — Treating a class like an ID

Incorrect:

```xpath
//input[@id="oxd-input"]
```

when the HTML actually contains:

```html
class="oxd-input"
```

Correct:

```xpath
//input[@class="oxd-input"]
```

or preferably use another stable, meaningful attribute if available.

---

### Mistake 2 — Using CSS syntax inside XPath

Incorrect:

```xpath
//p[.oxd-text.oxd-text--p]
```

XPath does not use CSS's `.` syntax for classes.

---

### Mistake 3 — Incorrect `contains()` syntax

Incorrect:

```xpath
//button[@contains(text(),"Login")]
```

Correct:

```xpath
//button[contains(text(),"Login")]
```

The function is:

```xpath
contains(value1, value2)
```

---

### Mistake 4 — Confusing `/` and `//`

```xpath
//div/p
```

means `p` is a direct child.

```xpath
//div//p
```

means `p` can be anywhere inside the `div`.

---

# 15. Locator Selection Checklist

Before finalizing a locator, ask:

### 1. Is it unique?

Does it identify the intended element rather than multiple elements?

### 2. Is it stable?

Is the attribute unlikely to change frequently?

### 3. Is it meaningful?

Does the locator tell another developer what element it represents?

### 4. Is it readable?

Can another person understand it quickly?

### 5. Is it resilient?

Will small UI changes break it?

### 6. Is it unnecessarily complicated?

If a simple direct attribute works, avoid a long XPath through multiple parent elements.

---

# 16. Examples From D7

| Element               | Locator                               |
| --------------------- | ------------------------------------- |
| Username              | `//input[@name="username"]`           |
| Password              | `//input[@name="password"]`           |
| Login button          | `//button[text()="Login"]`            |
| Forgot password       | `//p[text()="Forgot your password?"]` |
| OrangeHRM footer link | `//a[text()="OrangeHRM, Inc"]`        |

Dynamic ID examples:

```xpath
//input[starts-with(@id,"username-")]
```

```xpath
//input[starts-with(@id,"password-")]
```

```xpath
//button[starts-with(@id,"submit-login-")]
```

---

# 17. Main Takeaways From D7

* DevTools helps us inspect the actual HTML of a webpage.
* A locator should not just work; it should be stable, unique, readable, and meaningful.
* Prefer direct, useful attributes over unnecessary DOM traversal.
* `name`, `placeholder`, `type`, visible text, and test-specific attributes can all be useful depending on the situation.
* CSS and XPath have different syntax.
* `/` means direct child in XPath.
* `//` means descendant at any level.
* `contains()` is useful for partial matching.
* `starts-with()` is useful when an attribute has a stable prefix but a changing suffix.
* Dynamic IDs do not automatically mean the element cannot be located.
* Multiple locators can work for the same element, so locator selection requires judgment.
* Avoid unnecessarily long or fragile XPath expressions.

---

# D7 Exit Criteria

D7 is considered complete when I can:

* [x] Open DevTools and inspect an element.
* [x] Identify useful HTML attributes.
* [x] Create XPath locators.
* [x] Create CSS locators.
* [x] Distinguish `class` from `id`.
* [x] Use `text()` in XPath.
* [x] Use `contains()`.
* [x] Use `starts-with()`.
* [x] Understand `/` vs `//`.
* [x] Identify dynamic IDs.
* [x] Compare multiple possible locators.
* [x] Choose a locator based on stability and uniqueness.
* [x] Apply locator concepts to a real website.

**Status: D7 — Foundation Locator Practice: Completed**

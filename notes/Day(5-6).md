# D5 + D6 — CSS Selectors, XPath & Locator Strategy

## 1. What is a Selector?

A selector is a way of identifying a particular HTML element in a web page so that an automation tool can interact with it.

Examples:

```css
#username
```

```css
.login-button
```

```xpath
//input[@id="username"]
```

The goal is not just to find an element, but to find it using a **stable, unique, readable and maintainable locator**.

---

# 2. CSS Selectors

CSS selectors can be used to identify HTML elements based on their tag, ID, class, attributes and relationships.

### ID selector

```css
#username
```

Finds an element with:

```html
<input id="username">
```

### Class selector

```css
.login-button
```

Finds an element with the class:

```html
<button class="login-button">Login</button>
```

### Tag selector

```css
button
```

Finds button elements.

### Attribute selector

```css
input[name="username"]
```

Finds an input whose `name` attribute is `username`.

### Combining selectors

```css
button.primary-btn
```

Finds a `button` with the `primary-btn` class.

---

# 3. XPath

XPath is a language used to navigate and identify elements in an XML/HTML document.

Example:

```xpath
//button[@id="loginBtn"]
```

Meaning:

* `//` → search through the document
* `button` → find button elements
* `[@id="loginBtn"]` → whose ID is `loginBtn`

---

# 4. Relative XPath

A relative XPath commonly starts with:

```xpath
//
```

Example:

```xpath
//button[@id="loginBtn"]
```

It searches for the matching element without depending on the complete HTML hierarchy.

Relative XPath is generally more maintainable than absolute XPath.

---

# 5. Absolute XPath

An absolute XPath describes the complete path from the root of the document.

Example:

```xpath
/html/body/div[2]/div[1]/form/button
```

This is fragile because it depends heavily on the exact DOM structure.

If elements are added, removed or rearranged, the XPath can stop working.

### Avoid long absolute XPath

Bad example:

```xpath
/html/body/div[2]/div[1]/form/div[3]/div/button
```

Prefer a stable locator:

```xpath
//button[@data-testid="login-button"]
```

---

# 6. Parent and Child Relationships

Consider:

```html
<div class="login-form">
    <input id="username">
    <button id="loginBtn">Login</button>
</div>
```

The structure is:

```text
div.login-form
├── input#username
└── button#loginBtn
```

XPath can navigate these relationships.

### Direct child

```xpath
//div[@class="login-form"]/button
```

`/button` means the button must be a **direct child**.

### Descendant

```xpath
//div[@class="login-form"]//button
```

`//button` can find a button **anywhere inside** the div, including deeper nested elements.

Example:

```html
<div class="login-form">
    <div class="actions">
        <button>Login</button>
    </div>
</div>
```

This works:

```xpath
//div[@class="login-form"]//button
```

while this does not:

```xpath
//div[@class="login-form"]/button
```

because the button is not a direct child.

---

# 7. XPath Conditions — `and`

Example:

```xpath
//button[@id="loginBtn" and @class="primary-btn"]
```

Both conditions must be true.

The element must have:

```text
id = loginBtn
AND
class = primary-btn
```

`and` generally makes a locator more specific.

---

# 8. XPath Conditions — `or`

Example:

```xpath
//button[@id="loginBtn" or @class="primary-btn"]
```

Either condition can be true.

The element can have:

```text
id = loginBtn
OR
class = primary-btn
```

`or` makes the condition less restrictive.

---

# 9. `contains()`

`contains()` is useful when part of an attribute value is stable but another part is dynamic.

Example:

```html
<button id="login-btn-827364">Login</button>
```

The number may change.

Use:

```xpath
//button[contains(@id, 'login-btn-')]
```

This can match:

```text
login-btn-827364
login-btn-928371
login-btn-123456
```

General pattern:

```xpath
//tag[contains(@attribute, 'value')]
```

`contains()` checks whether the specified value appears **anywhere** inside the attribute value.

---

# 10. `starts-with()`

`starts-with()` is useful when the stable part of an attribute is always at the beginning.

Example:

```html
<input id="username-8273">
```

Use:

```xpath
//input[starts-with(@id, 'username-')]
```

This can match:

```text
username-8273
username-9281
username-1234
```

General pattern:

```xpath
//tag[starts-with(@attribute, 'value')]
```

### Difference

```xpath
contains(@id, 'user-')
```

→ `user-` can appear anywhere.

```xpath
starts-with(@id, 'user-')
```

→ `user-` must appear at the beginning.

---

# 11. Dynamic vs Stable Attributes

An attribute may look useful but still be unstable.

Example:

```html
<button id="btn_78291">Login</button>
```

If the ID changes frequently:

```text
btn_78291
btn_93821
btn_12345
```

then using:

```xpath
//button[@id="btn_78291"]
```

is fragile.

If the application provides:

```html
<button
    id="btn_78291"
    data-testid="login-button">
    Login
</button>
```

then:

```xpath
//button[@data-testid="login-button"]
```

may be more reliable.

Important: `data-testid` is not automatically guaranteed to be stable or unique. Its reliability depends on the application maintaining it as a testing attribute.

---

# 12. CSS vs XPath

Both CSS and XPath can identify the same element.

Example HTML:

```html
<button id="loginBtn">Login</button>
```

CSS:

```css
#loginBtn
```

XPath:

```xpath
//button[@id="loginBtn"]
```

Both can locate the same element.

The important point is:

> CSS and XPath are both locator strategies. The goal is to choose a stable and maintainable locator rather than blindly preferring one over the other.

XPath is particularly useful for expressing relationships such as:

* parent
* child
* descendant
* ancestor
* text-based conditions
* complex relationships

---

# 13. Locator Quality

A good locator should generally be:

### Stable

It should rely on information that is unlikely to change.

### Unique

It should identify the intended element without accidentally matching multiple elements.

### Readable

Another developer should understand what the locator is targeting.

### Resilient

It should not unnecessarily depend on DOM structure or element position.

---

# 14. Good vs Fragile Locators

### Fragile

```xpath
/html/body/div[2]/div[1]/form/div[3]/button
```

Why?

* Depends on exact DOM hierarchy
* Uses positional indexes
* Can break when elements are added or rearranged
* Difficult to maintain

### Better

```xpath
//button[@data-testid="submit-button"]
```

Why?

* Does not depend on the complete DOM hierarchy
* Uses a meaningful attribute
* Easier to read
* More resilient to unrelated DOM changes

---

# 15. Locator Thinking

When selecting a locator, don't only ask:

> "Can I find the element?"

Ask:

> "Can I find the element in a stable, unique and maintainable way?"

Think about:

```text
Stable
   ↓
Unique
   ↓
Readable
   ↓
Resilient
```

Avoid making a locator unnecessarily complicated.

The goal is not the longest locator.

The goal is the **simplest reliable locator**.

---

# 16. Common Locator Anti-Patterns

Avoid:

### Long absolute XPath

```xpath
/html/body/div[2]/div[1]/form/div[3]/button
```

### Generated/dynamic IDs

```text
btn_78291
```

when the value changes frequently.

### Unnecessary positional selectors

```text
first()
nth()
```

when they are being used to hide a poorly designed locator.

### Overly broad locators

```xpath
//div[@class="login-container"]//button
```

if multiple buttons could eventually exist inside the container.

Instead, make the locator more specific when necessary.

---

# 17. Key Rules to Remember

1. Prefer stable attributes.
2. Prefer unique locators.
3. Avoid unnecessary DOM hierarchy.
4. Avoid long absolute XPath.
5. Understand `/` vs `//`.
6. Use `contains()` when a stable part appears anywhere in a dynamic value.
7. Use `starts-with()` when a stable part appears at the beginning.
8. Do not assume every ID is stable.
9. Do not assume `data-testid` is automatically permanent or unique.
10. Choose the simplest locator that reliably identifies the intended element.
11. A locator being short does not automatically make it good.
12. A locator being complex does not automatically make it reliable.

---

# 18. Practical Examples

### Example 1 — ID

```xpath
//input[@id="username"]
```

### Example 2 — Text

```xpath
//button[text()="Login"]
```

### Example 3 — Attribute

```xpath
//input[@name="username"]
```

### Example 4 — Multiple conditions

```xpath
//button[@id="loginBtn" and @class="primary-btn"]
```

### Example 5 — Parent → direct child

```xpath
//div[@class="login-form"]/button
```

### Example 6 — Parent → descendant

```xpath
//div[@class="login-form"]//button
```

### Example 7 — Dynamic value

```xpath
//button[contains(@id, 'login-btn-')]
```

### Example 8 — Dynamic value with stable prefix

```xpath
//input[starts-with(@id, 'username-')]
```

### Example 9 — Testing attribute

```xpath
//button[@data-testid="login-button"]
```

---

# 19. What I Should Be Able to Explain

I should be able to explain:

> **Why is this locator better?**

rather than simply saying:

> **This locator works.**

For example:

```xpath
//button[@data-testid="login-button"]
```

can be preferred over:

```xpath
/html/body/div[2]/div/form/div[3]/button
```

because the first does not unnecessarily depend on the entire DOM hierarchy and uses a dedicated testing attribute.

However, I should still verify that the attribute is unique and maintained by the application.

---

# D5/D6 Exit Criteria

I should be able to:

* Create CSS selectors.
* Create XPath selectors.
* Explain relative vs absolute XPath.
* Explain `/` vs `//`.
* Navigate parent/child/descendant relationships.
* Use `and` and `or`.
* Use `contains()`.
* Use `starts-with()`.
* Recognize dynamic attributes.
* Identify fragile locators.
* Identify stable locators.
* Explain why a locator is better than another.
* Choose a locator based on stability, uniqueness and maintainability.

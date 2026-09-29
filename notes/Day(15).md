# Playwright D15 — Locators & Actions

## 1. What is a Locator?

A locator is used to identify an element on a web page so that Playwright can interact with it.

Example:

```ts
const loginButton = page.getByRole("button", { name: "Login" });
```

Here, the locator identifies the Login button.

A locator by itself does not perform an action.

```ts
const loginButton = page.getByRole("button", { name: "Login" });
```

Then an action can be performed:

```ts
await loginButton.click();
```

### Mental model

```text
Locator → Which element?
Action  → What should I do with it?
```

---

# 2. Common Playwright Locators

## `getByRole()`

Locates an element using its accessible role and name.

```ts
page.getByRole("button", { name: "Login" })
```

Example:

```html
<button>Login</button>
```

```ts
await page.getByRole("button", { name: "Login" }).click();
```

Here:

```text
button → Role
Login  → Accessible name
```

`getByRole()` is especially useful for buttons, links, checkboxes, headings, etc.

---

## `getByLabel()`

Used mainly for form controls that have an associated label.

```html
<label for="username">Username</label>
<input id="username">
```

```ts
await page.getByLabel("Username").fill("Admin");
```

It is useful for:

* Username
* Password
* Email
* Checkboxes
* Radio buttons
* Other form fields

---

## `getByText()`

Locates an element using visible text.

```html
<h1>Welcome to Dashboard</h1>
```

```ts
page.getByText("Welcome to Dashboard")
```

It can also be used in an assertion:

```ts
await expect(page.getByText("Welcome to Dashboard")).toBeVisible();
```

`getByText()` is useful when the visible text itself is what identifies the element.

---

## `getByPlaceholder()`

Locates an input using its placeholder.

```html
<input placeholder="Search products">
```

```ts
await page.getByPlaceholder("Search products").fill("Laptop");
```

Useful when the placeholder is meaningful and stable.

---

## `getByTestId()`

Locates an element using a dedicated test ID.

Application:

```html
<button data-testid="checkout-button">
    Checkout
</button>
```

Playwright:

```ts
await page.getByTestId("checkout-button").click();
```

A `data-testid` can act as a stable contract between the application and automation tests.

However, a test ID is only reliable if the development team intentionally maintains it.

---

## `locator()`

`locator()` is a general locator method that can use CSS selectors, XPath, and other selector expressions.

CSS:

```ts
page.locator("#username")
```

XPath:

```ts
page.locator('//input[@name="username"]')
```

Both can identify the same element.

---

# 3. CSS Selector vs XPath

CSS example:

```ts
page.locator('input[name="username"]')
```

XPath example:

```ts
page.locator('//input[@name="username"]')
```

Both can locate the same element.

The difference is the selector language:

```text
CSS    → input[name="username"]
XPath  → //input[@name="username"]
```

Use CSS/XPath when appropriate, especially when a suitable user-facing locator is not available.

---

# 4. Choosing a Good Locator

The goal is not simply to find a locator that works.

A good locator should ideally be:

* Stable
* Unique
* Readable
* Meaningful
* Resistant to unnecessary UI changes

Prefer a locator that identifies the intended element clearly rather than relying unnecessarily on its position.

For example:

```ts
page.getByRole("button", { name: "Login" })
```

is generally more meaningful than:

```ts
page.getByRole("button").nth(0)
```

because `nth(0)` depends on the element's position.

---

# 5. Locator Strictness

If a locator matches multiple elements and we perform an action that requires one element, Playwright can report a strictness error instead of arbitrarily choosing one.

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

If two buttons both have the accessible name `Login`, Playwright cannot know which one we intended.

The locator should ideally uniquely identify the intended element.

---

# 6. `first()`, `last()` and `nth()`

If multiple elements match, Playwright provides methods to select a particular match.

```ts
locator.first()
```

Selects the first matching element.

```ts
locator.last()
```

Selects the last matching element.

```ts
locator.nth(0)
```

Selects the first element.

```ts
locator.nth(1)
```

Selects the second element.

```ts
locator.nth(2)
```

Selects the third element.

Indexing starts from `0`.

Example:

```text
Index:     0       1       2
Element:  First   Second   Third
```

`nth()` works, but relying on position can be fragile if the UI order changes. Prefer a more specific locator when possible.

---

# 7. Common Playwright Actions

## `click()`

Clicks an element.

```ts
await page.getByRole("button", { name: "Login" }).click();
```

---

## `fill()`

Fills an input with a value.

```ts
await page.getByLabel("Username").fill("Admin");
```

`fill()` replaces the existing input value.

You normally do not need to call `clear()` before `fill()`.

---

## `clear()`

Clears the current value from an input.

```ts
await page.getByLabel("Username").clear();
```

Use it when you specifically need the field to become empty.

---

## `check()`

Checks a checkbox.

```ts
await page.getByLabel("Remember Me").check();
```

---

## `uncheck()`

Unchecks a checkbox.

```ts
await page.getByLabel("Remember Me").uncheck();
```

---

## `selectOption()`

Selects an option from a `<select>` dropdown.

Example:

```html
<select aria-label="Browser">
    <option value="chrome">Chrome</option>
    <option value="firefox">Firefox</option>
</select>
```

Select using the value:

```ts
await page.getByLabel("Browser").selectOption("firefox");
```

Select using the visible label:

```ts
await page.getByLabel("Browser").selectOption({ label: "Firefox" });
```

So:

```text
selectOption("firefox")
        ↓
option value

selectOption({ label: "Firefox" })
        ↓
visible option label
```

---

## `press()`

Simulates pressing a keyboard key.

```ts
await page.getByPlaceholder("Search products").press("Enter");
```

Other examples:

```ts
.press("Escape")
.press("Tab")
.press("ArrowDown")
```

---

## `hover()`

Moves the mouse over an element.

Useful when hovering causes a menu or other UI element to appear.

```ts
await page.getByText("Products").hover();
await page.getByText("Laptops").click();
```

---

## `dblclick()`

Performs a double-click.

```ts
await page.getByText("Report").dblclick();
```

---

## `focus()`

Gives keyboard focus to an element.

```ts
await page.getByLabel("Password").focus();
```

Useful when specifically testing focus or keyboard behavior.

---

## `pressSequentially()`

Simulates typing characters sequentially.

```ts
await page.getByLabel("Username").pressSequentially("Admin");
```

This can be useful when application behavior depends on individual keyboard input, such as:

* Autocomplete
* Search suggestions
* Input formatting
* Validation while typing

---

# 8. `fill()` vs `pressSequentially()`

Both can result in the same final value, but they have different purposes.

### `fill()`

Sets/replaces the input value directly.

```ts
await page.getByLabel("Username").fill("Admin");
```

Use it when the goal is simply to enter a value.

### `pressSequentially()`

Simulates typing the characters one by one.

```ts
await page.getByLabel("Username").pressSequentially("Admin");
```

Use it when keyboard typing behavior itself matters.

### Simple rule

```text
Need to set a value?
        ↓
      fill()

Need to simulate typing?
        ↓
pressSequentially()
```

---

# 9. Actions vs Assertions

Actions change or interact with the application.

Examples:

```text
click()
fill()
check()
uncheck()
selectOption()
```

Assertions verify the application's state.

For example:

```ts
await expect(checkbox).toBeChecked();
```

This does not check the checkbox.

It verifies that the checkbox is already checked.

Therefore:

```text
check()        → change state
toBeChecked()  → verify state
```

---

# 10. Locator + Action Examples

### Username

```ts
await page.getByLabel("Username").fill("Admin");
```

### Password

```ts
await page.getByLabel("Password").fill("admin123");
```

### Remember Me

```ts
await page.getByLabel("Remember Me").check();
```

### Country

```ts
await page.getByLabel("Country").selectOption("india");
```

### Login button

```ts
await page.getByRole("button", { name: "Login" }).click();
```

### Search

```ts
await page.getByPlaceholder("Search").fill("Laptop");
await page.getByPlaceholder("Search").press("Enter");
```

---

# 11. Main D15 Takeaway

Playwright automation can be understood as:

```text
Locate the element
       ↓
Perform an action
       ↓
Verify the result
```

Example:

```ts
await page.getByLabel("Username").fill("Admin");

await page.getByLabel("Remember Me").check();

await page.getByRole("button", { name: "Login" }).click();

await expect(page.getByText("Dashboard")).toBeVisible();
```

The most important lesson from D15 is not memorizing every method.

It is learning to choose:

**the right locator + the right action + the right verification.**

# Playwright D16 — Assertions

## 1. What is an Assertion?

An assertion verifies that the application is in the expected state after an action.

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();

await expect(page.getByText("Dashboard")).toBeVisible();
```

The first line performs an action.

The second line verifies the expected result.

### Mental model

```text
Action
   ↓
Application changes
   ↓
Assertion
   ↓
Verify expected result
```

A test that only performs actions does not properly verify whether the application behaved as expected.

---

# 2. Basic Assertion Structure

The common structure is:

```ts
await expect(locator).assertion();
```

Example:

```ts
await expect(page.getByText("Dashboard")).toBeVisible();
```

For page-level assertions:

```ts
await expect(page).toHaveURL("/dashboard");
await expect(page).toHaveTitle("Dashboard - My App");
```

---

# 3. `toBeVisible()`

Checks that an element is visible.

```ts
await expect(page.getByText("Dashboard")).toBeVisible();
```

Use it when the requirement is:

> The element should be visible.

---

# 4. `toBeHidden()`

Checks that an element is hidden.

```ts
await expect(
  page.getByText("Login")
).toBeHidden();
```

Use it when the requirement is:

> The element should not be visible.

---

# 5. `toBeEnabled()`

Checks whether an element is enabled and can be interacted with.

```ts
await expect(
  page.getByRole("button", { name: "Submit" })
).toBeEnabled();
```

---

# 6. `toBeDisabled()`

Checks whether an element is disabled.

```ts
await expect(
  page.getByRole("button", { name: "Submit" })
).toBeDisabled();
```

### Difference

```text
toBeEnabled()
    ↓
Element can be interacted with

toBeDisabled()
    ↓
Element cannot be interacted with
```

---

# 7. `toBeChecked()`

Verifies that a checkbox or applicable control is checked.

```ts
await expect(
  page.getByLabel("Remember Me")
).toBeChecked();
```

Remember the difference:

```text
check()        → changes the checkbox state

toBeChecked()  → verifies the checkbox state
```

---

# 8. `toHaveText()`

Verifies the text of an element.

```html
<h1>Dashboard</h1>
```

```ts
await expect(page.getByRole("heading"))
  .toHaveText("Dashboard");
```

Use it when you want to verify the element's text.

---

# 9. `toContainText()`

Verifies that an element's text contains the expected text.

If the actual text is:

```text
Welcome to Dashboard
```

then:

```ts
await expect(page.getByRole("heading"))
  .toContainText("Dashboard");
```

passes because `Dashboard` is contained within the text.

### Difference

```text
toHaveText()
    ↓
Verify the expected text

toContainText()
    ↓
Verify that the expected text appears within the text
```

---

# 10. `toHaveValue()`

Used to verify the value of a form control.

Example:

```ts
await page.getByLabel("Username").fill("Admin");

await expect(
  page.getByLabel("Username")
).toHaveValue("Admin");
```

### Important distinction

```text
Input/form value
    ↓
toHaveValue()

Element text
    ↓
toHaveText()
```

`toHaveValue()` can also be used with applicable form controls such as `<textarea>` and `<select>`.

---

# 11. `toHaveAttribute()`

Verifies an HTML attribute.

Example:

```html
<input id="username" name="username" type="text">
```

Verify the `name` attribute:

```ts
await expect(page.locator("#username"))
  .toHaveAttribute("name", "username");
```

Verify the `type` attribute:

```ts
await expect(page.locator("#username"))
  .toHaveAttribute("type", "text");
```

### General pattern

```ts
toHaveAttribute("attributeName", "expectedValue")
```

---

# 12. `toHaveClass()`

Verifies an element's CSS class.

Example:

```html
<button class="primary-btn active">
    Submit
</button>
```

Depending on the expected class list, you can use:

```ts
await expect(
  page.getByRole("button", { name: "Submit" })
).toHaveClass(/primary-btn/);
```

The regular expression allows us to verify that `primary-btn` is present in the class list.

---

# 13. `toHaveCount()`

Verifies the number of elements matching a locator.

Example:

```ts
await expect(
  page.getByTestId("product-card")
).toHaveCount(10);
```

This means:

> There should be exactly 10 product cards.

Useful for:

* Product lists
* Search results
* Table rows
* Menu items
* Other repeated elements

---

# 14. `toHaveURL()`

Verifies the current page URL.

```ts
await expect(page).toHaveURL("/dashboard");
```

Useful after:

* Login
* Logout
* Navigation
* Redirects
* Checkout

You can also use a regular expression when only part of the URL matters:

```ts
await expect(page).toHaveURL(/dashboard/);
```

---

# 15. `toHaveTitle()`

Verifies the browser page title.

If the page contains:

```html
<title>Dashboard - My App</title>
```

then:

```ts
await expect(page)
  .toHaveTitle("Dashboard - My App");
```

---

# 16. `toBeEmpty()`

Verifies that an applicable element is empty.

Example:

```ts
await expect(
  page.getByPlaceholder("Search products")
).toBeEmpty();
```

Useful when verifying that an input has been cleared.

---

# 17. Negative Assertions

Use `.not` when the expected condition should NOT be true.

Example:

```ts
await expect(
  page.getByText("Invalid username or password")
).not.toBeVisible();
```

This means:

> The error message should not be visible.

Other examples:

```ts
await expect(locator).not.toBeChecked();

await expect(locator).not.toBeDisabled();

await expect(locator).not.toHaveText("Error");
```

### Pattern

```text
expect(locator).assertion()
        ↓
Positive expectation

expect(locator).not.assertion()
        ↓
Negative expectation
```

---

# 18. Hard Assertions

Normal `expect()` is a hard assertion.

```ts
await expect(page.getByText("Dashboard"))
  .toBeVisible();
```

If the assertion fails, the test fails and execution stops at that point.

Use hard assertions when the condition is important or when later test steps depend on it.

---

# 19. Soft Assertions

Playwright also supports soft assertions:

```ts
await expect.soft(
  page.getByText("Dashboard")
).toBeVisible();
```

If the assertion fails, Playwright records the failure but continues executing the test.

Example:

```ts
await expect.soft(page.getByText("Dashboard")).toBeVisible();

await expect.soft(page.getByText("Welcome")).toBeVisible();

await expect.soft(page.getByText("Logout")).toBeVisible();
```

This is useful when checking multiple **independent** UI conditions and you want to see multiple failures in one test run.

### Difference

```text
expect()
    ↓
Hard assertion
    ↓
Failure → execution stops at that point

expect.soft()
    ↓
Soft assertion
    ↓
Failure is recorded → execution continues
```

Do not automatically use soft assertions everywhere. If a condition is a critical prerequisite for the next step, a hard assertion is often more appropriate.

---

# 20. Assertions and Auto-Waiting

Playwright web assertions automatically retry for a period of time while waiting for the expected condition.

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();

await expect(page.getByText("Dashboard")).toBeVisible();
```

If Dashboard takes a short time to appear, the assertion waits for the expected state.

Therefore, we generally should not add arbitrary fixed waits such as:

```ts
await page.waitForTimeout(3000);
```

before the assertion.

### Why fixed waits are unreliable

A fixed wait always waits for the specified duration.

If the application is ready in 500 ms:

```text
Wait 3000 ms
→ unnecessary delay
```

If the application needs 5000 ms:

```text
Wait 3000 ms
→ condition may still not be ready
```

An assertion instead waits for the **condition we actually care about**.

```text
Fixed wait:
"Wait 3 seconds."

Assertion:
"Wait until Dashboard is visible."
```

This is a key Playwright principle.

---

# 21. Action vs Assertion

Always distinguish between performing an action and verifying the result.

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();

await expect(page.getByText("Dashboard")).toBeVisible();
```

```text
click()
   ↓
Action

toBeVisible()
   ↓
Assertion
```

Another example:

```ts
await page.getByLabel("Remember Me").check();

await expect(
  page.getByLabel("Remember Me")
).toBeChecked();
```

```text
check()
   ↓
Change state

toBeChecked()
   ↓
Verify state
```

---

# 22. Important Assertion Cheat Sheet

| Assertion           | Purpose                               |
| ------------------- | ------------------------------------- |
| `toBeVisible()`     | Element is visible                    |
| `toBeHidden()`      | Element is hidden                     |
| `toBeEnabled()`     | Element is enabled                    |
| `toBeDisabled()`    | Element is disabled                   |
| `toBeChecked()`     | Checkbox is checked                   |
| `toHaveText()`      | Verify element text                   |
| `toContainText()`   | Verify text contains expected text    |
| `toHaveValue()`     | Verify form-control value             |
| `toHaveAttribute()` | Verify HTML attribute                 |
| `toHaveClass()`     | Verify CSS class                      |
| `toHaveCount()`     | Verify number of matching elements    |
| `toHaveURL()`       | Verify current URL                    |
| `toHaveTitle()`     | Verify page title                     |
| `toBeEmpty()`       | Verify element/form control is empty  |
| `.not`              | Negate an assertion                   |
| `expect.soft()`     | Record assertion failure and continue |

---

# 23. Example Login Test

```ts
import { test, expect } from "@playwright/test";

test("user can login with valid credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Username").fill("Admin");
  await page.getByLabel("Password").fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/dashboard");
  await expect(page).toHaveTitle("Dashboard - My App");
  await expect(page.getByText("Dashboard")).toBeVisible();
});
```

This demonstrates the overall flow:

```text
Locate
   ↓
Perform action
   ↓
Wait for expected state
   ↓
Assert result
```

## D16 Key Takeaway

Assertions are what make an automation test actually **verify application behavior**.

Do not simply ask:

> "Can Playwright click the Login button?"

Ask:

> "After clicking Login, did the application reach the expected state?"

That is the purpose of assertions.

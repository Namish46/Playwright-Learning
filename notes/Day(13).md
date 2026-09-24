# D13 — Playwright Foundations

## Objective

Understand the basic architecture of Playwright and how Playwright Test manages browsers, contexts, pages, locators, isolation, and test execution.

---

# 1. What is Playwright?

**Playwright is a browser automation and testing framework.**

It allows us to programmatically control browsers and automate web application tests.

Instead of manually:

```text
Open browser
    ↓
Open website
    ↓
Enter username
    ↓
Enter password
    ↓
Click Login
```

Playwright can perform these actions through code:

```ts id="4c7s2q"
await page.goto("https://example.com");
await page.locator('//input[@name="username"]').fill("Admin");
await page.locator('//input[@name="password"]').fill("admin123");
await page.getByRole("button", { name: "Login" }).click();
```

Basic architecture:

```text
Test Code
    ↓
Playwright
    ↓
Browser
    ↓
Web Application
```

### Useful characteristics

* Supports browser automation and testing.
* Supports Chromium, Firefox, and WebKit.
* Does not require separate WebDriver management like traditional Selenium setups.
* Provides features such as auto-waiting, test isolation, tracing, screenshots, and parallel execution.

---

# 2. Browser → Context → Page

One of the most important Playwright concepts is understanding the relationship between:

```text
Browser
   ↓
Context
   ↓
Page
```

## Browser

The browser is the actual browser instance.

Examples:

```text
Chromium
Firefox
WebKit
```

A browser can contain multiple browser contexts.

---

# 3. Browser Context

A **Browser Context** represents an isolated browser session.

A context can have its own:

* Cookies
* Local storage
* Session storage
* Authentication state

Example:

```text
Browser
 ├── Context A
 │    └── Admin session
 │
 └── Context B
      └── Employee session
```

Context A and Context B are isolated from each other.

### Why is this useful?

It allows us to test different users/personas independently.

For example:

```text
Context A → Admin
    ↓
Admin dashboard accessible

Context B → Employee
    ↓
Admin dashboard not accessible
```

This is especially useful when testing:

* Roles
* Permissions
* Authentication
* Different users
* Different data access

---

# 4. Page

A **Page represents a browser tab/page** inside a browser context.

Example:

```text
Browser
   ↓
Context
   ├── Page 1
   ├── Page 2
   └── Page 3
```

If a context has three tabs open, it can have three pages.

The `page` object is what we use to interact with the web application.

Examples:

```ts id="v4t7m2"
await page.goto("https://example.com");

await page.locator("input").fill("Admin");

await page.getByRole("button").click();
```

### Simple mental model

```text
Browser  = Browser instance
Context  = Isolated session
Page     = Tab/page
```

---

# 5. Browser Context vs Page

A common mistake is to think that the `page` itself is the session.

More precisely:

```text
Browser
   ↓
Context = isolated session
   ↓
Page = tab inside that session
```

The **context is the important isolation boundary**.

---

# 6. Multiple Contexts in the Same Browser

Two contexts can exist inside the same browser:

```ts id="0f2y9a"
const browser = await chromium.launch();

const context1 = await browser.newContext();
const context2 = await browser.newContext();

const page1 = await context1.newPage();
const page2 = await context2.newPage();
```

Structure:

```text
Browser
 ├── Context 1
 │     └── Page 1
 │
 └── Context 2
       └── Page 2
```

Even though both contexts belong to the same browser, they are **separate isolated sessions**.

For example:

```text
Context 1 → Admin logged in
Context 2 → Employee not logged in
```

Admin's session does not automatically make the Employee logged in.

---

# 7. Multiple Pages in One Context

A context can also contain multiple pages:

```ts id="5h7k2p"
const context = await browser.newContext();

const page1 = await context.newPage();
const page2 = await context.newPage();
```

Structure:

```text
Browser
   ↓
Context
   ├── Page 1
   └── Page 2
```

Both pages belong to the same context/session.

---

# 8. Test Isolation

Test isolation prevents one test's state from accidentally affecting another test.

Example:

```text
Test 1
 ↓
Admin session

Test 2
 ↓
Employee session
```

We don't want Test 2 to accidentally inherit Test 1's Admin session.

Isolation is especially important when testing:

### Roles and permissions

```text
Admin
 → Admin dashboard
 → User management

Employee
 → Employee dashboard
 → No admin controls
```

### Data access

Different users may have access to different data.

```text
User A → Data A
User B → Data B
```

Tests should not accidentally share authentication or state.

---

# 9. Playwright Test Fixtures

Consider:

```ts id="g8x4q1"
test("Login", async ({ page }) => {
    await page.goto("https://example.com");
});
```

We did not manually create:

```ts id="x6c3m8"
const browser = ...
const context = ...
const page = ...
```

Instead, **Playwright Test provides the `page` fixture to the test**.

The fixture can be thought of as something Playwright prepares and gives to our test.

```text
Playwright Test
      ↓
Creates required test environment
      ↓
Provides page fixture
      ↓
Our test uses page
```

---

# 10. Locator

A **Locator is a way to identify an element on the page** so we can interact with it or perform assertions.

Example:

```ts id="f2k8v5"
const username = page.getByRole("textbox", { name: "Username" });
```

The variable `username` represents a locator for the username input.

A locator is not the same as performing an action.

```ts id="m4v8p2"
const username = page.getByRole("textbox", { name: "Username" });
```

This identifies the element.

Then:

```ts id="j7q3n6"
await username.fill("Admin");
```

performs the action.

### Simple distinction

```text
Locator
   ↓
Identify element

Action
   ↓
Interact with element
```

Examples of actions:

```ts id="w6r2k9"
await username.fill("Admin");
await loginButton.click();
```

---

# 11. `getByRole()`

Example:

```ts id="c5n8q2"
const loginButton = page.getByRole("button", { name: "Login" });
```

Here:

```text
button → accessible role
Login  → accessible name
```

It identifies the Login button.

Then:

```ts id="t3m7p1"
await loginButton.click();
```

clicks it.

### Important distinction

This:

```ts id="u8k2v4"
page.locator('//input[@name="username"]')
```

uses the HTML `name` attribute.

But:

```ts id="q5r9m3"
page.getByRole("button", { name: "Login" })
```

uses the element's accessible role and accessible name.

---

# 12. Locator Does Not Immediately Perform an Action

Creating a locator:

```ts id="n4x7p2"
const username = page.getByRole("textbox", { name: "Username" });
```

does not mean that Playwright has typed anything.

The action happens when we perform:

```ts id="b6m2v8"
await username.fill("Admin");
```

So:

```text
Create locator
     ↓
Identify what we want
     ↓
Perform action
```

---

# 13. Playwright Auto-Waiting

Playwright has built-in waiting mechanisms for many normal browser interactions.

For example:

```ts id="a7c3m9"
await page.getByRole("button", { name: "Login" }).click();
```

If the button is not immediately ready, Playwright can wait for the relevant actionability conditions instead of immediately failing.

Because of this, we should generally avoid using arbitrary fixed waits such as:

```ts id="r5v8k2"
await page.waitForTimeout(5000);
```

just to give the page time to load.

### Why fixed waits are not ideal

If we wait for 2 seconds:

```text
Ready in 200 ms
→ unnecessary waiting

Ready in 3 seconds
→ 2 seconds was not enough
```

Better automation waits for the required condition/state rather than blindly waiting for a fixed amount of time.

---

# 14. Playwright Test Runner

The **Playwright Test Runner** manages the execution of our tests.

It is responsible for things such as:

* Running tests
* Providing fixtures such as `page`
* Managing test isolation
* Supporting parallel execution
* Managing retries when configured
* Handling test configuration
* Reporting test results

Think of it as the manager that executes and manages our tests.

```text
Playwright Test Runner
        ↓
      Test 1
        ↓
 Browser / Context / Page

Playwright Test Runner
        ↓
      Test 2
        ↓
 Browser / Context / Page
```

Our test code describes **what we want to test**.

The test runner manages much of **how the tests are executed and managed**.

---

# 15. Complete Mental Model

The overall Playwright architecture learned in D13:

```text
                 Playwright Test Runner
                          ↓
                        Test
                          ↓
                       Browser
                          ↓
                    Browser Context
                    (isolated session)
                          ↓
                        Page
                    (browser tab)
                          ↓
                       Locator
                          ↓
                       Action
                          ↓
                   Web Application
```

Example:

```ts id="e4q7m1"
test("Login", async ({ page }) => {
    await page.goto("https://example.com");

    await page.locator('//input[@name="username"]').fill("Admin");

    await page.locator('//input[@name="password"]').fill("admin123");

    await page.getByRole("button", { name: "Login" }).click();
});
```

---

# D13 Key Takeaways

1. **Playwright** is a browser automation and testing framework.
2. **Browser** is the browser instance.
3. **Browser Context** represents an isolated browser session.
4. **Page** represents a browser tab/page.
5. Multiple contexts in the same browser can have separate sessions.
6. Multiple pages can exist inside one context.
7. Context isolation is useful for testing different users, roles, permissions, and data access.
8. Playwright Test provides fixtures such as `page`.
9. A **locator identifies an element**.
10. An **action interacts with the located element**.
11. `getByRole()` uses accessible role and accessible name.
12. Playwright provides auto-waiting for many normal interactions.
13. Avoid arbitrary `waitForTimeout()` calls when normal Playwright waiting is sufficient.
14. The **Playwright Test Runner** manages test execution, fixtures, isolation, configuration, and reporting.
15. The key architecture is:

```text
Browser
   ↓
Context
   ↓
Page
   ↓
Locator
   ↓
Action
```

## D13 Status

**Completed**

Concepts understood through explanation and interactive questioning, including Browser/Context/Page, isolation, fixtures, locators, auto-waiting, and the Playwright Test Runner.

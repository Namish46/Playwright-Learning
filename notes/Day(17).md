# Playwright D17 — Synchronization & Waiting

## 1. What is Synchronization?

Synchronization means making sure the test interacts with the application at the correct time.

Modern web applications perform many asynchronous operations:

* API calls
* Navigation
* Server responses
* Dynamic UI updates
* Elements appearing or disappearing
* Data loading

These operations do not necessarily happen instantly.

Example:

```text
Click Login
    ↓
Request sent to server
    ↓
Server processes request
    ↓
Response received
    ↓
UI updates
    ↓
Dashboard appears
```

If the test assumes everything happens immediately, it can become unreliable or flaky.

---

# 2. Playwright Auto-Waiting

Playwright has built-in auto-waiting for many actions.

For example:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

Playwright waits for the element to become actionable before performing the click.

Depending on the action, Playwright can wait for conditions such as:

* Element is attached to the DOM
* Element is visible
* Element is stable
* Element can receive pointer events
* Element is enabled when required

Therefore, we generally do not need to manually add waits before every action.

---

# 3. Avoid Fixed `waitForTimeout()`

Avoid using arbitrary fixed waits such as:

```ts
await page.waitForTimeout(3000);
```

This means:

> Wait exactly 3 seconds.

The problem is that the application may be ready much earlier or may need longer.

Example:

```text
Application ready in 500 ms
        ↓
waitForTimeout(3000)
        ↓
2.5 seconds unnecessarily wasted
```

Or:

```text
Application needs 5000 ms
        ↓
waitForTimeout(3000)
        ↓
Test may continue too early
```

### Better approach

Wait for the condition that actually matters.

Instead of:

```ts
await page.waitForTimeout(3000);
```

use:

```ts
await expect(page.getByTestId("search-results")).toBeVisible();
```

### Key rule

> **Wait for a condition, not for an arbitrary amount of time.**

---

# 4. Assertions as Synchronization

Playwright web assertions automatically retry for a period of time while waiting for the expected condition.

Example:

```ts
await page.getByRole("button", { name: "Search" }).click();

await expect(
  page.getByTestId("search-results")
).toBeVisible();
```

The assertion does two things:

1. Waits for the expected condition.
2. Verifies that the condition is actually true.

This is usually better than adding a fixed timeout.

---

# 5. Synchronization Based on the Expected Result

Always ask:

> What does my test actually need to verify?

For example, after clicking Search:

```text
Click Search
     ↓
API request happens
     ↓
Response received
     ↓
Search results displayed
```

If the test only cares that the results are displayed, use:

```ts
await expect(
  page.getByTestId("search-results")
).toBeVisible();
```

We do not necessarily need to wait for the API response itself.

The API is an implementation detail if the actual requirement is the UI result.

---

# 6. `toHaveURL()` for Navigation Verification

After an action causes navigation:

```ts
await page.getByRole("button", { name: "Login" }).click();

await expect(page).toHaveURL("/dashboard");
```

This verifies that the user reached the expected URL.

`toHaveURL()` also provides the necessary waiting/retry behavior for the assertion.

### Instead of thinking:

> Wait for the redirect.

Think:

> Verify that the redirect resulted in `/dashboard`.

---

# 7. `waitForURL()`

Playwright also provides:

```ts
await page.waitForURL("/dashboard");
```

This specifically waits for the URL to change to the expected URL.

However, if the test requirement is to **verify** the final URL, an assertion is often more meaningful:

```ts
await expect(page).toHaveURL("/dashboard");
```

### Difference

```text
waitForURL()
    ↓
Wait for URL to become /dashboard

toHaveURL()
    ↓
Wait for and verify that URL is /dashboard
```

---

# 8. `waitForSelector()`

You may come across:

```ts
await page.waitForSelector("#dashboard");
```

This explicitly waits for a selector.

However, when the actual requirement is to verify a UI state, a locator assertion is usually clearer:

```ts
await expect(
  page.locator("#dashboard")
).toBeVisible();
```

This both waits and verifies the expected state.

### Preferred mindset

Instead of:

```ts
await page.waitForSelector("#dashboard");
```

prefer:

```ts
await expect(page.locator("#dashboard")).toBeVisible();
```

when visibility is the requirement.

---

# 9. `waitForResponse()`

Sometimes the test genuinely needs to synchronize with a specific API response.

Example:

```text
Click Search
     ↓
GET /api/products
     ↓
Server response
     ↓
Continue
```

Playwright provides:

```ts
const responsePromise =
  page.waitForResponse("**/api/products");

await page.getByRole("button", { name: "Search" }).click();

const response = await responsePromise;
```

### Why start waiting before the action?

The request may happen immediately after the click.

If we do:

```ts
await page.getByRole("button", { name: "Search" }).click();

await page.waitForResponse("**/api/products");
```

the request might already have happened before Playwright starts waiting for it.

So we create the response promise first.

```text
Start listening for response
          ↓
Click Search
          ↓
API request
          ↓
Response received
          ↓
Continue
```

### Important

Do not use `waitForResponse()` simply because an API call exists.

Use it when:

* The API response itself matters.
* You need to synchronize specifically with that network event.
* The test needs to inspect the response.

If you only care that the UI result appears, an assertion is usually more meaningful.

---

# 10. `waitForLoadState()`

Playwright provides page load states such as:

```ts
await page.waitForLoadState("domcontentloaded");
```

and:

```ts
await page.waitForLoadState("networkidle");
```

Common load states include:

### `domcontentloaded`

The initial HTML document has been parsed.

### `load`

The page and its dependent resources have finished loading.

### `networkidle`

The page has reached a period with no active network connections.

---

# 11. Why `networkidle` Should Not Be Used Blindly

Modern applications may continuously make background requests for:

* Notifications
* Analytics
* Polling
* Background data
* Monitoring
* Live updates

Therefore, waiting for:

```ts
await page.waitForLoadState("networkidle");
```

does not automatically mean the application is ready for the test.

If the actual requirement is:

> Dashboard should be visible.

then simply verify:

```ts
await expect(
  page.getByText("Dashboard")
).toBeVisible();
```

We care about the application's expected state, not whether every background request has stopped.

---

# 12. Synchronization Hierarchy

A useful way to think about Playwright synchronization is:

```text
1. Playwright auto-waiting
        ↓
   Normal actions

2. Web assertions
        ↓
   Verify expected UI state

3. Specific waits
        ↓
   Use when navigation/network/load-state
   synchronization is genuinely required

4. waitForTimeout()
        ↓
   Avoid arbitrary fixed waits
```

---

# 13. Synchronization vs API Response

Do not think:

> Every API call means I need to wait for the API response.

Instead think:

> What does my test actually need to verify?

Example:

```ts
await page.getByRole("button", { name: "Search" }).click();

await expect(
  page.getByTestId("search-results")
).toBeVisible();
```

Here, the API response is not the requirement.

The requirement is:

> Search results should be displayed.

Therefore, the UI assertion is sufficient.

---

# 14. Action → Synchronization → Assertion

A common Playwright flow is:

```text
Action
   ↓
Application performs asynchronous work
   ↓
Wait for expected condition
   ↓
Assertion
   ↓
Continue
```

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();

await expect(page).toHaveURL("/dashboard");

await expect(
  page.getByText("Dashboard")
).toBeVisible();
```

---

# 15. Complete Example

```ts
import { test, expect } from "@playwright/test";

test("user can login and reach dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Username").fill("Admin");
  await page.getByLabel("Password").fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/dashboard");

  await expect(
    page.getByText("Dashboard")
  ).toBeVisible();
});
```

There is no unnecessary:

```ts
await page.waitForTimeout(3000);
```

because Playwright handles the necessary waiting and the assertions verify the expected result.

---

# D17 Key Takeaways

1. Synchronization is needed because modern applications perform asynchronous operations.
2. Playwright has built-in auto-waiting for many actions.
3. Avoid arbitrary `waitForTimeout()` calls.
4. Prefer waiting for meaningful conditions.
5. Web assertions can both wait and verify.
6. Use `toHaveURL()` to verify navigation.
7. Use `waitForResponse()` when the API response itself matters.
8. Use load-state waits only when they solve a real synchronization requirement.
9. Do not blindly wait for `networkidle` in modern applications.
10. Always synchronize with the **condition that matters to the test**.

## D17 Core Principle

> **Don't wait for time. Wait for the expected application state.**

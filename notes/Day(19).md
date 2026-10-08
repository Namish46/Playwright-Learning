# D19 — Code Quality

## 1. DRY — Don't Repeat Yourself

DRY means avoiding unnecessary duplication of the same logic.

For example, if multiple tests contain the same login steps:

```ts
await page.getByLabel("Username").fill("Admin");
await page.getByLabel("Password").fill("admin123");
await page.getByRole("button", { name: "Login" }).click();
```

Instead of repeating this logic, create one reusable function:

```ts
async function login(page, username, password) {
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
}
```

Then different test data can be passed as parameters:

```ts
await login(page, "Admin", "admin123");
await login(page, "User", "user123");
```

### Benefit

If the Login button locator changes, it only needs to be updated inside `login()`.

**Key idea:** Same logic + different data → reuse the logic and pass the data as parameters.

---

## 2. KISS — Keep It Simple, Stupid

KISS means keeping the solution as simple as possible while still being correct, reliable, and maintainable.

Instead of unnecessary logic:

```ts
const button = page.getByRole("button", { name: "Login" });

if (await button.isVisible()) {
    await button.click();
}
```

Use the simpler solution when appropriate:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

Playwright's actions already provide waiting/actionability behavior, so unnecessary checks should not be added.

### Key idea

Do not add complexity when a simple solution is sufficient.

---

## 3. Single Responsibility Principle — SRP

SRP means a function or class should have one clear responsibility.

For example, avoid one large function doing:

```text
Login
Create User
Send Email
Generate Report
```

Instead, responsibilities can be separated:

```text
login()
createUser()
sendEmail()
generateReport()
```

This makes code easier to understand, maintain, test, and debug.

### Important

Do not split every individual line into a separate function.

The function should have a **clear responsibility**, not necessarily only one line of code.

---

## 4. Separation of Concerns

Separation of concerns means keeping different types of responsibilities in appropriate places.

In automation:

```text
Test
→ Test scenario and verification

Page Object
→ UI locators and UI interactions

Test Data
→ Test data

API Client
→ API operations
```

For example, POM helps separate the test scenario from the details of how the UI is interacted with.

### Key idea

Keep different responsibilities separated instead of mixing everything together.

---

## 5. Readable Naming

Names should clearly communicate what a variable, function, or object represents.

Poor:

```ts
const x = page.locator("#username");
```

Better:

```ts
const usernameInput = page.locator("#username");
```

Poor:

```ts
const a = ...
```

Better:

```ts
const loginButton = ...
```

Good naming allows another developer to understand the code without investigating what every variable means.

Examples:

```text
usernameInput
passwordInput
loginButton
createUser()
login()
searchProduct()
```

### Key idea

**The name should communicate the purpose.**

---

## 6. Small Focused Functions

A function should have a clear and manageable responsibility.

For example:

```ts
async function login(page) {
    // username
    // password
    // click login
}
```

This can be a good focused function because all the steps belong to the same login responsibility.

We should not unnecessarily split it into:

```text
enterUsername()
enterPassword()
clickLogin()
```

unless there is a real reason to reuse or manage those steps separately.

### Key idea

**Keep functions focused, but don't over-split them.**

---

## 7. Avoid Duplication

Repeated logic across multiple tests can make maintenance difficult.

Instead of:

```text
Test 1 → Login logic
Test 2 → Login logic
Test 3 → Login logic
```

Use a reusable function:

```ts
login(page, username, password);
```

Then the common logic exists in one place.

### Key idea

Remove unnecessary duplication, but don't create abstractions only because two pieces of code look slightly similar.

---

## 8. Avoid Premature Abstraction

Premature abstraction means creating reusable functions, classes, components, or complex structures before there is a real need.

If a locator/action is used only once:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

There may be no reason to create:

```ts
async function clickLoginButton(page) {
    await page.getByRole("button", { name: "Login" }).click();
}
```

If the same logic starts appearing in multiple places, then abstraction may become useful.

### Key idea

**First identify a real repeated pattern → then abstract it.**

Do not create unnecessary complexity just because something might be reused in the future.

---

# D19 Summary

Good automation code should be:

* DRY
* Simple
* Maintainable
* Focused
* Readable
* Properly separated
* Reusable when there is a real need
* Not unnecessarily abstracted

The goal is not to create the most complicated framework.

The goal is to create automation that is **easy to understand, maintain, debug, and change.**

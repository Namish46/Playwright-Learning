# D14 — Playwright Project Structure & Test Lifecycle

## Objective

Understand how a real Playwright project is structured, how Playwright tests are written and executed, how configuration and dependencies are managed, and how test setup/cleanup works using lifecycle hooks.

---

# 1. Playwright Project Structure

A typical Playwright project can look like:

```text
playwright-project/
│
├── tests/
│   └── login.spec.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
└── node_modules/
```

Each part has a specific purpose.

---

# 2. `tests/`

The `tests/` folder contains the test files for the project.

Example:

```text
tests/
├── login.spec.ts
├── cart.spec.ts
└── search.spec.ts
```

Each file can contain tests related to a particular feature.

For example:

### `login.spec.ts`

Contains tests related to:

* Valid login
* Invalid password
* Locked account
* Other login scenarios

### `cart.spec.ts`

Contains tests related to:

* Add product
* Remove product
* Update quantity

### `search.spec.ts`

Contains tests related to:

* Search product
* Search with invalid keyword
* Search results

### Main idea

> **Test files contain the test scenarios and test logic for the application.**

---

# 3. `.spec.ts`

A file such as:

```text
login.spec.ts
```

contains:

* `.spec` → indicates a test specification file
* `.ts` → TypeScript file

Therefore:

```text
login.spec.ts
```

is a TypeScript test file.

---

# 4. `playwright.config.ts`

`playwright.config.ts` contains **project-wide Playwright configuration**.

It tells Playwright **how the tests should run**.

Examples of configuration include:

* `baseURL`
* Browser projects
* Retries
* Timeouts
* Reporters
* Screenshots
* Traces
* Other Playwright settings

Example:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
    use: {
        baseURL: "https://example.com"
    }
});
```

### Important

The configuration can define browser projects such as:

```text
Chromium
Firefox
WebKit
```

It does not simply mean "browser versions"; it defines how the tests should be run against different browser engines/projects.

---

# 5. `baseURL`

`baseURL` provides a common base URL for the project.

Example:

```ts
use: {
    baseURL: "https://example.com"
}
```

Then instead of:

```ts
await page.goto("https://example.com/login");
```

we can use:

```ts
await page.goto("/login");
```

Playwright combines them:

```text
baseURL + /login
        ↓
https://example.com/login
```

### Important

`baseURL` does **not automatically navigate to the URL when the test starts**.

It provides the base URL that can be used when a relative URL is supplied.

### Why is `baseURL` useful?

If the application URL changes, we can update it in one configuration file instead of changing it across many test files.

This improves:

* Maintainability
* Readability
* Reusability
* Reduces repeated code

---

# 6. Cross-Browser Testing

A Playwright project can run tests against multiple browser engines.

For example:

```text
Chromium
Firefox
WebKit
```

### Why do we do this?

Different browsers can have different implementations and behavior.

An application might work correctly in one browser but expose a browser-specific problem in another.

Real users may also use different browsers.

Therefore, cross-browser testing helps verify browser compatibility.

```text
Same Test
   │
   ├── Chromium
   ├── Firefox
   └── WebKit
```

---

# 7. `package.json`

`package.json` contains information about the Node.js project and its dependencies.

Example:

```json
{
    "devDependencies": {
        "@playwright/test": "^1.x.x"
    }
}
```

It describes packages the project needs.

It can also contain other project information and scripts.

### Main idea

> **`package.json` tells us what dependencies and project configuration the Node.js project needs.**

---

# 8. `package-lock.json`

`package-lock.json` records the **resolved dependency tree and exact versions** that were installed/resolved.

It helps different developers install a more consistent dependency tree.

Think:

```text
package.json
      ↓
What dependencies does the project need?

package-lock.json
      ↓
What exact dependency tree/versions were resolved?

node_modules
      ↓
What packages are actually installed?
```

---

# 9. `node_modules`

`node_modules` contains the actual installed Node.js packages/dependencies.

For example, after:

```bash
npm install
```

the required dependencies are installed into:

```text
node_modules/
```

If another developer clones the project, they may have:

```text
package.json
package-lock.json
```

but not:

```text
node_modules/
```

They can run:

```bash
npm install
```

to install the required dependencies.

---

# 10. `npm init playwright@latest`

This command can be used to initialize a new Playwright project:

```bash
npm init playwright@latest
```

It helps create the initial Playwright project setup.

Depending on the choices made during setup, it can help configure:

* Project structure
* TypeScript/JavaScript
* Playwright configuration
* Dependencies
* Example tests
* Browser installation

Conceptually:

```text
npm init playwright@latest
          ↓
Playwright project setup
          ↓
Configuration
          ↓
Dependencies
          ↓
Test structure
```

### Important distinction

Use this mainly when **creating/initializing a new Playwright project**.

If the company already has an existing Playwright project, we normally don't initialize another one.

---

# 11. `npm install`

When an existing project already has dependency information, we use:

```bash
npm install
```

It reads the project's dependency definitions and installs the required packages.

For example:

```text
Clone repository
      ↓
package.json exists
package-lock.json exists
node_modules doesn't exist
      ↓
npm install
      ↓
Dependencies installed
      ↓
Project ready to run
```

### Difference

```text
npm init playwright@latest
→ Initialize a new Playwright project

npm install
→ Install dependencies for an existing project
```

---

# 12. Importing Playwright

A Playwright test normally imports functionality from:

```ts
@playwright/test
```

Example:

```ts
import { test, expect } from "@playwright/test";
```

`import` allows us to bring functionality from another module/package into our current file.

Here:

```ts
test
```

is imported so we can define tests.

And:

```ts
expect
```

is imported so we can make assertions.

---

# 13. `test()`

A Playwright test is defined using:

```ts
test("Login test", async ({ page }) => {
    // test steps
});
```

The first argument:

```ts
"Login test"
```

is the name/description of the test.

A clear test name is important because it helps with:

* Understanding the test
* Debugging failures
* Maintenance
* Test reports

Prefer:

```ts
test("User can login with valid credentials", ...)
```

instead of:

```ts
test("test1", ...)
```

---

# 14. `async` and `await`

Playwright browser operations are asynchronous.

Example:

```ts
await page.goto("/login");
```

We use `await` so the test waits for that particular asynchronous operation to reach the appropriate completion point before continuing.

Example:

```ts
await page.goto("/login");

await page.getByRole("textbox", { name: "Username" }).fill("Admin");

await page.getByRole("button", { name: "Login" }).click();
```

The intended sequence is:

```text
Navigate
   ↓
Fill
   ↓
Click
```

### Important

`await` does **not** mean:

> "Wait for a fixed amount of time."

It means:

> "Wait for this asynchronous operation to resolve."

This is different from:

```ts
await page.waitForTimeout(5000);
```

which is an arbitrary fixed delay.

---

# 15. Actions vs Assertions

A test should not only perform actions; it should also verify the expected result.

For example:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

This performs an action.

But it does not prove login was successful.

We can verify the result:

```ts
await expect(page.getByText("Dashboard")).toBeVisible();
```

Therefore:

```text
Action
 ↓
Click Login
 ↓
Assertion
 ↓
Verify Dashboard
```

### Main idea

> **Actions perform operations. Assertions verify expected behavior/results.**

---

# 16. Complete Login Test

Example:

```ts
import { test, expect } from "@playwright/test";

test("User can login with valid credentials", async ({ page }) => {

    await page.goto("/login");

    await page.getByRole("textbox", { name: "Username" }).fill("Admin");

    await page.getByRole("textbox", { name: "Password" }).fill("admin123");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Dashboard")).toBeVisible();
});
```

Flow:

```text
Test starts
   ↓
Open /login
   ↓
Find username field
   ↓
Fill username
   ↓
Find password field
   ↓
Fill password
   ↓
Find Login button
   ↓
Click Login
   ↓
Verify Dashboard
```

---

# 17. `test.describe()`

When a project becomes larger, we can group related tests using:

```ts
test.describe("Login Tests", () => {

    test("Valid login", async ({ page }) => {
        // ...
    });

    test("Invalid login", async ({ page }) => {
        // ...
    });

});
```

`test.describe()` creates a **logical group** of related tests.

For example:

```text
Login Tests
├── Valid login
├── Invalid password
└── Locked account
```

Another group could be:

```text
Cart Tests
├── Add product
├── Remove product
└── Update quantity
```

### Important

`test.describe()` groups tests logically.

The tests inside it are still **independent test cases**.

---

# 18. `beforeEach()`

`beforeEach()` runs before **every test** in its scope.

Example:

```ts
test.describe("Login Tests", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("Valid login", async ({ page }) => {
        // ...
    });

    test("Invalid login", async ({ page }) => {
        // ...
    });

});
```

Execution:

```text
beforeEach
    ↓
Valid login

beforeEach
    ↓
Invalid login
```

If there are 5 tests:

```text
beforeEach → 5 times
```

### Why use `beforeEach()`?

It is useful when every test needs the same setup.

For example:

```text
Open application
Login
Prepare test state
```

Instead of repeating the same setup in every test, we can put it in `beforeEach()`.

---

# 19. `beforeAll()`

`beforeAll()` runs **once before all tests in its scope**.

Example:

```ts
test.beforeAll(async () => {
    // setup
});
```

If there are 5 tests:

```text
beforeAll → 1 time
```

Conceptually:

```text
beforeAll
   ↓
Test 1
   ↓
Test 2
   ↓
Test 3
   ↓
Test 4
   ↓
Test 5
```

### Remember

> **beforeAll = once before the group**

---

# 20. `afterEach()`

`afterEach()` runs **after every test**.

Example:

```ts
test.afterEach(async ({ page }) => {
    // cleanup
});
```

If there are 4 tests:

```text
afterEach → 4 times
```

It can be useful for test-specific cleanup.

For example:

```text
Test creates test data
        ↓
Test finishes
        ↓
afterEach cleans up the data
```

### Remember

> **afterEach = cleanup after every test**

---

# 21. `afterAll()`

`afterAll()` runs **once after all tests in its scope finish**.

Example:

```ts
test.afterAll(async () => {
    // cleanup
});
```

If there are 4 tests:

```text
afterAll → 1 time
```

Conceptually:

```text
Test 1
   ↓
Test 2
   ↓
Test 3
   ↓
Test 4
   ↓
afterAll
```

### Remember

> **afterAll = cleanup once after the group**

---

# 22. Complete Test Lifecycle

Suppose we have:

```ts
test.describe("Cart Tests", () => {

    test.beforeAll(async () => {
        // once
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/cart");
    });

    test("Add product", async ({ page }) => {
        // ...
    });

    test("Remove product", async ({ page }) => {
        // ...
    });

    test.afterEach(async ({ page }) => {
        // cleanup
    });

    test.afterAll(async () => {
        // once
    });

});
```

The conceptual execution order is:

```text
beforeAll
    ↓
beforeEach
    ↓
Add product
    ↓
afterEach
    ↓
beforeEach
    ↓
Remove product
    ↓
afterEach
    ↓
afterAll
```

### Easy memory trick

```text
BEFORE → Setup
AFTER  → Cleanup

ALL  → Once
EACH → Every test
```

Therefore:

```text
beforeAll  → setup once
beforeEach → setup every test

afterEach  → cleanup every test
afterAll   → cleanup once
```

---

# 23. Choosing the Correct Hook

Suppose an e-commerce test suite has:

```text
Cart Tests
├── Add product
├── Remove product
└── Update quantity
```

Every test needs to:

```text
Open application
   ↓
Go to cart
```

And every test needs:

```text
Clean up its test data
```

A suitable approach is:

```text
beforeEach
    ↓
Prepare test

Test
    ↓
afterEach
    ↓
Cleanup
```

So:

```text
beforeEach + afterEach
```

are appropriate when each test needs its **own setup and cleanup**.

This supports test independence and reduces accidental state sharing.

---

# 24. `test.only()`

Sometimes we have many tests but are currently debugging only one.

Example:

```ts
test.only("Add product to cart", async ({ page }) => {
    // ...
});
```

This tells Playwright to run only that focused test.

For example:

```text
Test A
Test B
Test C ← test.only()
Test D
```

Only Test C is executed in the focused run.

### Important warning

`test.only()` should normally be temporary.

Do not accidentally commit it to a shared repository because it can prevent the rest of the test suite from running.

---

# 25. Complete D14 Mental Model

A basic Playwright project can be understood as:

```text
Playwright Project
│
├── tests/
│     └── *.spec.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
└── node_modules/
```

A test file can follow this structure:

```text
Import
  ↓
test.describe()
  ↓
beforeAll()
  ↓
beforeEach()
  ↓
test()
  ↓
Actions
  ↓
Assertions
  ↓
afterEach()
  ↓
afterAll()
```

---

# D14 Key Takeaways

1. `tests/` contains the project's test files.
2. `.spec.ts` represents a TypeScript test specification file.
3. `playwright.config.ts` contains project-wide Playwright configuration.
4. `baseURL` provides a common base URL for relative navigation.
5. Cross-browser testing helps verify compatibility across Chromium, Firefox, and WebKit.
6. `package.json` defines project information and dependencies.
7. `package-lock.json` records the resolved dependency tree and exact versions.
8. `node_modules` contains the installed packages.
9. `npm init playwright@latest` initializes a new Playwright project.
10. `npm install` installs dependencies for an existing project.
11. `import` brings functionality from a module/package into the current file.
12. `test()` defines an individual test case.
13. Clear test names improve readability, debugging, maintenance, and reporting.
14. `async/await` is used with asynchronous Playwright operations.
15. Actions perform operations; assertions verify expected results.
16. `test.describe()` logically groups related tests.
17. `beforeEach()` runs before every test.
18. `beforeAll()` runs once before all tests in the scope.
19. `afterEach()` runs after every test.
20. `afterAll()` runs once after all tests in the scope.
21. `test.only()` temporarily focuses execution on a specific test.
22. Test-specific setup/cleanup is commonly handled with `beforeEach()` and `afterEach()`.
23. Shared setup/cleanup can use `beforeAll()` and `afterAll()`, but should be used carefully when state could affect test independence.

---

# D14 Quick Revision

```text
Project
 ↓
tests/
 ↓
.spec.ts
 ↓
test()
 ↓
Actions
 ↓
Assertions
```

Lifecycle:

```text
beforeAll
    ↓
beforeEach
    ↓
Test
    ↓
afterEach
    ↓
beforeEach
    ↓
Test
    ↓
afterEach
    ↓
afterAll
```

### Most important concepts to remember

```text
baseURL
→ Common base URL

test()
→ Individual test

test.describe()
→ Group related tests

beforeEach()
→ Setup before every test

beforeAll()
→ Setup once

afterEach()
→ Cleanup after every test

afterAll()
→ Cleanup once

test.only()
→ Temporarily run only one test
```

## D14 Status

**DONE ✅**

I can explain the project structure, create/understand a Playwright test, use assertions, group tests, and explain the complete test lifecycle.

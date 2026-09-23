# D12 — JavaScript / TypeScript Basics for Playwright

## Objective

Learn only the JavaScript/TypeScript concepts required to understand and write basic Playwright tests.

---

## 1. Variables

Variables store values.

### `let`

`let` allows the value to be reassigned.

```ts
let browser = "Chrome";

browser = "Firefox";
```

### `const`

`const` does not allow the variable to be reassigned.

```ts
const password = "admin123";
```

For Playwright code, `const` is commonly used when the variable itself does not need to be reassigned.

---

## 2. Basic Data Types

Common JavaScript/TypeScript data types:

```ts
const username = "admin";          // string
const age = 25;                    // number
const isLoggedIn = true;           // boolean
const browsers = ["chromium", "firefox", "webkit"]; // array

const user = {
    username: "admin",
    role: "manager"
};                                 // object
```

### Common types

* **String** → text
* **Number** → numeric values
* **Boolean** → `true` or `false`
* **Array** → collection/list of values
* **Object** → collection of related properties and values

---

## 3. Functions

A function is a reusable block of code.

Example:

```ts
function add(a, b) {
    return a + b;
}

add(10, 20);
```

Output:

```text
30
```

### Parameters vs Arguments

In:

```ts
function add(a, b) {
    return a + b;
}
```

`a` and `b` are **parameters**.

When calling:

```ts
add(10, 20);
```

`10` and `20` are **arguments**.

---

## 4. Return

`return` sends a value back from a function.

```ts
function greet(name) {
    return "Hello " + name;
}

greet("Rahul");
```

Result:

```text
Hello Rahul
```

---

## 5. Arrow Functions

Arrow functions provide another way to write functions.

Regular function:

```ts
function add(a, b) {
    return a + b;
}
```

Arrow function:

```ts
const add = (a, b) => {
    return a + b;
};
```

They are commonly seen in modern JavaScript/TypeScript and Playwright code.

---

## 6. `if / else`

`if / else` is used to make decisions.

```ts
const isLoggedIn = true;

if (isLoggedIn) {
    console.log("Go to dashboard");
} else {
    console.log("Please login");
}
```

If the condition is `true`, the `if` block executes.

Otherwise, the `else` block executes.

---

## 7. Comparison Operator `===`

`===` checks whether two values are equal.

```ts
const age = 25;

if (age === 25) {
    console.log("Age is 25");
}
```

### Important difference

```ts
age = 25;       // assignment
age === 25;     // comparison
```

* `=` → assigns a value
* `===` → compares values

---

## 8. `for` Loop

A `for` loop repeats code.

```ts
for (let i = 1; i <= 3; i++) {
    console.log(i);
}
```

Output:

```text
1
2
3
```

The condition is checked again with `i = 4`, but `4 <= 3` is false, so the loop stops.

### Three parts

```ts
for (let i = 1; i <= 3; i++)
```

* `let i = 1` → starting value
* `i <= 3` → condition
* `i++` → increase `i` by 1

---

## 9. `for...of` Loop

`for...of` is useful for going through the values of an array.

```ts
const products = ["Laptop", "Phone", "Headphones"];

for (const product of products) {
    console.log(product);
}
```

Output:

```text
Laptop
Phone
Headphones
```

`product` directly receives each value.

It is not initially `null`.

---

## 10. Arrays and Indexes

Arrays store multiple values.

```ts
const browsers = ["chromium", "firefox", "webkit"];
```

Array indexes start at **0**.

```ts
browsers[0]; // chromium
browsers[1]; // firefox
browsers[2]; // webkit
```

### `.length`

`.length` gives the number of elements.

```ts
const products = ["Laptop", "Phone", "Mouse", "Keyboard"];

console.log(products.length);
```

Output:

```text
4
```

Important:

```text
Number of elements = 4
Last index = 3
```

---

## 11. `while` Loop

A `while` loop continues as long as its condition is true.

```ts
let i = 1;

while (i <= 3) {
    console.log(i);
    i++;
}
```

Output:

```text
1
2
3
```

The condition is checked again with `i = 4`, but `4 <= 3` is false.

---

## 12. `break`

`break` stops the entire loop.

```ts
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        break;
    }

    console.log(i);
}
```

Output:

```text
1
2
```

When `i` becomes `3`, `break` immediately stops the loop.

---

## 13. `continue`

`continue` skips the current iteration and moves to the next iteration.

```ts
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue;
    }

    console.log(i);
}
```

Output:

```text
1
2
4
5
```

### Remember

```text
break     → stop the entire loop
continue  → skip the current iteration
```

---

# 14. `async` and `await`

Playwright performs many operations that happen asynchronously.

Example:

```ts
async function login() {
    await page.goto("https://example.com");
}
```

### `async`

`async` allows a function to use `await`.

### `await`

`await` tells JavaScript to wait for an asynchronous operation to complete before continuing.

Example:

```ts
await page.goto("https://example.com");

console.log("Page opened");
```

The order is:

```text
page.goto() starts
        ↓
page.goto() finishes
        ↓
"Page opened" is printed
```

For now, we do not need to go deeply into Promises.

---

# 15. Playwright Uses Functions

A Playwright test can look like:

```ts
test("Search product", async ({ page }) => {
    await page.goto("https://example.com");
});
```

Here:

* `test()` → Playwright function
* `"Search product"` → test name
* `async` → allows `await`
* `page` → Playwright-provided object representing the browser page
* `page.goto()` → navigates to a URL
* `await` → waits for the operation to finish

---

# 16. Playwright Locators and Actions

Example:

```ts
await page.locator('//input[@name="username"]').fill("Admin");
```

Flow:

```text
page
 ↓
locator()
 ↓
find username input
 ↓
fill("Admin")
```

Here:

```ts
'//input[@name="username"]'
```

uses the HTML `name` attribute.

It means:

> Find an `input` element whose `name` attribute is `username`.

---

## 17. `getByRole()`

Example:

```ts
await page.getByRole("button", { name: "Login" }).click();
```

Here:

* `"button"` → accessible role
* `"Login"` → accessible name
* `.click()` → clicks the located button

Important distinction:

```ts
page.locator('//input[@name="username"]')
```

uses the HTML `name` attribute.

But:

```ts
page.getByRole("button", { name: "Login" })
```

uses the element's **accessible role and accessible name**. It is not simply using an HTML `name` attribute.

---

# 18. Complete Hands-on Playwright Test

The concepts learned in D12 were combined into this basic login test:

```ts
test("testlogin", async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    await page.locator('//input[@name="username"]').fill("Admin");

    await page.locator('//input[@name="password"]').fill("admin123");

    await page.getByRole("button", { name: "Login" }).click();
});
```

Flow:

```text
Start test
    ↓
Open OrangeHRM login page
    ↓
Find username input
    ↓
Fill Admin
    ↓
Find password input
    ↓
Fill admin123
    ↓
Find Login button
    ↓
Click Login
```

---

# D12 Key Takeaways

1. `let` → variable that can be reassigned.
2. `const` → variable that cannot be reassigned.
3. Functions → reusable blocks of code.
4. Parameters → placeholders inside a function.
5. Arguments → actual values passed to a function.
6. `return` → returns a value from a function.
7. `if / else` → decision making.
8. `===` → comparison.
9. `for`, `for...of`, `while` → loops.
10. `break` → stops a loop.
11. `continue` → skips the current iteration.
12. Arrays use indexes starting from `0`.
13. `.length` → number of array elements.
14. `async` → allows `await` inside a function.
15. `await` → waits for an asynchronous operation to complete.
16. `page` → represents the Playwright browser page.
17. `locator()` → finds elements.
18. Playwright actions include `.fill()` and `.click()`.
19. `getByRole()` uses accessible role/name to locate elements.

## D12 Status

**Completed**

Hands-on requirement completed by writing and correcting a basic Playwright login test.

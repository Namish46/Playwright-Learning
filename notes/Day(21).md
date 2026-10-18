# Day 21 — Page Object Model (POM) Project

## 1. Objective

Refactor a Playwright test into separate Page Object classes to improve readability, maintainability, reusability, and debugging.

**Application:** SauceDemo  
**URL:** https://www.saucedemo.com/

## 2. Project structure

```text
Playwright-Learning/
├── pages/
│   ├── LoginPage.js
│   ├── HomePage.js
│   └── CartPage.js
├── tests/
│   └── login.spec.js
└── playwright.config.js
```

## 3. Responsibilities of each Page Object

### LoginPage.js
- Stores the username, password, and login button locators.
- Provides a `login()` method to perform the login action.

### HomePage.js
- Stores the locator for the Sauce Labs Backpack Add to cart button.
- Provides an `addBackpackToCart()` method.

### CartPage.js
- Stores the locator for the Sauce Labs Backpack product name in the cart.
- Provides an `isBackpackVisible()` method that returns the visibility state.

## 4. Important code concepts

### Storing a locator

```javascript
this.addBackpackToCartBtn =
  page.locator("#add-to-cart-sauce-labs-backpack");
```

The locator is stored as an instance property so other methods in the class can reuse it.

### Accessing properties with `this`

```javascript
async addBackpackToCart() {
  await this.addBackpackToCartBtn.click();
}
```

`this` refers to the current class instance. It allows the method to access properties stored in the constructor.

### Exporting and importing classes

Export:

```javascript
module.exports = { HomePage };
```

Import:

```javascript
const { HomePage } = require("../pages/HomePage");
```

This allows a test to create and use the Page Object.

## 5. Test workflow

The test performs the following steps:

1. Navigate to SauceDemo.
2. Log in with the demo credentials.
3. Create a `HomePage` object.
4. Add Sauce Labs Backpack to the cart.
5. Click the cart link.
6. Create and use `CartPage` to verify the backpack is visible.

Example:

```javascript
const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginpage");
const { HomePage } = require("../pages/HomePage");
const { CartPage } = require("../pages/CartPage");

test("user can log in and add a backpack to the cart", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const homePage = new HomePage(page);
  await homePage.addBackpackToCart();

  await page.locator(".shopping_cart_link").click();

  const cartPage = new CartPage(page);
  await expect(await cartPage.isBackpackVisible()).toBe(true);
});
```

## 6. Locator debugging lesson

The initial cart locator used:

```javascript
page.getByRole("link", {
  name: "Sauce Labs Backpack"
});
```

The assertion failed because the accessible role and name did not match the element's actual accessible properties.

The page snapshot showed:

```text
button "View details for Sauce Labs Backpack"
```

The corrected locator was:

```javascript
page.getByRole("button", {
  name: "View details for Sauce Labs Backpack"
});
```

**Key lesson:** Use the actual accessible role and name exposed by the page. The HTML tag, accessible role, and accessible name are related but are not always identical.

## 7. Locator vs. action vs. assertion

- **Locator:** Identifies an element.
- **Action:** Interacts with an element, such as clicking or filling it.
- **Assertion:** Verifies that the actual result matches the expected result.

Example:

```javascript
const backpack = page.getByRole("button", {
  name: "View details for Sauce Labs Backpack"
});

await backpack.click();
await expect(backpack).toBeVisible();
```

Prefer Playwright's web-first assertions such as `toBeVisible()` because they automatically retry until the expected condition is met or the assertion times out.

## 8. Design principles

### POM — Page Object Model
Separates page-specific locators and actions from test workflows.

### DRY — Don't Repeat Yourself
Avoids duplicating common logic across tests.

### KISS — Keep It Simple
Avoids unnecessary complexity and overengineering.

### Maintainability
When a shared locator changes, update it in its Page Object instead of manually updating every test that uses it.

### Debugging
Separating page responsibilities helps isolate failures and makes tests easier to understand.

## 9. Completion checklist

- [x] Created `HomePage.js`.
- [x] Created `CartPage.js`.
- [x] Connected the Page Objects to the test.
- [x] Automated login and adding a product to the cart.
- [x] Opened the cart and verified the product.
- [x] Debugged a locator mismatch.
- [x] Explained POM, KISS, DRY, locators, and assertions.
- [x] Ran the test successfully.

**Status:** Done  
**Revision topics:** Web-first assertions, accessible roles, and Page Object responsibilities.

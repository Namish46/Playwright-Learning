# Day 20 — Page Object Model (POM)

## 1. What is Page Object Model?

Page Object Model (POM) is a design pattern used in UI automation. It organizes automation code by representing each application page as a separate class.

A page class contains the locators and methods needed to interact with that page.

## 2. What problem does POM solve?

Without POM, tests may repeat the same locators and UI actions in multiple places. If a locator changes, we may need to update several test files.

With POM, page-specific locators and interactions are centralized. This makes the framework easier to maintain, read, and update.

## 3. Page classes

An application can have separate page classes, such as:

- `LoginPage.ts` — login interactions
- `HomePage.ts` — home page interactions
- `ProductPage.ts` — product search and selection
- `CartPage.ts` — cart interactions
- `CheckoutPage.ts` — checkout interactions

Each class should focus on the responsibilities of its page or UI area.

## 4. Locator ownership

Page Objects own the locators needed to interact with their respective pages.

For example:

```ts
class LoginPage {
  constructor(private page: Page) {}

  username = this.page.getByLabel("Username");
  password = this.page.getByLabel("Password");
  loginButton = this.page.getByRole("button", {
    name: "Login"
  });
}
```

If a locator changes, we can update it in the Page Object rather than repeating the change across tests that use that locator through the Page Object.

## 5. Business actions

A Page Object can group several UI operations into a meaningful method.

```ts
async login(username: string, password: string) {
  await this.username.fill(username);
  await this.password.fill(password);
  await this.loginButton.click();
}
```

The `login()` method represents the action of logging in. The test can call this method instead of repeating each UI operation.

## 6. Constructor and page

The constructor receives the Playwright `page` object. This allows the Page Object to use the same browser page and session as the test.

```ts
const loginPage = new LoginPage(page);
```

Here, `page` is passed as an argument to the constructor.

## 7. Readable tests

A test using POM focuses on the scenario rather than the implementation details of every UI interaction.

```ts
test("user logs in", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login("Admin", "admin123");

  await expect(page.getByRole("heading", {
    name: "Dashboard"
  })).toBeVisible();
});
```

The test describes the scenario and verifies the expected result. The Page Object handles the UI interactions.

## 8. Assertions: test vs Page Object

Assertions normally belong in the test because the test defines the expected outcome and determines whether the scenario passes.

Page Objects may expose locators or page-specific condition methods for tests to use.

Example:
- Page Object: select a product.
- Test: verify that the correct product appears in the cart.

## 9. POM limitations

POM does not automatically guarantee:
- Reliable or non-flaky tests
- Good locators
- Correct synchronization
- Meaningful assertions
- Good test data
- Good test scenarios

These still require careful test design and implementation.

## 10. Large-page-object anti-pattern

A large-page-object anti-pattern occurs when one class contains too many unrelated responsibilities, such as login, dashboard, products, cart, checkout, API calls, and test-data creation.

This makes the class difficult to understand, debug, and maintain.

Instead, separate responsibilities into focused page classes and appropriate helper or service classes.

## 11. Connection to D19 principles

- **DRY:** Avoid unnecessary duplication of locators and repeated logic.
- **KISS:** Keep the framework simple and understandable.
- **SRP:** Give each class one clear responsibility.
- **Separation of concerns:** Keep scenario verification in tests and UI interaction details in Page Objects.

## Key takeaway

The test describes what should happen. The Page Object describes how to interact with the UI.

POM improves organization and maintainability, but good test design, assertions, locators, and synchronization are still necessary.
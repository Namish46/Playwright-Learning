const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginpage");
const { HomePage } = require("../pages/HomePage");
const { CartPage } = require("../pages/CartPage");
test("user can log in and add a backpack to the cart", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(
    "https://www.saucedemo.com/"
  );

  await loginPage.login("standard_user", "secret_sauce");
  const homePage = new HomePage(page);
  const cartPage=new CartPage(page);
  await homePage.addBackpackToCart();
  await page.locator(".shopping_cart_link").click();
  await page.screenshot({ path: "cart-debug.png" });
  expect(await cartPage.isBackpackVisible()).toBe(true);
});

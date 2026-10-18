class CartPage {
  constructor(page) {
    this.page = page;
    this.sauceLabsBackpack = page.getByRole("button", {
      name: "View details for Sauce Labs Backpack",
    });
  }

  async isBackpackVisible() {
    return await this.sauceLabsBackpack.isVisible();
  }
}

module.exports = { CartPage };
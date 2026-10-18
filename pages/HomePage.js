
class HomePage {
  constructor(page) {
    this.page = page;
    this.addBackpackToCartBtn=page.locator("#add-to-cart-sauce-labs-backpack");
  }

  async addBackpackToCart() {
    await this.addBackpackToCartBtn.click();
}
}

module.exports = { HomePage };
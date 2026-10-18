
class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole("textbox", {
      name: "Username",
    });

    this.password = page.getByRole("textbox", {
      name: "Password",
    });

    this.loginButton = page.getByRole("button", {
      name: "Login",
    });
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
# D18 — Real-World Browser Scenarios

## 1. Dropdowns

For a native HTML `<select>` dropdown, Playwright provides `selectOption()`.

```ts
await page.getByLabel("Browser").selectOption("Firefox");
```

The value passed to `selectOption()` should match the option's value.

### Key idea

Use the appropriate locator to identify the dropdown, then select the required option.

---

## 2. Tables

When working with tables, avoid locating rows only by position when possible.

Instead, identify the correct row using meaningful content and then scope the action inside that row.

```ts
const row = page.getByRole("row", { name: /David/ });

await row.getByRole("button", { name: "Edit" }).click();
```

### Why row scoping is better

Using:

```ts
page.getByRole("button", { name: "Edit" }).nth(2)
```

depends on the button's position.

If the table order changes, the test may act on the wrong row.

### Key idea

**Find the correct row → scope inside the row → perform the action.**

---

## 3. Pagination

When testing pagination, navigate to the correct page rather than assuming an element's position across the entire dataset.

For example, if User 57 is on page 4:

1. Navigate to page 4.
2. Locate User 57.
3. Perform the required action.
4. Verify the result.

Avoid approaches such as:

```ts
page.getByText("User 57").nth(56)
```

because they depend on position and do not properly test pagination.

### Key idea

Pagination should be tested as a user workflow, not by relying on global element indexes.

---

## 4. Calendars / Date Pickers

When selecting a date:

1. Identify the correct calendar.
2. Select or navigate to the required month/year.
3. Select the required date.
4. Verify the selected date.

Avoid simply searching for a number such as:

```ts
getByText("25")
```

because multiple months or elements may contain the same number.

### Key idea

**Correct calendar → correct month/year → correct date.**

---

## 5. Autocomplete

Autocomplete fields dynamically display suggestions while typing.

Example:

```ts
await page.getByPlaceholder("Search products").fill("lap");

await expect(
    page.getByRole("option", { name: "Laptop Bag" })
).toBeVisible();

await page.getByRole("option", { name: "Laptop Bag" }).click();
```

The test waits for the meaningful suggestion instead of using:

```ts
await page.waitForTimeout(2000);
```

### Key idea

Use a specific suggestion and synchronize with its actual appearance.

---

## 6. Modals / Dialogs

A modal is a dialog displayed over the current page.

Use the dialog as a scope to avoid accidentally interacting with another element.

```ts
const dialog = page.getByRole("dialog");

await dialog.getByRole("button", { name: "Delete" }).click();
```

If multiple dialogs exist, make the dialog itself more specific:

```ts
const dialog = page.getByRole("dialog", {
    name: "Delete User?"
});
```

Then:

```ts
await dialog.getByRole("button", { name: "Delete" }).click();
```

### Verify the result

Do not only verify that the modal disappeared.

For Delete:

```ts
await expect(dialog).toBeHidden();
```

And, when appropriate, verify the application state as well.

For Cancel:

```ts
await dialog.getByRole("button", { name: "Cancel" }).click();

await expect(dialog).toBeHidden();
await expect(page.getByText("David")).toBeVisible();
```

### Key idea

**Identify the correct dialog → identify the correct element inside it → perform action → verify the expected application state.**

---

## 7. Frames / iFrames

An iframe contains a separate document inside the main webpage.

Elements inside the iframe should be located within the correct frame.

Use `frameLocator()`:

```ts
const frame = page.frameLocator("#login-frame");

await frame.getByLabel("Username").fill("Admin");
```

Example:

```ts
const paymentFrame = page.frameLocator("#payment-frame");

await paymentFrame.locator("#cardNumber")
    .fill("4111111111111111");

await paymentFrame.getByRole("button", {
    name: "Pay Now"
}).click();
```

Then verify the result:

```ts
await expect(
    page.getByText("Payment Successful")
).toBeVisible();
```

### Key idea

**Main page → correct frame → correct element → action → verification.**

---

## 8. Multiple Tabs / Pages

A browser context can contain multiple pages (tabs).

Each `Page` object represents an individual tab/page.

Example:

```ts
const newPagePromise = context.waitForEvent("page");

await page.getByText("Open Report").click();

const newPage = await newPagePromise;

await expect(newPage).toHaveTitle("Monthly Report");
```

### Important concepts

* `Browser` → browser instance
* `BrowserContext` → isolated session
* `Page` → individual tab/page

Multiple pages in the same context share the same session state.

Different contexts can be used for isolated users.

---

## 9. Mouse and Keyboard Actions

Playwright provides actions for mouse and keyboard interactions.

Examples:

```ts
await page.getByText("Menu").hover();
```

```ts
await page.getByPlaceholder("Search").press("Enter");
```

```ts
await page.getByText("Item").dblclick();
```

```ts
await page.getByPlaceholder("Search").focus();
```

Use these when the application's behavior depends on actual mouse or keyboard interaction.

---

## 10. Downloads

Downloads are asynchronous events.

Set up the download listener **before** clicking the download button.

```ts
const downloadPromise = page.waitForEvent("download");

await page.getByRole("button", {
    name: "Download Report"
}).click();

const download = await downloadPromise;
```

Then verify the downloaded file:

```ts
await expect(download.suggestedFilename())
    .toBe("report.pdf");
```

### Why listen before clicking?

The download event can happen after the click. The listener should already be waiting so the event is not missed.

### Key idea

**Start listening → perform action → receive download → verify it.**

---

# D18 Core Principle

Real-world browser automation is not just about clicking elements.

The test should:

1. Identify the correct element/context.
2. Perform the correct user action.
3. Synchronize with the application's behavior.
4. Verify the expected result.

Good automation focuses on **stable locators, correct scoping, meaningful synchronization, and outcome verification**.

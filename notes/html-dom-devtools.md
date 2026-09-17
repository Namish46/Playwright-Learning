# HTML, DOM & DevTools

## 1. What is HTML?

HTML stands for **HyperText Markup Language**.

HTML defines the **structure of a web page** and the elements that appear on it.

Examples of elements:

* Button
* Input field
* Heading
* Link
* Image
* Form

For example:

```html
<button>Login</button>
```

This creates a button with the text `Login`.

### Simple understanding

* HTML → structure of the webpage
* CSS → appearance/style of the webpage
* JavaScript → behavior/interactions of the webpage

---

## 2. HTML Element / Tag

An HTML element represents something on a webpage.

Example:

```html
<button>Login</button>
```

Here:

* `button` → HTML tag/element
* `Login` → text/content

Another example:

```html
<input type="text">
```

Here:

* `input` → HTML element
* `type="text"` → attribute

---

## 3. HTML Attributes

Attributes provide additional information about an HTML element.

Example:

```html
<input id="username" type="text">
```

Here:

* `input` → element
* `id` → attribute
* `username` → value of the `id` attribute
* `type` → attribute
* `text` → value of the `type` attribute

Another example:

```html
<button id="loginBtn" class="primary-btn">Login</button>
```

Attributes:

* `id`
* `class`

Values:

* `loginBtn`
* `primary-btn`

Text:

* `Login`

---

## 4. Example of Identifying HTML Parts

Given:

```html
<button id="loginBtn" class="primary-btn">Login</button>
```

| Part          | Meaning          |
| ------------- | ---------------- |
| `button`      | Element/tag      |
| `id`          | Attribute        |
| `loginBtn`    | Value of `id`    |
| `class`       | Attribute        |
| `primary-btn` | Value of `class` |
| `Login`       | Text/content     |

---

# 5. DOM

DOM stands for **Document Object Model**.

The browser parses the HTML and creates the DOM.

The DOM is a **tree-like representation of the HTML document**, containing the page's elements and their relationships.

### Basic flow

```text
HTML
  ↓
Browser parses HTML
  ↓
DOM is created
  ↓
Elements are represented in the page
```

The DOM allows scripts and automation tools such as Playwright to find and interact with webpage elements.

---

## 6. HTML vs DOM

### HTML

HTML is the markup/code used to define the structure of a webpage.

Example:

```html
<div>
    <button>Login</button>
</div>
```

### DOM

After the browser parses the HTML, it creates a DOM representation.

Conceptually:

```text
div
└── button
    └── "Login"
```

### Easy way to remember

**HTML → code/markup we write**

**DOM → tree-like representation created by the browser after parsing the HTML**

---

# 7. Parent and Child Elements

HTML elements can have relationships with other elements.

Example:

```html
<div class="container">
    <button id="login">Login</button>
</div>
```

Here:

* `div` → parent element
* `button` → child element
* `class="container"` → attribute of the `div`
* `id="login"` → attribute of the `button`
* `Login` → button text

Conceptually:

```text
div
└── button
    └── "Login"
```

Understanding these relationships is useful when working with the DOM and locating elements in Playwright.

---

# 8. Browser DevTools

**DevTools** is a set of browser tools that helps us inspect and understand webpages.

We can open it in Chrome by:

**Right-click an element → Inspect**

The **Elements** panel shows the HTML/DOM structure of the webpage.

It allows us to inspect:

* HTML elements
* Attributes
* Element text
* Parent/child relationships
* Classes
* IDs
* Other information about the element

---

# 9. Practical DevTools Inspection

I inspected a real webpage element and found:

```html
<button id="voiceSearchButton"
        class="searchbox-icon-button"
        title="Search by voice">
    voice search
</button>
```

I identified:

* `button` → HTML element/tag
* `voice search` → text/content
* `id` → attribute
* `class` → attribute
* `title` → attribute
* `voiceSearchButton` → value of the `id` attribute
* `searchbox-icon-button` → value of the `class` attribute
* `Search by voice` → value of the `title` attribute

The `id` appears suitable for uniquely identifying this element.

---

# 10. Why HTML and DevTools Matter for Playwright

Playwright needs to find webpage elements before it can interact with them.

For example, if the webpage contains:

```html
<input id="username" type="text">
```

Playwright can locate the element using information from the HTML/DOM:

```typescript
await page.locator("#username").fill("admin");
```

The basic automation flow is:

```text
Website
   ↓
Inspect using DevTools
   ↓
Understand HTML/DOM
   ↓
Identify useful element information
   ↓
Create a Playwright locator
   ↓
Find the element
   ↓
Interact with the element
```

Therefore, understanding HTML, the DOM, and DevTools helps us understand **what we are automating and how Playwright can identify the elements**.

---

# 11. Key Terms

| Term            | Meaning                                                              |
| --------------- | -------------------------------------------------------------------- |
| HTML            | Defines the structure of a webpage                                   |
| Element/Tag     | Represents an element on the webpage                                 |
| Attribute       | Provides additional information about an element                     |
| Attribute value | The value assigned to an attribute                                   |
| DOM             | Tree-like representation of the HTML document created by the browser |
| Parent          | An element that contains another element                             |
| Child           | An element contained inside another element                          |
| DevTools        | Browser tools used to inspect and understand webpages                |
| Inspect         | DevTools feature used to inspect a webpage element                   |

---

# 12. What I Practiced

### HTML

I practiced identifying:

* HTML tags/elements
* Text/content
* Attributes
* Attribute values

### DOM

I practiced:

* Understanding the DOM
* Understanding HTML → browser parsing → DOM
* Identifying parent and child relationships

### DevTools

I practiced:

* Opening DevTools
* Using Inspect
* Finding an element in the Elements panel
* Reading its HTML
* Identifying its tag, text, attributes and values
* Identifying information that could potentially be useful for Playwright locators

---

## 13. Important Connection to Remember

```text
HTML
  ↓
Browser parses HTML
  ↓
DOM
  ↓
DevTools helps us inspect the DOM
  ↓
We identify useful element information
  ↓
Playwright uses locators
  ↓
Playwright finds and interacts with elements
```

This is the foundation for learning **Playwright locators**.

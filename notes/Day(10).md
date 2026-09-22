# D10 — What Should We Automate?

## 1. What Should We Automate?

We should **not automate every test just because it can be automated**.

The goal is to identify tests where automation provides enough value to justify the effort of building and maintaining the automation.

When deciding what to automate, consider:

* Business criticality
* Execution frequency
* Manual effort
* Regression value
* Risk
* Stability of the feature
* Maintenance cost
* Automation ROI

---

## 2. Automation ROI

ROI means **Return on Investment**.

Automation takes time and effort to build and maintain, but it can reduce repeated manual testing effort.

A simple way to think about it:

```text
Automation ROI
=
Value gained from automation
----------------------------
Build + maintenance effort
```

A test with high frequency and high manual effort can provide a high automation ROI.

### Example

If a login test runs 100 times every week and takes 2 minutes manually:

```text
100 × 2 minutes
= 200 minutes/week
```

Automating this test can remove a large amount of repeated manual effort.

---

## 3. Important Factors for Choosing Automation Candidates

### 3.1 Frequency

Tests that run frequently are usually good automation candidates.

Example:

```text
Login test
→ runs 100 times/week
→ repetitive
→ automation can save significant time
```

A test that runs once every six months may provide less automation ROI based purely on frequency.

---

### 3.2 Business Criticality

Important business functionality should receive strong consideration for automation.

Examples:

* Login
* Checkout
* Order creation
* Payment
* Important customer workflows

If these functions break, they can have a significant impact on the application or business.

---

### 3.3 Regression Value

Tests that need to be executed repeatedly during regression are good automation candidates.

Example:

```text
New release
    ↓
Run regression suite
    ↓
Login
Add product
Add to cart
Checkout
Order creation
```

Automating these tests allows the regression suite to run faster and reduces repeated manual effort.

---

### 3.4 Manual Effort

If a test requires a lot of repeated manual work, automation can provide significant value.

Example:

```text
Test A:
100 executions × 2 minutes
= 200 minutes

Test B:
1 execution every 6 months × 30 minutes
= 30 minutes over 6 months
```

Test A has much greater repeated manual effort.

---

### 3.5 Stability

Stable functionality is generally easier to automate and maintain.

Example:

```text
Stable login page
→ automation remains useful
→ lower maintenance
```

A feature whose UI changes every week may require frequent automation updates.

That increases maintenance cost.

This does **not** mean frequently changing features can never be automated. We need to consider whether the automation value justifies the maintenance effort.

---

### 3.6 Maintenance Cost

Automation itself needs maintenance.

If a test constantly breaks because the application changes, engineers may spend more time fixing the automation than the automation saves.

Therefore:

```text
Automation Value
        >
Build + Maintenance Cost
```

is an important consideration.

---

## 4. Do Not Automate Everything

Not every test should automatically become an automated test.

Some scenarios may be better suited for manual testing because they:

* Require human judgment
* Require physical interaction
* Require OTP or external authentication
* Involve real-world business interaction
* Require special hardware
* Involve expensive or risky real transactions
* Change too frequently to justify automation

For example, a real payment transaction should not normally be automated against a real customer's payment method.

A safe **sandbox/test payment environment** should be used instead.

---

## 5. API Automation Can Provide Broad Coverage

When deciding what to automate, we should also consider the testing layer.

If several tests are validating backend/business logic, API automation may provide faster and broader coverage than performing every check through the UI.

However:

> API automation does not replace every UI test.

Some tests specifically need to validate:

* UI behavior
* User interactions
* Navigation
* Displayed information
* End-to-end user journeys

Therefore, we should choose the appropriate testing layer for each requirement.

---

## 6. Example — E-Commerce Application

Consider an e-commerce application.

Important flows could include:

```text
Login
   ↓
Search/select product
   ↓
Add to cart
   ↓
Checkout
   ↓
Payment
   ↓
Order creation
```

Good automation candidates can include:

### Login

* Frequently used
* Repetitive
* Saves manual effort
* Useful for regression

### Product selection / Add to Cart

* Core application functionality
* Part of the main customer journey
* Useful during regression

### Payment / Checkout

* Business-critical
* Important to verify during releases
* High impact if broken

For payment testing, use a safe test/sandbox environment rather than real customer transactions.

---

## 7. Example of Prioritization

Suppose we have:

| Test            | Frequency | Importance | Stability                 |
| --------------- | --------- | ---------- | ------------------------- |
| Login           | 100/week  | High       | Stable                    |
| Logo            | 1/month   | Low        | Stable                    |
| Payment         | 1/release | Critical   | Requires test environment |
| Experimental UI | 20/week   | Medium     | Changes frequently        |

If only two tests can be automated, we could prioritize:

```text
Login
Payment
```

### Why?

**Login**

* High frequency
* Repetitive
* Stable
* Saves manual time
* Good regression value

**Payment**

* Critical business functionality
* High risk
* Important for every release
* Strong regression value

The decision should consider multiple factors rather than only frequency or importance.

---

## 8. Key Mindset

The goal of automation is **not**:

```text
Automate everything
```

The goal is:

```text
Automate the right things
```

We should ask:

> "Is automating this test worth the effort required to build and maintain it?"

---

## 9. D10 Summary

When selecting tests for automation, consider:

```text
Business Criticality
        +
Execution Frequency
        +
Manual Effort
        +
Regression Value
        +
Risk
        +
Stability
        +
Maintenance Cost
        ↓
Automation Priority
```

A strong automation candidate generally provides meaningful value while remaining practical to build and maintain.

### D10 Key Takeaway

> **We should prioritize automation based on value, risk, repetition, stability, regression needs, and maintenance cost — not simply automate everything that is technically possible.**

## Status

**D10 — Done ✅**

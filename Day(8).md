# D8 — What is Test Automation?

## 1. What is Test Automation?

Test automation is the use of software tools and automated scripts to execute predefined testing activities instead of manually performing every step.

For example, a login test can be performed manually:

1. Open the website.
2. Enter username.
3. Enter password.
4. Click Login.
5. Verify that the dashboard appears.

Instead of a tester repeating these steps manually every time, we can write an automated test that performs these actions and verifies the expected result.

---

# 2. Why Do We Automate Tests?

The major reason for automation is to reduce **repetitive manual effort and execution time**.

Imagine a login test needs to be executed 100 times.

### Manual approach

A tester has to:

```text
Open website
→ Enter username
→ Enter password
→ Click Login
→ Verify result
```

and repeat this process many times.

This consumes:

* Time
* Human effort
* Resources

### Automated approach

We create the automation once and execute it repeatedly.

```text
Write automation
      ↓
Run test
      ↓
Get result
      ↓
Run again whenever required
```

The automation itself requires development and maintenance effort, but it reduces the repetitive effort required during repeated test execution.

---

# 3. Main Benefits of Test Automation

## 3.1 Saves Time

Automated tests can execute repetitive steps much faster than manual execution.

For example:

```text
Manual regression → 4 hours
Automated regression → 30 minutes
```

The exact execution time depends on the application and test suite, but automation can significantly reduce execution time for suitable tests.

---

## 3.2 Reduces Repetitive Manual Effort

A tester does not need to repeatedly perform the same actions after every deployment.

Instead, the automation framework can execute the predefined steps.

This allows testers to spend more time on activities that require human reasoning, investigation, exploratory testing, and validation.

---

## 3.3 Faster Feedback

After a new build or deployment, automated tests can be executed quickly.

Example:

```text
New deployment
      ↓
Run automated regression
      ↓
Tests fail
      ↓
Investigate failure
      ↓
Fix issue
      ↓
Run regression again
```

This helps the team identify problems earlier.

---

## 3.4 Repeatability

An automated test follows the same programmed instructions every time it runs.

This makes repeated regression execution easier and more consistent.

---

## 3.5 Large Regression Suites Become Practical

Suppose an application has 500 regression tests.

Running all 500 tests manually after every deployment may require significant time.

With automation, a large regression suite can be executed repeatedly as part of the testing process.

---

# 4. Automation Does Not Mean Automating Everything

Not every test is automatically a good candidate for automation.

The correct mindset is:

> **Automate tests where automation provides reliable value.**

We should consider factors such as:

* Frequency of execution
* Manual execution time
* Stability of the functionality
* Maintenance effort
* Business risk
* Test data
* External dependencies
* Technical feasibility

---

# 5. Examples of Good Automation Candidates

### Login regression

If login needs to be tested after every deployment:

```text
Login test
→ repeated frequently
→ predictable steps
→ suitable for automation
```

This is generally a good automation candidate.

### Product search

If product search needs to be tested with 50 different datasets:

```text
Search product A
Search product B
Search product C
...
```

This is a strong automation candidate because the test is repetitive and data-driven.

---

# 6. Tests That May Require Special Consideration

## Real payment transactions

A real customer payment should not simply be automated against a production system for testing.

Instead, teams can use controlled test environments or payment-provider sandbox/test mechanisms where appropriate.

For example:

```text
Test environment
      ↓
Test payment
      ↓
Verify payment behavior
```

The important point is to avoid creating real business/financial consequences just for testing.

---

## OTP / MFA

Authentication involving OTP or MFA can sometimes require special automation strategies.

Depending on the test environment and security architecture, teams may use controlled test accounts, test authentication mechanisms, or authenticated session/storage state rather than repeatedly performing the complete real-world authentication process.

---

## CAPTCHA

CAPTCHA is specifically designed to distinguish humans from automated systems, so it is generally not treated like an ordinary functional automation target.

---

## Human Judgment / Visual Evaluation

Some tests require human judgment.

For example:

> "Does this page look visually correct and usable to a human?"

Certain aspects can be automated with visual testing tools, but not every usability or visual judgment should be treated as a simple functional automation test.

---

# 7. Automation vs Manual Testing

Automation does not completely replace manual testing.

Instead:

```text
Automation
    +
Manual testing
    =
Overall testing strategy
```

Automation is particularly useful for:

* Repetitive tests
* Regression tests
* Data-driven tests
* Frequently executed tests
* Predictable scenarios

Manual testing remains valuable for activities requiring:

* Human judgment
* Exploration
* Usability evaluation
* New/unclear functionality
* Scenarios where automation is not practical

---

# 8. Automation Helps With Regression Testing

Regression testing means checking that existing functionality still works after changes are made to the application.

Example:

```text
Developer changes login functionality
            ↓
Run regression tests
            ↓
Check existing functionality
            ↓
Identify unintended failures
```

Automation is especially useful for regression because regression tests often need to be executed repeatedly.

---

# 9. Important Distinction

Automation does not mean:

> "The system automatically fixes bugs."

Instead, automation helps:

> **Execute tests and provide faster feedback about whether expected behavior is working.**

If an automated test fails:

```text
Test failure
    ↓
Investigate
    ↓
Determine cause
    ↓
Fix application/test if necessary
    ↓
Run again
```

The human team still needs to investigate and resolve the problem.

---

# 10. Core D8 Definition

> **Test automation is the use of software tools and automated scripts to execute predefined testing activities, reducing repetitive manual effort and providing faster, repeatable feedback, especially for regression testing.**

---

# D8 Key Takeaways

* Automation reduces repetitive manual effort.
* Automation can reduce execution time.
* Automation provides faster feedback.
* Automated tests can be executed repeatedly.
* Automation is particularly useful for regression testing.
* Not every test should be automated.
* Real financial transactions require controlled test environments.
* OTP/MFA may require special automation strategies.
* Human judgment can still require manual testing.
* Automation helps detect failures; it does not automatically fix application bugs.
* Good automation requires selecting appropriate test cases.

**D8 Status: Completed**

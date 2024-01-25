## Analysis & Exploration (A&E) page

#### How to activate A&E page

Add a line below in your `.env` file to activate the A&E page. The A&E page will replace Data Catalog, and Data Analysis page.
Mind that the A&E page requires veda-ui version to be at least v4.0.

```
FEATURE_NEW_EXPLORATION = 'TRUE'
```

To deactivate the page, you can remove the line you added, or change the value for the variable as `FALSE`.
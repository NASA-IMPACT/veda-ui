## Analysis & Exploration (A&E) page

#### How to activate A&E page

Add a line below in your config instance's `.env` file to activate the A&E page. The A&E page will replace Data Catalog, and Data Analysis page.
This feature is available from veda-ui >= v4.0 - make sure your instance is up-to-date.

```
FEATURE_NEW_EXPLORATION = 'TRUE'
```

To deactivate the page, you can remove the line you added, or change the value for the variable as `FALSE`.
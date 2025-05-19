# sergiosgc-js/delete-confirm

This changes the behaviour of any button with class "delete" so that it requires arming and confirmation to click,

# Usage

Add the delete class to any A or BUTTON

```
<a href="delete-all" class="delete">Delete the universe</a>
```

When the user clicks the button, the text wil change to "Please wait...", the event will be canceled. After a few seconds, the text will prompt for confirmation. The next click will proceed without cancellation.

On first click, the button will have the class `delete-confirm-waiting` added to its classlist. This class is replaced by `delete-confirm` when prompting for confirmation.


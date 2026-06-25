# sergiosgc-js/delete-confirm

This changes the behaviour of any button with class "delete" so that it requires arming and confirmation to click,

# Usage

Add the delete class to any A or BUTTON

```
<a href="delete-all" class="delete">Delete the universe</a>
```

When the user clicks the button, the text wil change to "Please wait...", the event will be canceled. After a few seconds, the text will prompt for confirmation. The next click will proceed without cancellation.

On first click, the button will have the class `delete-confirm-waiting` added to its classlist. This class is replaced by `delete-confirm` when prompting for confirmation.

To disable this behaviour in an element that has the `delete` class, add the `skipconfirmation` class:

```
<a href="delete-all" class="delete skipconfirmation">Delete the universe</a>
```

# Localization

This uses `sergiosgc-js/localization` for localization. If the localization dictionary includes the strings `Click again to confirm deletion` and `Please wait...`, they will be translated before used.

If you prefer another localization method, set the strings when initializing your page:

```
sergiosgc.DeleteConfirm.click_again = "Clique de novo para confirmar";
sergiosgc.DeleteConfirm.please_wait = "Por favor aguarde...";
```

# Changing default classes

Set the classes when initializing the page if you wish to use different ones (this example sets the default ones):

```
sergiosgc.DeleteConfirm.attachClass = 'delete';
sergiosgc.DeleteConfirm.skipConfirmationClass = 'skipconfirmation';
sergiosgc.DeleteConfirm.waitingClass = 'delete-confirm-waiting';
sergiosgc.DeleteConfirm.confirmedClass = 'delete-confirm';
```

# sergiosgc-js/template-node

Use an existing HTML element as a template to create a new element

# Usage

This module extends HTMLElement with a templateNode() function. The function receives two arguments: `deep`, a boolean signaling a deep copy if true, shallow copy if false, and a dictionary of replacements. 
Each replacement is keyed by a a queryElements expression (an xpath or a css; check the documentation in this repo). Each replacement value is either null (delete the node), a string (replace the node 
content with the string value), or a string array (concatenate the array then replace as if the replacement were a string.

If the replacement does not refer to the `id` property, it is by default deleted.

Say you have this reference node:

```
<div class="card" id="user-card-template" style="display: none">
 <span class="name">The user name</span>
 <span class="bio">The user bio</span>
</div>
```

You can create, fill out and append a user card like this:
```
document.getElementById("logged-in-user-container").appendChild(
  document.getElementById("user-card-template").templateNode(
    true,
    {
        "xpath:./@id": "logged-in-user-card",
        "xpath:./@style": null,
        "css:.name", "Clark Kent",
        "xpath:.//node{}[@class='bio']": "The man of steel"
    }
  )
);
```

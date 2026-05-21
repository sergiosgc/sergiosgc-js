# sergiosgc-js

This is a loosely coupled of Javascript libraries I use regularly. Check each folder for a description.

# Installation

1. Add this as a git submodule in a private location of your web project.
2. Use vite to build the project and output to your public javascript folder:
```
(cd <private path of sergiosgc-js> && \
yarn run build
cp dist/* <public path of javascript assets>
```
3. Include the javascript in your document's HEAD:
```
<html>
 (...)
 <head>
 (...)
  <script src="<public path to javascript assets>/sergiosgc-js.js"></script>
```

# sergiosgc-js

This is a loosely coupled of Javascript libraries I use regularly. Check each folder for a description.

# Installation

1. Add this as a git submodule in a private location of your web project.
2. Use esbuild to build the project and output to your public javascript folder:
```
(cd <private path of sergiosgc-js> && \
yarn install && \
./node_modules/.bin/esbuild src/index.ts --bundle --sourcemap --target=es6 --outfile=<public path of javascript assets>/sergiosgc-js.js)
```
3. Include the javascript in your document's HEAD:
```
<html>
 (...)
 <head>
 (...)
  <script src="<public path to javascript assets>/sergiosgc-js.js"></script>
```

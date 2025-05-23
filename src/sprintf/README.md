# sergiosgc-js/sprintf

sprintf implementation in Javascript

This is mostly [Alexandre Marasteano's](https://github.com/alexei/) javascript sprintf implementation, converted to Typescript and imported into the sergiosgc namespace.

# Usage

It's sprintf. It follows the C implementation, perfectly documented in the man pages:

[https://linux.die.net/man/3/sprintf](https://linux.die.net/man/3/sprintf)

There are a few notes on the original repo:

[https://github.com/alexei/sprintf.js](https://github.com/alexei/sprintf.js)

namely, the implementation has yet no support for the a and A conversion specifiers, nor the '+' and ' ' flags.

The function is in the sergiosgc namespace, so the function name is actually `sergiosgc.sprintf`. Feel free to pull it into the global namespace in your application if you prefer: `globalThis.sprintf = globalThis.sergiosgc.sprintf`

// Top module global
import "./sergiosgc/src/index";
// Global polyfills
import "./xpathresult-polyfill/src/index";
// Web components
import "./jsonschema-form/src/index";
// Module classes and functions
import "./attribute-bind/src/index";
import "./assign-to-element/src/index";
import "./xpath-observer/src/index";
import "./query-elements/src/index";
import "./sprintf/src/index";

(function() {
    const event = new Event("sergiosgc.modules_loaded");
    window.dispatchEvent(event);
})();

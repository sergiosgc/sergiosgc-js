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
import "./call-on-load/src/index";
import "./button-collapser/src/index";
import "./delete-confirm/src/index";
import "./localization/src/index";
import "./drag-and-drop-helper/src/index";
import "./mutation-event-attacher/src/index";
import "./template-node/src/index";
import "./overlay-dialog/src/index";

(function() {
    const event = new Event("sergiosgc.modules_loaded");
    window.dispatchEvent(event);
})();
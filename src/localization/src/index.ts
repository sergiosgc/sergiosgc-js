import "../../sergiosgc/src/index";

var localizationTable: { [key: string]: string } = {};

export default function __fn(original: string): string {
    if (localizationTable.hasOwnProperty(original)) return localizationTable[original];
    return original;
}
function loadLocalizationTable(uri: string|object): void {
    if ("string" == typeof uri) {
        fetch(uri)
        .then(response => response.json())
        .then(json => { localizationTable = {...loadLocalizationTable, ...json }; });
    } else {
        localizationTable = {...loadLocalizationTable, ...uri };
    }
}
declare global {
    var __: typeof __fn;
    interface Sergiosgc { 
        loadLocalizationTable: typeof loadLocalizationTable,
    }
}
if ("undefined" == typeof globalThis.__) globalThis.__ = __fn;
globalThis.sergiosgc.loadLocalizationTable = loadLocalizationTable;
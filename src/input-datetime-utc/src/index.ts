import "../../sergiosgc/src/index";
import "../../call-on-load/src/index";

export default class InputDatetimeUtc {
	private static instance: InputDatetimeUtc;
	constructor() {
		globalThis.sergiosgc.callOnLoad(this.onLoad.bind(this));
	}
	public static singleton(): InputDatetimeUtc {
		if (!InputDatetimeUtc.instance) InputDatetimeUtc.instance = new InputDatetimeUtc();
		return InputDatetimeUtc.instance;
	}
	public onLoad() {
		const targetInputs = globalThis.sergiosgc
			.queryElements("css:input[type='datetime-local']")
			.map( input => input as HTMLInputElement );
		// Firefox does not handle timezones in input.value, so convert values to UTC and set the attribute without TZ
		targetInputs
			.filter( input => !Number.isNaN(Date.parse(input.getAttribute("value") ?? "")) )
			.forEach( input => {
				const valueAsDate = new Date(Date.parse(input.getAttribute("value") ?? ""));
				input.setAttribute("value", 
					"" +
					valueAsDate.getFullYear() + "-" +
					("" + valueAsDate.getMonth()).padStart(2, "0") + "-" +
					("" + valueAsDate.getDate()).padStart(2, "0") + " " +
					("" + valueAsDate.getHours()).padStart(2, "0") + ":" +
					("" + valueAsDate.getMinutes()).padStart(2, "0") + ":" +
					("" + valueAsDate.getSeconds()).padStart(2, "0") + "." +
					valueAsDate.getMilliseconds()
				);
		});
		// Setup submit event handlers to convert back to UTC
		targetInputs.forEach( input => {
			input.form?.addEventListener("submit", this.convertInputToUTC.bind(this, input));
		});
		// Convert UTC dates in date spans
		globalThis.sergiosgc
			.queryElements("css:span.datetime-utc")
			.forEach( span => {
				const valueAsTimestamp = Date.parse(span.innerText);
				if (Number.isNaN(valueAsTimestamp)) return;
				const valueAsDate = new Date(valueAsTimestamp);
				while (span.firstChild) span.removeChild(span.firstChild);
				span.append(document.createTextNode(
					"" +
					valueAsDate.getFullYear() + "-" +
					("" + valueAsDate.getMonth()).padStart(2, "0") + "-" +
					("" + valueAsDate.getDate()).padStart(2, "0") + " " +
					("" + valueAsDate.getHours()).padStart(2, "0") + ":" +
					("" + valueAsDate.getMinutes()).padStart(2, "0") + ":" +
					("" + valueAsDate.getSeconds()).padStart(2, "0")
				));

			});

	}
	public convertInputToUTC(input: HTMLInputElement) {
		const valueAsTimestamp = Date.parse(input.value);
		if (Number.isNaN(valueAsTimestamp)) return;
		const valueAsDate = new Date(valueAsTimestamp);
		input.setAttribute("value", 
			"" +
			valueAsDate.getUTCFullYear() + "-" +
			("" + valueAsDate.getUTCMonth()).padStart(2, "0") + "-" +
			("" + valueAsDate.getUTCDate()).padStart(2, "0") + " " +
			("" + valueAsDate.getUTCHours()).padStart(2, "0") + ":" +
			("" + valueAsDate.getUTCMinutes()).padStart(2, "0") + ":" +
			("" + valueAsDate.getUTCSeconds()).padStart(2, "0") + "." +
			valueAsDate.getUTCMilliseconds()
		);
	}
}
declare global {
    interface Sergiosgc { 
        InputDatetimeUtc: typeof InputDatetimeUtc,
    }
}
globalThis.sergiosgc.InputDatetimeUtc = InputDatetimeUtc;
globalThis.sergiosgc.InputDatetimeUtc.singleton();
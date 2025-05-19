import "../../sergiosgc/src/index";
import "../../call-on-load/src/index";

export default class InputDatetimeUtc {
	private static instance: InputDatetimeUtc;
	public static inputDateFormatter = InputDatetimeUtc.toLocalIso8601;
	public static elementDateFormatter = InputDatetimeUtc.toLocalIso8601;
	constructor() {
		globalThis.sergiosgc.callOnLoad(this.onLoad.bind(this));
	}
	public static singleton(): InputDatetimeUtc {
		if (!InputDatetimeUtc.instance) InputDatetimeUtc.instance = new InputDatetimeUtc();
		return InputDatetimeUtc.instance;
	}
	public static parseDate(input: string): Date | null{
		let match;
		if (match = input.match(/\w{3}, (?<day>\d+) (?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<year>\d+) (?<hour>\d\d):(?<minute>\d\d):(?<second>\d\d)(?:\.\d+)? (?<offset>[-+]?\d+)/)) {
			let day = parseInt(match.groups?.day ?? "");
			let month = 1 + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(match.groups?.month ?? "");
			let year = parseInt(match.groups?.year ?? "");
			if (year < 100) year += 2000;
			let hour = parseInt(match.groups?.hour ?? "");
			let minute = parseInt(match.groups?.minute ?? "");
			let second = parseInt(match.groups?.second ?? "");
			let offset = parseInt(match.groups?.offset ?? "");
			input = 
				year.toString().padStart(4, "0") + "-" +
				month.toString().padStart(2, "0") + "-" +
				day.toString().padStart(2, "0") + "T" +
				hour.toString().padStart(2, "0") + ":" +
				minute.toString().padStart(2, "0") + ":" +
				second.toString().padStart(2, "0") + ".000" +
				(offset == 0 ? "Z" : (offset.toString().padStart(2, "0") + ":00"));
		}
		let unixTimestamp = Date.parse(input);
		if (Number.isNaN(unixTimestamp)) return null;
		return new Date(unixTimestamp);
	}
	public static toLocalIso8601(d: Date): string {
		return d.getFullYear().toString() + "-" + 
			(1+d.getMonth()).toString().padStart(2, "0") + "-" + 
			d.getDate().toString().padStart(2, "0") + "T" + 
			d.getHours().toString().padStart(2, "0") + ":" + 
			d.getMinutes().toString().padStart(2, "0") + ":" + 
			d.getSeconds().toString().padStart(2, "0") + 
			(d.getMilliseconds() == 0 ? "" : "." + d.getMilliseconds().toString().padStart(3, "0"));
	}
	public onLoad() {
		const targetInputs = globalThis.sergiosgc
			.queryElements("css:input[type='datetime-local']")
			.map( input => input as HTMLInputElement );
		// Firefox does not handle timezones in input.value, so convert values to UTC and set the attribute without TZ
		targetInputs
			.forEach( input => {
				const valueAsDate = InputDatetimeUtc.parseDate(input.getAttribute("value") ?? "");
				if (valueAsDate == null) return;
				input.setAttribute("value", InputDatetimeUtc.inputDateFormatter(valueAsDate));
		});
		// Setup submit event handlers to convert back to UTC
		targetInputs.forEach( input => {
			input.form?.addEventListener("submit", this.convertInputToUTC.bind(this, input));
		});
		// Convert UTC dates in date spans
		globalThis.sergiosgc
			.queryElements("css:.datetime-utc")
			.forEach( element => {
				const valueAsDate = InputDatetimeUtc.parseDate(element.innerText);
				if (valueAsDate == null) return;
				while (element.firstChild) element.removeChild(element.firstChild);
				element.append(document.createTextNode(InputDatetimeUtc.elementDateFormatter(valueAsDate).replace("T", " ")));
			});

	}
	public convertInputToUTC(input: HTMLInputElement) {
		const valueAsTimestamp = Date.parse(input.value);
		if (Number.isNaN(valueAsTimestamp)) return;
		const valueAsDate = new Date(valueAsTimestamp);
		input.setAttribute("value", InputDatetimeUtc.inputDateFormatter(valueAsDate));
	}
}
declare global {
    interface Sergiosgc { 
        InputDatetimeUtc: typeof InputDatetimeUtc,
    }
}
globalThis.sergiosgc.InputDatetimeUtc = InputDatetimeUtc;
globalThis.sergiosgc.InputDatetimeUtc.singleton();
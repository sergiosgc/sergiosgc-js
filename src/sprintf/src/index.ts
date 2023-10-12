import "./../../sergiosgc/src/index";

/*
 TODO
  - Implement flags +, ' ' and '
  - Implement conversion specifiers a,A

 Notes:
  Most length specifiers do not make sense in javascript and are thus no-ops
  Conversion specifiers p,n,m are not applicable to javascript and are thus not implemented
*/
export default function sprintf<T extends any[]>(format: string, ...args: T): string {
    const namedArguments = args.length > 0 && "object" == typeof args[0] ? args[0] : {};
    const positionalArguments = args.length > 0 && "object" == typeof args[0] ? args.slice(1) : args;
    return parse_format(format).map( token => token.format(namedArguments, positionalArguments)).join("");
}
class Counter {
    current: number = -1;
    increment(): number {
        this.current += 1;
        return this.current;
    }
}
interface Token { 
    format(named: any, positional: any[]): string;
}
class Literal implements Token {
    value: string;
    constructor(value:string) {
        this.value = value
    }
    format(named: any, positional: any[]): string {
        return this.value;
    }
}
class Conversion implements Token {
    order: string | number;
    flags: string[];
    width: string;
    precision: string;
    length_modifier: string | null;
    conversion_specifier: string;
    constructor(regex_match: { [key: string]: string; }, positionCounter: Counter) {
        if (!regex_match.conversion_specifier) throw new Error("Missing conversion specifier");

        this.conversion_specifier = regex_match.conversion_specifier;
        this.order = regex_match.order && regex_match.order != '*' ? regex_match.order_name ?? parseInt(regex_match.order) : positionCounter.increment();
        this.flags = regex_match.flags.split("");
        this.width = regex_match.width ?? "0";
        if (this.width == "*") this.width = "" + positionCounter.increment() + "$";
        this.precision = regex_match.precision ?? "0";
        if (this.precision == "*") this.precision = "" + positionCounter.increment() + "$";
        this.length_modifier = regex_match.length_modifier ?? null;
        this.conversion_specifier = regex_match.conversion_specifier;
        if (this.conversion_specifier == "i") this.conversion_specifier = "d";
        if (this.conversion_specifier == "F") this.conversion_specifier = "f";
        if (this.conversion_specifier == "G") this.conversion_specifier = "f";
        if (this.conversion_specifier == "C") {
            this.conversion_specifier = "c";
            this.length_modifier = "l";
        }
        if (this.conversion_specifier == "S") {
            this.conversion_specifier = "s";
            this.length_modifier = "l";
        }
    }
    format(named: any, positional: any[]): string {
        const width = this.width.includes("$") ? positional[parseInt(this.width)] : parseInt(this.width);
        const precision = this.precision.includes("$") ? positional[parseInt(this.precision)] : parseInt(this.precision);
        const value = "string" == typeof this.order ? named[this.order] : positional[this.order];
        switch (this.conversion_specifier) {
            case "d":
                return this.d(value, width, precision);
            case "o":
                return this.o(value, width, precision);
            case "u":
                return this.u(value, width, precision);
            case "x":
                return this.x(value, width, precision);
            case "X":
                return this.x(value, width, precision).toUpperCase();
            case "e":
                return this.e(value, width, precision);
            case "E":
                return this.e(value, width, precision).toUpperCase();
            case "f":
                return this.f(value, width, precision);
            case "g":
                return this.f(value, width, precision == 0 ? 1 : precision);
            case "c":
                return String.fromCharCode(value);
            case "s":
                return this.s(value, width, precision);
            case "%":
                return "%";
            default: 
                throw new Error("Unknown conversion specifier %" + this.conversion_specifier);
        }
    }
    padValue(value: string, width: number, override_pad_character: string | null = null): string {
        if (value.length >= width) return value;
        const pad_character = override_pad_character ?? (this.flags.includes('0') && !this.flags.includes('-')) ? '0' : ' ';
        return this.flags.includes('-') || override_pad_character != null ? value.padEnd(width, pad_character) : value.padStart(width, pad_character);
    }
    d(value: any, width: number, precision: number): string {
        return this.padValue("" + Math.round(parseInt(value)), width);
    }
    o(value: any, width: number, precision: number): string {
        const int_val = Math.floor(Math.abs(value));
        let result = int_val.toString(8);
        if (this.flags.includes('#') && result[0] != '0') result = '0' + result;
        return this.padValue(result, width);
    }
    u(value: any, width: number, precision: number): string { return this.d(Math.floor(Math.abs(value)), width, precision); }
    x(value: any, width: number, precision: number): string {
        return (
            (this.flags.includes('#') ? '0x' : '') + 
            this.padValue( Math.floor(Math.abs(value)).toString(16), this.flags.includes('#') ? Math.max(0, width - 2) : width )
        ).replace(/0x(?<spaces> +)/, "$<spaces>0x");
    }
    e(value: any, width: number, precision: number): string {
        let parts = (value as number).toExponential().match(/(?<sign>-)?(?<integer>\d*)(?:\.(?<decimal>\d+))e(?<esign>[-+])(?<exponent>\d+)/)?.groups;
        if (parts == null) throw new Error("Unable to parse exponential");
        let integer = parts.integer;
        let decimal = precision == 0 ? "" : ("." + this.padValue(parts.decimal, precision, "0").substring(0, precision));
        let exponent = sprintf("%02d", parseInt(parts.exponent));
        return this.padValue((parts.sign ?? "") + integer + decimal + "e" + parts.esign + exponent, width);
    }
    f(value: any, width: number, precision: number): string {
        return this.padValue(
            "" + Math.trunc(parseFloat(value)) + "." + this.padValue(("" + parseFloat(value) % 1).replace("0", "").replace(".", ""), precision, "0"),
            width
        );
    }
    s(value: any, width: number, precision: number): string {
        return this.padValue(width == 0 ? value : ("" + value).substring(0, width), width);
    }


}

// To interpret this regex, follow the printf man page "Format of the format string" (man 3 printf)
const format_regex = /(?<token>(?<conversion>%(?<order>\d+\$|\*|<(?<order_name>[a-zA-Z_]*)>)?(?<flags>[-#0 +'I]*)(?<width>\d+\$|\d+|\*)?(?:.(?<precision>\d+\$|\d+|\*))?(?<length_modifier>hh|h|ll|l|q|L|j|z|Z|t)?(?<conversion_specifier>[diouxXeEfFgGaAcsCSpnm%]))|(?<literal>[^%]+))/sg;

function parse_format(format:string): Token[] {
    const positionCounter = new Counter();
    return Array
        .from(format.matchAll(format_regex))
        .map( match => match.groups ? (match.groups.literal ? new Literal(match.groups.literal) : new Conversion(match.groups, positionCounter)) : null )
        .filter( token => token != null ) as ((Conversion|Literal)[]);
}

declare global {
    interface Sergiosgc { 
        sprintf: typeof sprintf, 
    }
}
globalThis.sergiosgc.sprintf = sprintf;
export default class CallStatement {

    private fn: string

    private parameters: any[]

    constructor(fn: string, parameters: any[]) {
        this.fn = fn
        this.parameters = parameters
    }

    parameterToString(param: any) : string {
        if ( typeof param === 'string' && param.substr(0, 1) != '$' ) {
            return `"${param.replace('"', '\"')}"`
        }
        else if ( Array.isArray(param) ) {
            // TODO: Always a comma?
            return `[${param.map(p => this.parameterToString(p)).join(', ')}]`
        }
        else if ( typeof param === 'object' ) {
            let output = '{'

            output += Object.entries(param)
                .map(([key, value]) => `${key}: ${this.parameterToString(value)}`)
                .join(', ')

            return `${output}}`
        }


        return param.toString()
    }

    toString() {
        return `${this.fn}(${this.parameters.map(param => this.parameterToString(param)).join(', ')})`;
    }

}
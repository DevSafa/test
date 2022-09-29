declare const IntraJwtStrategy_base: new (...args: any[]) => any;
export declare class IntraJwtStrategy extends IntraJwtStrategy_base {
    constructor();
    private static extractJWT;
    validate(payload: any): Promise<any>;
}
export {};

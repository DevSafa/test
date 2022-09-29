import { Profile } from "passport-42";
declare const IntraStrategy_base: new (...args: any[]) => any;
export declare class IntraStrategy extends IntraStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};

import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): void;
    success(req: any, res: any): Promise<void>;
    test(req: any, res: any): void;
}

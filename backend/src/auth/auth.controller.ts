import { Controller, Post, Body, Res, HttpStatus, Get, UseGuards, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MESSAGES } from 'src/constantsAndMessage';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('ping')
    async ping() {
        return { message: "Server is awake" }
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string; guestToken: string | null }, @Res({ passthrough: true }) res) {
        return await this.authService.login(body.username, body.password, body.guestToken, res)
    }

    @Post('signup')
    async signup(@Body() body: SignUpDto, @Res({ passthrough: true }) res) {
        return await this.authService.signup(body, res)
    }

    @Post('logout')
    async logout(@Body() body: { userId: number }, @Res({passthrough: true}) res) {
        await this.authService.signOut(body.userId, res);
        return {message: MESSAGES.AUTH.SUCCESS.LOGOUT}
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) throw new UnauthorizedException(MESSAGES.AUTH.ERROR.REFRESH_TOKEN_MISSING);
        return await this.authService.refreshTokens(refreshToken, res)
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res({ passthrough: true }) res) {
        const user = req.user;

        if (!user) {
            res.redirect(process.env.FRONTEND_DOMAIN_1 + '/login?error=Google authentication failed');
        }

        try {
            const result = await this.authService.loginWithGoogle(
                user.email,
                user.firstName,
                user.lastName,
                user.picture
            );

            await this.authService.setRefreshTokenToCookie(result.refreshToken, res)

            return res.redirect(process.env.FRONTEND_DOMAIN_1 + '/auth-google-result');
        } catch (error) {
            res.redirect(process.env.FRONTEND_DOMAIN_1 + '/login?error=Google authentication failed')
        }
    }
}

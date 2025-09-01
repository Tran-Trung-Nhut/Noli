import { Controller, Post, Body, Res, HttpStatus, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup-body.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { log } from 'console';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('ping')
    async ping(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json({ message: "Server is awake"});
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string; guestToken: string | null }, @Res() res) {
        try {
            return res.status(HttpStatus.OK).json({ data: await this.authService.login(body.username, body.password, body.guestToken, res) });
        } catch (error) {
            return res.status(error.status).json({ message: error.message });
        }
    }

    @Post('signup')
    async signup(@Body() body: SignUpDto, @Res() res) {
        try {
            return res.status(HttpStatus.CREATED).json({ message: MESSAGES.USER.SUCCESS.CREATE, data: await this.authService.signup(body, res) });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Post('logout')
    async logout(@Body() body: { userId: number }, @Res() res) {
        try {
            await this.authService.signOut(body.userId, res);
            return res.status(HttpStatus.OK).json({ message: MESSAGES.AUTH.SUCCESS.LOGOUT });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) return res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.AUTH.ERROR.REFRESH_TOKEN_MISSING });
        try {
            return res.status(HttpStatus.OK).json({ data: await this.authService.refreshTokens(refreshToken, res) });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res) {
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

            this.authService.setRefreshTokenToCookie(result.refreshToken, res)

            return res.redirect(process.env.FRONTEND_DOMAIN_1 + '/auth-google-result');
        } catch (error) {
            res.redirect(process.env.FRONTEND_DOMAIN_1 + '/login?error=Google authentication failed')
        }
    }
}

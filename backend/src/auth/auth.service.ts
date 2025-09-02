import { BadRequestException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup-body.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { JwtPayload } from './dto/jwt.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private prismaService: PrismaService, private cartService: CartService) { }

    async validateUser(username: string, password: string) {
        const user = await this.prismaService.user.findUnique({ where: { username } });
        if (!user) throw new UnauthorizedException('Tên người dùng không tồn tại');

        if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedException('Mật khẩu không chính xác');

        return user;
    }

    setRefreshTokenToCookie(refreshToken: string, @Res() res) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });
    }

    signAccessToken(payload: JwtPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        })
    }

    signRefreshToken(payload: JwtPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.REFRESH_JWT_SECRET,
            expiresIn: '7d',
        })
    }

    async login(username: string, password: string, guestToken: string | null, @Res({passthrough: true}) res) {
        const user = await this.validateUser(username, password);
        await this.prismaService.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

        const accessToken = this.signAccessToken({ sub: user.id, username: user.username });
        const refreshToken = this.signRefreshToken({ sub: user.id, username: user.username });

        this.setRefreshTokenToCookie(refreshToken, res)

        const hashRefreshToken = await bcrypt.hash(refreshToken, Number(process.env.SALT));
        await this.prismaService.user.update({ where: { id: user.id }, data: { refreshToken: hashRefreshToken } })

        if( guestToken ) await this.cartService.mergeCart(guestToken, user.id);

        return { accessToken, userInfo: { id: user.id, firstName: user.firstName, lastName: user.lastName } };
    }

    async loginWithGoogle(email: string, firstName: string, lastName: string, picture: string) {
        const user = await this.prismaService.user.findUnique({ where: { username: email } });

        const password = process.env.GOOGLE_AUTH_PASSWORD_DEFAULT;

        if (!password) throw new BadRequestException("Lỗi hệ thống, vui lòng thử lại sau");

        if (!user) {
            const newUser = await this.prismaService.user.create({
                data: {
                    username: email,
                    email,
                    firstName,
                    lastName,
                    image: picture,
                    password: bcrypt.hashSync(password, Number(process.env.SALT)),
                }
            });

            const refreshToken = this.signRefreshToken({ sub: newUser.id, username: newUser.username });

            const hashRefreshToken = await bcrypt.hash(refreshToken, Number(process.env.SALT));
            await this.prismaService.user.update({ where: { id: newUser.id }, data: { refreshToken: hashRefreshToken } })

            return { refreshToken };
        } else {
            const refreshToken = this.signRefreshToken({ sub: user.id, username: user.username });

            const hashRefreshToken = await bcrypt.hash(refreshToken, Number(process.env.SALT));
            await this.prismaService.user.update({ where: { id: user.id }, data: { refreshToken: hashRefreshToken } })

            return { refreshToken };
        }
    }



    async signup(body: SignUpDto, @Res({passthrough: true}) res) {
        const existingUser = await this.prismaService.user.findUnique({ where: { username: body.username } });
        if (existingUser) throw new BadRequestException(MESSAGES.USER.ERROR.EXISTED);

        const hashedPassword = await bcrypt.hash(body.password, Number(process.env.SALT));

        const newUser = await this.prismaService.user.create({
            data: {
                username: body.username,
                password: hashedPassword,
                firstName: body.firstName,
                lastName: body.lastName,
            }
        });

        return this.login(newUser.username, body.password, body.guestToken,res);
    }

    async signOut(userId: number, @Res({passthrough: true}) res) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND);
        await this.prismaService.user.update({ where: { id: userId }, data: { refreshToken: null } });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
    }

    async refreshTokens(refreshToken: string, @Res({passthrough: true}) res) {
        let payload: any;
        try {
            payload = await this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_JWT_SECRET });
        } catch (e) {
            throw new UnauthorizedException('Token không hợp lệ');
        }

        const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });

        if (!user || !user.refreshToken) throw new UnauthorizedException('Token không hợp lệ');

        const isRefreshTokenMatched = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenMatched) throw new UnauthorizedException('Token không hợp lệ');

        const accessToken = this.signAccessToken({ sub: user.id, username: user.username });
        const newRefreshToken = this.signRefreshToken({ sub: user.id, username: user.username });
        const hashRefreshToken = await bcrypt.hash(newRefreshToken, Number(process.env.SALT));
        await this.prismaService.user.update({ where: { id: user.id }, data: { refreshToken: hashRefreshToken } })

        this.setRefreshTokenToCookie(newRefreshToken, res)

        return { accessToken, userInfo: { id: user.id, firstName: user.firstName, lastName: user.lastName, image: user.image } };
    }

    async guestToken() {
        const payload = { role: 'guest', sub: 'guest_' + Date.now() };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }
}

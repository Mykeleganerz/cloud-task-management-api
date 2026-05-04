import { Controller, Post, UnauthorizedException, Body, Get, Req, UseGuards } from '@nestjs/common';
import { CredentialsInputDto } from './dto/auth-dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService) { }

    @Post('login')
    async login(@Body() credentials: CredentialsInputDto) {
        const user = await this.authservice.login(credentials)

        if (!user) {
            throw new UnauthorizedException("Invalid Credentials.")
        }
        return user;
    }


    @Post('register')
    async register(@Body() reg: RegisterDto) {
        return this.authservice.register(reg)
    }

    @Get('token-info')
    @UseGuards(JwtAuthGuard)
    async info(@Req() req) {
        return req.user
    }
}

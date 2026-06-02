import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { CredentialsInputDto } from './dto/auth-dto';
import { Role } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';

type loginPayload = {
    id: string,
    email: string,
    role: Role,
    access_token: string
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async login(credentials: CredentialsInputDto): Promise<loginPayload | null> {
        const user = await this.usersService.findByEmail(credentials.email)

        if (!user) {
            return null;
        }

        const validPass = await bcrypt.compare(credentials.password, user.password)

        if (!validPass) {
            return null;
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            access_token: this.jwtService.sign(payload)
        }

    }

    async register(reg: RegisterDto) {
        const hashedPassword = await bcrypt.hash(reg.password, 10);
        const checkEmail = await this.usersService.findByEmail(reg.email)

        if (checkEmail) {
            throw new ConflictException("The email you entered already exists.")
        }
        return this.usersService.create({
            ...reg,
            password: hashedPassword,
            role: 'USER'
        });
    }

}


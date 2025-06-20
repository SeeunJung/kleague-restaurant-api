import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(
    dto: SignupDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { nickname: dto.nickname },
          { phoneNumber: dto.phoneNumber },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email)
        throw new ConflictException('이미 존재하는 이메일입니다.');
      if (existingUser.nickname === dto.nickname)
        throw new ConflictException('이미 존재하는 닉네임입니다.');
      if (existingUser.phoneNumber === dto.phoneNumber)
        throw new ConflictException('이미 존재하는 전화번호입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        nickname: dto.nickname,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        favoriteTeam: dto.favoriteTeam,
      },
    });

    const { password, ...userWithoutPassword } = user;
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('가입된 이메일이 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const { password, ...userWithoutPassword } = user;
    const accessToken = this.getJwtToken(user.id);

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  private getJwtToken(userId: number): string {
    return this.jwtService.sign({ sub: userId });
  }

  async validateUserByPayload(payload: { sub: number }): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  }
}

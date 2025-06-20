import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // API 체크용
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phoneNumber: true,
        favoriteTeam: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phoneNumber: true,
        favoriteTeam: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  // 유저 업데이트 (me 기준)
  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: dto.nickname,
        favoriteTeam: dto.favoriteTeam,
        phoneNumber: dto.phoneNumber,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phoneNumber: true,
        favoriteTeam: true,
        updatedAt: true,
      },
    });
  }

  // 유저 삭제
  async remove(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    await this.prisma.user.delete({ where: { id: userId } });

    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}

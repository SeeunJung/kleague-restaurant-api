import {
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^01[0-9]{8,9}$/)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  favoriteTeam?: string;
}

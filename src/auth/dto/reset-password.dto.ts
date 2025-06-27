import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^01[0-9]{8,9}$/)
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/, {
    message: '비밀번호는 영문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.',
  })
  newPassword: string;
}

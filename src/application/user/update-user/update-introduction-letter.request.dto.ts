import { IsString, MaxLength } from 'class-validator';

export class UpdateIntroductionLetterRequestDto {
	@IsString()
	@MaxLength(300)
	introductionLetter: string;
}

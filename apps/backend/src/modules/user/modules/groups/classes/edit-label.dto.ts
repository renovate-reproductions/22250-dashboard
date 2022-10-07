import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class EditLabelDto {
	@ApiProperty({ type: String, description: 'The new label for a group', example: 'Yazif Group' })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	readonly label!: string;
}

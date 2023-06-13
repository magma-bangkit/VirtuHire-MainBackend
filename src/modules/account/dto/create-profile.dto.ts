import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxDate,
} from 'class-validator';

import { JobType } from '@/common/types/enums/job-type.enum';

export class CreateProfileDTO {
  @ApiProperty()
  @MaxDate(new Date(), { message: 'Birthday must be less than today' })
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiProperty({
    description: 'Degree in ID',
  })
  @IsNotEmpty()
  readonly degreeId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly institutionId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly majorId: number;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  readonly educationStartDate: Date;

  @ApiPropertyOptional({
    description:
      'Education end date. If empty, it means the education is ongoing.',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  readonly educationEndDate?: Date;

  @ApiProperty({
    description: 'Array of skills id.',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly skills: number[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly cityId: number;

  @ApiProperty({ enum: JobType, isArray: true })
  @IsEnum(JobType, { each: true })
  @IsNotEmpty()
  readonly preferredJobTypes: JobType[];

  @ApiProperty({
    description: 'Expected Salary per month in IDR',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly expectedSalary: number;

  @ApiProperty({
    description: 'Array of city id.',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly preferredCities: number[];

  @ApiProperty({
    description: 'Array of category id.',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly preferredJobCategories: number[];
}

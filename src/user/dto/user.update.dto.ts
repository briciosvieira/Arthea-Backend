import { IsBoolean, IsOptional } from "class-validator";
import { CreateUserDto } from "./user.create.dto";
import { PartialType } from '@nestjs/mapped-types';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsBoolean()
    active?: boolean;

}
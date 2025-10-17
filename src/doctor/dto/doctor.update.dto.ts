import { PartialType } from "@nestjs/mapped-types";
import { DoctorCreateDto } from "./doctor.create.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class DoctorUpdateDto extends PartialType(DoctorCreateDto) {

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
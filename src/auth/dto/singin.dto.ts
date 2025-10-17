import { IsNotEmpty, IsString } from "class-validator"

export class SingInDto{
    @IsString()
    login: string

    @IsString()
    @IsNotEmpty()
    password: string
}
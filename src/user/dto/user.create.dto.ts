import { IsBoolean, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @Length(4,50, {message:'O nome deve conter no minimo 4 caracter'})
    name: string;
    
    @IsString()
    login: string;

    @IsString()
    @Length(6,40, {message:'A senha deve conter no minico 3 caracter'})
    password: string;
}
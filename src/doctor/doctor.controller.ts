import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/role/role.decorator';
import { Role } from '../auth/role/roles.enum';
import { DoctorService } from './doctor.service';
import { DoctorCreateDto } from './dto/doctor.create.dto';
import { DoctorUpdateDto } from './dto/doctor.update.dto';
import { PaginationDto } from '../commom/pagination';



@Controller('doctors')
export class DoctorController {

    constructor(
        private service: DoctorService,
    ) { }

    @Post()// create
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() doctorCreateDto: DoctorCreateDto) {
        return this.service.create(doctorCreateDto, doctorCreateDto.photoUrl);
    }

    @Post('upload') // upload image
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /jpeg|jpg|png/,
                }).addMaxSizeValidator({
                    maxSize: 10 * 1024 * 1024,
                }).build()
        ) file: Express.Multer.File) {
        return this.service.uploadAvatar(file);
    }

    @Put(':id') //update
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('file'))
    update(id: string, doctorUpdateDto: DoctorUpdateDto, photoUrl: string) {
        return this.service.update(id, doctorUpdateDto, photoUrl)
    }

    @Delete(':id') //delete
    @Roles(Role.ADMIN, Role.USER)
    delete(@Param('id') id: string) {
        return this.service.delete(id)
    }

    @Get() //findAll
    @Roles(Role.ADMIN, Role.USER)
    findAll(pagination?: PaginationDto){
        return this.service.findAll(pagination)
    }
}

import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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

    @Post()
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('photo'))
    async create(
        @Body() doctorCreateDto: DoctorCreateDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /jpeg|jpg|png/ })
                .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
                .build({ fileIsRequired: false })
        )
        file?: Express.Multer.File
    ) {
        let photoUrl: string | undefined = undefined;

        if (file) {
            const uploadResult = await this.service.uploadAvatar(file);
            photoUrl = uploadResult.photoUrl;
        }
        return this.service.create(doctorCreateDto, photoUrl);
    }

    @Post('upload')
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('photo'))
    async uploadAvatar(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /jpeg|jpg|png/ })
                .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
                .build()
        )
        file: Express.Multer.File
    ) {
        return this.service.uploadAvatar(file);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.USER)
    @UseInterceptors(FileInterceptor('photo'))
    async update(
        @Param('id') id: string,
        @Body() doctorUpdateDto: DoctorUpdateDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /jpeg|jpg|png/ })
                .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
                .build({ fileIsRequired: false })
        )
        file?: Express.Multer.File
    ) {

        if (doctorUpdateDto.active !== undefined) {
            doctorUpdateDto.active = (doctorUpdateDto.active as any) === 'true' || doctorUpdateDto.active === true;
        }

        let photoUrl: string | undefined = undefined;
        if (file) {
            const uploadResult = await this.service.uploadAvatar(file);
            photoUrl = uploadResult.photoUrl;
        }
        return this.service.update(id, doctorUpdateDto, photoUrl);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.USER)
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    @Get()
    @Roles(Role.ADMIN, Role.USER)
    findAll(@Query() pagination?: PaginationDto) {
        return this.service.findAll(pagination);
    }
}
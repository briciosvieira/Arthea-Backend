import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { DoctorService } from './doctor.service';
import { DoctorCreateDto } from './dto/doctor.create.dto';
import { DoctorUpdateDto } from './dto/doctor.update.dto';
import { PaginationDto } from '../commom/pagination';

@Controller('doctors')
export class DoctorController {

    constructor(
        private service: DoctorService,
    ) { }

    @UseGuards(AuthGuard)
    @Post()
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

    @UseGuards(AuthGuard)
    @Post('upload')
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

    @UseGuards(AuthGuard)
    @Put(':id')
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

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    @Get()
    findAll(@Query() pagination?: PaginationDto) {
        return this.service.findAll(pagination);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }
}
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/role/role.decorator';
import { Role } from '../auth/role/roles.enum';
import { PaginationDto } from '../commom/pagination';
import { CreateUserDto } from './dto/user.create.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserService } from './user.service';


@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {

    constructor(private service: UserService) { }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createDto: CreateUserDto) {
        return this.service.save(createDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.USER)
    findAll(@Query() pagination: PaginationDto) {
        return this.service.findAll(pagination);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    findeOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    delete(@Param('id') id: string) {
        return this.service.delete(id)
    }
}

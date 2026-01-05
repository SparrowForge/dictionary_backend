import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';

@ApiTags('Teachers')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/teachers')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new teacher', description: 'Creates a new teacher with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'Teacher created successfully', type: BaseResponseDto<Teacher>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createTeacherDto: CreateTeacherDto) {
        createTeacherDto.created_by = user.userId;
        const teacher = await this.teacherService.create(createTeacherDto);
        return new BaseResponseDto(teacher, 'Teacher created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all teacher with pagination and filters', description: 'Retrieves a paginated list of all active teacher with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of teacher', type: BaseResponseDto<PaginatedResponseDto<Teacher>>,
        schema: {
            example: {
                success: true,
                message: 'Teacher retrieved successfully',
                data: {
                    items: [] as Teacher[],
                    meta: {
                        total: 1,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    },
                },
                timestamp: '2024-03-14T12:00:00.000Z',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findAll(@Query() filters: FilterTeacherDto) {
        const { page, limit, ...teacherFilters } = filters;
        const pagination = { page, limit };
        const teacher = await this.teacherService.findAll(pagination, teacherFilters);
        return new BaseResponseDto(teacher, 'Teacher retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a teacher by id', description: 'Retrieves a specific teacher by their ID. Only returns active teacher (soft-deleted teacher are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Teacher ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'Teacher retrieved successfully', type: BaseResponseDto<Teacher>, })
    @ApiResponse({ status: 404, description: 'Teacher not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const teacher = await this.teacherService.findOne(id);
        return new BaseResponseDto(teacher, 'Teacher retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a teacher by id', description: 'Updates an existing teacher with the provided information. Only active teacher can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Teacher ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Teacher updated successfully', type: BaseResponseDto<Teacher>, })
    @ApiResponse({ status: 404, description: 'Teacher not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto,) {
        updateTeacherDto.updated_by = user.userId;
        const teacher = await this.teacherService.update(id, updateTeacherDto);
        return new BaseResponseDto(teacher, 'Teacher updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a teacher by id',
        description: 'Soft deletes a teacher by setting the deletedAt timestamp. The teacher will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'Teacher ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Teacher soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Teacher not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.teacherService.remove(id);
        return new BaseResponseDto(null, 'Teacher soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a teacher by id', description: 'Permanently deletes a teacher from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Teacher ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Teacher permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Teacher not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.teacherService.permanentRemove(id);
        return new BaseResponseDto(null, 'Teacher permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted teacher', description: 'Restores a soft-deleted teacher.', })
    @ApiParam({ name: 'id', description: 'Teacher ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Teacher restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Teacher not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.teacherService.restore(id);
        return new BaseResponseDto(null, 'Teacher restored successfully');
    }
}


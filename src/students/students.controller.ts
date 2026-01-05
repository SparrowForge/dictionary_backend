import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { Students } from './entities/students.entity';
import { CreateStudentsDto } from './dto/create-students.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { UpdateStudentsDto } from './dto/update-students.dto';

@ApiTags('Students')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new students', description: 'Creates a new students with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'Students created successfully', type: BaseResponseDto<Students>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createStudentsDto: CreateStudentsDto) {
        createStudentsDto.created_by = user.userId;
        const students = await this.studentsService.create(createStudentsDto);
        return new BaseResponseDto(students, 'Students created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all students with pagination and filters', description: 'Retrieves a paginated list of all active students with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of students', type: BaseResponseDto<PaginatedResponseDto<Students>>,
        schema: {
            example: {
                success: true,
                message: 'Students retrieved successfully',
                data: {
                    items: [] as Students[],
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
    async findAll(@Query() filters: FilterStudentsDto) {
        const { page, limit, ...studentsFilters } = filters;
        const pagination = { page, limit };
        const students = await this.studentsService.findAll(pagination, studentsFilters);
        return new BaseResponseDto(students, 'Students retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a students by id', description: 'Retrieves a specific students by their ID. Only returns active students (soft-deleted students are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Students ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'Students retrieved successfully', type: BaseResponseDto<Students>, })
    @ApiResponse({ status: 404, description: 'Students not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const students = await this.studentsService.findOne(id);
        return new BaseResponseDto(students, 'Students retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a students by id', description: 'Updates an existing students with the provided information. Only active students can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Students ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Students updated successfully', type: BaseResponseDto<Students>, })
    @ApiResponse({ status: 404, description: 'Students not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateStudentsDto: UpdateStudentsDto,) {
        updateStudentsDto.updated_by = user.userId;
        const students = await this.studentsService.update(id, updateStudentsDto);
        return new BaseResponseDto(students, 'Students updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a students by id',
        description: 'Soft deletes a students by setting the deletedAt timestamp. The students will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'Students ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Students soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Students not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.studentsService.remove(id);
        return new BaseResponseDto(null, 'Students soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a students by id', description: 'Permanently deletes a students from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Students ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Students permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Students not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.studentsService.permanentRemove(id);
        return new BaseResponseDto(null, 'Students permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted students', description: 'Restores a soft-deleted students.', })
    @ApiParam({ name: 'id', description: 'Students ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Students restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Students not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.studentsService.restore(id);
        return new BaseResponseDto(null, 'Students restored successfully');
    }
}



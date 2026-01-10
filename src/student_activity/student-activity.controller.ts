import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { StudentActivity } from './entities/student-activity.entity';
import { CreateStudentActivityDto } from './dto/create-student-activity.dto';
import { StudentActivityService } from './student-activity.service';
import { FilterStudentActivityDto } from './dto/filter-student-activity.dto';
import { UpdateStudentActivityDto } from './dto/update-student-activity.dto';

@ApiTags('Student Activity')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/student-activity')
export class StudentActivityController {
    constructor(private readonly StudentActivityService: StudentActivityService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new StudentActivity', description: 'Creates a new StudentActivity with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'StudentActivity created successfully', type: BaseResponseDto<StudentActivity>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createStudentActivityDto: CreateStudentActivityDto) {
        createStudentActivityDto.created_by = user.userId;
        const entity = await this.StudentActivityService.create(createStudentActivityDto);
        return new BaseResponseDto(entity, 'StudentActivity created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all StudentActivity with pagination and filters', description: 'Retrieves a paginated list of all active StudentActivity with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of StudentActivity', type: BaseResponseDto<PaginatedResponseDto<StudentActivity>>,
        schema: {
            example: {
                success: true,
                message: 'StudentActivity retrieved successfully',
                data: {
                    items: [] as StudentActivity[],
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
    async findAll(@Query() filters: FilterStudentActivityDto) {
        const { page, limit, ...StudentActivityFilters } = filters;
        const pagination = { page, limit };
        const StudentActivity = await this.StudentActivityService.findAll(pagination, StudentActivityFilters);
        return new BaseResponseDto(StudentActivity, 'StudentActivity retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StudentActivity by id', description: 'Retrieves a specific StudentActivity by their ID. Only returns active StudentActivity (soft-deleted StudentActivity are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'StudentActivity ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'StudentActivity retrieved successfully', type: BaseResponseDto<StudentActivity>, })
    @ApiResponse({ status: 404, description: 'StudentActivity not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const StudentActivity = await this.StudentActivityService.findOne(id);
        return new BaseResponseDto(StudentActivity, 'StudentActivity retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a StudentActivity by id', description: 'Updates an existing StudentActivity with the provided information. Only active StudentActivity can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'StudentActivity ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'StudentActivity updated successfully', type: BaseResponseDto<StudentActivity>, })
    @ApiResponse({ status: 404, description: 'StudentActivity not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateStudentActivityDto: UpdateStudentActivityDto,) {
        updateStudentActivityDto.updated_by = user.userId;
        const StudentActivity = await this.StudentActivityService.update(id, updateStudentActivityDto);
        return new BaseResponseDto(StudentActivity, 'StudentActivity updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a StudentActivity by id',
        description: 'Soft deletes a StudentActivity by setting the deletedAt timestamp. The StudentActivity will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'StudentActivity ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'StudentActivity soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'StudentActivity not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.StudentActivityService.remove(id);
        return new BaseResponseDto(null, 'StudentActivity soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a StudentActivity by id', description: 'Permanently deletes a StudentActivity from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'StudentActivity ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'StudentActivity permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'StudentActivity not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.StudentActivityService.permanentRemove(id);
        return new BaseResponseDto(null, 'StudentActivity permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted StudentActivity', description: 'Restores a soft-deleted StudentActivity.', })
    @ApiParam({ name: 'id', description: 'StudentActivity ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'StudentActivity restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'StudentActivity not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.StudentActivityService.restore(id);
        return new BaseResponseDto(null, 'StudentActivity restored successfully');
    }
}



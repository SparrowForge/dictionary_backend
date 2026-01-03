import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WordClassesService } from './word-classes.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { CreateWordClassesDto } from './dto/create-word-classes.dto';
import { WordClasses } from './entities/word-classes.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { FilterWordClassesDto } from './dto/filter-word-classes.dto';
import { UpdateWordClassesDto } from './dto/update-word-classes.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiTags('Classes')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/word-classes')
export class WordClassesController {
    constructor(private readonly classesService: WordClassesService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new classes', description: 'Creates a new classes with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'Classes created successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createClassesDto: CreateWordClassesDto) {
        createClassesDto.created_by = user.userId;
        const classes = await this.classesService.create(createClassesDto);
        return new BaseResponseDto(classes, 'Classes created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all classes with pagination and filters', description: 'Retrieves a paginated list of all active classes with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of classes', type: BaseResponseDto<PaginatedResponseDto<WordClasses>>,
        schema: {
            example: {
                success: true,
                message: 'Classes retrieved successfully',
                data: {
                    items: [] as WordClasses[],
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
    async findAll(@Query() filters: FilterWordClassesDto) {
        const { page, limit, ...classesFilters } = filters;
        const pagination = { page, limit };
        const classes = await this.classesService.findAll(pagination, classesFilters);
        return new BaseResponseDto(classes, 'Classes retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a classes by id', description: 'Retrieves a specific classes by their ID. Only returns active classes (soft-deleted classes are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Classes ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'Classes retrieved successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 404, description: 'Classes not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const classes = await this.classesService.findOne(id);
        return new BaseResponseDto(classes, 'Classes retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a classes by id', description: 'Updates an existing classes with the provided information. Only active classes can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Classes ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Classes updated successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 404, description: 'Classes not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateClassesDto: UpdateWordClassesDto,) {
        updateClassesDto.updated_by = user.userId;
        const classes = await this.classesService.update(id, updateClassesDto);
        return new BaseResponseDto(classes, 'Classes updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a classes by id',
        description: 'Soft deletes a classes by setting the deletedAt timestamp. The classes will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'Classes ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Classes soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Classes not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.classesService.remove(id);
        return new BaseResponseDto(null, 'Classes soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a classes by id', description: 'Permanently deletes a classes from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Classes ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Classes permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Classes not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.classesService.permanentRemove(id);
        return new BaseResponseDto(null, 'Classes permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted classes', description: 'Restores a soft-deleted classes.', })
    @ApiParam({ name: 'id', description: 'Classes ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Classes restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Classes not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.classesService.restore(id);
        return new BaseResponseDto(null, 'Classes restored successfully');
    }
}



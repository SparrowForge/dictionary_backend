import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordClasses } from './entities/word-classes.entity';
import { CreateWordClassesDto } from './dto/create-word-classes.dto';
import { WordClassesService } from './word-classes.service';
import { FilterWordClassesDto } from './dto/filter-word-classes.dto';
import { UpdateWordClassesDto } from './dto/update-word-classes.dto';

@ApiTags('WordClasses')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@Controller('api/v1/word-classes')
export class WordClassesController {
    constructor(private readonly WordClassesService: WordClassesService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new WordClasses', description: 'Creates a new WordClasses with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordClasses created successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordClassesDto: CreateWordClassesDto) {
        createWordClassesDto.created_by = user.userId;
        const entity = await this.WordClassesService.create(createWordClassesDto);
        return new BaseResponseDto(entity, 'WordClasses created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all WordClasses with pagination and filters', description: 'Retrieves a paginated list of all active WordClasses with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordClasses', type: BaseResponseDto<PaginatedResponseDto<WordClasses>>,
        schema: {
            example: {
                success: true,
                message: 'WordClasses retrieved successfully',
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
        const { page, limit, ...WordClassesFilters } = filters;
        const pagination = { page, limit };
        const WordClasses = await this.WordClassesService.findAll(pagination, WordClassesFilters);
        return new BaseResponseDto(WordClasses, 'WordClasses retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a WordClasses by id', description: 'Retrieves a specific WordClasses by their ID. Only returns active WordClasses (soft-deleted WordClasses are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordClasses ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordClasses retrieved successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 404, description: 'WordClasses not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordClasses = await this.WordClassesService.findOne(id);
        return new BaseResponseDto(WordClasses, 'WordClasses retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a WordClasses by id', description: 'Updates an existing WordClasses with the provided information. Only active WordClasses can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordClasses ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordClasses updated successfully', type: BaseResponseDto<WordClasses>, })
    @ApiResponse({ status: 404, description: 'WordClasses not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordClassesDto: UpdateWordClassesDto,) {
        updateWordClassesDto.updated_by = user.userId;
        const WordClasses = await this.WordClassesService.update(id, updateWordClassesDto);
        return new BaseResponseDto(WordClasses, 'WordClasses updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a WordClasses by id',
        description: 'Soft deletes a WordClasses by setting the deletedAt timestamp. The WordClasses will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordClasses ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordClasses soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordClasses not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordClassesService.remove(id);
        return new BaseResponseDto(null, 'WordClasses soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a WordClasses by id', description: 'Permanently deletes a WordClasses from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordClasses ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordClasses permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordClasses not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordClassesService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordClasses permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted WordClasses', description: 'Restores a soft-deleted WordClasses.', })
    @ApiParam({ name: 'id', description: 'WordClasses ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordClasses restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordClasses not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordClassesService.restore(id);
        return new BaseResponseDto(null, 'WordClasses restored successfully');
    }
}



import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordSynonyms } from './entities/word-synonyms.entity';
import { CreateWordSynonymsDto } from './dto/create-word-synonyms.dto';
import { WordSynonymsService } from './word-synonyms.service';
import { FilterWordSynonymsDto } from './dto/filter-word-synonyms.dto';
import { UpdateWordSynonymsDto } from './dto/update-word-synonyms.dto';

@ApiTags('WordSynonyms')
@ApiBearerAuth()
//@Roles(RolesEnum.ADMIN)
@Controller('api/v1/word-synonyms')
export class WordSynonymsController {
    constructor(private readonly WordSynonymsService: WordSynonymsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new WordSynonyms', description: 'Creates a new WordSynonyms with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordSynonyms created successfully', type: BaseResponseDto<WordSynonyms>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordSynonymsDto: CreateWordSynonymsDto) {
        createWordSynonymsDto.created_by = user.userId;
        const entity = await this.WordSynonymsService.create(createWordSynonymsDto);
        return new BaseResponseDto(entity, 'WordSynonyms created successfully');
    }

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER, RolesEnum.STUDENT)
    @ApiOperation({ summary: 'Get all WordSynonyms with pagination and filters', description: 'Retrieves a paginated list of all active WordSynonyms with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordSynonyms', type: BaseResponseDto<PaginatedResponseDto<WordSynonyms>>,
        schema: {
            example: {
                success: true,
                message: 'WordSynonyms retrieved successfully',
                data: {
                    items: [] as WordSynonyms[],
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
    async findAll(@Query() filters: FilterWordSynonymsDto) {
        const { page, limit, ...WordSynonymsFilters } = filters;
        const pagination = { page, limit };
        const WordSynonyms = await this.WordSynonymsService.findAll(pagination, WordSynonymsFilters);
        return new BaseResponseDto(WordSynonyms, 'WordSynonyms retrieved successfully');
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER, RolesEnum.STUDENT)
    @ApiOperation({ summary: 'Get a WordSynonyms by id', description: 'Retrieves a specific WordSynonyms by their ID. Only returns active WordSynonyms (soft-deleted WordSynonyms are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSynonyms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordSynonyms retrieved successfully', type: BaseResponseDto<WordSynonyms>, })
    @ApiResponse({ status: 404, description: 'WordSynonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordSynonyms = await this.WordSynonymsService.findOne(id);
        return new BaseResponseDto(WordSynonyms, 'WordSynonyms retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a WordSynonyms by id', description: 'Updates an existing WordSynonyms with the provided information. Only active WordSynonyms can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSynonyms ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSynonyms updated successfully', type: BaseResponseDto<WordSynonyms>, })
    @ApiResponse({ status: 404, description: 'WordSynonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordSynonymsDto: UpdateWordSynonymsDto,) {
        updateWordSynonymsDto.updated_by = user.userId;
        const WordSynonyms = await this.WordSynonymsService.update(id, updateWordSynonymsDto);
        return new BaseResponseDto(WordSynonyms, 'WordSynonyms updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a WordSynonyms by id',
        description: 'Soft deletes a WordSynonyms by setting the deletedAt timestamp. The WordSynonyms will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordSynonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSynonyms soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSynonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSynonymsService.remove(id);
        return new BaseResponseDto(null, 'WordSynonyms soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a WordSynonyms by id', description: 'Permanently deletes a WordSynonyms from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSynonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSynonyms permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSynonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSynonymsService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordSynonyms permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted WordSynonyms', description: 'Restores a soft-deleted WordSynonyms.', })
    @ApiParam({ name: 'id', description: 'WordSynonyms ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSynonyms restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSynonyms not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSynonymsService.restore(id);
        return new BaseResponseDto(null, 'WordSynonyms restored successfully');
    }
}



import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { WordSentences } from './entities/word-sentences.entity';
import { CreateWordSentencesDto } from './dto/create-word-sentences.dto';
import { WordSentencesService } from './word-sentences.service';
import { FilterWordSentencesDto } from './dto/filter-word-sentences.dto';
import { UpdateWordSentencesDto } from './dto/update-word-sentences.dto';

@ApiTags('WordSentences')
@ApiBearerAuth()
@Controller('api/v1/word-sentences')
export class WordSentencesController {
    constructor(private readonly WordSentencesService: WordSentencesService) { }

    @Post()
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
    @ApiOperation({
        summary: 'Create a new WordSentences', description: 'Creates a new WordSentences with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'WordSentences created successfully', type: BaseResponseDto<WordSentences>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordSentencesDto: CreateWordSentencesDto) {
        createWordSentencesDto.created_by = user.userId;
        const entity = await this.WordSentencesService.create(createWordSentencesDto);
        return new BaseResponseDto(entity, 'WordSentences created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all WordSentences with pagination and filters', description: 'Retrieves a paginated list of all active WordSentences with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of WordSentences', type: BaseResponseDto<PaginatedResponseDto<WordSentences>>,
        schema: {
            example: {
                success: true,
                message: 'WordSentences retrieved successfully',
                data: {
                    items: [] as WordSentences[],
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
    async findAll(@Query() filters: FilterWordSentencesDto) {
        const { page, limit, ...WordSentencesFilters } = filters;
        const pagination = { page, limit };
        const WordSentences = await this.WordSentencesService.findAll(pagination, WordSentencesFilters);
        return new BaseResponseDto(WordSentences, 'WordSentences retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a WordSentences by id', description: 'Retrieves a specific WordSentences by their ID. Only returns active WordSentences (soft-deleted WordSentences are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSentences ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'WordSentences retrieved successfully', type: BaseResponseDto<WordSentences>, })
    @ApiResponse({ status: 404, description: 'WordSentences not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const WordSentences = await this.WordSentencesService.findOne(id);
        return new BaseResponseDto(WordSentences, 'WordSentences retrieved successfully');
    }

    @Patch(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
    @ApiOperation({ summary: 'Update a WordSentences by id', description: 'Updates an existing WordSentences with the provided information. Only active WordSentences can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSentences ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSentences updated successfully', type: BaseResponseDto<WordSentences>, })
    @ApiResponse({ status: 404, description: 'WordSentences not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordSentencesDto: UpdateWordSentencesDto,) {
        updateWordSentencesDto.updated_by = user.userId;
        const WordSentences = await this.WordSentencesService.update(id, updateWordSentencesDto);
        return new BaseResponseDto(WordSentences, 'WordSentences updated successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
    @ApiOperation({
        summary: 'Soft delete a WordSentences by id',
        description: 'Soft deletes a WordSentences by setting the deletedAt timestamp. The WordSentences will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'WordSentences ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSentences soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSentences not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSentencesService.remove(id);
        return new BaseResponseDto(null, 'WordSentences soft deleted successfully');
    }

    @Delete(':id/permanent')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
    @ApiOperation({ summary: 'Permanently delete a WordSentences by id', description: 'Permanently deletes a WordSentences from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'WordSentences ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSentences permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSentences not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSentencesService.permanentRemove(id);
        return new BaseResponseDto(null, 'WordSentences permanently deleted successfully');
    }

    @Post(':id/restore')
    @Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
    @ApiOperation({ summary: 'Restore a soft-deleted WordSentences', description: 'Restores a soft-deleted WordSentences.', })
    @ApiParam({ name: 'id', description: 'WordSentences ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'WordSentences restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'WordSentences not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.WordSentencesService.restore(id);
        return new BaseResponseDto(null, 'WordSentences restored successfully');
    }
}



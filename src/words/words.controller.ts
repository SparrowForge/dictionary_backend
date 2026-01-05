import { BadRequestException, Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import type AuthUser from 'src/auth/dto/auth-user';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { Words } from './entities/words.entity';
import { CreateWordsDto } from './dto/create-words.dto';
import { FilterWordsDto } from './dto/filter-words.dto';
import { UpdateWordsDto } from './dto/update-words.dto';
import { WordStatusEnum } from 'src/common/enums';

@ApiTags('Words')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.TEACHER)
@Controller('api/v1/words')
export class WordsController {
    constructor(private readonly wordsService: WordsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new words', description: 'Creates a new words with the provided information. Password will be hashed before saving. Requires authentication.',
    })
    @ApiResponse({ status: 201, description: 'Words created successfully', type: BaseResponseDto<Words>, })
    @ApiResponse({ status: 400, description: 'Bad request - validation error', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async create(@CurrentUser() user: AuthUser, @Body() createWordsDto: CreateWordsDto) {
        createWordsDto.created_by = user.userId;
        const words = await this.wordsService.create(createWordsDto);
        return new BaseResponseDto(words, 'Words created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all words with pagination and filters', description: 'Retrieves a paginated list of all active words with optional filtering by role, department, and search terms. Requires authentication.', })
    @ApiResponse({
        status: 200, description: 'Returns paginated list of words', type: BaseResponseDto<PaginatedResponseDto<Words>>,
        schema: {
            example: {
                success: true,
                message: 'Words retrieved successfully',
                data: {
                    items: [] as Words[],
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
    async findAll(@Query() filters: FilterWordsDto) {
        const { page, limit, ...wordsFilters } = filters;
        const pagination = { page, limit };
        const words = await this.wordsService.findAll(pagination, wordsFilters);
        return new BaseResponseDto(words, 'Words retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a words by id', description: 'Retrieves a specific words by their ID. Only returns active words (soft-deleted words are excluded). Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'string', })
    @ApiResponse({ status: 200, description: 'Words retrieved successfully', type: BaseResponseDto<Words>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async findOne(@Param('id') id: string) {
        const words = await this.wordsService.findOne(id);
        return new BaseResponseDto(words, 'Words retrieved successfully');
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a words by id', description: 'Updates an existing words with the provided information. Only active words can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Words updated successfully', type: BaseResponseDto<Words>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWordsDto: UpdateWordsDto,) {
        updateWordsDto.updated_by = user.userId;
        const words = await this.wordsService.update(id, updateWordsDto);
        return new BaseResponseDto(words, 'Words updated successfully');
    }

    @Patch(':id/approve-status/:status')
    @Roles(RolesEnum.ADMIN)
    @ApiOperation({ summary: 'Update a words status by word id and status enum. Admin only.', description: 'Updates an existing words with the provided information. Only active words can be updated. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: '45e16f14-b27f-4d20-99df-c1d5535ff9e3', type: 'number', })
    @ApiResponse({ status: 200, description: 'Words updated successfully', type: BaseResponseDto<Words>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async approved(
        @CurrentUser() user: AuthUser,
        @Param('id') id: string,
        @Param(
            'status',
            new ParseEnumPipe(WordStatusEnum, {
                errorHttpStatusCode: 400,
                exceptionFactory: () => {
                    return new BadRequestException(
                        `status must be one of: ${Object.values(WordStatusEnum).join(', ')}`,
                    );
                },
            }),
        ) status: WordStatusEnum,) {
        const approved_by_user_id = user.userId;
        const words = await this.wordsService.updateApprovalStatus(id, status, approved_by_user_id);
        return new BaseResponseDto(words, 'Words updated successfully');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete a words by id',
        description: 'Soft deletes a words by setting the deletedAt timestamp. The words will not appear in regular queries but can be restored. Requires authentication.',
    })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Words soft deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.wordsService.remove(id);
        return new BaseResponseDto(null, 'Words soft deleted successfully');
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete a words by id', description: 'Permanently deletes a words from the database. This action cannot be undone. Requires authentication.', })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Words permanently deleted successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async permanentRemove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.wordsService.permanentRemove(id);
        return new BaseResponseDto(null, 'Words permanently deleted successfully');
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted words', description: 'Restores a soft-deleted words.', })
    @ApiParam({ name: 'id', description: 'Words ID (uuid)', example: 1, type: 'number', })
    @ApiResponse({ status: 200, description: 'Words restored successfully', type: BaseResponseDto<null>, })
    @ApiResponse({ status: 404, description: 'Words not found', })
    @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required', })
    async restore(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        await this.wordsService.restore(id);
        return new BaseResponseDto(null, 'Words restored successfully');
    }
}



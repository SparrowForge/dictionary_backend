import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BaseResponseDto } from '../common/dto/base-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('api/v1/roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Creates a new role in a specific branch. Role names must be unique within each branch. Requires authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: BaseResponseDto,
    schema: {
      example: {
        success: true,
        message: 'Role created successfully',
        data: {
          id: 1,
          branchId: 1,
          name: 'Teacher',
          description: 'Teacher role with access to course management',
          status: 'active',
          createdAt: '2024-03-14T12:00:00.000Z',
          updatedAt: '2024-03-14T12:00:00.000Z',
          deletedAt: null,
          branch: {
            id: 1,
            name: 'Main Branch',
            address: '123 Main St',
          },
        },
        timestamp: '2024-03-14T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid role data, branch not found, or duplicate role name',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return new BaseResponseDto(role, 'Role created successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roles with pagination and filtering',
    description:
      'Retrieves a paginated list of all roles with optional filtering by branchId, name, status, and search. Soft-deleted roles are excluded. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: BaseResponseDto<PaginatedResponseDto<Role>>,
    schema: {
      example: {
        success: true,
        message: 'Roles retrieved successfully',
        data: {
          items: [
            {
              id: 1,
              branchId: 1,
              name: 'Teacher',
              description: 'Teacher role with access to course management',
              status: 'active',
              createdAt: '2024-03-14T12:00:00.000Z',
              updatedAt: '2024-03-14T12:00:00.000Z',
              deletedAt: null,
              branch: {
                id: 1,
                name: 'Main Branch',
                address: '123 Main St',
              },
            },
          ],
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async findAll(@Query() filterRoleDto: FilterRoleDto) {
    const { page = 1, limit = 10, ...filters } = filterRoleDto;
    const pagination = { page, limit };

    const roles = await this.rolesService.findAll(pagination, filters);
    return new BaseResponseDto(roles, 'Roles retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by ID',
    description:
      'Retrieves a specific role by its numeric ID. Only returns active roles (soft-deleted roles are excluded). Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID (numeric)',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: BaseResponseDto<Role>,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.findOne(id);
    return new BaseResponseDto(role, 'Role retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role by ID',
    description:
      'Updates an existing role with the provided information. Only active roles can be updated. Role names must remain unique within the branch. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID (numeric)',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: BaseResponseDto<Role>,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid role data, branch not found, or duplicate role name',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.rolesService.update(id, updateRoleDto);
    return new BaseResponseDto(role, 'Role updated successfully');
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete a role by ID',
    description:
      'Soft deletes a role by setting the deletedAt timestamp. The role will not appear in regular queries but can be restored. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID (numeric)',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Role soft deleted successfully',
    type: BaseResponseDto<null>,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return new BaseResponseDto(null, 'Role soft deleted successfully');
  }

  @Delete(':id/permanent')
  @ApiOperation({
    summary: 'Permanently delete a role by ID',
    description:
      'Permanently deletes a role from the database. This action cannot be undone. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID (numeric)',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Role permanently deleted successfully',
    type: BaseResponseDto<null>,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async permanentRemove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.permanentRemove(id);
    return new BaseResponseDto(null, 'Role permanently deleted successfully');
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore a soft-deleted role',
    description:
      'Restores a soft-deleted role by clearing the deletedAt timestamp. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID (numeric)',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Role restored successfully',
    type: BaseResponseDto<null>,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Role is not deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.restore(id);
    return new BaseResponseDto(null, 'Role restored successfully');
  }
}

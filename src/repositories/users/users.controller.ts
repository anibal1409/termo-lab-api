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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  PaginationDto,
  QueryBaseDto,
} from '../../common/pagination/dto';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiBody({ type: CreateUserDto, description: 'Datos para crear un usuario' })
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente. La contraseña se genera automáticamente.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtiene todos los usuarios activos (lista completa)' })
  @ApiOkResponse({
    description: 'Lista completa de usuarios activos',
    type: [UserResponseDto]
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene usuarios activos de forma paginada' })
  @ApiQuery({
    type: QueryBaseDto,
    description: 'Parámetros de paginación y filtrado'
  })
  @ApiOkResponse({
    description: 'Usuarios paginados',
    type: PaginationDto<UserResponseDto>
  })
  async findPaginated(@Query() query: QueryBaseDto): Promise<PaginationDto<UserResponseDto>> {
    return this.usersService.findPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario activo por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: UserResponseDto
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiBody({ type: UpdateUserDto, description: 'Datos para actualizar' })
  @ApiOkResponse({
    description: 'Usuario actualizado',
    type: UserResponseDto
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina lógicamente un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiOkResponse({
    description: 'Usuario marcado como eliminado',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' } }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}

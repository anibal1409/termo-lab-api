import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'; // Importar ParseIntPipe y Query
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

import { PaginationDto, QueryBaseDto } from '../../common/pagination/dto';
import { CreateTestDto, TestResponseDto, UpdateTestDto } from './dto';
import { TestService } from './test.service';

// Importar la entidad Test ya no es necesario si el controlador solo trabaja con DTOs de respuesta
// import { Test } from './entities/test.entity';

/**
 * Controlador para gestionar las operaciones relacionadas con la entidad Test.
 * Proporciona endpoints para crear, leer (lista completa y paginada), actualizar y eliminar registros de Test.
 * Utiliza el TestService para la lógica de negocio e interacción con el repositorio.
 * Los endpoints que retornan datos de Test ahora devuelven TestResponseDto o PaginationDto<TestResponseDto>.
 */
@ApiTags('tests') // Agrupa todos los endpoints de este controlador bajo la etiqueta 'tests' en Swagger UI
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  /**
   * Crea un nuevo registro de Test.
   * Recibe los datos en el cuerpo de la solicitud utilizando CreateTestDto.
   * @param createTestDto Los datos para crear el Test.
   * @returns Una promesa que resuelve con el Test creado como TestResponseDto.
   */
  @Post()
  @ApiOperation({ summary: 'Crea un nuevo Test' }) // Descripción de la operación
  @ApiBody({
    type: CreateTestDto,
    description: 'Datos para crear un nuevo Test',
  }) // Documenta el cuerpo de la solicitud
  @ApiCreatedResponse({
    description: 'El Test ha sido creado exitosamente.',
    type: TestResponseDto,
  }) // Documenta una respuesta exitosa (Creado) con el DTO de respuesta
  @ApiBadRequestResponse({ description: 'Solicitud inválida.' }) // Documenta una posible respuesta de error (Bad Request)
  async create(@Body() createTestDto: CreateTestDto): Promise<TestResponseDto> {
    return this.testService.create(createTestDto);
  }

  /**
   * Obtiene todos los registros de Test "válidos" (no eliminados lógicamente) sin paginación.
   * Devuelve una lista completa de entidades Test mapeadas a DTOs de respuesta.
   * Nota: Este endpoint puede ser ineficiente para grandes cantidades de datos.
   * @returns Una promesa que resuelve con un array de TestResponseDto.
   */
  @Get('all') // Nuevo path para la lista completa sin paginación
  @ApiOperation({ summary: 'Obtiene todos los Tests válidos (lista completa)' }) // Descripción de la operación
  @ApiOkResponse({
    description: 'Lista completa de Tests válidos.',
    type: [TestResponseDto],
  }) // Documenta una respuesta exitosa (OK) con un array de DTOs
  async findAll(): Promise<TestResponseDto[]> {
    // Llama al método findAll del servicio que retorna DTOs
    return this.testService.findAll();
  }

  /**
   * Obtiene registros de Test "válidos" (no eliminados lógicamente) de forma paginada.
   * Acepta parámetros de consulta para paginación, búsqueda y ordenamiento.
   * @param query Los parámetros de consulta para paginación, búsqueda y ordenamiento.
   * @returns Una promesa que resuelve con un objeto PaginationDto<TestResponseDto>.
   */
  @Get() // Endpoint principal para la consulta paginada
  @ApiOperation({ summary: 'Obtiene Tests válidos de forma paginada' }) // Descripción de la operación
  @ApiQuery({
    type: QueryBaseDto,
    description: 'Parámetros de consulta para paginación, búsqueda y ordenamiento',
  }) // Documenta los parámetros de consulta
  @ApiOkResponse({
    description: 'Lista paginada de Tests válidos.',
    type: PaginationDto<TestResponseDto>,
  }) // Documenta una respuesta exitosa (OK) con el DTO de paginación
  async findPaginated(@Query() query: QueryBaseDto): Promise<PaginationDto<TestResponseDto>> {
    // Acepta QueryBaseDto y retorna PaginationDto
    return this.testService.findPaginated(query); // Llama al método findPaginated del servicio
  }

  /**
   * Obtiene un registro de Test "válido" (no eliminado lógicamente) por su ID.
   * @param id El ID del Test a buscar.
   * @returns Una promesa que resuelve con el Test encontrado como TestResponseDto.
   * @throws NotFoundException Si el Test no se encuentra o está eliminado lógicamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un Test válido por ID' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del Test a obtener', type: Number }) // Documenta el parámetro 'id' en la URL
  @ApiOkResponse({
    description: 'El Test válido encontrado.',
    type: TestResponseDto,
  }) // Documenta una respuesta exitosa con el DTO de respuesta
  @ApiNotFoundResponse({ description: 'Test no encontrado o no válido.' }) // Documenta una posible respuesta de error (Not Found)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TestResponseDto> {
    // Usa ParseIntPipe para convertir el ID a número y validar, retorna TestResponseDto
    return this.testService.findOne(id); // Llama al método findOne del servicio
  }

  /**
   * Actualiza un registro de Test "válido" (no eliminado lógicamente) por su ID.
   * Recibe los datos de actualización en el cuerpo de la solicitud utilizando UpdateTestDto.
   * @param id El ID del Test a actualizar.
   * @param updateTestDto Los datos para actualizar el Test.
   * @returns Una promesa que resuelve con el Test actualizado como TestResponseDto.
   * @throws NotFoundException Si el Test no se encuentra o está eliminado lógicamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un Test válido por ID' }) // Descripción de la operación
  @ApiParam({
    name: 'id',
    description: 'ID del Test a actualizar',
    type: Number,
  }) // Documenta el parámetro 'id'
  @ApiBody({
    type: UpdateTestDto,
    description: 'Datos para actualizar el Test',
  }) // Documenta el cuerpo de la solicitud
  @ApiOkResponse({
    description: 'El Test ha sido actualizado exitosamente.',
    type: TestResponseDto,
  }) // Documenta una respuesta exitosa con el DTO de respuesta
  @ApiBadRequestResponse({ description: 'Solicitud inválida.' }) // Documenta posibles errores
  @ApiNotFoundResponse({ description: 'Test no encontrado o no válido.' }) // Documenta posibles errores
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTestDto: UpdateTestDto): Promise<TestResponseDto> {
    // Usa ParseIntPipe, retorna TestResponseDto
    return this.testService.update(id, updateTestDto);
  }

  /**
   * Marca un registro de Test como eliminado lógicamente por su ID.
   * No elimina físicamente el registro de la base de datos.
   * Lanza una excepción NotFoundException si el Test no se encuentra o ya está eliminado lógicamente.
   * @param id El ID del Test a marcar como eliminado.
   * @returns Una promesa que resuelve con un objeto indicando el éxito de la operación.
   * @throws NotFoundException Si el Test no se encuentra o ya está marcado como eliminado lógicamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Marca un Test como eliminado lógicamente por ID' }) // Descripción de la operación
  @ApiParam({
    name: 'id',
    description: 'ID del Test a marcar como eliminado',
    type: Number,
  }) // Documenta el parámetro 'id'
  @ApiOkResponse({
    description: 'El Test ha sido marcado como eliminado exitosamente.',
    type: Object,
  }) // Documenta una respuesta exitosa (el servicio devuelve un objeto simple)
  @ApiNotFoundResponse({
    description: 'Test no encontrado o ya marcado como eliminado.',
  }) // Documenta una posible respuesta de error
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    // Usa ParseIntPipe
    return this.testService.remove(id);
  }
}

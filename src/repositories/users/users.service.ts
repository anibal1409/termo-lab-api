import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { FindManyOptions, Not, Raw, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto, QueryBaseDto } from '../../common/pagination/dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { MailService } from '../../common/mail';
import { normalizeText } from '../../common/utlis/string.utils';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto';
import { User, UserRole } from './entities/user.entity';

/** Vigencia del enlace para definir contraseña. */
const PASSWORD_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const ALLOWED_SORT = new Set([
  'id',
  'name',
  'email',
  'role',
  'createdAt',
  'updatedAt',
  'lastLogin',
]);

@Injectable()
export class UsersService implements CrudRepository<User> {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mail: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Contraseña aleatoria que nadie conoce; el usuario define la suya con el enlace
    const newUser = this.usersRepository.create({
      ...createUserDto,
      enrollOnFirstLogin: createUserDto.enrollOnFirstLogin ?? true,
      password: randomBytes(32).toString('hex'),
    });
    const createdUser = await this.usersRepository.save(newUser);
    const inviteSent = await this.sendPasswordSetup(createdUser);
    return new UserResponseDto(createdUser, inviteSent);
  }

  /** Reenvía el enlace (p. ej. si venció). Invalida el enlace anterior. */
  async resendInvite(id: number): Promise<UserResponseDto> {
    const user = await this.findValid(id);
    const inviteSent = await this.sendPasswordSetup(user);
    return new UserResponseDto(user, inviteSent);
  }

  private async sendPasswordSetup(user: User): Promise<boolean> {
    const token = randomBytes(32).toString('base64url');
    await this.usersRepository.update(user.id, {
      passwordTokenHash: createHash('sha256').update(token).digest('hex'),
      passwordTokenExpires: new Date(Date.now() + PASSWORD_TOKEN_TTL_MS),
    });
    try {
      await this.mail.sendSetPassword(user.email, user.name, token);
      return true;
    } catch (err) {
      // El usuario queda creado; el admin puede reenviar con POST /users/:id/invite
      this.logger.error(`No se pudo enviar el correo a ${user.email}: ${err}`);
      return false;
    }
  }

  async findAll(excludeUserId?: number): Promise<UserResponseDto[]> {
    const where: any = { deleted: false };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const users = await this.usersRepository.find({
      where,
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async findPaginated(
    query: QueryBaseDto,
    excludeUserId?: number,
  ): Promise<PaginationDto<UserResponseDto>> {
    const {
      term,
      page = 1,
      size = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = query;

    if (!ALLOWED_SORT.has(sort)) {
      throw new BadRequestException(`Campo de ordenamiento inválido: ${sort}`);
    }

    const where: any = { deleted: false };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const findOptions: FindManyOptions<User> = {
      where,
      take: size,
      skip: (page - 1) * size,
      order: { [sort]: order },
    };

    if (term) {
      const normalizedTerm = normalizeText(term);
      findOptions.where = {
        ...findOptions.where,
        name: Raw(
          (alias) => `unaccent(LOWER(${alias})) LIKE unaccent(LOWER(:value))`,
          {
            value: `%${normalizedTerm}%`,
          },
        ),
      };
    }

    const [users, total] = await this.usersRepository.findAndCount(findOptions);
    const userDtos = users.map((user) => new UserResponseDto(user));

    return pagination(page, size, userDtos, total);
  }

  async findValid(id: number | string): Promise<User> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new NotFoundException(`ID de usuario inválido: ${id}`);
    }

    const user = await this.usersRepository.findOne({
      where: { id: numericId, deleted: false },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.findValid(id);
    return new UserResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    actorId?: number,
  ): Promise<UserResponseDto> {
    const userToUpdate = await this.findValid(id);
    const demoting =
      userToUpdate.role === UserRole.ADMIN &&
      updateUserDto.role != null &&
      updateUserDto.role !== UserRole.ADMIN;
    if (demoting) {
      if (id === actorId) {
        throw new ForbiddenException(
          'No puede quitarse su propio rol de administrador',
        );
      }
      await this.assertNotLastAdmin();
    }
    if (
      updateUserDto.role != null &&
      updateUserDto.role !== userToUpdate.role
    ) {
      // Cambio de rol: se cierran sus sesiones para que vuelva a autenticarse
      userToUpdate.tokensValidAfter = new Date();
    }
    Object.assign(userToUpdate, updateUserDto);
    const updatedUser = await this.usersRepository.save(userToUpdate);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: number, actorId?: number): Promise<{ message: string }> {
    if (id === actorId) {
      throw new ForbiddenException('No puede eliminar su propia cuenta');
    }
    const userToDelete = await this.findValid(id);
    if (userToDelete.role === UserRole.ADMIN) await this.assertNotLastAdmin();
    userToDelete.deleted = true;
    userToDelete.tokensValidAfter = new Date();
    await this.usersRepository.save(userToDelete);
    return { message: `Usuario con ID ${id} marcado como eliminado` };
  }

  /** Evita dejar el sistema sin administradores activos. */
  private async assertNotLastAdmin(): Promise<void> {
    const admins = await this.usersRepository.count({
      where: { role: UserRole.ADMIN, deleted: false },
    });
    if (admins <= 1) {
      throw new ForbiddenException(
        'Debe quedar al menos un administrador activo',
      );
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email, deleted: false },
    });
  }

  // ── Profile ─────────────────────────────────────────────

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.findValid(userId);
    return new UserResponseDto(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.findValid(userId);
    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    return new UserResponseDto(saved);
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, deleted: false },
      select: ['id', 'password'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const valid = await user.comparePassword(dto.currentPassword);
    if (!valid) throw new UnauthorizedException('Contraseña actual incorrecta');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashed = await bcrypt.hash(dto.newPassword, saltRounds);
    // Cierra todas las sesiones abiertas con la contraseña anterior
    await this.usersRepository.update(userId, {
      password: hashed,
      tokensValidAfter: new Date(),
    });
    return { message: 'Contraseña actualizada exitosamente' };
  }
}

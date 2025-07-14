import {
  FindManyOptions,
  Not,
  Raw,
  Repository,
} from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PaginationDto,
  QueryBaseDto,
} from '../../common/pagination/dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements CrudRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = this.usersRepository.create(createUserDto);
    const createdUser = await this.usersRepository.save(newUser);
    return new UserResponseDto(createdUser);
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
  ): Promise<UserResponseDto> {
    const userToUpdate = await this.findValid(id);
    Object.assign(userToUpdate, updateUserDto);
    const updatedUser = await this.usersRepository.save(userToUpdate);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const userToDelete = await this.findValid(id);
    userToDelete.deleted = true;
    await this.usersRepository.save(userToDelete);
    return { message: `Usuario con ID ${id} marcado como eliminado` };
  }

  // Método adicional para autenticación
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email, deleted: false },
    });
  }
}

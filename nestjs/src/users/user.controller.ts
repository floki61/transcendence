import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }
  @Post()
  async createUser(@Body() createUserDto: { name: string , password: string}) {
    try {
      console.log("name::", createUserDto.name,"\n");
      console.log("password::", createUserDto.password,"\n");
      const newUser = await this.usersService.createUser(createUserDto.name, createUserDto.password);
      return { message: 'Book created successfully', book: newUser };
    } catch (error) {
      return { error: 'Failed to create book', message: error.message };
    }
  }
}
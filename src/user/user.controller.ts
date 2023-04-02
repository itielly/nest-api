import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  async list() {
    return { users: [] };
  }

  @Get(':id')
  async readOne(@Param() param) {
    return { user: {}, param };
  }

  @Post()
  async create(@Body() body: any) {
    return { body };
  }

  @Put(':id')
  async update(@Body() body, @Param() param) {
    return {
      method: 'put',
      body,
      param,
    };
  }

  @Patch(':id')
  async updateParcial(@Body() body, @Param() param) {
    return {
      method: 'patch',
      body,
      param,
    };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return {
      params,
    };
  }
}

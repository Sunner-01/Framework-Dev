import { Body, Controller, Get, Post } from '@nestjs/common';
import { Animal } from './animal';
import { AnimalsService } from './animals.service';

@Controller('animales')
export class AnimalsController {
  constructor(private readonly animals: AnimalsService) {}

  @Get()
  findAll(): Animal[] {
    return this.animals.findAll();
  }

  @Post()
  create(@Body() body: { nombre: string; especie: string }): Animal {
    return this.animals.create(body?.nombre, body?.especie);
  }
}

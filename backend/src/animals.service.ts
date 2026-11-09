import { BadRequestException, Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Animal } from './animal';

@Injectable()
export class AnimalsService {
  private get file(): string {
    return process.env.DB_FILE || join(process.cwd(), 'backend', 'db.json');
  }

  findAll(): Animal[] {
    try {
      const data = JSON.parse(readFileSync(this.file, 'utf8')) as { animales: Animal[] };
      return data.animales;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  create(nombre: string, especie: string): Animal {
    if (!nombre?.trim() || !especie?.trim()) {
      throw new BadRequestException('Nombre y especie son obligatorios');
    }
    const animales = this.findAll();
    const id = Math.max(0, ...animales.map((animal) => animal.id)) + 1;
    const animal = new Animal(id, nombre.trim(), especie.trim());
    writeFileSync(this.file, JSON.stringify({ animales: [...animales, animal] }, null, 2));
    return animal;
  }
}

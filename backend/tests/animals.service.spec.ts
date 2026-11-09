import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BadRequestException } from '@nestjs/common';
import { AnimalsService } from '../src/animals.service';

describe('AnimalsService (unitarias)', () => {
  let directory: string;
  let service: AnimalsService;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'animals-unit-'));
    process.env.DB_FILE = join(directory, 'db.json');
    service = new AnimalsService();
  });
  afterEach(() => {
    delete process.env.DB_FILE;
    rmSync(directory, { recursive: true, force: true });
  });

  it('devuelve una lista vacía si todavía no existe db.json', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('rechaza un animal sin especie', () => {
    expect(() => service.create('Luna', ' ')).toThrow(BadRequestException);
    expect(service.findAll()).toEqual([]);
  });
});

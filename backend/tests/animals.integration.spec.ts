import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API y db.json (integración)', () => {
  let app: INestApplication;
  let directory: string;

  beforeEach(async () => {
    directory = mkdtempSync(join(tmpdir(), 'animals-integration-'));
    process.env.DB_FILE = join(directory, 'db.json');
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
    delete process.env.DB_FILE;
    rmSync(directory, { recursive: true, force: true });
  });

  it('POST guarda un animal que luego devuelve GET', async () => {
    const created = await request(app.getHttpServer()).post('/animales').send({ nombre: 'Luna', especie: 'Gato' }).expect(201);
    expect(created.body).toEqual({ id: 1, nombre: 'Luna', especie: 'Gato' });
    const list = await request(app.getHttpServer()).get('/animales').expect(200);
    expect(list.body).toEqual([created.body]);
  });

  it('POST inválido responde 400 sin alterar la lista', async () => {
    await request(app.getHttpServer()).post('/animales').send({ nombre: '', especie: 'Gato' }).expect(400);
    const list = await request(app.getHttpServer()).get('/animales').expect(200);
    expect(list.body).toEqual([]);
  });
});

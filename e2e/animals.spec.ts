import { expect, test } from '@playwright/test';

test('la página muestra el registro y el formulario', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Registro de animales' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Nombre' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Especie' })).toBeVisible();
});

test('un usuario agrega un animal y lo ve en la lista', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Nombre' }).fill('Nala');
  await page.getByRole('textbox', { name: 'Especie' }).fill('Perro');
  await page.getByRole('button', { name: 'Agregar animal' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Nala — Perro' })).toBeVisible();
});

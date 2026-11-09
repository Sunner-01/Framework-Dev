'use client';

import { FormEvent, useEffect, useState } from 'react';

type Animal = { id: number; nombre: string; especie: string };
const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${api}/animales`)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la lista');
        return response.json();
      })
      .then(setAnimales)
      .catch(() => setError('No se pudo conectar con el backend'));
  }, []);

  async function agregar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${api}/animales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, especie }),
      });
      if (!response.ok) throw new Error('No se pudo guardar el animal');
      const animal = await response.json() as Animal;
      setAnimales((actuales) => [...actuales, animal]);
      setNombre('');
      setEspecie('');
    } catch {
      setError('No se pudo guardar el animal');
    }
  }

  return <main>
    <h1>Registro de animales</h1>
    <p>Ejemplo pequeño con Next.js, NestJS y un archivo JSON.</p>
    <form onSubmit={agregar}>
      <label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label>
      <label>Especie<input value={especie} onChange={(e) => setEspecie(e.target.value)} required /></label>
      <button type="submit">Agregar animal</button>
    </form>
    {error && <p role="alert">{error}</p>}
    <h2>Animales</h2>
    <ul>{animales.map((animal) => <li key={animal.id}>{animal.nombre} — {animal.especie}</li>)}</ul>
    {animales.length === 0 && !error && <p>Aún no hay animales.</p>}
  </main>;
}

// Versión liviana de un video para pantallas angostas (720 px, generada junto al original con el
// sufijo -m). Se comprueba al compilar: si no existe, el video usa siempre el original.
import { existsSync } from 'node:fs';

export const mobileSrc = (src?: string) => {
  if (!src || !src.endsWith('.mp4')) return undefined;
  const m = src.replace(/\.mp4$/, '-m.mp4');
  return existsSync(`public${m}`) ? m : undefined;
};

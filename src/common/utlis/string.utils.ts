export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Descompone los acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos
    .toLowerCase(); // Convierte a minúsculas
};

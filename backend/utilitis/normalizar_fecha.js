const normalizarFecha = (fecha) => {
  if (!fecha) return null;

  if (fecha.length === 4) return `${fecha}-01-01`;
  if (fecha.length === 7) return `${fecha}-01`;

  return fecha;
};

module.exports = normalizarFecha;
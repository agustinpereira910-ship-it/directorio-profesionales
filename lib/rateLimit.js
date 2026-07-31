const historial = new Map();

// Rate limiter simple en memoria (ventana deslizante). Sirve como primera línea
// de defensa en una sola instancia del servidor. A escala real, con múltiples
// instancias serverless en paralelo, esto NO comparte estado entre ellas —
// para eso hace falta un store compartido (ej. Redis/Upstash).
export function rateLimit(key, { limite = 10, ventanaMs = 60_000 } = {}) {
  const ahora = Date.now();
  const intentos = (historial.get(key) || []).filter((t) => ahora - t < ventanaMs);
  intentos.push(ahora);
  historial.set(key, intentos);
  return intentos.length <= limite;
}

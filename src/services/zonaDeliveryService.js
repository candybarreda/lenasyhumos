  
const API_URL =
import.meta.env.APP_API_URL || "http://localhost:8080";

export async function obtenerZonasDelivery() {
const respuesta = await fetch(`${API_URL}/api/zonas-delivery`);

if (!respuesta.ok) {
  throw new Error(
    `Error al consultar las zonas de delivery: ${respuesta.status}`
  );
}

return respuesta.json();
}

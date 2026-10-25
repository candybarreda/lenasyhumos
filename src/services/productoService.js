
const API_URL =
import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/api/productos`);

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar productos: ${respuesta.status}`
    );
  }

  return respuesta.json();
}

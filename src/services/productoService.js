
const API_URL = "http://localhost:8080/api/productos";

export async function obtenerProductos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar productos: ${respuesta.status}`
    );
  }

  return respuesta.json();
}

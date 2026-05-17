const request = require("supertest");
const api = require("../index");

describe("Libros y preventas", () => {
  test("GET /preventas debe responder 200 y devolver data como arreglo", async () => {
    const res = await request(api).get("/preventas");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body).toHaveProperty("cantidad");
  });

  test("GET /libros/buscar sin q debe responder 400", async () => {
    const res = await request(api).get("/libros/buscar");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Debes enviar un término de búsqueda");
  });

  test("GET /libros/filtros debe responder 200", async () => {
    const res = await request(api).get("/libros/filtros");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test("GET /libros/id inexistente debe responder 404", async () => {
    const res = await request(api).get("/libros/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Libro no encontrado");
  });
});
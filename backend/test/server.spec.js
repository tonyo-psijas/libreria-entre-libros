const request = require("supertest");
const app = require("../index");

describe("API Librería Entre Libros", () => {
  it("GET / debe responder 200", async () => {
    const response = await request(app).get("/").send();

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API libreria funcionando");
  });

  it("GET /libros debe responder 200 y devolver un arreglo", async () => {
    const response = await request(app).get("/libros").send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("POST /clientes/login con credenciales inválidas debe responder 401", async () => {
    const response = await request(app)
      .post("/clientes/login")
      .send({
        email: "usuario_inexistente@test.com",
        password: "claveincorrecta",
      });

    expect(response.statusCode).toBe(401);
  });

  it("GET /carrito sin token debe responder 401", async () => {
    const response = await request(app).get("/carrito").send();

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("No se proporcionó un token de autenticación");
  });
});
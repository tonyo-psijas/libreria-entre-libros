const request = require("supertest");
const api = require("../index");

let tokenCliente = "";

describe("Protección de rutas admin", () => {
  beforeAll(async () => {
    const loginCliente = await request(api)
      .post("/clientes/login")
      .send({
        email: "orlando@test.com",
        password: "123456",
      });

    tokenCliente = loginCliente.body.token;
  });

  test("POST /libros sin token debe responder 401", async () => {
    const res = await request(api).post("/libros").send({});

    expect(res.statusCode).toBe(401);
  });

  test("POST /libros con token cliente debe responder 403", async () => {
    const res = await request(api)
      .post("/libros")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({});

    expect(res.statusCode).toBe(403);
  });

  test("PUT /libros/1/desactivar sin token debe responder 401", async () => {
    const res = await request(api).put("/libros/1/desactivar");

    expect(res.statusCode).toBe(401);
  });

  test("POST /empresas-envio con token cliente debe responder 403", async () => {
    const res = await request(api)
      .post("/empresas-envio")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({
        nombre: "Empresa Test",
      });

    expect(res.statusCode).toBe(403);
  });
});
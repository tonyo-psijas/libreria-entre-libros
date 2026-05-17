const request = require("supertest");
const api = require("../index");

let tokenAdmin = "";
let tokenCliente = "";

describe("Gestión de usuarios - rutas protegidas", () => {
  beforeAll(async () => {
    const loginAdmin = await request(api)
      .post("/clientes/login")
      .send({
        email: "orlando2@test.com",
        password: "123456",
      });

    tokenAdmin = loginAdmin.body.token;

    const loginCliente = await request(api)
      .post("/clientes/login")
      .send({
        email: "orlando@test.com",
        password: "123456",
      });

    tokenCliente = loginCliente.body.token;
  });

  test("GET /clientes sin token debe responder 401", async () => {
    const res = await request(api).get("/clientes");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test("GET /clientes con token de cliente debe responder 403", async () => {
    const res = await request(api)
      .get("/clientes")
      .set("Authorization", `Bearer ${tokenCliente}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBeDefined();
  });

  test("GET /clientes con token admin debe responder 200", async () => {
    const res = await request(api)
      .get("/clientes")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test("GET /clientes/:id con id inválido debe responder 400", async () => {
    const res = await request(api)
      .get("/clientes/abc")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(400);
  });

  test("PUT /clientes/:id/rol con rol inválido debe responder 400", async () => {
    const res = await request(api)
      .put("/clientes/4/rol")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        rol: "superadmin",
      });

    expect(res.statusCode).toBe(400);
  });
});
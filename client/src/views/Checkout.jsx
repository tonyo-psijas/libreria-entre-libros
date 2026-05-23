import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// Métodos de pago con IDs fijos (no hay ruta en el backend aún)
const METODOS_PAGO = [
  { id: 1, label: "WebPay", icono: "fa-credit-card" },
  { id: 2, label: "Tarjeta de crédito/débito", icono: "fa-credit-card-blank" },
  { id: 3, label: "Transferencia bancaria", icono: "fa-building-columns" },
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, totalItems, totalPrecio, cargarCarrito } = useCart();
  const { user } = useUser();
  const { crearPedido } = useOrders();

  const [direcciones, setDirecciones] = useState([]);
  const [empresasEnvio, setEmpresasEnvio] = useState([]);

  const [idDireccionSeleccionada, setIdDireccionSeleccionada] = useState("");
  const [idEmpresaEnvio, setIdEmpresaEnvio] = useState("");
  const [idMetodoPago, setIdMetodoPago] = useState("");

  const [loadingDatos, setLoadingDatos] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  // Cargar direcciones del cliente y empresas de envío al montar
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingDatos(true);
      try {
        const [resDirecciones, resEmpresas] = await Promise.all([
          fetch(`${BASE_URL}/direcciones`, { headers: authHeaders() }),
          fetch(`${BASE_URL}/empresas-envio`),
        ]);

        const jsonDirecciones = await resDirecciones.json();
        const jsonEmpresas = await resEmpresas.json();

        const listaDirecciones = Array.isArray(jsonDirecciones.data)
          ? jsonDirecciones.data
          : [];
        const listaEmpresas = Array.isArray(jsonEmpresas.data)
          ? jsonEmpresas.data
          : [];

        setDirecciones(listaDirecciones);
        setEmpresasEnvio(listaEmpresas);

        // Preseleccionar la primera opción si existe
        if (listaDirecciones.length > 0)
          setIdDireccionSeleccionada(listaDirecciones[0].id_direccion);
        if (listaEmpresas.length > 0)
          setIdEmpresaEnvio(listaEmpresas[0].id_empresa_envio);
      } catch (err) {
        console.error("Error al cargar datos del checkout:", err);
        setError("Error al cargar los datos. Intenta de nuevo.");
      } finally {
        setLoadingDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError("");

    if (!idDireccionSeleccionada) {
      setError("Selecciona una dirección de envío.");
      return;
    }
    if (!idEmpresaEnvio) {
      setError("Selecciona una empresa de envío.");
      return;
    }
    if (!idMetodoPago) {
      setError("Selecciona un método de pago.");
      return;
    }

    setProcesando(true);
    try {
      const pedido = await crearPedido({
        id_direccion: idDireccionSeleccionada,
        id_empresa_envio: idEmpresaEnvio,
        id_metodo_pago: idMetodoPago,
      });

      // El backend ya vació el carrito en la BD; sincronizamos el estado local
      await cargarCarrito();

      navigate(`/pedido/${pedido.id_pedido}`);
    } catch (err) {
      setError(err.message || "Error al procesar el pedido.");
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h5>No tienes productos en el carrito.</h5>
      </div>
    );
  }

  if (loadingDatos) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h4 className="fw-semibold mb-4">Finalizar compra</h4>

      <form onSubmit={handleConfirmar}>
        <div className="row g-4 align-items-start">

          {/* COLUMNA IZQUIERDA */}
          <div className="col-12 col-lg-8">

            {/* DIRECCIÓN DE ENVÍO */}
            <div className="profile-content mb-4 pb-4">
              <h6 className="fw-semibold mb-3">DIRECCIÓN DE ENVÍO</h6>
              <hr className="divider mb-3" />

              {direcciones.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-secondary mb-2">
                    No tienes direcciones guardadas.
                  </p>

                  <Link to="/perfil"
                  className="btn boton-secundario btn-sm">
                    Agregar dirección en Mi Perfil
                  </Link>

                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {direcciones.map((dir) => (
                    <label
                      key={dir.id_direccion}
                      onClick={() => setIdDireccionSeleccionada(dir.id_direccion)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        padding: "1rem",
                        border:
                          idDireccionSeleccionada === dir.id_direccion
                            ? "2px solid #4A5947"
                            : "1px solid #D4D9C7",
                        borderRadius: "12px",
                        cursor: "pointer",
                        backgroundColor:
                          idDireccionSeleccionada === dir.id_direccion
                            ? "#F1F2ED"
                            : "white",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="direccion"
                        value={dir.id_direccion}
                        checked={idDireccionSeleccionada === dir.id_direccion}
                        onChange={() => setIdDireccionSeleccionada(dir.id_direccion)}
                        style={{ marginTop: "3px" }}
                      />
                      <div>
                        <p className="fw-semibold mb-0">
                          {dir.alias && (
                            <span className="me-2">{dir.alias} —</span>
                          )}
                          {dir.destinatario}
                        </p>
                        <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
                          {dir.calle} {dir.numero}, {dir.ciudad}, {dir.pais}
                          {dir.codigo_postal && `, ${dir.codigo_postal}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* EMPRESA DE ENVÍO */}
            <div className="profile-content mb-4 pb-4">
              <h6 className="fw-semibold mb-3">EMPRESA DE ENVÍO</h6>
              <hr className="divider mb-3" />

              {empresasEnvio.length === 0 ? (
                <p className="text-secondary">No hay empresas de envío disponibles.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {empresasEnvio.map((empresa) => (
                    <label
                      key={empresa.id_empresa_envio}
                      onClick={() => setIdEmpresaEnvio(empresa.id_empresa_envio)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        border:
                          idEmpresaEnvio === empresa.id_empresa_envio
                            ? "2px solid #4A5947"
                            : "1px solid #D4D9C7",
                        borderRadius: "12px",
                        cursor: "pointer",
                        backgroundColor:
                          idEmpresaEnvio === empresa.id_empresa_envio
                            ? "#F1F2ED"
                            : "white",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="empresaEnvio"
                        value={empresa.id_empresa_envio}
                        checked={idEmpresaEnvio === empresa.id_empresa_envio}
                        onChange={() => setIdEmpresaEnvio(empresa.id_empresa_envio)}
                      />
                      <div>
                        <p className="fw-semibold mb-0">{empresa.nombre}</p>
                        {empresa.telefono && (
                          <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
                            {empresa.telefono}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="profile-content pb-4">
              <h6 className="fw-semibold mb-3">MÉTODO DE PAGO</h6>
              <hr className="divider mb-3" />

              <div className="d-flex flex-column gap-2">
                {METODOS_PAGO.map((metodo) => (
                  <label
                    key={metodo.id}
                    onClick={() => setIdMetodoPago(metodo.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      border:
                        idMetodoPago === metodo.id
                          ? "2px solid #4A5947"
                          : "1px solid #D4D9C7",
                      borderRadius: "12px",
                      cursor: "pointer",
                      backgroundColor:
                        idMetodoPago === metodo.id ? "#F1F2ED" : "white",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={metodo.id}
                      checked={idMetodoPago === metodo.id}
                      onChange={() => setIdMetodoPago(metodo.id)}
                    />
                    <i
                      className={`fa-regular ${metodo.icono} fs-5`}
                      style={{ color: "#4A5947" }}
                    ></i>
                    <span className="fw-semibold">{metodo.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA — resumen */}
          <div className="col-12 col-lg-4">
            <div className="profile-content pb-4">
              <h6 className="fw-semibold mb-3">RESUMEN DEL PEDIDO</h6>
              <hr className="divider mb-3" />

              {carrito.map((item) => (
                <div
                  key={item.id_libro}
                  className="d-flex justify-content-between mb-2"
                >
                  <span
                    className="text-secondary"
                    style={{ maxWidth: "65%" }}
                  >
                    {item.titulo}{" "}
                    <span className="fw-semibold">x{item.cantidad}</span>
                  </span>
                  <span className="fw-semibold">
                    ${Number(item.precio * item.cantidad).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}

              <hr className="divider my-3" />

              <div className="d-flex justify-content-between text-secondary mb-2">
                <span>
                  Subtotal ({totalItems}{" "}
                  {totalItems === 1 ? "libro" : "libros"})
                </span>
                <span>${Number(totalPrecio).toLocaleString("es-CL")}</span>
              </div>

              <div className="d-flex justify-content-between text-secondary mb-3">
                <span>Envío</span>
                <span>Por calcular</span>
              </div>

              <hr className="divider mb-3" />

              <div className="d-flex justify-content-between fw-semibold mb-4">
                <span>Total</span>
                <span className="card-price fs-5">
                  ${Number(totalPrecio).toLocaleString("es-CL")}
                </span>
              </div>

              {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn boton-primario w-100 py-2 fw-semibold"
                disabled={procesando || direcciones.length === 0}
              >
                {procesando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar pedido{" "}
                    <i className="fa-regular fa-chevron-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
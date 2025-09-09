const express = require("express");
const cors = require("cors");
const { create } = require("xmlbuilder2");

const app = express();
app.use(cors());
app.use(express.json());

// Simulación de una tarjeta válida
const tarjetaDemo = {
  numero: "1234987612349876",
  nombre: "JUANPEREZ",
  fecha_venc: "202604",
  num_seguridad: "123",
  monto_disponible: 1000
};

// Ruta de autorización
app.get("/autorizacion", (req, res) => {
  const { tarjeta, nombre, fecha_venc, num_seguridad, monto, tienda, formato } = req.query;

  let status = "DENEGADO";
  let numero = "0";

  // Validaciones muy básicas
  if (
    tarjeta === tarjetaDemo.numero &&
    nombre === tarjetaDemo.nombre &&
    fecha_venc === tarjetaDemo.fecha_venc &&
    num_seguridad === tarjetaDemo.num_seguridad &&
    Number(monto) <= tarjetaDemo.monto_disponible
  ) {
    status = "APROBADO";
    numero = Math.floor(100000 + Math.random() * 900000).toString(); // número de autorización random
  }

  const data = {
    autorizacion: {
      emisor: "VISA",
      tarjeta,
      status,
      numero
    }
  };

  if (formato && formato.toUpperCase() === "XML") {
    const xml = create(data).end({ prettyPrint: true });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } else {
    res.json(data);
  }
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor de tarjetas corriendo en http://localhost:${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import authRoute from './routes/auth/auth.routes';
// import clientRoute from './routes/client/client.routes';
// import adminRoute from './routes/admin/admin.routes';
// import citasRoute from './routes/citas/citas.routes';
// import cortesRoute from './routes/cortes/cortes.routes';
// import evaluacionesRoute from './routes/evaluaciones/evaluaciones.routes';

dotenv.config();

const app = express();

let urlFront: string;

if (process.env.ENV === 'DEV') {
  urlFront = 'http://localhost:3000';
} else {
  urlFront = process.env.URL_FRONT!;
}

const corsOptions = {
  origin: urlFront,
  exposedHeaders: ['token'],
  optionsSuccessStatus: 200, //--Para navegadores antiguos que no manejan bien los códigos 204--//
};

// Habilitar cors
app.use(cors(corsOptions));

// Middleware para añadir el encabezado CORS a todas las respuestas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', urlFront);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Usar json
app.use(express.json());

// // Rutas
// app.use('/ws/auth', authRoute);
// app.use('/ws/client', clientRoute);
// app.use('/ws/admin', adminRoute);
// app.use('/ws/citas', citasRoute);
// app.use('/ws/cortes', cortesRoute);
// app.use('/ws/evaluaciones', evaluacionesRoute);

export default app;

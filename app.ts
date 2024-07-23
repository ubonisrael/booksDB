import express from "express";
import dotenv from "dotenv";
// security packages
import helmet from "helmet";
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
// routes
import { route as authorsRoute } from "./routes/authors/authors";
import { route as booksRoute } from "./routes/books/books";
import { route as reviewsRoute} from "./routes/reviews/review";
import { route as usersRoute} from "./routes/users/user";
import { route as authRoute } from "./routes/auth/auth";
import { route as favoritesRoute } from "./routes/favorites/favorites";
// middlewares
import { inputSanitizer } from "./middleware/input_sanitizer";
import { errorHandlerMiddleware } from "./middleware/error_handler";
import { authHandlerMiddleware } from "./middleware/auth_handler";
import { routeNameHandlerMiddleware } from "./middleware/route_name_handler";
// swagger
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

dotenv.config();

const swaggerDocument = YAML.load('./swagger.yaml')

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1 /* number of proxies between user and server */)

app.use(inputSanitizer)
app.use(helmet())
app.use(cors())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
}))
app.use(express.json())

// app.get("/", (req, res) => {
//   res.send("<h1>BooksDB</h1><a href='/api_docs'>Documentation</a>");
// });
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1', routeNameHandlerMiddleware)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/authors', authHandlerMiddleware, authorsRoute)
app.use('/api/v1/books', authHandlerMiddleware, booksRoute)
app.use('/api/v1/reviews', authHandlerMiddleware, reviewsRoute)
app.use('/api/v1/users', authHandlerMiddleware, usersRoute)
app.use('/api/v1/favorites', authHandlerMiddleware, favoritesRoute)

app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Server launched🚀🚀🚀\nListening on localhost:${port}`);
});

import express from "express";
import dotenv from "dotenv";
import { route as authorsRoute } from "./routes/authors/authors";
import { route as booksRoute } from "./routes/books/books";
import { route as reviewsRoute} from "./routes/reviews/review";
import { route as usersRoute} from "./routes/users/user";
import { route as authRoute } from "./routes/auth/auth";
import { errorHandlerMiddleware } from "./middleware/error_handler";
import { authHandlerMiddleware } from "./middleware/auth_handler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Typescript+Express server");
});
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/authors', authHandlerMiddleware, authorsRoute)
app.use('/api/v1/books', authHandlerMiddleware, booksRoute)
app.use('/api/v1/reviews', authHandlerMiddleware, reviewsRoute)
app.use('/api/v1/users', authHandlerMiddleware, usersRoute)

app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`🚀 Server is listening on localhost:${port}`);
});

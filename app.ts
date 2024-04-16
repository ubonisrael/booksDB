import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { route as authorsRoute } from "./routes/authors/authors";
import { route as booksRoute } from "./routes/books/books";
import { route as reviewsRoute} from "./routes/reviews/review";
import { route as usersRoute} from "./routes/users/user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

app.use('/api/v1/authors', authorsRoute)
app.use('/api/v1/books', booksRoute)
app.use('/api/v1/reviews', reviewsRoute)
app.use('/api/v1/users', usersRoute)

// const main = async () => {
//   const user = await prisma.user.create({
//     data: {
//       email: "johndoe@example.com",
//       username: "johndoe000",
//       firstName: "John",
//       lastName: "Doe",
//       password: "weeb123",
//       avatar: "https://robohash.org/doloroditdolorem.png?size=50x50&set=set1",
//       isAdmin: false,
//     },
//   });
//   console.log(user);
// };

app.get("/", (req, res) => {
  res.send("Typescript+Express server");
});

app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});

// main().then(async() => {
//     await prisma.$disconnect()
// }).catch(async(error) => {
//     console.error(error)
//     await prisma.$disconnect()
//     process.exit(1)  
// })

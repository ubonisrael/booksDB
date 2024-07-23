"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// security packages
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
// routes
const authors_1 = require("./routes/authors/authors");
const books_1 = require("./routes/books/books");
const review_1 = require("./routes/reviews/review");
const user_1 = require("./routes/users/user");
const auth_1 = require("./routes/auth/auth");
const favorites_1 = require("./routes/favorites/favorites");
// middlewares
const input_sanitizer_1 = require("./middleware/input_sanitizer");
const error_handler_1 = require("./middleware/error_handler");
const auth_handler_1 = require("./middleware/auth_handler");
const route_name_handler_1 = require("./middleware/route_name_handler");
// swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
dotenv_1.default.config();
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.set('trust proxy', 1 /* number of proxies between user and server */);
app.use(input_sanitizer_1.inputSanitizer);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
}));
app.use(express_1.default.json());
// app.get("/", (req, res) => {
//   res.send("<h1>BooksDB</h1><a href='/api_docs'>Documentation</a>");
// });
app.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use('/api/v1', route_name_handler_1.routeNameHandlerMiddleware);
app.use('/api/v1/auth', auth_1.route);
app.use('/api/v1/authors', auth_handler_1.authHandlerMiddleware, authors_1.route);
app.use('/api/v1/books', auth_handler_1.authHandlerMiddleware, books_1.route);
app.use('/api/v1/reviews', auth_handler_1.authHandlerMiddleware, review_1.route);
app.use('/api/v1/users', auth_handler_1.authHandlerMiddleware, user_1.route);
app.use('/api/v1/favorites', auth_handler_1.authHandlerMiddleware, favorites_1.route);
app.use(error_handler_1.errorHandlerMiddleware);
app.listen(port, () => {
    console.log(`Server launched🚀🚀🚀\nListening on localhost:${port}`);
});

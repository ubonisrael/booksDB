"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSanitizer = void 0;
const xss_1 = __importDefault(require("xss"));
// Custom middleware to sanitize input
const inputSanitizer = (req, res, next) => {
    // Sanitize query parameters
    for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
            req.query[key] = (0, xss_1.default)(req.query[key]);
        }
    }
    // Sanitize request body
    if (req.body) {
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                req.body[key] = (0, xss_1.default)(req.body[key]);
            }
        }
    }
    // Sanitize URL parameters
    for (const key in req.params) {
        if (req.params.hasOwnProperty(key)) {
            req.params[key] = (0, xss_1.default)(req.params[key]);
        }
    }
    next();
};
exports.inputSanitizer = inputSanitizer;

"use strict";
/*
ISC License

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const authRouter_1 = __importDefault(require("./auth/authRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//test
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!config_1.default.DB_URL) {
                throw new Error("DB_URL is not defined");
            }
            yield mongoose_1.default.connect(config_1.default.DB_URL);
            const app = (0, express_1.default)();
            // Middleware 
            app.use(express_1.default.json());
            app.use((0, express_fileupload_1.default)({}));
            app.use((0, cors_1.default)({ origin: config_1.default.CORS_ORIGIN }));
            app.use(express_1.default.static('static'));
            app.use((0, cookie_parser_1.default)());
            //Routes
            app.use('/auth', authRouter_1.default);
            app.get('/', (req, res) => {
                res.send('server is running');
            });
            app.use((req, res) => {
                res.status(404).send('Not Found');
            });
            app.listen(config_1.default.PORT, config_1.default.HOST, () => {
                console.log(`my server started on http://${config_1.default.HOST}:${config_1.default.PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
startServer();

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ExceptionsFilter = exports.ExceptionsFilter = class ExceptionsFilter {
    catch(exception, host) {
        console.error(exception);
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            switch (exception.code) {
                case 'P2000': {
                    const status = common_1.HttpStatus.BAD_REQUEST;
                    response.status(status).json({
                        statusCode: status,
                        message: 'Bad Request',
                    });
                    break;
                }
                case 'P2002': {
                    const status = common_1.HttpStatus.CONFLICT;
                    response.status(status).json({
                        statusCode: status,
                        message: 'Conflict',
                    });
                    break;
                }
                case 'P2025': {
                    const status = common_1.HttpStatus.NOT_FOUND;
                    response.status(status).json({
                        statusCode: status,
                        message: 'Not Found',
                    });
                    break;
                }
                default: {
                    const status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                    response.status(status).json({
                        statusCode: status,
                        message: 'Internal Server Error',
                    });
                    break;
                }
            }
        }
        else {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const status = exception.status;
            response.status(status).json({
                message: exception.message,
                error: exception.response.error,
                statusCode: status,
            });
        }
    }
};
exports.ExceptionsFilter = ExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], ExceptionsFilter);
//# sourceMappingURL=exception_filter.js.map
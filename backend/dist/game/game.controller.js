"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let GameController = exports.GameController = class GameController {
    constructor() { }
    async game(req) {
        return "hey";
    }
    async updateGameState(gameState) {
        const io = new socket_io_1.Server({
            cors: {
                origin: "http://localhost:300"
            }
        });
        io.listen(3001);
        console.log('Received game state:', gameState);
        return { message: 'Game state received successfully' };
    }
};
__decorate([
    (0, common_1.Get)('/pong'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "game", null);
__decorate([
    (0, common_1.Post)('updateGameState'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updateGameState", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], GameController);
//# sourceMappingURL=game.controller.js.map
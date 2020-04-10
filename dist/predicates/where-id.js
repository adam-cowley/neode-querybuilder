"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var predicate_1 = __importDefault(require("./predicate"));
var constants_1 = require("../constants");
var WhereId = /** @class */ (function (_super) {
    __extends(WhereId, _super);
    // @ts-ignore
    function WhereId(alias, param, operator, prefix) {
        if (operator === void 0) { operator = constants_1.Operator.EQUALS; }
        if (prefix === void 0) { prefix = constants_1.Prefix.AND; }
        var _this = _super.call(this, alias, param, operator, prefix) || this;
        _this.alias = "id(" + alias + ")";
        _this.param = param;
        _this.operator = operator;
        _this.prefix = prefix;
        return _this;
    }
    return WhereId;
}(predicate_1.default));
exports.default = WhereId;

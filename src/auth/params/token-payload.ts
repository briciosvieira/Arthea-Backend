
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD } from "../params/auth-constants";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const TokenPayloadParam = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=> {
        const context = ctx.switchToHttp()
        const request: Request = context.getRequest()

        return request[REQUEST_TOKEN_PAYLOAD]
    }
)
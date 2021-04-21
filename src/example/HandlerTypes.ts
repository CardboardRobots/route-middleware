import { Handler } from 'sierra';

export type HandlerContext<T> = T extends Handler<infer U> ? U : never;

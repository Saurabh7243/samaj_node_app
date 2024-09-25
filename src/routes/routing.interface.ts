import * as express from "express";

export interface IRouting {
  register(app: express.Application): void;
  prefix: string;
}

// add a registry of the type you expect
export namespace ImportedRoute {
  type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  const implementations: Constructor<IRouting>[] = [];
  export function GetImplementations(): Constructor<IRouting>[] {
    return implementations;
  }
  export function register<T extends Constructor<IRouting>>(ctor: T) {
    implementations.push(ctor);
    return ctor;
  }
}
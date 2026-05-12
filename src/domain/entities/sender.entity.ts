import { Document } from "../value-objects/document";

export class Sender {
  constructor(
    readonly document: Document,
    readonly fullName: string,
    readonly phone: string,
  ) {}
}

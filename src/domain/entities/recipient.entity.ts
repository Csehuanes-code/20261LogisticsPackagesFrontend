import { Document } from "../value-objects/document";

export class Recipient {
  constructor(
    readonly document: Document,
    readonly fullName: string,
    readonly phone: string,
    readonly email: string,
    readonly address: string,
  ) {}
}

import { DocumentType } from "../enums/document-type.enum";

export class Document {
  private constructor(
    readonly type: DocumentType,
    readonly number: string,
  ) {}

  static create(type: DocumentType, number: string): Document {
    if (!number.trim()) {
      throw new Error("Document number is required");
    }
    return new Document(type, number);
  }
}

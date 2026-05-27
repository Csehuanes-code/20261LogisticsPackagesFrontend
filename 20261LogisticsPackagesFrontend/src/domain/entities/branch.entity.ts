import { BranchType } from "../enums/branch-type.enum";

export class Branch {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly type: BranchType,
  ) {}
}

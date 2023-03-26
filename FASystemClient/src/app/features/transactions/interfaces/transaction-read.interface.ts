export interface TransactionReadInterface {
  readonly id: number,
  readonly amount: number,
  readonly description: string,
  readonly typeId: number,
  readonly categoryId: number,
  readonly accountId: number,
  readonly categoryName: string,
  readonly typeName: string,
  readonly accountName: string
}

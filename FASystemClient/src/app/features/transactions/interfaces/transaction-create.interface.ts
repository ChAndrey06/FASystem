export interface TransactionCreateInterface {
  readonly typeId: number | null,
  readonly amount: number | null,
  readonly description: string | null,
  readonly categoryId: number | null,
  readonly categoryName: string | null
  readonly accountId: number | null
}
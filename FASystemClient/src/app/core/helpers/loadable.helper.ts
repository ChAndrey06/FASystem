export class Loadable<DataType> {
  private _data: DataType;
  private _error: any;
  isLoading: boolean = false;

  constructor(data: DataType, isLoading: boolean) {
    this._data = data;
    this.isLoading = isLoading
  }

  public get data() {
    return this._data;
  }

  public get error() {
    return this._error;
  }

  setData(data: DataType): void {
    this._data = data;
    this.isLoading = false;
  }

  setError(error: any): void {
    this.isLoading = false;
    this._error = error;
    console.log(error);
  }
}
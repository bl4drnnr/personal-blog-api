export class UserTokensDto {
  readonly _at: string;
  readonly _rt: string;

  constructor({ _at, _rt }: { _at: string; _rt: string }) {
    this._at = _at;
    this._rt = _rt;
  }
}

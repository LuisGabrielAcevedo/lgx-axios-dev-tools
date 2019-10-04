import { LgxQueryParam } from "../query/lgx-query-param";
import { ILgxQueryConfig } from "../interfaces/lgx-query-config";

export class LgxPagination {
  public page: number | null;
  protected perPage: number;
  protected queryParams: LgxQueryParam[];

  constructor() {
    this.page = null;
    this.perPage = 10;
    this.queryParams = [];
  }

  public getPaginationParameters(
    queryConfig: ILgxQueryConfig
  ): LgxQueryParam[] {
    this.queryParams.push(
      new LgxQueryParam(queryConfig["page"] || "page", this.page)
    );
    this.queryParams.push(
      new LgxQueryParam(queryConfig["per_page"] || "per_page", this.perPage)
    );
    return this.queryParams;
  }

  public setPage(value: number) {
    this.page = value;
  }

  public setPerPage(value: number) {
    this.perPage = value;
  }
}

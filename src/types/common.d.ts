interface PaginationQueryBase {
  pageNum?: number;
  pageSize?: number;
}

interface PaginationBase<T> {
  current: number;
  pages: number;
  size: number;
  total: number;
  records: T[];
}

interface Rules {
  code: string | null;
  operator: string | null;
  value: string | number | null;
  id?: number | string;
  setCode?: string;
  type?: string;
}

interface DataStructure {
  condition?: string;
  queryGroups?: DataStructure[];
  queryItems?: Array<Rules>;
  id?: number;
  orgQuery?: {
    condition: string;
    queryItems: Array<{
      operator: string;
      orgId: number | string;
      orgType: string;
    }>;
  };
}

interface IdQuery {
  id?: string | number;
}

interface ImageFileItem {
  url: string;
  status: "finished";
  [key: string]: any;
}

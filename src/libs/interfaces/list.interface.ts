export interface IList {
  type: 'list-numeric' | 'list-bullet';
  items: Array<any>;
  style: string;
}

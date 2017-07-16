export interface IGameAttribute {
  id: string;
  name?: string;
}

export interface IGame {
  id: string;
  name: string;
  groupTitle: string;
  aliases: string[];
  attributes: Array<string | IGameAttribute>;
}

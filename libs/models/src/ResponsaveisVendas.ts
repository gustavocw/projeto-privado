import {jsonModel, jsonNumber, jsonString} from '@alkord/json/decorators';

@jsonModel
export default class ResponsaveisVendas {
  @jsonString
  NOME: string;

  @jsonNumber
  CODIGO: number;
}

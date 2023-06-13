import {jsonClass, jsonModel, jsonNumber, jsonString} from '@alkord/json/decorators';
import RelacionamentoTipo from './RelacionamentoTipo';
import {observable} from 'mobx';

@jsonModel
export default class Relacionamento {
  @observable
  @jsonNumber
  CODIGO: number;
  @observable
  @jsonString
  NOME: string;
  @observable
  @jsonClass(() => RelacionamentoTipo)
  TIPO: RelacionamentoTipo;
}

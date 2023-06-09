import BaseService from '../api/BaseService';
import {SelectParametros} from '@alkord/models/SelectParametros';
import RetornoRegistros from '@alkord/models/RetornoRegistros';
import ResponsaveisVendas from '@alkord/models/ResponsaveisVendas';

export default class ResponsaveisVendasServices extends BaseService {
  async get(parametros: SelectParametros): Promise<RetornoRegistros<ResponsaveisVendas>> {
    return this.http.get('responsaveis-vendas', ResponsaveisVendas, SelectParametros.toRest(parametros));
  }
}

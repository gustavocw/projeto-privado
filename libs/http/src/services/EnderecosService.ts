import BaseService from '../api/BaseService';
import RetornoRegistros from '@alkord/models/RetornoRegistros';
import Estado from '@alkord/models/Estado';
import Pais from '@alkord/models/Pais';
import {SelectParametros} from '@alkord/models/SelectParametros';
import Cidade from '@alkord/models/Cidade';

export default class EnderecosService extends BaseService {
  getPaises(): Promise<RetornoRegistros<Pais>> {
    return this.http.get('alkord-geral-paises', Pais, {ordenacoes: 'NOME'});
  }

  getEstados(codigoPais?: number): Promise<RetornoRegistros<Estado>> {
    return this.http.get('alkord-geral-estados', Estado, {
      filtros: `PAIS:IGUAL:${codigoPais ?? 1}`,
      ordenacoes: 'NOME',
    });
  }

  getCidades(selectParametros: SelectParametros): Promise<RetornoRegistros<Cidade>> {
    return this.http.get('alkord-geral-cidades', Cidade, SelectParametros.toRest(selectParametros));
  }
}

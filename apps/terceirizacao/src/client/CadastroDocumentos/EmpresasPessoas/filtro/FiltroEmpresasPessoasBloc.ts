import {action, observable} from 'mobx';
import FiltroEmpresasPessoas from './FiltroEmpresasPessoas';
import Services from '@alkord/http/Services';
import EnderecosService from '@alkord/http/services/EnderecosService';
import Estado from '@alkord/models/Estado';

export default class FiltroVeiculosReboquesBloc {
  @observable filtro: FiltroEmpresasPessoas = new FiltroEmpresasPessoas();
  @observable erros: { [key: string]: string } = {};
  @observable listaEstados: Estado[] = [];
  private enderecosService: EnderecosService = Services.get().enderecosService;

  @action.bound
  async buscarEstados() {
    this.listaEstados = (await this.enderecosService.getEstados()).REGISTROS;
  }

  @action.bound
  limpar() {
    this.filtro = new FiltroEmpresasPessoas();
    this.erros = {};
  }
}

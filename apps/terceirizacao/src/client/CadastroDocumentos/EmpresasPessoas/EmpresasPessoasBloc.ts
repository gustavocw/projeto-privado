import {action, computed, observable} from 'mobx';
import BaseBloc from '@alkord/shared/bloc/BaseBloc';
import Services from '@alkord/http/Services';
import NameToken from '../../../modules/NameToken';
import EventBus from '@alkord/shared/utils/EventBus';
import {debounce} from '@material-ui/core';
import FiltroEmpresasPessoas from './filtro/FiltroEmpresasPessoas';
import ResponsaveisVendas from '@alkord/models/ResponsaveisVendas';

export default class EmpresasPessoasBloc extends BaseBloc {
  @observable filtro: FiltroEmpresasPessoas = new FiltroEmpresasPessoas();
  @observable responsaveisVendas: ResponsaveisVendas[] = [];
  @observable registros: ResponsaveisVendas[] = [];
  @observable isCarregando: boolean = false;
  @observable private totalRegistros: number = 1;
  private atualizarResponsaveisVendasDebounce = debounce(async () => await this.buscarTodosRegistros(), 500);

  @action.bound
  async buscarTodosRegistros(): Promise<void> {
    this.registros = [];
    this.totalRegistros = 0;

    await this.buscarMaisRegistros();
  }

  @action.bound
  async buscarMaisRegistros(): Promise<void> {
    this.registros = [...this.registros, ...(await this.buscarRegistros())];
  }

  @action.bound
  private async buscarRegistros() {
    try {
      this.isCarregando = true;

      const response = await Services.get().responsaveisVendasService.get({});
      console.log(response);
      this.totalRegistros = response.TOTAL_REGISTROS;

      return this.responsaveisVendas = response.REGISTROS;
    }
    catch (e) {
      this.viewHandler.exibirMensagem(null, e.message);
      return [];
    }
    finally {
      this.isCarregando = false;
    }
  }

  @action.bound
  cadastrarRegistro(): void {
    this.viewHandler.navegarParaPagina(NameToken.CADASTRO_EMPRESAS_E_PESSOAS, false, {});
  }

  @action.bound
  editarRegistro(registro: ResponsaveisVendas): void {
    this.viewHandler.navegarParaPagina(NameToken.CADASTRO_EMPRESAS_E_PESSOAS, false, {codigo: registro.CODIGO});
  }

  @action.bound
  async removerRegistro(registro: ResponsaveisVendas): Promise<void> {
    this.viewHandler.exibirConfirmacao(
        'Atenção',
        'Tem certeza que deseja excluir o registro?',
        {name: 'Excluir registro', onClick: () => this.executarRemocaoRegistro(registro)},
    );
  }

  @action.bound
  private async executarRemocaoRegistro(registro: ResponsaveisVendas): Promise<void> {
    console.log(registro);
    try {
      // await Services.get().transporteService.editarTipoResponsaveisVendas(
      //     registro.CODIGO,
      //     Object.assign(new ResponsaveisVendas(), {
      //       EXCLUIDO: true,
      //     } as ResponsaveisVendas),
      // );

      // this.buscarTodosRegistros();
    }
    catch (e) {
      this.viewHandler.exibirMensagem(null, e.message);
    }
  }

  @action.bound
  async atualizarFiltro(filtro: FiltroEmpresasPessoas) {
    this.filtro = filtro;
    return this.buscarTodosRegistros();
  }

  @action.bound
  alterarTextoPesquisa() {
    this.atualizarResponsaveisVendasDebounce();
  }

  @action.bound
  protected onBind(): void {
    this.buscarTodosRegistros();
  }

  @action.bound
  protected onReveal(): void {
    if (EventBus.get().removeSticky('recarregar')) {
      this.buscarTodosRegistros();
    }
  }

  @computed
  get podeBuscarMaisRegistros(): boolean {
    return this.responsaveisVendas.length < this.totalRegistros;
  }
}

// import React from 'react';
import {action, computed, IReactionDisposer, observable, reaction} from 'mobx';
import BaseBloc from '@alkord/shared/bloc/BaseBloc';
import TipoPermissao from '@alkord/shared/modules/TipoPermissao.enum';
import GlobalHandlers from '@alkord/models/handlers/GlobalHandlers';
import Pessoa from '@alkord/models/Pessoa';
import Estado from '@alkord/models/Estado';
import NameToken from '../../../../modules/NameToken';
import Services from '@alkord/http/Services';
import EventBus from '@alkord/shared/utils/EventBus';
import * as yup from 'yup';
// import PessoaTipo from '@alkord/models/enum/PessoaTipo';
import Pais from '@alkord/models/Pais';

export default class CadastroEmpresasPessoasBloc extends BaseBloc {
  @observable codigoRegistro?: number;
  @observable registro: Pessoa = new Pessoa();
  @observable estados: Array<Estado> = [];
  @observable retornaEstado: string;
  @observable tipoDeCarroceria: number | string;
  @observable erros: { [key: string]: string } = {};
  @observable visibilidadeCampos: { [key in Paths<Pessoa>]?: boolean } = {};
  @observable paises: Pais[] = [];
  @observable paisEscolhido: Pais;

  @observable private itensCarregando: number = 0;
  private reactions: IReactionDisposer[] = null;

  @action.bound
  private limparReactions(): void {
    this.reactions?.map((reaction) => reaction());
  }

  @action.bound
  async buscarPaises(): Promise<void> {
    try {
      this.itensCarregando++;

      const {REGISTROS} = await Services.get().enderecosService.getPaises();

      this.paises = REGISTROS;
    }
    catch (e) {
      this.viewHandler.exibirMensagem(null, e.message);
    }
    finally {
      this.itensCarregando--;
    }
  }

  @action.bound
  private async buscarCargaInicial(): Promise<void> {
    try {
      this.itensCarregando++;

      const response = await Services.get().pessoasService.get({
        colunas: 'CODIGO,NOME,APELIDO,DOCUMENTO,DOCUMENTO2,' +
        'TIPO_PESSOA,NACIONALIDADE,COMERCIAL_VENDA,TELEFONES,EMAILS, VENDEDOR,NASCIMENTO_CONSTITUICAO,REGIAO,' +
        'FISCAL,ENDERECOS,RAMOS_ATIVIDADE,RELACIONAMENTOS',
        ordenacao: 'CODIGO',
        filtros: `CODIGO:IGUAL${this.codigoRegistro}`,
        registroInicial: 0,
        numeroRegistros: 1,
      });

      this.registro = response.REGISTROS[0];
    }
    catch (e) {
      this.viewHandler.exibirMensagem(null, e.message);
    }
    finally {
      this.itensCarregando--;
    }
  }

  @action.bound
  protected async onReveal(lastPath: string | null, query: URLSearchParams): Promise<void> {
    this.limparReactions();

    this.codigoRegistro = !!query.get('codigo') ?
      parseInt(query.get('codigo')) :
      null;
    this.registro = new Pessoa();

    if (this.codigoRegistro) {
      await this.buscarCargaInicial();
    }

    this.inicializarReactions();
  }

  @action.bound
  private inicializarReactions(): void {
    this.reactions = [
      reaction(() => this.registro?.APELIDO, this.atualizarVisibilidadeCampos),
      reaction(
          () => [
            this.registro?.APELIDO,
            this.registro?.DOCUMENTO,
            this.registro?.CODIGO,
          ],
          () => this.calcularVolume(),
      ),
    ];
  }

  @action.bound
  private atualizarVisibilidadeCampos(): void {
    this.visibilidadeCampos = {};
  }

  @action.bound
  protected onDestroy(): void {
    this.limparReactions();
  }

  @action.bound
  private async validar(): Promise<boolean> {
    const formHandler = yup.object().shape({
      TIPO: yup.number().nullable().required(),
      PLACA: yup.string().nullable().required(),
      LOCALIZACAO: yup.object().shape({
        NOME: yup.string().nullable().required(),
      }),
      ESTADO: yup.object().nullable().required(),
      TIPO_CARROCERIA: yup.string().nullable().required(),
      TIPO_RODADO: yup.string().nullable(),
      RENAVAM: yup.string().nullable(),
      CODIGO_INTERNO: yup.number().nullable(),
      RNTRC: yup.number().nullable(),
      CAPACIDADE_VOLUME: yup.number().nullable(),
      CAPACIDADE_PESO: yup.number().nullable(),
      CAPACIDADE_ALTURA: yup.number().nullable(),
      CAPACIDADE_LARGURA: yup.number().nullable(),
      CAPACIDADE_PROFUNDIDADE: yup.number().nullable(),
      TARA: yup.number().nullable(),
    });

    try {
      await formHandler.validate(this.registro);
    }
    catch (erro) {
      this.erros[erro.path] = erro.message;
      return false;
    }

    return true;
  }

  @action.bound
  async salvar(): Promise<void> {
    if (!(await this.validar())) return;

    try {
      this.itensCarregando++;

      if (this.isCadastro) {
        // await Services.get().transporteService.cadastrarTipoPessoa(this.registro);
      }
      else {
        // await Services.get().transporteService.editarTipoPessoa(this.codigoRegistro, this.registro);
      }

      EventBus.get().postSticky('recarregar', true);
      this.viewHandler.navegarParaPagina(NameToken.EMPRESAS_E_PESSOAS, true);
    }
    catch (e) {
      this.viewHandler.exibirMensagem(null, e.message);
    }
    finally {
      this.itensCarregando--;
    }
  }

  @computed
  get isCarregando(): boolean {
    return this.itensCarregando > 0;
  }

  @computed
  get isCadastro(): boolean {
    return !this.codigoRegistro;
  }

  @computed
  get podeSalvar(): boolean {
    return (
      !this.isCarregando &&
      (this.isCadastro ? this.isCadastroHabilitado : this.isEdicaoHabilitada)
    );
  }

  @computed
  get isCadastroHabilitado(): boolean {
    return GlobalHandlers.gerenciadorPermissoes.isPermissaoHabilitada(
        NameToken.CADASTRO_EMPRESAS_E_PESSOAS,
        TipoPermissao.CADASTRAR,
    );
  }

  @computed
  get isEdicaoHabilitada(): boolean {
    return GlobalHandlers.gerenciadorPermissoes.isPermissaoHabilitada(
        NameToken.CADASTRO_EMPRESAS_E_PESSOAS,
        TipoPermissao.EDITAR,
    );
  }

  @action.bound
  private calcularVolume() {
    // if (!this.registro?.CAPACIDADE_ALTURA ||
    //   !this.registro?.CAPACIDADE_LARGURA ||
    //   !this.registro?.CAPACIDADE_PROFUNDIDADE) {
    //   return;
    // }

    // this.registro.CAPACIDADE_VOLUME = (this.registro.CAPACIDADE_ALTURA *
    //   this.registro.CAPACIDADE_LARGURA *
    // this.registro?.CAPACIDADE_PROFUNDIDADE);
  }
}

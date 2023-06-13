import {
  jsonArray,
  jsonClass,
  jsonConvertStringToBoolean,
  jsonDateFormat,
  jsonEnum,
  jsonModel,
  jsonNumber,
  jsonString,
} from '@alkord/json/decorators';
import {computed, observable} from 'mobx';
import PessoaEndereco from './PessoaEndereco';
import PessoaTipo from './enum/PessoaTipo';
import PessoaNacionalidade from './enum/PessoaNacionalidade';
import PessoaComercialVenda from './PessoaComercialVenda';
import PessoaTelefone from './PessoaTelefone';
import PessoaEmail from './PessoaEmail';
import PessoaRelacionamento from './PessoaRelacionamento';
import PessoaFiscal from './PessoaFiscal';
import RegiaoVenda from './RegiaoVenda';
import PessoaVendedor from './PessoaVendedor';
import PessoaRamoAtividade from './PessoaRamoAtividade';
import PessoaRh from './PessoaRh';
import hasSuggestion from '@alkord/shared/components/hasSuggestion';

@jsonModel
@hasSuggestion('numeric')
export default class Pessoa {
  @jsonNumber
  @observable
  CODIGO: number;
  @jsonString
  @observable
  NOME: string;
  @jsonString
  @observable
  APELIDO?: string;
  @observable
  @jsonString
  DOCUMENTO?: string;
  @observable
  @jsonString
  DOCUMENTO2?: string;
  @observable
  @jsonEnum(PessoaTipo)
  TIPO_PESSOA: PessoaTipo;
  @observable
  @jsonEnum(PessoaNacionalidade)
  NACIONALIDADE: PessoaNacionalidade;
  @observable
  @jsonClass(() => PessoaComercialVenda)
  COMERCIAL_VENDA?: PessoaComercialVenda;
  @observable
  @jsonArray(() => PessoaTelefone)
  TELEFONES?: PessoaTelefone[];
  @observable
  @jsonArray(() => PessoaEmail)
  EMAILS?: PessoaEmail[];
  @observable@jsonArray(() => PessoaRelacionamento)
  RELACIONAMENTOS?: PessoaRelacionamento[];
  @observable@jsonArray(() => PessoaRamoAtividade)
  RAMOS_ATIVIDADE?: PessoaRamoAtividade[];
  @observable@jsonArray(() => PessoaEndereco)
  ENDERECOS: PessoaEndereco[];
  @observable@jsonClass(() => PessoaFiscal)
  FISCAL?: PessoaFiscal;
  @observable@jsonClass(() => RegiaoVenda)
  REGIAO: RegiaoVenda;
  @observable@jsonDateFormat('date')
  NASCIMENTO_CONSTITUICAO: Date;
  @observable@jsonClass(() => PessoaVendedor)
  VENDEDOR: PessoaVendedor;
  @observable@jsonClass(() => PessoaRh)
  RH?: PessoaRh;
  @observable
  @jsonConvertStringToBoolean
  EXCLUIDO?: boolean;

  @computed
  get nomeExibicao(): string {
    return this.APELIDO ?? this.NOME;
  }

  @computed
  get nomeExibicaoCompleto(): string {
    const nome = this.NOME;
    const apelido = this.APELIDO;

    if (nome && apelido) {
      if (nome === apelido) {
        return nome;
      }
      else {
        return `${nome} (${apelido})`;
      }
    }
    else if (nome) {
      return nome;
    }
  }

  @computed
  get enderecoPrincipal(): PessoaEndereco | null {
    if (this.ENDERECOS?.length) {
      for (const endereco of this.ENDERECOS) {
        if (endereco.PRINCIPAL) {
          return endereco;
        }
      }

      return this.ENDERECOS[0];
    }

    return null;
  }

  @computed
  get telefonePrincipal(): PessoaTelefone | null {
    if (this.TELEFONES?.length) {
      for (const telefone of this.TELEFONES) {
        if (telefone.PRINCIPAL) {
          return telefone;
        }
      }

      return this.TELEFONES[0];
    }

    return null;
  }

  @computed
  get emailPrincipal(): PessoaEmail | null {
    if (this.EMAILS?.length) {
      for (const email of this.EMAILS) {
        if (email.PRINCIPAL) {
          return email;
        }
      }

      return this.EMAILS[0];
    }

    return null;
  }
}

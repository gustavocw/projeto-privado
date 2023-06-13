import React, {useEffect} from 'react';
import ViewProps from '@alkord/shared/types/ViewProps';
import {bindView} from '@alkord/components/ViewBinder';
import useBaseViewHandler from '@alkord/shared/bloc/UseBaseViewHandler';
import ViewContent from '@alkord/components/ViewContent';
import AppBar from '@alkord/components/AppBar';
import PessoaTipo from '@alkord/models/enum/PessoaTipo';
import {Button, Grid, TextField} from '@material-ui/core';
import BarraAcoes from '@alkord/components/BarraAcoes';
import CadastroEmpresasPessoasBloc from './CadastroEmpresasPessoasBloc';
import Formulario from '@alkord/components/Formulario';
import CardForm from '@alkord/components/CardForm';
import CampoFormulario from '@alkord/components/CampoFormulario';
import ValueAdapter from '@alkord/components/adapters/ValueAdapter';
import Select from '@alkord/components/form/Select';
import NameToken from '../../../../modules/NameToken';
import Pais from '@alkord/models/Pais';
import Pessoa from '@alkord/models/Pessoa';
import RelacionamentoTipo from '@alkord/models/RelacionamentoTipo';
import Relacionamento from '@alkord/models/Relacionamento';

type Props = ViewProps<CadastroEmpresasPessoasBloc>;

const CadastroEmpresasPessoasView: React.FC<Props> = (props: Props) => {
  const {bloc} = props;
  const {registro} = bloc;
  const viewHandler = useBaseViewHandler(bloc);

  useEffect(() => {
    bloc.buscarPaises();
  }, [bloc]);

  return (
    <>
      <AppBar
        title={bloc.codigoRegistro == null ? 'Dados da pessoa' : `Editar dados da pessoa`}
        onVoltarClick={() => viewHandler.navegarParaPagina(NameToken.VEICULOS_REBOQUES, true)}
      />
      <ViewContent>
        <Formulario<Pessoa>
          objeto={registro}
          erros={bloc.erros}
          disabled={!bloc.isEdicaoHabilitada}
          visibilidade={bloc.visibilidadeCampos}
        >
          <CardForm>
            <Grid container>
              {/* PRIMEIRA_LINHA_DE_CAMPOS */}
              <Grid container item md={12}>
                <Grid item md={3} sm={3} xs={3}>
                  <CampoFormulario propriedade="TIPO_PESSOA" adapter={ValueAdapter}>
                    <Select<PessoaTipo>
                      required
                      label="Tipo"
                      registros={PessoaTipo.values()}
                      keyHandler={(registro) => registro}
                      descriptionHandler={(registro) => PessoaTipo.getTipoPessoa(registro)}
                    />
                  </CampoFormulario>
                </Grid>

                <Grid item md={3} sm={3} xs={3}>
                  <CampoFormulario propriedade="CODIGO" adapter={ValueAdapter}>
                    <Select<Pais>
                      required
                      label="País de origem"
                      registros={bloc.paises}
                      keyHandler={(registro) => registro.CODIGO + ''}
                      descriptionHandler={(registro) => registro.NOME}
                    />
                  </CampoFormulario>
                </Grid>

                <Grid item md={3} sm={3} xs={3}>
                  <CampoFormulario propriedade="CNPJ" adapter={ValueAdapter}>
                    <TextField label="CNPJ" required />
                  </CampoFormulario>
                </Grid>
              </Grid>

              {/* SEGUNDA_LINHA_DE_CAMPOS */}
              <Grid item md={5.5} sm={6} xs={12}>
                <Grid item md={12} sm={6} xs={12}>
                  <CampoFormulario propriedade="RAZAO_SOCIAL" adapter={ValueAdapter}>
                    <TextField label="Razão social" required />
                  </CampoFormulario>
                </Grid>
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <CampoFormulario propriedade="NOME_FANTASIA" adapter={ValueAdapter}>
                  <TextField label="Nome fantasia" required />
                </CampoFormulario>
              </Grid>
            </Grid>

            {/* FALTA_OPÇÕES_DO_SELECT_DE_RELACIONAMENTOS */}
            <Grid item md={6} sm={6} xs={12}>
              <CampoFormulario propriedade="RELACIONAMENTOS" adapter={ValueAdapter}>
                <Select<RelacionamentoTipo>
                  required
                  label="Relacionamentos"
                  registros={[]}
                  keyHandler={() => Relacionamento + ''}
                  descriptionHandler={() => ''}
                />
              </CampoFormulario>
            </Grid>

            {/* TEXT_AREA_DE_OBSERVAÇÕES (NÃO_ACHEI_AINDA_O_CAMPO_DE_MÁXIMO_DE_CARACTÉRES) */}
            <Grid item md={12} sm={6} xs={12}>
              <CampoFormulario propriedade="OBSERVACOES" adapter={ValueAdapter}>
                <TextField label="Observações" required fullWidth />
              </CampoFormulario>
            </Grid>
          </CardForm>
        </Formulario>
        {bloc.podeSalvar && (
          <BarraAcoes sempreVisivel>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={bloc.salvar}
            >
              SALVAR
            </Button>
          </BarraAcoes>
        )}
      </ViewContent>
    </>
  );
};

export default bindView(CadastroEmpresasPessoasView, CadastroEmpresasPessoasBloc);

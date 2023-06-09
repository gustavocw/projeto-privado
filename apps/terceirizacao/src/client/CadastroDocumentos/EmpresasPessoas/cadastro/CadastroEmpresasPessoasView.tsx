import React, {ChangeEvent, useEffect} from 'react';
import ViewProps from '@alkord/shared/types/ViewProps';
import {bindView} from '@alkord/components/ViewBinder';
import useBaseViewHandler from '@alkord/shared/bloc/UseBaseViewHandler';
import ViewContent from '@alkord/components/ViewContent';
import AppBar from '@alkord/components/AppBar';
import PessoaTipo from '@alkord/models/enum/PessoaTipo';
import {Button, Grid} from '@material-ui/core';
import BarraAcoes from '@alkord/components/BarraAcoes';
import CadastroEmpresasPessoasBloc from './CadastroEmpresasPessoasBloc';
import Formulario from '@alkord/components/Formulario';
import CardForm from '@alkord/components/CardForm';
import CampoFormulario from '@alkord/components/CampoFormulario';
import ValueAdapter from '@alkord/components/adapters/ValueAdapter';
import Select from '@alkord/components/form/Select';
import NameToken from '../../../../modules/NameToken';
import Veiculo from '@alkord/models/Veiculo';
// import Localizacao from '@alkord/models/Localizacao';
import Pais from '@alkord/models/Pais';

type Props = ViewProps<CadastroEmpresasPessoasBloc>;

const CadastroEmpresasPessoasView: React.FC<Props> = (props: Props) => {
  const {bloc} = props;
  const {registro} = bloc;
  const viewHandler = useBaseViewHandler(bloc);

  useEffect(() => {
    bloc.buscarPaises();
    // bloc.buscarEstados();
  }, [bloc]);

  return (
    <>
      <AppBar
        title={bloc.codigoRegistro == null ? 'Dados da pessoa' : `Editar dados da pessoa`}
        onVoltarClick={() => viewHandler.navegarParaPagina(NameToken.VEICULOS_REBOQUES, true)}
      />
      <ViewContent>
        <Formulario<Veiculo>
          objeto={registro}
          erros={bloc.erros}
          disabled={!bloc.isEdicaoHabilitada}
          visibilidade={bloc.visibilidadeCampos}
        >
          <CardForm>
            <Grid container>
              <Grid item md={6} sm={6} xs={12}>
                <CampoFormulario propriedade="TIPO" adapter={ValueAdapter}>
                  <Select<PessoaTipo>
                    required
                    onClick={(e: ChangeEvent<any>) => alert(e.target.value)}
                    label="Tipo de pessoa"
                    registros={PessoaTipo.values()}
                    keyHandler={(registro) => registro.toString()}
                    descriptionHandler={(registro) => registro}
                  />
                </CampoFormulario>
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <CampoFormulario propriedade="CODIGO" adapter={ValueAdapter}>
                  <Select<Pais>
                    required
                    label="País de origem"
                    onClick={(e: ChangeEvent<any>) => bloc.buscarEstadoPorPais(e)}
                    registros={bloc.paises}
                    keyHandler={(registro) => registro.CODIGO + ''}
                    descriptionHandler={(registro) => registro.NOME}
                  />
                </CampoFormulario>
              </Grid>
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

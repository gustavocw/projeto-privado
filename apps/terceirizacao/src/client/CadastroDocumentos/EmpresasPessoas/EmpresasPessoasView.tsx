import React, { useEffect } from 'react';
import ViewProps from '@alkord/shared/types/ViewProps';
import {bindView} from '@alkord/components/ViewBinder';
import useBaseViewHandler from '@alkord/shared/bloc/UseBaseViewHandler';
import ViewContent from '@alkord/components/ViewContent';
import AppBar from '@alkord/components/AppBar';
import CardRegistros from '@alkord/components/CardRegistros';
import ListaRegistros from '@alkord/components/ListaRegistros';
import Text from '@alkord/components/Text';
import SearchBar from '@alkord/components/SearchBar';
import {DeleteOutline} from '@material-ui/icons';
import {Button} from '@material-ui/core';
import BarraAcoes from '@alkord/components/BarraAcoes';
import EmpresasPessoasBloc from './EmpresasPessoasBloc';
import FiltroEmpresasPessoasView from './filtro/FiltroEmpresasPessoas.View';
import FiltroEmpresasPessoas from './filtro/FiltroEmpresasPessoas';
import ResponsaveisVendas from '@alkord/models/ResponsaveisVendas';

type ComponentProps = ViewProps<EmpresasPessoasBloc>;

const EmpresasPessoasView: React.FC<ComponentProps> = ({bloc}: ComponentProps) => {
  useBaseViewHandler(bloc);

  useEffect(() => {
    bloc.buscarTodosRegistros();
  }, [bloc]);

  return (
    <>
      <AppBar title="Empresas e pessoas"/>

      <ViewContent>
        <CardRegistros
          titulo={<SearchBar onChange={bloc.alterarTextoPesquisa}/>}
          acoesHeader={<FiltroEmpresasPessoasView
            onFiltrar={(filtros: FiltroEmpresasPessoas) => bloc.atualizarFiltro(filtros)}
          />}
          exibirBuscarRegistros={bloc.podeBuscarMaisRegistros}
          onCarregarMaisRegistros={bloc.buscarMaisRegistros}
          displayDivider
        >
          <ListaRegistros<ResponsaveisVendas>
            registros={bloc.responsaveisVendas}
            onClick={() => alert('clicou na lista de registros')}

            render={(registro) => {
              return (
                <div>
                  <Text style={{fontWeight: '450'}}>
                    informações serão aqui
                  </Text>

                  <Text style={{fontWeight: '400', color: '#6E6E6E'}}>
                    outras infomrações serão aqui
                  </Text>
                </div>
              );
            }}

            acoes={{
              onClick: bloc.removerRegistro,
              condicao: () => true,
              icone: <DeleteOutline color="secondary"/>,
            }}
          />
        </CardRegistros>

        {/* {bloc.isCadastroHabilitado && (
          <BarraAcoes sempreVisivel>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={bloc.cadastrarRegistro}
            >
              ADICIONAR
            </Button>
          </BarraAcoes>
        )} */}
      </ViewContent>
    </>
  );
};

export default bindView(EmpresasPessoasView, EmpresasPessoasBloc);

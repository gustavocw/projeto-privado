import React from 'react';
import VeiculosReboquesBloc from './EmpresasPessoasBloc';
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
import FiltroVeiculosReboquesView from './filtro/FiltroEmpresasPessoas.View';
import FiltroVeiculosReboques from './filtro/FiltroEmpresasPessoas';
import Pessoa from '@alkord/models/Pessoa';

type Props = ViewProps<VeiculosReboquesBloc>;

const VeiculosReboquesView: React.FC<Props> = (props: Props) => {
  const {bloc} = props;

  useBaseViewHandler(bloc);

  return (
    <>
      <AppBar title="Empresas e pessoas"/>
      <ViewContent>
        <CardRegistros
          titulo={(
            <SearchBar onChange={bloc.alterarTextoPesquisa}/>
          )}
          acoesHeader={(
            <FiltroVeiculosReboquesView
              onFiltrar={(filtros: FiltroVeiculosReboques) => bloc.atualizarFiltro(filtros)}
            />
          )}
          exibirBuscarRegistros={bloc.podeBuscarMaisRegistros}
          onCarregarMaisRegistros={bloc.buscarMaisRegistros}
          displayDivider
        >
          <ListaRegistros<Pessoa>
            registros={bloc.pessoas}
            render={(registro) => {
              return (
                <div>
                  <Text style={{fontWeight: '450'}}>{registro.APELIDO ?? 'APELIDO AQUI'}</Text>

                  <Text style={{fontWeight: '400', color: '#6E6E6E'}}>
                    {registro.DOCUMENTO ?? 'CNPJ AQUI'}
                  </Text>
                </div>
              );
            }}
            acoes={{
              onClick: bloc.removerRegistro,
              condicao: () => bloc.isRemocaoHabilitada,
              icone: <DeleteOutline color="secondary"/>,
            }}
          />
        </CardRegistros>
        {bloc.isCadastroHabilitado && (
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
        )}
      </ViewContent>
    </>
  );
};

export default bindView(VeiculosReboquesView, VeiculosReboquesBloc);

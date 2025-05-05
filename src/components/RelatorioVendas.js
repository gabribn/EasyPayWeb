import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVendas } from '../services/api';

const RelatorioVendas = () => {
  const { id } = useParams(); // produtoId
  const [vendas, setVendas] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Requisição apenas uma vez, com todas as vendas
  useEffect(() => {
    if (id) {
      getVendas(id)
        .then((response) => {
          const data = response.data?.$values || [];
          setVendas(data);
        })
        .catch((error) => {
          console.error('Erro ao carregar vendas:', error);
        });
    }
  }, [id]);

  // Filtragem de vendas no frontend considerando os dias inteiros
  const vendasFiltradas = vendas.filter((v) => {
    const dataVenda = new Date(v.dataVenda);

    // Filtro para data de início (inclusivo)
    const inicioOk =
      !dataInicio || dataVenda >= new Date(`${dataInicio}T00:00:00.000Z`);

    // Filtro para data de fim (inclusivo até o final do dia)
    const fimOk =
      !dataFim ||
      dataVenda <= new Date(`${dataFim}T23:59:59.999Z`);

    return inicioOk && fimOk;
  });

  // Agrupamento por dia (YYYY-MM-DD)
  const vendasPorDia = vendasFiltradas.reduce((acc, venda) => {
    const dia = new Date(venda.dataVenda).toISOString().split('T')[0];
    acc[dia] = acc[dia] || { unidades: 0, total: 0 };
    acc[dia].unidades += venda.quantidade;
    acc[dia].total += venda.valorVendido;
    return acc;
  }, {});

  const totalGeral = Object.values(vendasPorDia).reduce(
    (acc, dia) => acc + dia.total,
    0
  );

  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Relatório de Vendas</h2>

      <div style={styles.filtros}>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          style={styles.input}
        />
        <button onClick={limparFiltros} style={styles.botaoLimpar}>
          Limpar Filtros
        </button>
      </div>

      {vendasFiltradas.length > 0 ? (
        <>
          <h3 style={styles.subTitle}>Unidades Vendidas</h3>
          <div style={styles.grafico}>
            {Object.entries(vendasPorDia).map(([dia, info]) => (
              <div key={dia} style={styles.barraContainer}>
                <div
                  style={{
                    ...styles.barra,
                    height: `${info.unidades * 10}px`,
                  }}
                />
                <span>{new Date(dia).getDate()}</span>
              </div>
            ))}
          </div>

          <h3 style={styles.subTitle}>Informações de Vendas</h3>
          <ul style={styles.lista}>
            {Object.entries(vendasPorDia).map(([dia, info]) => (
              <li key={dia}>
                Valor de Venda Total (Dia {new Date(dia).toLocaleDateString()}):{' '}
                <strong style={styles.valor}>R$ {info.total.toFixed(2)}</strong>
              </li>
            ))}
            <li>
              Valor de Venda Total (Somatória):{' '}
              <strong style={styles.valor}>R$ {totalGeral.toFixed(2)}</strong>
            </li>
          </ul>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Nenhuma venda encontrada neste período.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    color: '#333',
  },
  title: {
    color: '#28a745',
    textAlign: 'center',
    marginBottom: '20px',
  },
  filtros: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  botaoLimpar: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  subTitle: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#333',
  },
  grafico: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    alignItems: 'end',
    height: '150px',
    marginBottom: '30px',
  },
  barraContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  barra: {
    width: '30px',
    backgroundColor: '#28a745',
    borderRadius: '4px 4px 0 0',
  },
  lista: {
    listStyle: 'none',
    padding: 0,
  },
  valor: {
    color: '#28a745',
  },
};

export default RelatorioVendas;

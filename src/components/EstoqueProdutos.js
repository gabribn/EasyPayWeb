import React, { useEffect, useState } from 'react';
import { getProdutos, getVendas } from '../services/api';

const EstoqueProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saidas, setSaidas] = useState([]);

  useEffect(() => {
    getProdutos()
      .then((response) => {
        const produtosArray = Array.isArray(response.data)
          ? response.data
          : response.data.$values || [];
        setProdutos(produtosArray);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, []);

  const calcularPorcentagemEstoque = (estoque) => {
    return Math.min((estoque / 100) * 100, 100);
  };

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);

    getVendas(produto.id)
      .then((response) => {
        const vendasArray = Array.isArray(response.data)
          ? response.data
          : response.data.$values || [];
        setSaidas(vendasArray);
      })
      .catch((error) => console.error('Erro ao buscar saídas:', error));
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(null);
    setSaidas([]);
  };

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Estoque de Produtos</h2>

      <div style={styles.grid}>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div
              key={produto.id}
              style={styles.card}
              onClick={() => abrirModal(produto)}
            >
              <div style={styles.topContainer}>
                <img
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  style={styles.image}
                />
                <h3 style={styles.productName}>{produto.nome}</h3>
              </div>

              <div style={styles.estoqueContainer}>
                <span>Estoque: {produto.estoque}</span>
                <div style={styles.progressBarBackground}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${calcularPorcentagemEstoque(produto.estoque)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>

      {isModalOpen && produtoSelecionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button onClick={fecharModal} style={styles.closeButton}>X</button>
            <div style={styles.modalContent}>
              <img
                src={produtoSelecionado.imagemUrl}
                alt={produtoSelecionado.nome}
                style={styles.modalImage}
              />
              <h3>{produtoSelecionado.nome}</h3>
              <div style={styles.estoqueContainer}>
                <span>Estoque: {produtoSelecionado.estoque}</span>
                <div style={styles.progressBarBackground}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${calcularPorcentagemEstoque(produtoSelecionado.estoque)}%`,
                    }}
                  />
                </div>
              </div>

              <div style={styles.registroContainer}>
                <h4>Saídas registradas:</h4>
                <ul style={styles.registroList}>
                  {saidas.length > 0 ? (
                    saidas.map((saida) => (
                      <li key={saida.id} style={styles.registroItem}>
                        <span style={styles.saida}>
                          -{saida.quantidade} unidades
                        </span>
                        <span style={styles.data}>
                          ({formatarData(saida.dataVenda)})
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>Nenhuma saída registrada.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
  },
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  productName: {
    marginLeft: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1,
  },
  estoqueContainer: {
    marginTop: '10px',
    textAlign: 'left',
  },
  progressBarBackground: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    marginTop: '5px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: '5px',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  modalContent: {
    padding: '20px',
  },
  modalImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  registroContainer: {
    marginTop: '20px',
    textAlign: 'left',
    maxHeight: '250px',
    overflowY: 'auto',
  },
  registroList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginTop: '20px',
  },
  registroItem: {
    marginBottom: '15px',
  },
  entrada: {
    color: 'green',
  },
  saida: {
    color: 'red',
  },
  data: {
    color: 'gray',
    fontSize: '12px',
    marginLeft: '10px',
  },
};

export default EstoqueProdutos;

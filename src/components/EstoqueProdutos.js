import React, { useEffect, useState } from 'react';
import { getProdutos } from '../services/api';

const EstoqueProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null); // Para armazenar o produto selecionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a visibilidade do modal

  useEffect(() => {
    getProdutos()
      .then((response) => {
        const produtosArray = Array.isArray(response.data) ? response.data : response.data.$values || [];
        setProdutos(produtosArray);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, []);

  // Função para calcular a porcentagem da barra de estoque
  const calcularPorcentagemEstoque = (estoque) => {
    return Math.min((estoque / 100) * 100, 100); // Limita a 100%
  };

  // Função para abrir o modal e selecionar o produto
  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(null);
  };

  // Função para formatar a data
  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Estoque de Produtos</h2>

      {/* Grid de produtos */}
      <div style={styles.grid}>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div
              key={produto.id}
              style={styles.card}
              onClick={() => abrirModal(produto)} // Abre o modal ao clicar no card
            >
              {/* Imagem e Nome do Produto lado a lado */}
              <div style={styles.topContainer}>
                <img
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  style={styles.image}
                />
                <h3 style={styles.productName}>{produto.nome}</h3>
              </div>

              {/* Barra de estoque */}
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

      {/* Modal */}
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

              {/* Registro de entrada e saída */}
              <div style={styles.registroContainer}>
                <ul style={styles.registroList}>
                  <li style={styles.registroItem}>
                    <span style={styles.entrada}>+1 unidade (Entrada)</span>
                    <span style={styles.data}>({formatarData('2025-05-01')})</span>
                  </li>
                  <li style={styles.registroItem}>
                    <span style={styles.saida}>-2 unidades (Saída)</span>
                    <span style={styles.data}>({formatarData('2025-05-02')})</span>
                  </li>
                  <li style={styles.registroItem}>
                    <span style={styles.entrada}>+3 unidades (Entrada)</span>
                    <span style={styles.data}>({formatarData('2025-05-03')})</span>
                  </li>
                  <li style={styles.registroItem}>
                    <span style={styles.saida}>-1 unidade (Saída)</span>
                    <span style={styles.data}>({formatarData('2025-05-04')})</span>
                  </li>
                  <li style={styles.registroItem}>
                    <span style={styles.entrada}>+5 unidades (Entrada)</span>
                    <span style={styles.data}>({formatarData('2025-05-05')})</span>
                  </li>
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
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 produtos por linha
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer', // Indica que o card é clicável
  },
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinha a imagem e nome lado a lado
    marginBottom: '15px',
  },
  image: {
    width: '50px', // Tamanho fixo da imagem
    height: '50px', // Tamanho fixo da imagem
    objectFit: 'cover',
    borderRadius: '50%', // Deixa a imagem redonda
  },
  productName: {
    marginLeft: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1, // Faz o nome ocupar o espaço restante
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
  // Estilos do modal
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
  },
  registroList: {
    listStyleType: 'disc', // Usando bolinhas para as entradas e saídas
    paddingLeft: '20px',
    marginTop: '20px',
  },
  registroItem: {
    marginBottom: '15px', // Espaçamento entre os itens da lista
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

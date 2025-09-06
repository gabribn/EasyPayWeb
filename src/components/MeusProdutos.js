import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProdutos } from '../services/api';

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProdutos()
      .then((response) => {
        const produtosArray = response.data.$values || [];
        setProdutos(produtosArray);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, []);

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Meus Produtos</h2>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou categoria..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.grid}>
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              style={styles.card}
              onClick={() => navigate(`/editar-produto/${produto.id}`)}
            >
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
                style={styles.image}
              />
              <h3>{produto.nome}</h3>
              <p>
                <strong>R$ {Number(produto.preco).toFixed(2)}</strong>
              </p>
              <p>Categoria: {produto.categoria}</p>
              <p>Estoque: {produto.estoque}</p>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
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
  searchContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '10px',
    width: '50%',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 250px))',
    gap: '20px',
    justifyContent: 'center',
  }
  ,
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  },
  image: {
    width: '100%',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
};

export default MeusProdutos;

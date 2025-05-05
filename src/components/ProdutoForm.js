import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduto, updateProduto } from '../services/api';

const ProdutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    estoque: '',
    imagemUrl: '',
    categoria: '',
  });

  const [quantidade, setQuantidade] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const produtoToSend = {
      ...produto,
      preco: parseFloat(produto.preco),
      estoque: parseInt(produto.estoque, 10),
    };

    const action = id ? updateProduto(id, produtoToSend) : createProduto(produtoToSend);
    action.then(() => navigate('/relatorio-vendas'));
  };

  const handleAddToCart = () => {
    alert(`Adicionado ${quantidade}x "${produto.nome}" ao carrinho!`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Cadastro de Produtos</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Nome do Produto</label>
            <input
              type="text"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
              placeholder="Digite o nome do produto"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Preço</label>
            <input
              type="number"
              name="preco"
              value={produto.preco}
              onChange={handleChange}
              placeholder="Digite o preço"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Estoque</label>
            <input
              type="number"
              name="estoque"
              value={produto.estoque}
              onChange={handleChange}
              placeholder="Digite a quantidade em estoque"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>URL da Imagem</label>
            <input
              type="text"
              name="imagemUrl"
              value={produto.imagemUrl}
              onChange={handleChange}
              placeholder="Cole a URL da imagem"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Categoria</label>
            <select
              name="categoria"
              value={produto.categoria}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Selecione a Categoria</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Alimentos">Alimentos</option>
            </select>
          </div>

          <button type="submit" style={styles.submitButton}>
            Salvar Produto
          </button>
        </form>
      </div>

      {/* Título fora do card */}
      <div style={{ maxWidth: '300px' }}>
        <h3 style={styles.previewTitle}>Prévia no App</h3>

        {/* Card de visualização */}
        <div style={styles.previewCard}>
          {produto.imagemUrl && (
            <img
              src={produto.imagemUrl}
              alt="Preview"
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
            />
          )}
          <p><strong>{produto.nome || 'Nome do produto'}</strong></p>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            R$ {produto.preco ? Number(produto.preco).toFixed(2) : '--'}
          </p>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            style={styles.qtyInput}
          />
          <button onClick={handleAddToCart} style={styles.cartButton}>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '30px',
    padding: '40px',
    flexWrap: 'wrap',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewTitle: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  previewCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  qtyInput: {
    width: '60px',
    padding: '6px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  cartButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ProdutoForm;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProdutoId, updateProduto, deleteProduto } from '../services/api';

const EditarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    estoque: '',
    imagemUrl: '',
    categoria: '',
  });

  useEffect(() => {
    getProdutoId(id)
      .then((res) => {
        const data = res.data.$values ? res.data.$values[0] : res.data;
        setProduto(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar produto:', err);
        alert('Erro ao carregar produto.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    const produtoAtualizado = {
      ...produto,
      preco: parseFloat(produto.preco),
      estoque: parseInt(produto.estoque, 10),
    };

    updateProduto(id, produtoAtualizado)
      .then(() => {
        alert('Produto atualizado com sucesso!');
        navigate('/meus-produtos');
      })
      .catch((err) => {
        console.error('Erro ao atualizar produto:', err);
        alert('Erro ao salvar produto.');
      });
  };

  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduto(id)
        .then(() => {
          alert('Produto excluído com sucesso!');
          navigate('/meus-produtos');
        })
        .catch((err) => {
          console.error('Erro ao excluir produto:', err);
          alert('Erro ao excluir produto.');
        });
    }
  };

  const handleRelatorioVendas = (e) => {
    e.preventDefault(); // Impede que o envio do formulário seja acionado
    navigate(`/relatorio-vendas/${produto.nome}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Editar Produto</h2>
        <form onSubmit={handleSalvar} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
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
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Imagem (URL)</label>
            <input
              type="text"
              name="imagemUrl"
              value={produto.imagemUrl}
              onChange={handleChange}
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
              <option value="">Selecione</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Petiscos">Petiscos</option>
              <option value="Salgados">Salgados</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={styles.saveButton}>Salvar</button>
            <button type="button" onClick={handleExcluir} style={styles.deleteButton}>
              Excluir
            </button>
          </div>

          {/* Botão Relatório de Vendas abaixo dos botões Salvar e Excluir */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={handleRelatorioVendas} style={styles.relatorioButton}>
              Relatório de Vendas
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div style={{ maxWidth: '300px' }}>
        <h3 style={styles.previewTitle}>Prévia</h3>
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
          <p>{produto.categoria}</p>
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
  saveButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#dc3545',
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
  relatorioButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EditarProduto;

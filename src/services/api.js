import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5107/api', 
});

export const getProdutos = () => api.get('/produto');
export const getProdutoId = (id) => api.get(`/produto/${id}`);
export const createProduto = (produto) => api.post('/produto', produto);
export const updateProduto = (id, produto) => api.put(`/produto/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/produto/${id}`);
export const getVendas = (id, params = {}) => api.get(`/vendas/produto/${id}`); 

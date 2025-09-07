import axios from "axios";

const api = axios.create({
  baseURL: "https://e310bb17aa03.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

export const getProdutos = () => api.get("/produto");
export const getProdutoId = (id) => api.get(`/produto/${id}`);
export const createProduto = (produto) => api.post("/produto", produto);
export const updateProduto = (id, produto) =>
  api.put(`/produto/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/produto/${id}`);
export const getVendas = (id, params = {}) => api.get(`/vendas/produto/${id}`);

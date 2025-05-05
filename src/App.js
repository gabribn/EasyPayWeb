import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProdutoForm from './components/ProdutoForm';
import RelatorioVendas from './components/RelatorioVendas';
import MeusProdutos from './components/MeusProdutos';
import EditarProduto from './components/EditarProduto';
import EstoqueProdutos from './components/EstoqueProdutos';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        {/* Menu de Navegação */}
        <nav>
          <ul>
            <li>
              <Link to="/produto">Adicionar Produto</Link>
            </li>
            <li>
              <Link to="/meus-produtos">Meus Produtos</Link>
            </li>
            <li>
              <Link to="/EstoqueProdutos">Meus Estoque</Link>
            </li>
          </ul>
        </nav>

        {/* Definição das Rotas */}
        <Routes>
          <Route path="/" element={<MeusProdutos />} />
          <Route path="/produto" element={<ProdutoForm />} />
          <Route path="/editar-produto/:id" element={<EditarProduto />} />
          <Route path="/relatorio-vendas/:id" element={<RelatorioVendas />} />
          <Route path="/meus-produtos" element={<MeusProdutos />} />
          <Route path="/EstoqueProdutos" element={<EstoqueProdutos />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;

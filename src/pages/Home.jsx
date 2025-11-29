import Card from "../components/ProdutoCard";
import './Home.css'
import { useEffect, useState } from "react";

const API_URL = 'https://crudcrud.com/api/f344df899d0f42178eafe5c75763391e/tarefas';

function Home() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        preco: '',
        descricao: ''
    });

    // Buscar os dados na API quando o componente for montado
    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                setCarregando(true);
                setErro(null);
                
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos');
                }
                
                const dados = await response.json();
                setProdutos(dados);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                setErro("Falha ao carregar produtos. Tente novamente.");
            } finally {
                setCarregando(false);
            }
        };

        buscarProdutos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!novoProduto.nome.trim() || !novoProduto.preco || !novoProduto.descricao.trim()) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        
        try {
            const produto = {
                nome: novoProduto.nome.trim(),
                preco: parseFloat(novoProduto.preco),
                descricao: novoProduto.descricao.trim()
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar produto');
            }

            const produtoCriado = await response.json();
            setProdutos([...produtos, produtoCriado]);
            setNovoProduto({
                nome: '',
                preco: '',
                descricao: ''
            });

        } catch (error) {
            console.error("Erro ao criar produto:", error);
            alert("Erro ao adicionar produto. Tente novamente.");
        }
    }

    // Função para remover produto
    const handleRemoverProduto = async (_id) => {
        if (!window.confirm('Tem certeza que deseja remover este produto?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao remover produto');
            }

            // Atualizar state local após remoção bem-sucedida
            setProdutos(produtos.filter(produto => produto._id !== _id));
            
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            alert("Erro ao remover produto. Tente novamente.");
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoProduto({
            ...novoProduto,
            [name]: value
        });
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lista de Produtos</h2>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <div style={{ display: 'grid', gap: '10px', maxWidth: '300px' }}>
                    <input 
                        type="text" 
                        placeholder="Nome do produto" 
                        name="nome"
                        value={novoProduto.nome}
                        onChange={handleInputChange}
                        style={{ padding: '8px' }}
                        required
                    />
                    <input 
                        type="number" 
                        placeholder="Preço" 
                        name="preco"
                        value={novoProduto.preco}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        style={{ padding: '8px' }}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Descrição" 
                        name="descricao"
                        value={novoProduto.descricao}
                        onChange={handleInputChange}
                        style={{ padding: '8px' }}
                        required
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Adicionar Produto
                    </button>
                </div>
            </form>

            {/* Estado de Carregamento */}
            {carregando && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#666'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    <p>Carregando produtos...</p>
                </div>
            )}

            {/* Mensagem de Erro */}
            {erro && !carregando && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#dc3545',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '5px',
                    margin: '20px 0'
                }}>
                    <p>{erro}</p>
                </div>
            )}

            {/* Lista de Produtos */}
            {!carregando && !erro && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {produtos.map((produto) => 
                            <Card 
                                key={produto._id}
                                id={produto._id}
                                nome={produto.nome} 
                                preco={produto.preco} 
                                descricao={produto.descricao}
                                onRemover={handleRemoverProduto}
                            />
                        )}
                    </div>

                    {produtos.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                            Nenhum produto encontrado. Adicione o primeiro produto!
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
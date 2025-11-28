import './ProdutoCard.css'

function Card(props) {
    return (
        <div className='container-card'>
            <h1>🖼️ Foto</h1>
            <hr />
            <div className="icone-container">
                <p><span>Nome: </span>{props.nome}</p>
            </div>
            <div className='icone-container'>
                <p><span>Preço: </span>
                    <span className="preco">R$ {props.preco?.toFixed(2)}</span>
                </p>
            </div>
            <div className='icone-container'>
                <p><span>Descrição: </span>
                    <span className="descricao">{props.descricao}</span>
                </p>
            </div>
            <button 
                className='botao'
                onClick={() => props.onRemover(props.id)}
            >
                Remover
            </button>
        </div>
    )
}

export default Card;
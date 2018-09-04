

var abertos = []
var fechados = []
var solucao = []
var pilhaFilhosDeX = []
const celulas = document.querySelectorAll('.celula');
const numeros = document.querySelectorAll('.number')

var meta = [
    ["1", "2", "3"],	// estado objetivo
    ["4", "5", "6"],
    ["7", "8", ""]
];


var estadoInicial = [
    ["7", "1", "3"],	// estado inicial
    ["2", "6", ""],
    ["5", "4", "8"]
];

var estado2  = [
    ["4", "2", "3"],	// estado inicial
    ["6", "", "1"],
    ["7", "5", "8"]
];

configInicial()



function iteracaoBusca() {
    var nodoInicial = {
        estado: copiaEstado(estadoInicial),
        pai: null
    }
    abertos.push(nodoInicial)


    while (abertos.length > 0) {
        // Remove o nodo do estado mais a esquerda em abertos
        let x = abertos.pop();

        // Extrai o estado do nodo
        let estado = x.estado
        // Compara com o estado meta
        let objetivo = comparaEstados(estado, meta)
        
        if(objetivo) { 
                
            solucao.push(x.estado);	// reconstr�i o caminho at� o estado inicial
            
            while (x.pai) {
                x = x.pai;
				solucao.push(x.estado);
            }
            x = solucao.pop();	// retira o ultimo estado empilhado (estado inicial)
            
            mostrarNaTela(x);	// volta o tabuleiro ao estado inicial
            document.getElementById("solucaoBotao").style.display = 'block';
            return; 
        }
        else {
            // Gera filhos de X
            geraFilhos(x)
            // Coloca o X em fechados
            fechados.push(x)

            // Descarta os filhos de X se ja estiverem em abertos ou fechados
            let filhosValidosDeX = []
            pilhaFilhosDeX.forEach(function (e) {
                let filhoExiste = verificaFilhoEmAbertosFechados(e)

                if (!filhoExiste) { filhosValidosDeX.push(e) }
            })

            // Coloca os filhos que restam no final esquerdo de abertos
            let novosAbertos = filhosValidosDeX.concat(abertos)
            abertos = novosAbertos

            pilhaFilhosDeX = []

        }
    }
    return "FALHA"
};




// gera os filhos de um nodo
//
function geraFilhos(nodo) {

    for (var i = 0; i < 3; i++) {

        for (var j = 0; j < 3; j++) {

            if (nodo.estado[i][j] == "") {  // localiza o espaço em branco

                // gera os filhos possiveis e coloca na pilha
                if (i > 0)
                    empilhaFilho(nodo, i, j, i - 1, j);   // move o branco para cima
                if (i < 2)
                    empilhaFilho(nodo, i, j, i + 1, j);   // move o branco para baixo
                if (j > 0)
                    empilhaFilho(nodo, i, j, i, j - 1);   // move o branco para a esquerda
                if (j < 2)
                    empilhaFilho(nodo, i, j, i, j + 1);   // move o branco para a direita

                return; // encerra, nao precisa terminar os loops
            } // end if
        }
    }
}


function empilhaFilho(pai, io, jo, id, jd) {
    var estado = copiaEstado(pai.estado);
    trocaPeca(estado, io, jo, id, jd);
    pilhaFilhosDeX.push({ estado: estado, pai: pai }); // coloca filho na pilha/lista
}



function trocaPeca(estado, oi, oj, di, dj) {
    var t = estado[di][dj];
    estado[di][dj] = estado[oi][oj];
    estado[oi][oj] = t;
}


function copiaEstado(estado) {	// retorna uma copia do estado
    var retorno = [];
    for (var i = 0; i < estado.length; i++)	// copia elementos do array
        retorno[i] = estado[i].slice(0);		// necessario para evitar a copia por referencia

    return retorno;
}

function comparaEstados(estado1, estado2) {	// compara estados
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            if (estado1[i][j] != estado2[i][j])
                return false;

    return true;
}


function verificaFilhoEmAbertosFechados(nodo) {
    let existEmAberto = false;
    let existEmFechado = false;

    if (abertos.length) {
        let exist = []
        exist = abertos.filter(function (e) {
            return comparaEstados(nodo.estado, e.estado)
        })

        if (exist.length) { existEmAberto = true }
    }

    if (fechados.length) {
        let exist2 = []
        exist2 = fechados.filter(function (e) {
            return comparaEstados(nodo.estado, e.estado)
        })

        if (exist2.length) { existEmFechado = true }
    }

    return existEmAberto || existEmFechado
};


function exibeSolucao() {
	if (solucao.length) {
		estado = solucao.pop();
        mostrarNaTela(estado)        
	}
}

function mostrarNaTela(estado) {
    var estadoFinal = estado;
    estadoFinal = estadoFinal.concat(estadoFinal[0], estadoFinal[1], estadoFinal[2]);
    for (let i = 2; i >= 0; i--) {
        estadoFinal.splice(i, 1);
    }
    for (let index = 0; index < estadoFinal.length; index++) {
        celulas[index].innerText = estadoFinal[index];
        celulas[index].style.color = 'white';
        celulas[index].style.backgroundColor = 'green';
    }
}


function aplicarNumerosUsuario () {
    
    let l1 = [numeros[0].value, numeros[1].value, numeros[2].value]
    let l2 = [numeros[3].value, numeros[4].value, numeros[5].value]
    let l3 = [numeros[6].value, numeros[7].value, numeros[8].value]
   
    estadoInicial = [l1,l2,l3]

    configInicial()
}

function configInicial(){

    
    // Transforma o array dado em um array exibível em tela
    var estadoLivroTransformed = estadoInicial.concat(estadoInicial[0], estadoInicial[1], estadoInicial[2]);
    // Limpa o array
    for (let i = 2; i >= 0; i--) {
        var removed = estadoLivroTransformed.splice(i, 1);
    }
    // Preenche o array inicial em tela
    for (let index = 0; index < estadoLivroTransformed.length; index++) {
        celulas[index].innerText = estadoLivroTransformed[index];
    }
} 
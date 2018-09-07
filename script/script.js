var abertos = [] // Pilha de abertos
var fechados = [] // Pilha de fechados
var solucao = [] // Array que vai armazenar os estados da solução
var pilhaFilhosDeX = [] // Pilha temporaria dos filhos de X
var celulas = document.querySelectorAll('.celula') // Celulas da tabela que representa a solução do quebra cabeça
var numeros = document.querySelectorAll('.number')  // Celulas da tabela que representa o estado inicial que o usuario escolher
var modo


// estado objetivo
var meta = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", ""]
];

// estado inicial de exemplo com profundidade 12 na arvore de busca
var estadoInicial = [
    ["7", "1", "3"],
    ["2", "6", ""],
    ["5", "4", "8"]
];

// estado de exemplo 2
var estado2 = [
    ["4", "2", "3"],
    ["6", "", "1"],
    ["7", "5", "8"]
];

// Configura a aparencia inicial do quebra cabeça com o estado inicial como exemplo
configInicial()

// Funçao principal que inicia a busca da solução de acordo com o estado inicial
function iteracaoBusca() {

    modo = document.querySelector('input[name="modo"]:checked').value;

    console.log(modo)

    var nodoInicial = { estado: copiaEstado(estadoInicial), pai: null }

    // Coloca o estado inicial na pilha de abertos
    abertos.push(nodoInicial)

    // Faz a iteração em abertos ate encontrar o estado objetivo
    while (abertos.length > 0) {
        var x

        // [BA] = busca em aplitude e [BP] busca em profundidade

        if (modo == 'BA') {
            // Remove o estado mais esquerdo da fila em abertos e chama de x
            x = abertos.shift()
        } else if(modo == 'BP') {
            // Remove o estado do topo da pilha em abertos e chama de x
            x = abertos.pop()
        }

        // Compara com o estado meta pra saber se são iguais
        let objetivo = comparaEstados(x.estado, meta)

        // Se forem iguais, encontrou o estado igual o objetivo (solucionado)
        if (objetivo) {
            console.log("Achei o objetivo")
            // Coloca o estado solução na pllha de solução
            console.log(solucao)
            solucao.push(x.estado)

            // Reconstroi o caminho ate o estado inicial
            while (x.pai) { // Enquanto pai nao for nulo, ou seja, o nodo Raiz
                // extrai o pai do nodo
                x = x.pai;
                // Empilha o estado na pilha de solução
                solucao.push(x.estado);
            }

            // Retira o ultimo estado empilhado (estado inicial)
            x = solucao.pop()

            // Volta o tabuleiro ao estado inicial do problema para mostrar os passos a partir do inicio
            mostrarNaTela(x)

            // Mostra o botao de solução
            document.getElementById("solucaoBotao").style.display = 'block'

            return;
        }
        else {

            // Gera filhos de X
            geraFilhos(x)

            // Coloca o X na pilha em fechados
            fechados.push(x)

            // Descarta os filhos de X se ja estiverem em abertos ou fechados
            let filhosValidosDeX = []
            pilhaFilhosDeX.forEach(function (e) {
                if (!verificaFilhoEmAbertosFechados(e)) { filhosValidosDeX.push(e) }
            })

            if (modo == 'BP') {
                // Na busca em profundidade o abertos é uma pilha
                // Coloca os filhos que restam no topo da pilha de abertos
                abertos = filhosValidosDeX.concat(abertos)
            } else if(modo == 'BA') {
                // Na busca em amplitude o abertos é uma fila
                // Coloca os filhos que restam na fila de abertos
                abertos = abertos.concat(filhosValidosDeX)
            }

            // Limpa a pilha de filhos de X
            pilhaFilhosDeX = []

        }
    }
    return "FALHA"
};




// gera os filhos de um nodo
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

// Empilha o filho de X gerado na função geraFilhos() acima
function empilhaFilho(pai, io, jo, id, jd) {
    var estado = copiaEstado(pai.estado);

    trocaPeca(estado, io, jo, id, jd);

    pilhaFilhosDeX.push({ estado: estado, pai: pai }); // coloca nodo na pilha temporaria dos filhos de X
}



function trocaPeca(estado, oi, oj, di, dj) {
    var t = estado[di][dj];
    estado[di][dj] = estado[oi][oj];
    estado[oi][oj] = t;
}


function copiaEstado(estado) {	// retorna uma copia do estado
    var retorno = [];
    for (var i = 0; i < estado.length; i++) {	// copia elementos do array
        retorno[i] = estado[i].slice(0);		// necessario para evitar a copia por referencia
    }
    return retorno;
}

// Pega duas matrizes de dados, no caso os estados, e compara se são iguais
function comparaEstados(estado1, estado2) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (estado1[i][j] != estado2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

// Verifica se o nodo está na pilha de abertos ou fechados
function verificaFilhoEmAbertosFechados(nodo) {
    let existEmAberto = false;
    let existEmFechado = false;

    if (abertos.length) {
        let e1 = []

        // Filtra na pilha de abertos os nodos iguais ao nodo atual
        e1 = abertos.filter(function (e) { return comparaEstados(nodo.estado, e.estado) })

        // Se na filtragem existir algum nodo entao o nodo atual existe em abertos
        if (e1.length) { existEmAberto = true }
    }

    if (fechados.length) {
        let e2 = []
        // Filtra na pilha de fechados os nodos iguais ao nodo atual
        e2 = fechados.filter(function (e) { return comparaEstados(nodo.estado, e.estado) })

        // Se na filtragem existir algum nodo entao o nodo atual existe em fechados
        if (e2.length) { existEmFechado = true }
    }

    // Se o nodo existir em abertos ou fechados retorna true
    return existEmAberto || existEmFechado
};

// Ação do botao [Proximo passo] para exibir os passos da solução
function exibeSolucao() {
    if (solucao.length) {
        estado = solucao.pop();
        mostrarNaTela(estado)
    }
}

// Recebe um estado e coloca na tela
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

// Aplica ao estado inicial uma matriz de estados escolhida pelo usuário 
function aplicarNumerosUsuario() {
    let l1 = [numeros[0].value, numeros[1].value, numeros[2].value]
    let l2 = [numeros[3].value, numeros[4].value, numeros[5].value]
    let l3 = [numeros[6].value, numeros[7].value, numeros[8].value]

    estadoInicial = [l1, l2, l3]

    configInicial()
}

// COnfigura os estado inicial na tela do usuário
function configInicial() {
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
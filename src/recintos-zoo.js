class RecintosZoo {
    constructor() {
        this.recintos = [
            {numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: ['MACACO', 'MACACO', 'MACACO'], espacoOcupado: 3},
            {numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [], espacoOcupado: 0},
            {numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['GAZELA'], espacoOcupado: 2},
            {numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [], espacoOcupado: 0},
            {numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['LEAO'], espacoOcupado: 3}
        ];
        this.animaisValidos = {
            'LEAO': {tamanho: 3, bioma: ['savana'], carnivoro: true},
            'LEOPARDO': {tamanho: 2, bioma: ['savana'], carnivoro: true},
            'CROCODILO': {tamanho: 3, bioma: ['rio'], carnivoro: true},
            'MACACO': {tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false},
            'GAZELA': {tamanho: 2, bioma: ['savana'], carnivoro: false},
            'HIPOPOTAMO': {tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false},
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validar animal
        if (!this.animaisValidos[animal]){
            return{erro: 'Animal inválido'};
        }
        
        // Validar quantidade
        if (!Number.isInteger(quantidade) || quantidade <= 0){
            return{erro: 'Quantidade inválida'};
        }

        const animalEscolhido = this.animaisValidos[animal];

        // Viabilidade de cada recinto
        const recintosViaveis = this.recintos.filter(recinto => {
            const espacoLivre = recinto.tamanhoTotal - recinto.espacoOcupado;

            // Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo
            if (animalEscolhido.bioma.includes(recinto.bioma) && animalEscolhido.tamanho < espacoLivre) {
                return true;
            }

            // Animais carnívoros devem habitar somente com a própria espécie
            if (animalEscolhido.carnivoro && recinto.animais.some(a => a == animal)) {
                return true;
            }

            // Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
            if (animal == 'HIPOPOTAMO' && recinto.animais.some(a => a != 'HIPOPOTAMO')) {
                return true;
            }

            if (animal != 'HIPOPOTAMO' && recinto.animais.includes('HIPOPOTAMO')) {
                return true;
            }

            // Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            if (animal == 'MACACO' && recinto.animais.length != 0) {
                return true;
            }

            // Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
            if (recinto.animais.includes(animal) || quantidade > 1) {
                recinto.espacoOcupado++;
            }

            const espacoNecessario = quantidade * animalEscolhido.tamanho;
            return false;
        });
        
        // Se não houver recintos viáveis, retornar erro
        if (recintosViaveis.length === 0) {
            return {erro: "Nenhum recinto viável encontrado"};
        };

        // Ordenar os recintos viáveis pelo número
        const recintosOrdenados = recintosViaveis.sort((a, b) => a.numero - b.numero);

        // Retornar a lista de recintos viáveis com o espaço livre após a inclusão dos animais
        const resultado = recintosOrdenados.map(recinto => {
            const espacoLivreAtual = recinto.tamanhoTotal - recinto.espacoOcupado;
            const espacoNecessario = quantidade * animalEscolhido.tamanho;
            const espacoLivreRestante = espacoLivreAtual - espacoNecessario;

            return `Recinto: ${recinto.numero} (espaço livre: ${espacoLivreRestante} total: ${recinto.tamanhoTotal})`;
        });

        return {recintosViaveis: resultado};
        if (resultado.erro) {
            console.log(resultado.erro);
        } else {
            console.log('Recintos viáveis:', resultado.recintosViaveis);
        }
    }
};

test('Deve encontrar recintos para 2 macacos', () => { const resultado = new RecintosZoo().analisaRecintos('MACACO', 2); expect(resultado.erro).toBeFalsy(); expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)'); expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)'); expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)'); });
new RecintosZoo().analisaRecintos('MACACO', 2);


export { RecintosZoo as RecintosZoo };

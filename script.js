// Seleciona o elemento <html> da página.
const html = document.querySelector('html');
// Seleciona os botões de contexto: foco, descanso curto e descanso longo.
const focoBotao = document.querySelector('.app__card-button--foco');
const curtoBotao = document.querySelector('.app__card-button--curto');
const longoBotao = document.querySelector('.app__card-button--longo');
// Seleciona o elemento de imagem do banner.
const banner = document.querySelector('.app__image');
// Seleciona o elemento do título principal.
const titulo = document.querySelector('.app__title');
// Seleciona todos os botões de contexto.
const botoes = document.querySelectorAll('.app__card-button');
// Seleciona o botão de "Começar/Pausar".
const startPauseBotao = document.querySelector('#start-pause');
// Seleciona o input checkbox para alternar a música.
const musicaFocoInput = document.querySelector('#alternar-musica');
// Seleciona o texto dentro do botão "Começar/Pausar".
const iniciarOuPausarBotao = startPauseBotao.querySelector('span');
const iniciarOuPausarBotaoIcone = startPauseBotao.querySelector('.app__card-primary-button-icon');
// Cria um novo objeto de áudio para a música de fundo.
const musica = new Audio('./sons/kingdoms-will-burn.mp3');
// Seleciona os botões de "Música anterior" e "Próxima música".
const previousMusicBotao = document.querySelector('#previous-music');
const nextMusicBotao = document.querySelector('#next-music');
const shuffleMusicBotao = document.querySelector('#shuffle-music');

// Seleciona o slider de volume.
const volumeBotao = document.querySelector('#volume-button');
const volumeSlider = document.querySelector('#volume-slider');
// Seleciona os elementos do timer da música
const currentTimeElement = document.querySelector('#current-time');
const totalDurationElement = document.querySelector('#total-duration');
const currentSongElement = document.querySelector('#current-song');

// Seleciona o elemento que exibe o tempo na tela.
const tempoNaTela = document.querySelector('#timer');

// Seleciona os elementos do modal
const modalCiclo = document.querySelector('#modal-ciclo');
const modalTitulo = document.querySelector('#modal-titulo');
const modalMensagem = document.querySelector('#modal-mensagem');
const modalBtnConfirmar = document.querySelector('#modal-btn-confirmar');

// Ciclo de estudo Pomodoro padrão: foco -> descanso-curto -> foco -> descanso-longo
const cicloPomodoro = ['foco', 'descanso-curto', 'foco', 'descanso-longo'];
let indiceCicloAtual = 0;

// Cria objetos de áudio para os efeitos sonoros de play, pause e fim do tempo.
const audioPlay = new Audio('./sons/play.mp3');
const audioPausa = new Audio('./sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/ready-check.mp3');

// Garante o carregamento dos arquivos de áudio
audioPlay.load();
audioPausa.load();
audioTempoFinalizado.load();

// Variável para armazenar o tempo do timer em segundos. Inicia com 25 minutos (1500s).
let tempoDecorridoEmSegundos = 1500;
// Variável para armazenar o ID do intervalo (setInterval), para que possamos pará-lo depois.
let intervaloId = null;

// Lista de músicas disponíveis.
const musicas = [
    {
        nome: 'Kingdoms Will Burn',
        path: './sons/kingdoms-will-burn.mp3'
    },
    {
        nome: 'Lament of the Highborne',
        path: './sons/lament-of-the-highborne.mp3'
    },
    {
        nome: 'Alliance & Stormwind Theme',
        path: './sons/alliance-stormwind-theme.mp3'
    },
    {
        nome: 'City of Gold',
        path: './sons/city-of-gold.mp3'
    },
    {
        nome: 'Dark Ironforge',
        path: './sons/dark-iIronforge.mp3'
    },
    {
        nome: 'Darkmoon Faire',
        path: './sons/darkmoon-faire-music.mp3'
    },
    {
        nome: 'Horde & Orgrimmar Theme',
        path: './sons/horde-orgrimmar-theme.mp3'
    },
    {
        nome: 'Wrath of the Lich King',
        path: './sons/wrath-of-the-lich-king.mp3'
    },
        {
        nome: 'Sunwell Plateu',
        path: './sons/sunwell-plateau.mp3'
    },
    {
        nome: 'Eversong Woods',
        path: './sons/eversong-woods.mp3'
    }
];

// Variável para rastrear o índice da música atual.
let musicaAtual = 0;
// Variável para controlar o modo aleatório
let isShuffle = false;


// Configura a música de fundo para tocar em loop.
musica.loop = false; // Deve ser false para o evento 'ended' funcionar

// Adiciona um evento que é acionado quando o estado do checkbox de música muda.
musicaFocoInput.addEventListener('change', () => {
    // Se a música estiver pausada, toca. Caso contrário, pausa.
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

// Função auxiliar para mudar o modo de foco/descanso
function mudarModo(contexto) {
    if (contexto === 'foco') {
        tempoDecorridoEmSegundos = 1500;
    } else if (contexto === 'descanso-curto') {
        tempoDecorridoEmSegundos = 300;
    } else if (contexto === 'descanso-longo') {
        tempoDecorridoEmSegundos = 900;
    }
    alterarContexto(contexto);
    
    // Adiciona a classe 'active' ao botão correto
    if (contexto === 'foco') {
        focoBotao.classList.add('active');
    } else if (contexto === 'descanso-curto') {
        curtoBotao.classList.add('active');
    } else if (contexto === 'descanso-longo') {
        longoBotao.classList.add('active');
    }
}


// Adiciona um evento de clique ao botão "Foco".
focoBotao.addEventListener('click', () => {
    if (indiceCicloAtual === 1) {
        indiceCicloAtual = 2; // Avança para o Foco 2 se estava no descanso curto
    } else {
        indiceCicloAtual = 0; // Caso contrário, reinicia para o Foco 1
    }
    mudarModo('foco');
});

// Adiciona um evento de clique ao botão "Descanso curto".
curtoBotao.addEventListener('click', () => {
    indiceCicloAtual = 1;
    mudarModo('descanso-curto');
});

// Adiciona um evento de clique ao botão "Descanso longo".
longoBotao.addEventListener('click', () => {
    indiceCicloAtual = 3;
    mudarModo('descanso-longo');
});

// Função para alterar o contexto da aplicação (foco, descanso-curto, descanso-longo).
function alterarContexto (contexto) {
    // Atualiza a exibição do tempo na tela para o novo contexto.
    mostrarTempo();
    // Remove a classe 'active' de todos os botões de contexto.
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    })
    // Define o atributo 'data-contexto' no HTML para alterar o tema (cores, etc via CSS).
    html.setAttribute('data-contexto', contexto);
    // Altera a imagem do banner de acordo com o contexto.
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    // Altera o texto do título de acordo com o contexto.
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Não há tempo a perder,<br><strong class="app__title-strong">a caça aguarda!</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Reúna sua força, <br><strong class="app__title-strong">o dever nos chama!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            O destino me chama de volta.<br><strong class="app__title-strong">Sinta o ódio de dez mil anos!</strong>
                        ` 
        default:
            break;
    }
}

// Abre o modal de transição automática
function abrirModalTransicao() {
    const proximoIndice = (indiceCicloAtual + 1) % cicloPomodoro.length;
    const proximoContexto = cicloPomodoro[proximoIndice];
    
    if (proximoContexto === 'foco') {
        modalTitulo.textContent = 'Descanso Finalizado!';
        modalMensagem.textContent = 'Seu tempo de descanso acabou. Pronto para focar novamente?';
        modalBtnConfirmar.querySelector('span').textContent = 'Iniciar Foco';
    } else if (proximoContexto === 'descanso-curto') {
        modalTitulo.textContent = 'Foco Finalizado!';
        modalMensagem.textContent = 'Parabéns por completar o ciclo de foco! Pronto para o descanso curto?';
        modalBtnConfirmar.querySelector('span').textContent = 'Iniciar Descanso Curto';
    } else if (proximoContexto === 'descanso-longo') {
        modalTitulo.textContent = 'Ciclo Completo!';
        modalMensagem.textContent = 'Parabéns! Você completou a sequência de foco. Pronto para o descanso longo?';
        modalBtnConfirmar.querySelector('span').textContent = 'Iniciar Descanso Longo';
    }
    
    modalCiclo.classList.remove('hidden');
}

// Configura o evento do botão de confirmação do modal
modalBtnConfirmar.addEventListener('click', () => {
    modalCiclo.classList.add('hidden');
    
    // Avança o índice do ciclo
    indiceCicloAtual = (indiceCicloAtual + 1) % cicloPomodoro.length;
    const proximoContexto = cicloPomodoro[indiceCicloAtual];
    
    mudarModo(proximoContexto);
    
    // Inicia a contagem regressiva automaticamente
    iniciarOuPausar();
});

// Função que executa a contagem regressiva do timer.
const contagemRegressiva = () => {
    // Verifica se o tempo chegou a zero.
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.currentTime = 0;
        audioTempoFinalizado.play().catch(err => {
            console.error("Erro ao reproduzir o som de fim de ciclo:", err);
        });
        
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento)
        }
        // Para a contagem regressiva.
        zerar();
        
        // Abre o modal para autorizar a mudança e início da próxima etapa
        abrirModalTransicao();
        return 
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo()
}

// Adiciona um evento de clique ao botão principal para iniciar ou pausar o timer.
startPauseBotao.addEventListener('click', iniciarOuPausar)

// Função para iniciar ou pausar o timer.
function iniciarOuPausar() {
    // Se 'intervaloId' não for nulo, significa que o timer está rodando, então devemos pausar.
    if (intervaloId) {
        audioPausa.currentTime = 0;
        audioPausa.play().catch(err => {
            console.error("Erro ao reproduzir o som de pausa:", err);
        });  
        zerar();
        return
    }
    // Se o timer estiver pausado, toca o som de play.
    audioPlay.currentTime = 0;
    audioPlay.play().catch(err => {
        console.error("Erro ao reproduzir o som de início:", err);
    });  
    // Inicia a contagem regressiva a cada 1 segundo (1000ms) e armazena o ID do intervalo.
    intervaloId = setInterval(contagemRegressiva, 1000);
    // Altera o texto do botão para "Pausar".
    iniciarOuPausarBotao.textContent = "Pausar";
    iniciarOuPausarBotaoIcone.setAttribute('src', `./imagens/pause.png`);
}

// Função para parar o timer e resetar seu estado.
function zerar() {
    // Para a execução do setInterval usando o ID armazenado.
    clearInterval(intervaloId);
    iniciarOuPausarBotaoIcone.setAttribute('src', `./imagens/play_arrow.png`);
    // Altera o texto do botão de volta para "Começar".
    iniciarOuPausarBotao.textContent = "Começar";
    // Reseta a variável 'intervaloId' para null, indicando que o timer está parado.
    intervaloId = null;
}

// Função para formatar e exibir o tempo na tela.
function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

// Chama a função uma vez no início para exibir o tempo inicial (25:00).
mostrarTempo()

// Função para formatar e exibir o nome da música atual
function atualizarNomeMusica() {
    currentSongElement.textContent = musicas[musicaAtual].nome;
}

// Adiciona um evento de clique ao botão "Música anterior".
previousMusicBotao.addEventListener('click', () => {
    const estavaTocando = !musica.paused; // Verifica se a música estava tocando
    musicaAtual--;
    if (musicaAtual < 0) {
        musicaAtual = musicas.length - 1;
    }
    musica.src = musicas[musicaAtual].path;
    atualizarNomeMusica();
    if (estavaTocando) { // Se estava tocando, a nova música começa a tocar
        musica.play();
    }
});

// Adiciona um evento de clique ao botão "Próxima música".
nextMusicBotao.addEventListener('click', () => {
    const estavaTocando = !musica.paused; // Verifica se a música estava tocando

    if (isShuffle) {
        let proximaMusica;
        do {
            proximaMusica = Math.floor(Math.random() * musicas.length);
        } while (proximaMusica === musicaAtual); // Garante que não repita a mesma música
        musicaAtual = proximaMusica;
    } else {
        musicaAtual++;
        if (musicaAtual >= musicas.length) {
            musicaAtual = 0;
        }
    }
    musica.src = musicas[musicaAtual].path;

    atualizarNomeMusica();
    if (estavaTocando) { // Se estava tocando, a nova música começa a tocar
        musica.play();
    }
});

// Função para formatar o tempo em minutos e segundos
function formatarTempoMusica(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

// Evento para atualizar a duração total quando os metadados da música forem carregados
musica.addEventListener('loadedmetadata', () => {
    totalDurationElement.textContent = formatarTempoMusica(musica.duration);
});

// Evento para atualizar o tempo atual da música enquanto ela toca
musica.addEventListener('timeupdate', () => {
    currentTimeElement.textContent = formatarTempoMusica(musica.currentTime);
});

// Função para resetar o timer da música
function resetarTimerMusica() {
    currentTimeElement.textContent = '00:00';
    // A duração total será atualizada pelo evento 'loadedmetadata'
    // Se a música não carregar, pode mostrar 00:00
    totalDurationElement.textContent = formatarTempoMusica(musica.duration || 0);
}

// Define a música inicial
musica.src = musicas[musicaAtual].path;

// Exibe o nome da música inicial
atualizarNomeMusica();

// Adiciona um evento para tocar a próxima música quando a atual terminar
musica.addEventListener('ended', () => {
    nextMusicBotao.click(); // Simula um clique no botão "Próxima"
});

// Adiciona um evento de clique ao botão de aleatorizar
shuffleMusicBotao.addEventListener('click', () => {
    isShuffle = !isShuffle; // Inverte o estado de aleatório
    shuffleMusicBotao.classList.toggle('active', isShuffle); // Adiciona ou remove a classe 'active'

    // Se o modo aleatório for ativado e uma música estiver tocando, pula para uma música aleatória
    if (isShuffle && !musica.paused) {
        nextMusicBotao.click();
    }
});

// Adiciona um evento de clique ao botão de volume para mostrar/esconder o slider.
volumeBotao.addEventListener('click', () => {
    volumeSlider.classList.toggle('hidden');
});

// Adiciona um evento de 'input' ao slider de volume.
// Este evento é disparado continuamente enquanto o slider é arrastado.
volumeSlider.addEventListener('input', () => {
    const vol = volumeSlider.value;
    musica.volume = vol;
    audioPlay.volume = vol;
    audioPausa.volume = vol;
    audioTempoFinalizado.volume = vol;
});


// Define o volume inicial dos áudios para 50%.
musica.volume = 0.5;
audioPlay.volume = 0.5;
audioPausa.volume = 0.5;
audioTempoFinalizado.volume = 0.5;

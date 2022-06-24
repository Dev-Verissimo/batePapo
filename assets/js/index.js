const nome = document.querySelector('.acesso input')
const botaoEntrar = document.querySelector('.acesso button')
const inputEntrar = document.querySelector('.acesso input')
const telaLoggin = document.querySelector('.login')
const containerChat = document.querySelector('.userIn .chat')
const telaChat = document.querySelector('.userIn')
const usersSidebar = document.querySelector('.usersSidebar')
const aside = document.querySelector('aside')
const contatosContainer = document.querySelector('.menu_lateral .contatos')
const lienviarMensagensParaTodos = document.querySelector('.enviarMensagensParaTodos')
const botaoEnviarMensagem = document.querySelector('.enviarMensagem-users')

let visibilidade = 'message'
let destinatario = 'Todos'


botaoEntrar.addEventListener('click', () => {
    const participante = {
        name: nome.value
    }

    const logar = axios.post(
        'https://mock-api.driven.com.br/api/v6/uol/participants',
        participante
    )

    logar.then(usuarioLogado)
    logar.catch(erroLogin)

})

function usuarioLogado(user) {
    
    console.log(user)
    telaLoggin.classList.add('invisible')
    inputEntrar.classList.remove('erro')
    telaChat.classList.remove('invisible')

    verificationUserIsHere()
    buscarMensagens()

}

function erroLogin(erro) {
    console.log(erro)
    inputEntrar.classList.add('erro')
}

function isHere() {
    const participante = {
        name: nome.value
    }
    const userIsHere = axios.post(
        'https://mock-api.driven.com.br/api/v6/uol/status',
        participante
    )
}

function verificationUserIsHere() {
    setInterval(isHere, 5000)
}

function buscarMensagens() {
    const mensagens = axiosGet('https://mock-api.driven.com.br/api/v6/uol/messages')
    mensagens.then(verificaAsMensagens)
}

setInterval(buscarMensagens,3000)

function verificaAsMensagens(mensagens) {
    console.log(mensagens.data)
    mensagens.data.map(mensagem => criarMensagem(mensagem))
}

function criarMensagem(mensagem) {
    const mensagemContainer = document.createElement('div')
    if (mensagem.type === 'status') {
        mensagemContainer.classList.add('entraNaSala')
        mensagemContainer.innerHTML = `<span>(${mensagem.time})</span>  <strong>${mensagem.from}</strong> ${mensagem.text} `
    } else if (mensagem.type === 'private_message') {
        mensagemContainer.classList.add('mensagemPrivada')
        mensagemContainer.innerHTML = `<span>(${mensagem.time})</span>  <strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>: ${mensagem.text} `
    } else {
        mensagemContainer.classList.add('mensagemParaTodos')
        mensagemContainer.innerHTML = `(${mensagem.time})  <strong>${mensagem.from}</strong> ${mensagem.text}`
    }
    mensagemContainer.scrollIntoView();
    containerChat.appendChild(mensagemContainer)
}


usersSidebar.addEventListener('click', () => {
    aside.classList.remove('invisible')
    const participantes = axiosGet('https://mock-api.driven.com.br/api/v6/uol/participants')
    participantes.then((contatos) => {
        console.log(contatos.data)
        contatos.data.map(contato => contatosContainer.innerHTML += `
        <li onclick="selecionaUser(this,'${contato.name}')">
            <ion-icon name="person-circle-outline"></ion-icon>
            <span>${contato.name}</span>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </li>`)
    })
    
})

aside.addEventListener('click', () => {
    let itensSelecionado = document.querySelectorAll('.selecionado')
    console.log(itensSelecionado)
    setTimeout(() => {
        aside.classList.add('invisible')
    }, 5000)
})

function selecionaUser(user, userName) {
    const remetenteAntigo = document.querySelector('.contatos .selecionado')
    remetenteAntigo.classList.remove('selecionado')
    user.classList.add('selecionado')
    destinatario = userName
}

function selecionaVisibilidade(opcao, visibilidadeEscolhida) {
    const visibilidadeAntiga = document.querySelector('.visibilidade li.selecionado')
    visibilidadeAntiga.classList.remove('selecionado')
    opcao.classList.add('selecionado')

    let itensSelecionado = document.querySelectorAll('.selecionado')
    visibilidade = visibilidadeEscolhida
}

botaoEnviarMensagem.addEventListener('click', () => {
    const mensagemEscrita = document.querySelector('.enviarMensagem input').value
        const objetoMensagem = {
            from: nome.value,
            to: destinatario,
            text: mensagemEscrita,
            type: visibilidade
        }
        console.log(objetoMensagem)

    let enviar = axiosPost(
        'https://mock-api.driven.com.br/api/v6/uol/messages',
        objetoMensagem
    )
    enviar.then((oi) => {
        console.log('foi', oi)
        buscarMensagens()
        console.log(objetoMensagem)
        document.querySelector('.enviarMensagem input').value = ''
    })
    enviar.catch((oi)=>{
        console.log(objetoMensagem, 'ca')

    })

})


// Automatizando processos 

function axiosGet(url) {
    const axiosGet = axios.get(
        url
    )

    return axiosGet;

}

function axiosPost(url, paramentro) {
    const axiosPost = axios.post(
        url,
        paramentro
    )

    return axiosPost;

}


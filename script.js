(function() {
    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ========== NAVBAR SCROLL EFEITO ==========
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ========== MENU HAMBURGER ==========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) navLinks.classList.remove('open');
    });

    // ========== CHATBOT ==========
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotBody = document.getElementById('chatbotBody');
    const closeChat = document.getElementById('closeChat');
    const notifBadge = chatbotToggle.querySelector('.notif-badge');

    const WHATSAPP_NUMERO = '55xxxxxxx';
    const WHATSAPP_LINK_BASE = `https://wa.me/${WHATSAPP_NUMERO}?text=`;

    // Base de respostas
    const respostas = {
        'horarios_cultos': {
            pergunta: 'Quais os horários dos cultos?',
            resposta: '📅 <b>Nossos horários:</b><br>• <b>Domingo:</b> 9h (Manhã) e 19h (Noite)<br>• <b>Terça:</b> 19h (Culto de Ensino)<br>• <b>Quarta:</b> 19h30 (Oração)<br>• <b>Quinta:</b> 19h (Culto de Doutrina)<br>• <b>Domingo:</b> 8h30 (Escola Dominical)<br><br>Quer confirmar algo específico? 👇',
            botoes: ['Culto de terça?', 'Culto de quinta?', 'Escola Dominical?', 'Falar no WhatsApp']
        },
        'culto_terca': {
            pergunta: 'Culto de terça-feira?',
            resposta: '📖 Sim! Toda <b>terça-feira às 19h</b> temos o <b>Culto de Ensino</b>, um momento de aprofundamento na Palavra de Deus. Venha aprender mais!',
            botoes: ['Ver todos os horários', 'Onde fica a igreja?', 'Falar no WhatsApp']
        },
        'culto_quinta': {
            pergunta: 'Culto de quinta-feira?',
            resposta: '🙌 Sim! Toda <b>quinta-feira às 19h</b> temos o <b>Culto de Doutrina</b>, onde estudamos os fundamentos da fé quadrangular. Participe!',
            botoes: ['Ver todos os horários', 'Onde fica a igreja?', 'Falar no WhatsApp']
        },
        'escola_dominical': {
            pergunta: 'Escola Dominical?',
            resposta: '📖 Sim! A <b>Escola Dominical</b> acontece todo <b>domingo às 8h30</b>. Temos classes para crianças, jovens e adultos. Todos são bem-vindos!',
            botoes: ['Ver todos os horários', 'Tem classe infantil?', 'Falar no WhatsApp']
        },
        'endereco': {
            pergunta: 'Qual o endereço da igreja?',
            resposta: '📍 Estamos em <b>São Paulo - SP</b>.<br>Mais detalhes sobre a localização você pode obter pelo WhatsApp.',
            botoes: ['Enviar localização no WhatsApp', 'Ver horários', 'Falar com pastor']
        },
        'falar_pastor': {
            pergunta: 'Quero falar com um pastor',
            resposta: '👨‍⚕️ Claro! Para assuntos espirituais, aconselhamento ou emergências, podemos te conectar diretamente com um dos nossos pastores via <b>WhatsApp</b>. Clique no botão abaixo:',
            botoes: ['Falar no WhatsApp agora', 'Agendar aconselhamento']
        },
        'batismo': {
            pergunta: 'Como faço para me batizar?',
            resposta: '💧 Que alegria! O batismo é um passo público de fé. Realizamos batismos <b>mensalmente</b> e oferecemos um <b>curso preparatório</b> para que você entenda o significado desse ato. Para se inscrever, fale conosco no WhatsApp! 😊',
            botoes: ['Quero me inscrever!', 'Ver horários', 'Falar no WhatsApp']
        },
        'ceia': {
            pergunta: 'Quem pode participar da Ceia?',
            resposta: '🍞 A <b>Ceia do Senhor</b> é celebrada mensalmente e é aberta a todos que fazem parte da comunhão da igreja – membros e frequentadores que compartilham da mesma fé e estão em paz com Deus e com o próximo. Caso tenha dúvidas, converse com um pastor.',
            botoes: ['Falar com pastor', 'Ver horários', 'Falar no WhatsApp']
        },
        'classe_infantil': {
            pergunta: 'Tem classe infantil?',
            resposta: '👶 Sim! Nosso <b>Ministério Infantil</b> é uma bênção! Temos atividades para crianças de 0 a 12 anos durante todos os cultos de domingo. A Escola Dominical também tem classes divididas por idade.',
            botoes: ['Ver horários', 'Falar no WhatsApp', 'Mais informações']
        },
        'localizacao_whatsapp': {
            pergunta: 'Enviar localização no WhatsApp',
            resposta: '📍 Vou te redirecionar para o WhatsApp com a localização! É só clicar abaixo:',
            botoes: ['Abrir WhatsApp com localização', 'Ver endereço novamente']
        },
        'agendar_aconselhamento': {
            pergunta: 'Agendar aconselhamento',
            resposta: '📋 Nosso serviço de <b>aconselhamento pastoral</b> funciona de segunda a sábado. Para agendar um horário, fale conosco no WhatsApp e nossa equipe vai te atender com todo carinho.',
            botoes: ['Agendar agora no WhatsApp', 'Voltar ao menu']
        },
        'welcome_back': {
            pergunta: null,
            resposta: '👋 Em que mais posso ajudar? Escolha uma opção abaixo:',
            botoes: ['Horários dos cultos', 'Endereço', 'Falar com pastor', 'Sobre batismo', 'Sobre a Ceia', 'Escola Dominical']
        }
    };

    // Função para adicionar mensagem do bot
    function addBotMessage(html, botoes = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-bot';
        msgDiv.innerHTML = html;
        chatbotBody.appendChild(msgDiv);

        if (botoes && botoes.length > 0) {
            const botoesDiv = document.createElement('div');
            botoesDiv.className = 'chatbot-botoes';
            botoes.forEach(texto => {
                const btn = document.createElement('button');
                btn.textContent = texto;
                if (texto.toLowerCase().includes('whatsapp') || texto.toLowerCase().includes('inscrever') || texto.toLowerCase().includes('agendar')) {
                    btn.classList.add('btn-whatsapp-chat');
                }
                // Ao clicar, chama a função handleBotaoClick, sem remover os botões
                btn.addEventListener('click', () => handleBotaoClick(texto, btn));
                botoesDiv.appendChild(btn);
            });
            chatbotBody.appendChild(botoesDiv);
        }
        scrollToBottom();
    }

    // Função para adicionar mensagem do usuário
    function addUserMessage(texto) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-user';
        msgDiv.textContent = texto;
        chatbotBody.appendChild(msgDiv);
        scrollToBottom();
    }

    // Função de scroll
    function scrollToBottom() {
        setTimeout(() => {
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 80);
    }

    // Mostrar "digitando..."
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg-bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '⏳ <em>Digitando...</em>';
        typingDiv.style.opacity = '0.7';
        chatbotBody.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // Handler principal dos botões – agora NÃO remove os botões
    function handleBotaoClick(texto, btnElement) {
        // Adiciona a mensagem do usuário
        addUserMessage(texto);

        // Mostra indicador de digitação
        showTyping();

        // Processa a resposta com delay
        setTimeout(() => {
            hideTyping();

            const textoLower = texto.toLowerCase();

            // Verifica se é uma ação que leva ao WhatsApp
            if (textoLower.includes('whatsapp') || textoLower.includes('inscrever') || textoLower.includes('agendar') || textoLower.includes('abrir whatsapp')) {
                let mensagemWhatsApp = 'Olá! Gostaria de mais informações sobre a igreja.';
                if (textoLower.includes('localização') || textoLower.includes('localizacao')) {
                    mensagemWhatsApp = 'Olá! Gostaria de receber a localização da igreja.';
                } else if (textoLower.includes('inscrever')) {
                    mensagemWhatsApp = 'Olá! Gostaria de me inscrever para o batismo.';
                } else if (textoLower.includes('agendar')) {
                    mensagemWhatsApp = 'Olá! Gostaria de agendar um aconselhamento pastoral.';
                } else if (textoLower.includes('pastor')) {
                    mensagemWhatsApp = 'Olá! Gostaria de falar com um pastor.';
                } else if (textoLower.includes('ceia')) {
                    mensagemWhatsApp = 'Olá! Tenho dúvidas sobre a Ceia do Senhor.';
                }
                const encodedMsg = encodeURIComponent(mensagemWhatsApp);
                addBotMessage('📲 <b>Redirecionando para o WhatsApp...</b><br>Se não abrir automaticamente, <a href="' + WHATSAPP_LINK_BASE + encodedMsg + '" target="_blank" style="color:#25D366;font-weight:700;">clique aqui</a>.');
                setTimeout(() => {
                    window.open(WHATSAPP_LINK_BASE + encodedMsg, '_blank');
                }, 600);
                // Depois do redirecionamento, mostra o menu de volta (opcional)
                setTimeout(() => {
                    addBotMessage(respostas['welcome_back'].resposta, respostas['welcome_back'].botoes);
                }, 2000);
                return;
            }

            // Mapeia o texto para uma chave de resposta
            let respostaKey = null;
            if (textoLower.includes('todos os horários') || textoLower.includes('ver horários') || textoLower.includes('horários dos cultos')) {
                respostaKey = 'horarios_cultos';
            } else if (textoLower.includes('terça') || textoLower.includes('terca')) {
                respostaKey = 'culto_terca';
            } else if (textoLower.includes('quinta')) {
                respostaKey = 'culto_quinta';
            } else if (textoLower.includes('escola dominical')) {
                respostaKey = 'escola_dominical';
            } else if (textoLower.includes('endereço') || textoLower.includes('onde fica') || textoLower.includes('endereco')) {
                respostaKey = 'endereco';
            } else if (textoLower.includes('pastor') || textoLower.includes('falar com')) {
                respostaKey = 'falar_pastor';
            } else if (textoLower.includes('batismo') || textoLower.includes('batizar')) {
                respostaKey = 'batismo';
            } else if (textoLower.includes('ceia')) {
                respostaKey = 'ceia';
            } else if (textoLower.includes('classe infantil') || textoLower.includes('criança')) {
                respostaKey = 'classe_infantil';
            } else if (textoLower.includes('localização') || textoLower.includes('localizacao')) {
                respostaKey = 'localizacao_whatsapp';
            } else if (textoLower.includes('aconselhamento')) {
                respostaKey = 'agendar_aconselhamento';
            } else if (textoLower.includes('voltar') || textoLower.includes('menu') || textoLower.includes('mais informações')) {
                respostaKey = 'welcome_back';
            } else {
                // Fallback: oferece opções genéricas
                addBotMessage('🤔 Hmm, não entendi bem. Mas posso te ajudar com estas opções:', ['Horários dos cultos', 'Endereço', 'Falar com pastor', 'Sobre batismo', 'Sobre a Ceia', 'Falar no WhatsApp']);
                return;
            }

            if (respostaKey && respostas[respostaKey]) {
                const resp = respostas[respostaKey];
                addBotMessage(resp.resposta, resp.botoes);
            }
        }, 400);
    }

    // Alternar abertura/fechamento do chat
    chatbotToggle.addEventListener('click', () => {
        const isActive = chatbotWindow.classList.contains('active');
        if (isActive) {
            chatbotWindow.classList.remove('active');
            if (notifBadge) notifBadge.style.display = 'none';
        } else {
            chatbotWindow.classList.add('active');
            if (notifBadge) notifBadge.style.display = 'none';
            chatbotBody.innerHTML = '';
            addBotMessage('🙏 <b>Olá! Bem-vindo à Igreja Quadrangular de São Paulo.</b><br>Como posso ajudar você hoje?', ['Horários dos cultos', 'Endereço', 'Falar com pastor', 'Sobre batismo', 'Sobre a Ceia', 'Escola Dominical']);
            scrollToBottom();
        }
    });

    closeChat.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        if (notifBadge) notifBadge.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        const widget = document.getElementById('chatbotWidget');
        if (!widget.contains(e.target) && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
            if (notifBadge) notifBadge.style.display = 'block';
        }
    });

    if (notifBadge) notifBadge.style.display = 'block';
})();
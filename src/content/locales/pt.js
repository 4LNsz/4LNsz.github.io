/**
 * TODO o conteúdo deste arquivo é rastreável a uma das duas fontes:
 *   [CV]  Currículo do LinkedIn (PT-BR e ENG)
 *   [GH]  github.com/4LNsz
 *   [AL]  Confirmado diretamente por Alan nesta conversa
 *
 * Nada é inferido, arredondado ou "preenchido para compor". Se um fato
 * não estiver em nenhuma das duas, ele não entra aqui — mesmo que soe
 * plausível. Ao adicionar algo, cite a fonte no comentário.
 */
export default {
  __meta: { order: 1, code: "PT", name: "Português", locale: "pt-BR", htmlLang: "pt-BR" },

  nav: { profile: "Perfil", stack: "Stack", practice: "Atuação", path: "Trajetória", contact: "Contato" },
  meta: { status: "Status", role: "Função", based: "Base", time: "Horário local", focus: "Foco" },
  ui: {
    toDark: "Mudar para o tema escuro",
    toLight: "Mudar para o tema claro",
    menu: "Abrir o menu",
    menuClose: "Fechar o menu",
    skip: "Ir para o conteúdo",
  },

  hero: {
    status: "Disponível para projetos",
    // [CV] Primeira frase do resumo do LinkedIn, na íntegra. Estava com
    // duas frases e ocupava seis linhas antes do ALAN, o que deixava a
    // primeira tela pesada — o resto do resumo está no PDF, a um clique.
    statement: "Mais do que apenas escrever código, meu foco é a saúde e a eficiência do software.",
    role: "Engenheiro de Software",              // [CV] título do perfil
    based: "Caruaru, PE — Brasil",               // [CV] localidade
    focus: "Back-end / Tempo real",              // [CV] resumo
    // Rótulos do painel do hero. Os valores são medidos em tempo de
    // execução por motion/field.js — nenhum é escrito aqui.
    hud: {
      sessions: "Sessões",
      tick: "Tick (ms)",
      load: "+ Carga",
      reset: "Reiniciar",
    },
  },

  // [CV] + [GH]. "Sistemas distribuídos" saiu: não aparece em nenhuma
  // das duas fontes.
  marquee: ["Lua", "TypeScript", "JavaScript", "Node.js", "React", "Vue.js", "MySQL", "Alta concorrência", "Tempo real"],

  /**
   * A seção 01 é dirigida por dados. `about` é um array de parágrafos e
   * `blocks` um array de listas — acrescentar uma segunda formação, uma
   * certificação nova ou mais uma especialidade é acrescentar um item,
   * sem tocar em CSS ou renderizador. Um bloco vazio some sozinho.
   *
   * O texto é o resumo do LinkedIn, na íntegra, a partir da segunda
   * frase — a primeira já é o statement do hero.
   */
  profile: {
    kicker: "Quem eu sou",
    aboutTitle: "Apresentação",
    about: [
      "Sou um Engenheiro de Software focado em Back-end e sistemas de simulação em tempo real, onde o maior desafio é manter ambientes estáveis e performáticos para centenas de usuários simultâneos.",
      "Gosto de lidar com o que está “debaixo do capô”. Minha rotina envolve arquitetar lógicas complexas e, principalmente, resolver gargalos de performance. Tenho o hábito de analisar sistemas sob estresse para encontrar formas de reduzir o consumo de hardware (CPU/RAM), transformando infraestruturas pesadas em soluções leves e escaláveis.",
      // Um terceiro parágrafo ficava aqui — "Além da parte técnica,
      // tenho experiência gerenciando equipes e definindo roadmaps…".
      // O fato não sumiu da página: a seção 04 registra a gestão da
      // equipe de back-end na Energy, que é onde ela aconteceu. Aqui
      // era a mesma informação contada uma segunda vez.
    ],
    /**
     * Cinco blocos curtos, não seis longos.
     *
     * Esta lista chegou a ter vinte itens, e o efeito era o oposto do
     * pretendido: uma parede de tópicos que ninguém lê, repetindo o que
     * as seções 02, 03 e 04 já dizem. Duas regras a mantêm curta:
     *
     *   1. Se o fato já aparece em outra seção, ele NÃO se repete aqui.
     *   2. Fato de duas palavras vira `chips`, não `items` — o
     *      renderizador emite pílulas em vez de linhas com marcador.
     *
     * Nada foi reescrito para encurtar, só removido: cada linha que
     * sobrou continua idêntica à fonte que a marca.
     */
    blocks: [
      {
        // [AL] Nacionalidade e o início em 2018, confirmados por Alan.
        // [CV] O vínculo formal começa na Garty Group, janeiro de 2022.
        //
        // As duas datas ficam juntas de propósito. Só "desde 2022"
        // apagava quatro anos de prática; só "desde 2018" divergiria do
        // LinkedIn, onde o primeiro cargo é 2022 — e divergência entre o
        // site e o perfil vira pergunta na entrevista. Juntas, contam a
        // trajetória inteira sem que nenhuma das duas possa ser
        // contestada.
        //
        // Ano de início, nunca contagem de anos: "6 anos de experiência"
        // fica errado sozinho a cada aniversário.
        title: "Dados",
        items: [
          "Nacionalidade brasileira",
          "Desenvolvendo desde 2018 · profissionalmente desde 2022",
        ],
      },
      {
        // [CV] A headline do perfil, palavra por palavra: "Especialista
        // em Lua | Sistemas de Alta Performance & Escala | Otimização de
        // CPU e RAM". Três linhas — e são as três que ele mesmo escolheu
        // para se apresentar.
        //
        // Saíram daqui outras quatro, todas por repetição e nenhuma por
        // dúvida sobre o fato: React/Vue.js (linha Front-end da seção
        // 02), MySQL/MariaDB (linha Dados da 02), monitoramento e
        // arquitetura de ponta a ponta (painéis 03 e 04 da seção 03),
        // FiveM (linha Plataforma da 02 e a Garty Group na 04) e
        // redução de custo operacional (painel 02 da seção 03).
        title: "Especialidades",
        items: [
          "Lua — alta performance e escala",
          "Otimização de consumo de CPU e RAM",
          "Alta concorrência e tempo real",
        ],
      },
      {
        // [AL] Nativo primeiro, depois por relevância para trabalho
        // internacional. Em `chips` porque são rótulos de duas palavras:
        // como linhas de lista ocupavam três linhas inteiras para dizer
        // o que três pílulas dizem de relance.
        title: "Idiomas",
        chips: ["PT · nativo", "EN · intermediário", "ES · intermediário"],
      },
      {
        // [AL] Aceita qualquer arranjo. Três palavras, sem hierarquia
        // entre elas.
        //
        // Havia um "· preferência" no remoto e um quarto chip,
        // "Disponível para mudança". Alan mandou tirar os dois, e a
        // leitura melhora: a preferência transformava uma lista de
        // opções abertas num pedido, e anunciar disponibilidade para
        // mudar responde uma pergunta que ninguém fez ainda — é assunto
        // de conversa, não de vitrine. Os dois fatos continuam
        // verdadeiros; só não são publicados. Não reintroduzir sem ele
        // pedir.
        title: "Disponibilidade",
        chips: ["Remoto", "Presencial", "Híbrido"],
      },
      {
        // [CV] Seção Certifications. Fica aqui e NÃO na seção 04: são
        // credenciais que crescem em número, e lista é a forma certa
        // para isso. A formação em si vive na linha do tempo do 04 —
        // repetir nos dois lugares era a duplicação que Alan apontou.
        title: "Certificações",
        items: ["IV Semana Nacional da Área da Tecnologia da Informação — 5 certificados"],
      },
      // Dois blocos saíram inteiros.
      //
      // "Principais competências" vinha do campo Top Skills do LinkedIn
      // — TypeScript, UX e Figma. Alan confirmou que não são as
      // competências principais dele: aquele campo é derivado de
      // endossos, não curado. Não repopular a partir dele.
      //
      // "Como eu trabalho" tinha quatro linhas de método já ditas em
      // outro lugar: "analisar sistemas sob estresse" é o segundo
      // parágrafo da apresentação, e antecipar gargalos, arquitetura e
      // alinhamento com o negócio são os painéis 02 e 03 da seção 03.
    ],
  },

  // Somente tecnologias citadas no currículo ou no perfil do GitHub.
  // Saíram daqui: REST, Redis, Linux, Docker, CI/CD, Turborepo, pnpm e
  // Vite — nenhuma aparece em qualquer das duas fontes.
  stack: {
    kicker: "O que eu uso",
    rows: [
      { name: "Back-end",    items: ["Lua", "Node.js", "TypeScript", "JavaScript"] }, // [CV] WinsVue + [GH]
      { name: "Front-end",   items: ["React", "Vue.js"] },                            // [CV] resumo + [GH]
      { name: "Dados",       items: ["MySQL", "MariaDB"] },                            // [CV] resumo + [GH]
      { name: "Plataforma",  items: ["FiveM", "CFX.RE"] },                             // [GH]
      { name: "Ferramentas", items: ["Git", "VS Code", "Figma"] },                     // [GH] + [CV] competências
    ],
  },

  // Domínios de atuação descritos a partir do que o currículo relata em
  // cada cargo. Continuam sendo capacidades, não sistemas nomeados —
  // ver a seção Privacy do CLAUDE.md.
  practice: {
    kicker: "O que eu faço",
    hint: "Role na horizontal",
    items: [
      {
        label: "Domínio",
        title: "Simulação em tempo real",
        desc: "Ecossistemas de alta complexidade com centenas de usuários simultâneos. Processamento de dados em tempo real e persistência de estados complexos, mantendo ambientes dinâmicos estáveis sob carga.",
        tags: ["Lua", "Alta concorrência", "Estado persistente"],
      },
      {
        label: "Domínio",
        title: "Otimização de performance",
        desc: "Análise de sistemas sob estresse para encontrar formas de reduzir o consumo de hardware. Refatoração de sistemas críticos com redução de CPU e memória e queda de custo operacional de infraestrutura.",
        tags: ["CPU / RAM", "Refatoração", "Custo operacional"],
      },
      {
        label: "Domínio",
        title: "Arquitetura e decisão técnica",
        desc: "Planejamento de novos sistemas e arquitetura de software de ponta a ponta, antecipando gargalos antes que virem problema, e integração entre o núcleo do servidor e interfaces reativas.",
        tags: ["Arquitetura", "React", "Vue.js"],
      },
      {
        label: "Domínio",
        title: "Monitoramento e diagnóstico",
        desc: "Rotinas de monitoramento e diagnóstico de servidor, com resolução ágil de problemas complexos para garantir a alta disponibilidade do ambiente.",
        tags: ["Monitoramento", "Disponibilidade", "MySQL"],
      },
    ],
  },

  // [CV] Períodos, títulos e ordem exatamente como no currículo. Os
  // meses ficam porque a Garty Group durou três meses dentro de 2022, o
  // mesmo ano em que a Energy começou.
  path: {
    kicker: "Onde eu estive",
    cv: "Currículo completo",
    cvView: "Visualizar",
    cvGet: "Baixar",
    rows: [
      {
        when: "ago 2025 — abr 2026",
        role: "Desenvolvedor Back-end",
        org: "WinsVue",
        note: "Ecossistemas de simulação em tempo real com alta concorrência de usuários. Refatorações que reduziram consumo de CPU e memória em sistemas críticos, além de rotinas de monitoramento e diagnóstico de servidor.",
      },
      {
        when: "ago 2022 — jun 2025",
        role: "Desenvolvedor de Software",
        org: "Energy",
        note: "Gestão da equipe de back-end — distribuição de funções, definição de objetivos e qualidade do produto — somada ao desenvolvimento de novas funcionalidades e à reestruturação operacional dos sistemas.",
      },
      {
        when: "jan — mar 2022",
        role: "Desenvolvedor de Software",
        org: "Garty Group",
        note: "Back-end em empresa focada em FiveM, atendendo quatro servidores distintos com funcionalidades sob medida, otimizações e resolução de problemas operacionais.",
      },
      {
        when: "2020 — 2024",
        role: "Ciência da Computação",
        org: "UniFavip Wyden — Bacharelado",
        // Sem nota de propósito. A ementa que estava aqui era invenção,
        // e as certificações que a substituíram passaram para a seção
        // 01, onde crescem como lista. `note` é opcional — o
        // renderizador omite a coluna quando ela falta.
      },
    ],
  },

  contact: {
    kicker: "Fale comigo",
    big: "VAMOS CONVERSAR",
    primary: "Canal principal",
  },
};

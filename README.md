**Bistrobits - Cardápio Online para Restaurantes**

Bistrobits é um sistema de cardápio online desenvolvido para restaurantes modernos que desejam proporcionar uma experiência inovadora aos seus clientes. Este projeto nasceu da necessidade de preencher uma lacuna identificada na indústria gastronômica, onde muitos cardápios digitais oferecem apenas informações estáticas em PDF, não atendendo adequadamente às expectativas dos clientes em termos de experiência de usuário.

**Objetivo:**

O objetivo principal do Bistrobits é oferecer uma solução abrangente e inovadora para cardápios online, indo além da simples digitalização do cardápio convencional. Nosso software é projetado para:

* Apresentar visualmente os pratos de maneira atrativa, com imagens e descrições elaboradas.
* Proporcionar aos clientes informações detalhadas sobre os pratos oferecidos, incluindo ingredientes, preparo e preços transparentes.
* Facilitar a interação entre clientes e equipe do restaurante, através da funcionalidade de chamada de atendente para solicitações.         específicas ou esclarecimento de dúvidas.

**Instalação:**

Para instalar e executar o Bistrobits localmente, siga estas etapas:

1 - Clone o repositório para o seu ambiente de desenvolvimento:
git clone git@github.com:thiagoscosta33/bistrobits.git

2 - Navegue até o diretório do projeto:
cd bistrobits

3 - Instale as dependências do projeto:
npm install

4 - Inicie o servidor local:
npm start

Acesse o Bistrobits em seu navegador usando o endereço [Localhost](http://localhost:8081).

**Funcionalidades Principais:**

* Apresentação visual atrativa dos pratos, com imagens de alta qualidade e descrições elaboradas.
* Informações detalhadas sobre cada prato, incluindo ingredientes, alergênios e informações nutricionais.
* Preços transparentes para que os clientes possam tomar decisões informadas.
* Funcionalidade de chamada de atendente para solicitações específicas ou dúvidas.
* Integração de tecnologia QR Code para acesso instantâneo ao cardápio digital.

**Estrutura do Projeto:**

bistrobits/                                                                <br>
│                                                                          <br>
├── .vscode/        # Configurações do Visual Studio Code                  <br>
├── app/            # Código da aplicação                                  <br>
├── bistrobits/     # Configurações principais do projeto                  <br> 
├── certs/          # Certificados e chaves de segurança                   <br>
├── config/         # Arquivos de configuração                             <br>
├── data/           # Dados estáticos                                      <br> 
│   ├── diagnostic.data/                                                   <br>      
│   └── journal/                                                           <br>
├── helpers/        # Funções auxiliares                                   <br>
├── middlewares/    # Middlewares da aplicação                             <br>
├── models/         # Modelos de dados                                     <br>
├── node_modules/   # Dependências do projeto (geradas pelo npm)           <br> 
├── public/         # Arquivos públicos (HTML, CSS, imagens, etc.)         <br> 
│   ├── css/                                                               <br>
│   ├── img/                                                               <br> 
│   ├── js/                                                                <br> 
│   └── service/                                                           <br>
├── routers/        # Roteadores da aplicação                              <br>
├── uploads/        # Arquivos de upload                                   <br>
├── utils/          # Utilitários                                          <br> 
└── views/          # Arquivos de visualização (views)                     <br> 
    ├── admin/                                                             <br> 
    ├── cardapios/                                                         <br>
    ├── grupos/                                                            <br>
    ├── ingredientes/                                                      <br>
    ├── layouts/                                                           <br> 
    ├── offline/                                                           <br>
    ├── partials/                                                          <br>
    ├── produtos/                                                          <br>
    ├── usuarios/                                                          <br>  
    ├── welcome/                                                           <br>
    └──                                                                    <br>
└── __tests__/   # Testes do sistema                                       <br>
        ├── integration/                                                   <br> 
        └── unitarias/                                                     <br> 


**Tecnologias Utilizadas:**

O Bistrobits é desenvolvido utilizando as seguintes tecnologias:

* Frontend: HTML, CSS, JavaScript, bootstrap
* Backend: Node.js, Express.js
* Banco de Dados: MongoDB
* Outras ferramentas e bibliotecas: Git, GitHub, Visual Studio Code.


**Contribuição:**

Se você gostaria de contribuir com o desenvolvimento do Bistrobits, siga estas etapas:

Faça um fork do repositório.
Crie uma branch para sua funcionalidade (git checkout -b feature/nova-funcionalidade).
Faça commit de suas alterações (git commit -am 'Adiciona nova funcionalidade').
Faça push para a branch (git push origin feature/nova-funcionalidade).
Crie um novo Pull Request.

**Contato:**
Se você tiver alguma dúvida, sugestão ou problema, entre em contato com o responsável pelo projeto:
Nome: Thiago Costa
E-mail: thiagoscosta33@gmail.com
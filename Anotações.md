### Tabelas
Na persona de um desenvolvedor de software, crie a estrutura para um projeto de um website cujas telas tem os seguintes requisitos:
>Tela01 - Login:
- Logar no sistema com o email: mogiana@gmail.com e senha
- Perfis de acesso: user-geral, user-admin, user-clube
---------------------------------------------------------------
>Tela02 - Inicial:
- Criar barra de busca com o link das outras páginas (cabeçalho)
- Botão para acessar a tela de login (cabeçalho)
- Rodapé
- Perfis de acesso: user-geral, user-admin, user-clube
---------------------------------------------------------------
>Tela03 - Clube:
- Após efetuar o login com o email do clube Mogiana o usuário terá acesso a essa tela
- Listar todos os jogadores filiados ao clube
- Botão para cadastrar um novo atleta
- cabeçalho
- rodapé
- botão de editar jogador na grid
Perfis de acesso: user-clube
---------------------------------------------------------------
>Tela04 - Cadastro:
- Ao clicar no botão Novo Atleta da tela 03
- Cadastrar atleta que sera filiado ao clube
- Ao clicar em enviar cadastro, enviar formulário para o user-admin (não fazer inserção dos dados no banco)
Perfis de acesso: user-clube
---------------------------------------------------------------
>Tela05 - Editar:
- Ao clicar no botão de editar na grid da tela 03
- Listar os campos preenchidos anteriormente
- Editar registros
- clicar em enviar atualização (mesmo processo da tela de cadastro)
Perfis de acesso: user-clube
*********************************************************************
ESTRUTURA DO BANCO DE DADOS:
>tb_Federacao:
cd_Federacao (PK, int, não nulo, unico)	
nm_RazaoSocial (varchar(255), não nulo)	
nm_Fantasia (varchar(255), nulo)	
sg_Sigla (char(10), nulo)	
cd_CNPJ (char(14), não nulo, unico)	
cd_CEP (char(8), nao nulo)	
ds_EnderecoSede (varchar(255), não nulo)	
ds_Cidade (varchar(100), não nulo)	
sg_Estado (char(2), não nulo)	
nm_Presidente (varchar(255), não nulo)	
---------------------------------------------------------------
>tb_Clube:
cd_Federacao (PK, int, não nulo, unico)	
nm_RazaoSocial (varchar(255), não nulo)	
nm_Fantasia (varchar(255), nulo)	
sg_Sigla (char(10), nulo)	
cd_CNPJ (char(14), não nulo, unico)	
cd_CEP (char(8), não nulo)	
ds_EnderecoSede (varchar(255), não nulo)	
ds_Cidade (varchar(100), não nulo)	
sg_Estado (char(2), não nulo)	
nm_Presidente (varchar(255), não nulo)	
---------------------------------------------------------------
>tb_Aleta:
cd_Atleta (PK, int, não nulo, unico)	
nm_Atleta (varchar(100), não nulo)	
nm_Sobrenome (varchar(100), não nulo)	
cd_Federacao (FK, int, nao nulo)	
cd_Clube (FK, int, nao nulo)	
cd_Responsavel (FK, int, nulo)	
dt_Nascimento (date, não nulo)	
sg_Sexo (char(1), não nulo)	
cd_RG (char(9), nulo, unico)	
cd_CPF (char(11), nulo, unico)	
ds_Nacionalidade (varchar(100), não nulo)	
cd_Passaporte (varchar(20), nulo, unico)	
dt_ValidadePassaporte (date, nulo)	
ds_Endereco (varchar(255), nulo)	
ds_Cidade (varchar(100), nulo)	
sg_Estado (char(2), nulo)	
cd_CEP (char(8), nulo)	
ds_Status (varchar(20), nao nulo)	
---------------------------------------------------------------
>tb_ResponsavelAtleta:
cd_Responsavel (PK, int, não nulo, unico)	
cd_Atleta (FK, int, nao nulo)	
cd_Contato (FK, int, nao nulo)	
nm_Responsavel (varchar(255), não nulo)	
cd_RG_Responsavel (char(9), não nulo, unico)	
cd_CPF_Responsavel (char(11), não nulo, unico)	
---------------------------------------------------------------
>tb_Contato:
cd_Contato (PK, int, não nulo)	
cd_Federacao (FK, int, nulo)	
cd_Filiacao (FK, int, nulo)	
cd_Atleta (FK, int, nulo)	
cd_Telefone (varchar(15), não nulo)	
ds_Email (varchar(255), não nulo)	
ds_Facebook (varchar(255), nulo)	
ds_Instagram (varchar(255), nulo)	
ds_OutraRedeSocial (varchar(255), nulo)	
---------------------------------------------------------------
>tb_Contrato:
cd_Contrato (PK, int, não nulo)	
cd_Atleta (FK, int, nulo)	
cd_Clube_Origem (FK, int, nulo)	
cd_Clube_Destino (FK, int, nulo)	
dt_Inicio (date, não nulo)	
dt_Fim (date, não nulo)	
ds_Condicoes (text, nulo)	
ds_Status (varchar(50), não nulo)	
ds_Tipo (varchar(50), não nulo)	
dt_Criacao (date, não nulo)	
dt_Atualizacao (date, não nulo)	
***************************************************************
Linguagem adotada: backend (Java/Springboot), banco de dados (postgresql), front (Next.js), tendo em vista que serão utilizadas técnicas de segurança como dupla autenticação, perfis de acesso, microserviços e features. Aceito sugestões de tecnologias

### Estrutura do Projeto

```
meu-projeto/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── meuapp/
│   │   │   │           ├── controller/         # Controladores REST
│   │   │   │           ├── model/              # Modelos (Entidades)
│   │   │   │           ├── repository/          # Repositórios JPA
│   │   │   │           ├── service/             # Serviços de Negócio
│   │   │   │           ├── security/            # Configurações de segurança
│   │   │   │           └── exception/           # Tratamento de exceções
│   │   │   └── resources/
│   │   │       ├── application.properties        # Configurações do Spring
│   │   │       └── static/                       # Arquivos estáticos (se necessário)
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── meuapp/
│   │                   └── ...                   # Testes unitários e de integração
│   └── pom.xml                                    # Dependências do Maven
├── frontend/
│   ├── public/                                    # Arquivos públicos
│   ├── src/
│   │   ├── components/                           # Componentes reutilizáveis
│   │   ├── pages/                                # Páginas do Next.js
│   │   │   ├── login.js                          # Tela de Login
│   │   │   ├── index.js                          # Tela Inicial
│   │   │   ├── clube.js                          # Tela do Clube
│   │   │   ├── cadastro.js                       # Tela de Cadastro
│   │   │   └── editar.js                         # Tela de Edição
│   │   ├── styles/                               # Estilos globais e por componente
│   │   ├── utils/                                # Funções utilitárias
│   │   ├── contexts/                             # Contextos para gerenciar estado (se necessário)
│   │   └── hooks/                                # Hooks personalizados
│   ├── package.json                               # Dependências do Next.js
│   └── next.config.js                            # Configurações do Next.js
└── README.md                                      # Documentação do projeto
```

### Tecnologias Sugeridas

1. **Backend**:
   - **Spring Boot**: Para criar APIs RESTful com facilidade.
   - **Spring Security**: Para autenticação e autorização (dupla autenticação, perfis de acesso).
   - **JPA/Hibernate**: Para acesso ao banco de dados.
   - **PostgreSQL**: Como sistema de gerenciamento de banco de dados.

2. **Frontend**:
   - **Next.js**: Framework React que permite renderização do lado do servidor e facilita o SEO.
   - **Axios**: Para fazer requisições HTTP ao backend.
   - **Redux ou Context API**: Para gerenciar o estado global da aplicação.

3. **Segurança**:
   - **JWT (JSON Web Tokens)**: Para autenticação de usuários.
   - **Bcrypt**: Para hash de senhas no backend.

4. **Testes**:
   - **JUnit**: Para testes unitários no backend.
   - **React Testing Library**: Para testes de componentes no frontend.

5. **Desdobramentos Futuros**:
   - **Docker**: Para containerizar a aplicação.
   - **Kubernetes**: Para orquestração, caso a aplicação cresça.
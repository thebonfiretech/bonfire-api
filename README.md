# UaiLab API
API responsavel por suprir demandas de uma extensão de automatização de processos juridicos.


### Linguagem de Programação: 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
### Framework & Bibliotecas:
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Instalação

Clone o repositório:
```bash
git clone https://github.com/uailab/uailab-api
```
Entre no diretório do projeto:
```bash
cd uailab-api
```
Instale as dependências:
```bash
npm install 
```
## Uso em modo de desenvolvimento

```bash
npm run dev
```
## Build e Iniciação do build

```bash
npm run build
npm run start
```

## Arquitetura
- dist -> Pasta final do projeto compilado
- src -> Pasta destinada aos scripts
    - assets -> Pasta destinada a arquivos gerais e de configurações
        - config -> Arquivos de configuração do projeto
            - default.ts -> Arquivo de configuração geral do projeto
            - errors.ts -> Arquivo de configuração do retorno de erros
            - logger.ts -> Configuração de estilos do logger
    - database -> Pasta destinada a funções e models da database
        - models -> Models internos do projeto
        - index.ts -> Funções gerais e de conexão da database
    - middlewares -> Pasta destinada a middlewares
        - manageRequest.ts -> Gerenciador de requisições 
    - resources -> Pasta destinada aos recursos
        - [resource] -> Pasta controladora dos recursos da API
    - routes -> Pasta destinada as rotas
        - resouces -> Agrupamento dos arquivos de rotas
            - [resource].router.ts -> Roteamento do recurso
        - index.ts -> Arquivo principal de rotas  
    - utils -> Pasta destinada a funções e tipos gerais 
        - functions -> Pasta de funções globais 
        - types -> Pasta de tipos globais 
    - app.ts -> Arquivo de configuração do app express
    - server.ts -> Arquivo principal do projeto
- .env -> Variaveis de ambiente do projeto

## Autores

- [@odutradev](https://www.github.com/odutradev)

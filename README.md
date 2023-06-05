<h1 align=center>API KeyKeeper</h1>

## Descrição
KeyKeeper é uma API que permite usuários guardar diversos logins e senhas em um unico lugar sob uma unica senha. 

## Funcionalidades
- Armazenamento dos dados em banco de dados SQL (PostgreSQL)
- Registro de redes e logins
  - Usuários podem inserir e deletar nomes de redes e suas senhas (tabela Network)
  - Também inserir e deletar seus logins e senhas, junto do site/aplicativo em que são utilizados (tabela Credentials)
- Dados armazenados em banco de forma encriptada
- Aplicação construida utilizando arquitetura em camadas(Services, Controllers e Routers)
- Validação de novas entradas utilizando middlewares e schemas


## Instalação
Para a utilização da API
- Clone o repositório em sua máquina e instale as dependencias necessarias.
- Crie dois banco de dados PostgreSQL e configure os arquivos `.env.development` e `.env.test` de acordo com o `.env.example` fornecido.
- Carregue as migrations do prisma para a configuração dos bancos de dados
- Após a instalação seguir os passos a seguir

### Para o desenvolvimento utilize
```
npm run dev:migration run
```
E carregue a aplicação para desenvolvimento
```
npm run dev
```

### Para rodar os testes utilize
 ```
npm run test:migration run
```
Carregue o ambiente de teste
```
npm run test:watch
```


  







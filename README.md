Projeto para servidor em Node para o LinkClass.

Para execução, é necessário:

- Um projeto no Google Cloud Console, com client OAuth2 Web.
    - O clientID deve ser configurado em `.env.dev`, no campo
    `GOOGLE_WEB_CLIENT_ID`.
- Um banco de dados MySQL
    - Para que a aplicação possa acessar o banco, configure no arquivo
    `.env.dev` os campos:
        - `DB_HOST`: Endereço do banco de dados
        - `DB_USER`: Nome do usuário
        - `DB_PASS`: Senha
        - `DB_SCHEMA`: Schema a ser utilizado para tabelas do LinkClass
- Opcionalmente pode ser configurado o valor `JWT_SECRET`, o que afeta a
geração de token para autenticação no servidor.

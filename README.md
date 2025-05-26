# InfoVac Mobile API

API RESTful para o aplicativo mobile do InfoVac, um sistema de gerenciamento de vacinas em UBSs.

## Funcionalidades

- Autenticação de funcionários
- Listagem de UBSs
- Consulta de disponibilidade de vacinas
- Atualização de status de vacinas

## Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT para autenticação

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/infovac-mobile-api.git
cd infovac-mobile-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Copie o conteúdo do arquivo `.env.example` e preencha as variáveis

4. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints

### Autenticação
- `POST /api/mobile/login` - Login de funcionário

### UBS
- `GET /api/ubs` - Lista todas as UBSs
- `GET /api/ubs/:id` - Busca UBS por ID
- `GET /api/ubs/:id/vacinas` - Lista vacinas de uma UBS

### Vacinas
- `PUT /api/mobile/ubs/:ubsId/vacinas/:vacinaId` - Atualiza status de uma vacina

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.
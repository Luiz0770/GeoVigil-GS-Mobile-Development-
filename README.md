# GeoVigil — Alertas Comunitários de Desastres Naturais

> Aplicativo mobile de registro e monitoramento de ocorrências de desastres naturais em áreas urbanas e periurbanas.
> Desenvolvido para a disciplina de Desenvolvimento Mobile — FIAP (Global Solution).

---

## Identificação do Grupo

| Nome Completo | RM |
|---|---|
| Luiz Felipe | RM555074 |
| Vitor Musolino | RM555012 |
| Gabriel Vallejo | RM554973 |
| Lucas dias | RM555450 |
| Fernando Alexandre | RM555045 |
---

## Descrição da Solução

O **GeoVigil** é um aplicativo comunitário de alerta precoce para desastres naturais. Moradores registram sinais de risco observados no dia a dia — nível de rio subindo, rachaduras em encosta, focos de fumaça, ventos fortes — formando uma rede colaborativa de vigilância que complementa os canais oficiais de defesa civil.

### Problema Abordado

Desastres naturais em ambientes urbanos frequentemente têm sinais antecipados perceptíveis pela própria comunidade, mas não existe um canal simples e rápido para que esses sinais sejam registrados e compartilhados antes que os órgãos oficiais tomem ciência. O GeoVigil preenche essa lacuna.

### Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Cadastro de conta e login com validação de campos e indicador de força de senha |
| **Feed de Alertas** | Visualização de todos os alertas da comunidade, ordenados do mais recente, com filtro por tipo de desastre |
| **Registrar Alerta** | Formulário para reportar nova ocorrência com localização (bairro/rua), tipo de desastre, nível de risco e descrição |
| **Detalhes do Alerta** | Visualização completa de um alerta com metadados, descrição e opção de exclusão para o próprio autor |
| **Meus Alertas** | Histórico pessoal de ocorrências com resumo estatístico por nível de risco (bar chart) |
| **Logout** | Encerramento de sessão com retorno à tela de login |

### Tipos de Desastre Suportados

- Enchente
- Deslizamento
- Vendaval
- Incêndio
- Estiagem
- Outro

### Níveis de Risco

- **Baixo** — sinal de atenção, sem risco imediato
- **Medio** — situação de alerta, requer monitoramento
- **Alto** — risco iminente, ação necessária

### Telas do Aplicativo

```
Login  →  Cadastro
  |
Home (Feed de Alertas)
  |          |              |
Nova      Detalhes      Meus Alertas
Ocorrência  Alerta
```

1. **Login** — campos de email e senha, chip de credenciais de teste com preenchimento automático
2. **Cadastro** — 4 campos com validação inline e indicador de força de senha em 4 níveis
3. **Home** — feed com `FlatList`, chips de filtro por categoria, FAB para novo alerta, menu do usuário
4. **Nova Ocorrência** — seleção de tipo (grid 2 colunas), nível de risco (botões segmentados), descrição com contador de caracteres
5. **Detalhes** — metadados completos, exclusão com confirmação em dois passos (somente autor)
6. **Meus Alertas** — estatísticas com bar chart por nível de risco + histórico filtrado

### Decisões Técnicas

- **Persistência local via AsyncStorage** — sem dependência de backend ou internet
- **Dados mock pré-carregados** — 7 alertas e 2 usuários inicializados no primeiro boot para avaliação imediata
- **IDs no formato `AL-XXXX`** — gerados sequencialmente com persistência do contador
- **Tema escuro obrigatório** — paleta `#080E1C` como fundo base, inspirada em painéis de monitoramento
- **Gradientes via `expo-linear-gradient`** — botões primários, headers e FAB com efeito visual

---

## Stack e Dependências

| Tecnologia | Versão |
|---|---|
| React Native | 0.85.3 |
| Expo | 56.x |
| TypeScript | 6.x |
| React Navigation (Native Stack) | 7.x |
| AsyncStorage | 2.2.0 |
| expo-linear-gradient | 56.x |

---

## Instruções para Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)
- Celular e computador na **mesma rede Wi-Fi**

### Passo a Passo

**1. Instalar as dependências**

```bash
npm install
```

**2. Iniciar o servidor de desenvolvimento**

```bash
npx expo start
```

**3. Abrir no dispositivo**

- **Android:** abra o app **Expo Go** e escaneie o QR Code exibido no terminal
- **iOS:** use a câmera nativa para escanear o QR Code — ela reconhece e abre no Expo Go automaticamente

> O app já inicia com dados de demonstração. Não é necessária nenhuma configuração adicional.

### Rodar em emulador (opcional)

```bash
# Android (requer Android Studio com emulador configurado)
npm run android

# iOS (requer Xcode — apenas macOS)
npm run ios
```

---

## Credenciais de Teste

```
┌─────────────────────────────────────┐
│  Email:  fiap@teste.com             │
│  Senha:  123456                     │
└─────────────────────────────────────┘
```

> Na tela de Login há o chip **"Credenciais de teste"** que expande e exibe o email e a senha com um botão **"Preencher automaticamente"** — basta tocar para preencher os campos sem digitar.

### Usuário secundário (também disponível nos dados mock)

```
Email:  maria@teste.com
Senha:  123456
```

> O usuário `fiap@teste.com` possui 3 alertas pré-cadastrados, tornando a tela "Meus Alertas" e o bar chart de estatísticas visualmente informativos desde o primeiro acesso.

---

## Estrutura do Projeto

```
geovigil/
├── App.tsx                    # Entry point: inicialização de dados e providers
├── src/
│   ├── navigation/            # Stack Navigator com rotas públicas e privadas
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto de autenticação (login, cadastro, logout)
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── Cadastro.tsx
│   │   ├── Home.tsx
│   │   ├── NovaOcorrencia.tsx
│   │   ├── DetalhesOcorrencia.tsx
│   │   └── MinhasOcorrencias.tsx
│   ├── components/
│   │   ├── OcorrenciaCard.tsx  # Card do feed com borda colorida por nível de risco
│   │   ├── BadgeRisco.tsx      # Badge com dot indicator e glow colorido
│   │   └── BotaoPrimario.tsx   # Botão com LinearGradient
│   ├── services/
│   │   ├── authService.ts      # CRUD de usuários no AsyncStorage
│   │   ├── ocorrenciasService.ts # CRUD de alertas no AsyncStorage
│   │   └── storage.ts          # Abstração das chaves do AsyncStorage
│   ├── types/                  # Tipos TypeScript: Ocorrencia, Usuario, TipoDesastre, NivelRisco
│   ├── styles/
│   │   └── tema.ts             # Design tokens: cores, espaçamentos, sombras
│   └── utils/
│       ├── formatters.ts       # Formatação de datas, timestamps e geração de IDs
│       └── validators.ts       # Validação de email e senha
```

---

## Chaves do AsyncStorage

| Chave | Conteúdo |
|---|---|
| `@geovigil:usuarios` | Array de usuários cadastrados |
| `@geovigil:usuarioLogado` | Sessão ativa (usuario ou null) |
| `@geovigil:ocorrencias` | Feed completo de alertas |
| `@geovigil:inicializado` | Flag para evitar sobrescrever os mocks no segundo boot |
| `@geovigil:contadorId` | Contador sequencial para geração de IDs no formato `AL-XXXX` |

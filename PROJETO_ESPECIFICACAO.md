# GeoVigil — Alertas Comunitários de Desastres Naturais

> **Especificação Técnica e README de Entrega**
> Aplicativo Mobile em React Native com Expo
> Disciplina de Desenvolvimento Mobile — FIAP

---

## SEÇÃO 1 — DOCUMENTAÇÃO DE ENTREGA (README.md)

### Sobre o Projeto

O **GeoVigil** é um aplicativo comunitário de registro e visualização de possíveis ocorrências de desastres naturais em áreas urbanas e periurbanas. Moradores reportam sinais de risco observados no dia a dia — nível de rio subindo, rachaduras em encosta, foco de fumaça, vento forte — formando uma rede comunitária de alerta precoce que chega antes dos canais oficiais.

O usuário pode cadastrar-se, fazer login, visualizar o feed de alertas da comunidade, registrar um novo alerta com tipo, localização, descrição e nível de risco, ver o relato completo de qualquer alerta, e consultar seus próprios registros com resumo estatístico. Toda a persistência é feita localmente via AsyncStorage, sem dependência de backend.

Dados de teste são carregados automaticamente no primeiro boot para que o avaliador veja o app populado imediatamente.

### Identificação do Grupo

| Nome Completo            | RM            |
| ------------------------ | ------------- |
| [A PREENCHER]            | [A PREENCHER] |
| [A PREENCHER]            | [A PREENCHER] |
| [A PREENCHER]            | [A PREENCHER] |

### Instruções de Execução

```bash
npm install
```

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go (Android) ou câmera (iOS).

### Credenciais de Teste

```
┌─────────────────────────────────────┐
│  📧  Email:  fiap@teste.com         │
│  🔑  Senha:  123456                 │
└─────────────────────────────────────┘
```

> Na tela de Login existe o chip **"📋 Credenciais de teste"** que expande um card com email/senha e botão "Preencher automaticamente".

---

## SEÇÃO 2 — ARQUITETURA E BLUEPRINT DE IMPLEMENTAÇÃO

> **Instruções para o Claude Code:**
> 1. Leia esta especificação integralmente antes de criar qualquer arquivo.
> 2. Os arquivos de design em `mockup/` são a fonte de verdade visual — use-os como referência primária de layout, medidas e estilo.
> 3. O stack é TypeScript + React Navigation Native Stack + AsyncStorage. Não adicionar Redux, Zustand, React Query, styled-components, ou qualquer outra lib além das listadas em 2.1.
> 4. Calibração de complexidade: o projeto `sistema-consultas-mobile` (referência da aula). Soluções simples e bem executadas têm mais valor que complexas e incompletas.

---

### 2.1 Stack e Dependências

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/native": "^7.2.2",
    "@react-navigation/native-stack": "^7.14.12",
    "expo": "~55.0.6",
    "expo-linear-gradient": "~13.0.2",
    "expo-status-bar": "~55.0.4",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-native": "0.83.2",
    "react-native-safe-area-context": "~5.6.2",
    "react-native-screens": "~4.23.0",
    "react-native-web": "^0.21.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~5.9.2"
  }
}
```

> `expo-linear-gradient` é um pacote oficial do Expo SDK e é necessário para replicar os gradientes dos botões primários e backgrounds definidos no design.

---

### 2.2 Design System — Tokens Visuais

> **Fonte:** `mockup/ds.css` é o arquivo canônico. Todos os valores abaixo foram extraídos diretamente dele. Ao implementar, priorize `mockup/ds.css` em caso de divergência.

#### Tema: Dark Ops-Room

O app usa tema escuro obrigatório, inspirado em painéis de controle de monitoramento. A tela de fundo tem uma textura de grade fina (`40×40px`, azul em `4% de opacidade`) visível apenas no topo, produzida via `LinearGradient` em RN ou omitida se comprometer performance.

#### Paleta de Cores

```typescript
// src/styles/tema.ts
export const CORES = {
  // Superfícies
  fundo:       '#080E1C',  // fundo primário de todas as telas
  fundoCard:   '#0F1729',  // cards, painéis secundários
  fundoInput:  '#0B1322',  // campos de entrada
  borda:       '#1E2D4A',  // divisores, bordas inativas
  glass:       'rgba(15, 23, 42, 0.7)',        // fundo glassmorphism
  glassBorda:  'rgba(59, 130, 246, 0.2)',       // borda glassmorphism

  // Marca
  azul:        '#3B82F6',  // ação primária (botões, foco)
  azulEl:      '#60A5FA',  // elétrico: ícones ativos, hovers, glows
  ciano:       '#06B6D4',  // acento secundário

  // Risco / Alerta
  riscoBaixo:  '#10B981',  // verde
  riscoMedio:  '#F59E0B',  // âmbar
  riscoAlto:   '#EF4444',  // vermelho

  // Texto
  texto:       '#F1F5F9',  // primário
  textoSec:    '#94A3B8',  // secundário
  textoMuted:  '#64748B',  // terciário / apagado

  // Botão danger (texto/borda)
  dangerTexto: '#fda4a4',
  dangerBorda: 'rgba(239, 68, 68, 0.4)',
  dangerFundo: 'rgba(239, 68, 68, 0.08)',
};
```

#### Tipografia

```typescript
export const FONTES = {
  titulo: 'SpaceGrotesk-Bold',     // fallback: System bold
  tituloSemi: 'SpaceGrotesk-SemiBold',
  corpo:  'Inter-Regular',          // fallback: System regular
  corpoMed: 'Inter-Medium',
  mono:   'IBMPlexMono-Regular',    // fallback: monospace
};

// Escala tipográfica (fontSize em px)
export const TIPO = {
  // Títulos de tela (Space Grotesk 700, letterSpacing 0.14em, uppercase)
  screenTitle: { fontSize: 17, fontWeight: '700', letterSpacing: 2.4, textTransform: 'uppercase' as const },
  // Eyebrow acima do título (IBM Plex Mono, uppercase)
  eyebrow: { fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  // Section label (Space Grotesk 600, uppercase, com dot antes)
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 1.76, textTransform: 'uppercase' as const },
  // Field label
  fieldLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.1, textTransform: 'uppercase' as const },
  // Body card (Inter)
  body: { fontSize: 14, lineHeight: 21 },
  bodySm: { fontSize: 13, lineHeight: 18.85 },
  bodyXs: { fontSize: 12.5 },
  // Mono timestamp
  mono: { fontSize: 11, letterSpacing: 0.44 },
  monoSm: { fontSize: 10.5, letterSpacing: 0.63 },
};
```

> **Nota de fonte:** Space Grotesk e IBM Plex Mono requerem `expo-font` + `@expo-google-fonts/*`. Para o escopo da disciplina, substituir pelos fallbacks do sistema (`Platform.select({ ios: 'System', android: 'sans-serif' })`) é aceitável. A aplicação do estilo permanece idêntica — apenas a família tipográfica muda.

#### Dimensões e Bordas

```typescript
export const RAIOS = { sm: 8, md: 10, lg: 12, xl: 14, fab: 17 };
export const ESPACO = { xs: 8, sm: 12, md: 18, lg: 24, xl: 32 };

// Alturas fixas de componentes
export const ALTURAS = {
  input:   48,  // campos de texto
  botao:   50,  // botão primário/secundário
  botaoSm: 44,  // botão secundário compacto
  chip:    32,  // filtro do feed
  segBtn:  46,  // segmento de risco
  typeCard: 78, // card de tipo de desastre
  iconBtn: 38,  // botão ícone no header
  fab:     58,  // floating action button
};
```

#### Shadows / Glow (RN)

Em React Native, `box-shadow` com `spread` e `blur` colorido não existe nativamente. Implementar como:

```typescript
// Glow azul (botão primário, FAB)
export const SHADOW_AZUL = {
  shadowColor: '#3B82F6',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.8,
  shadowRadius: 16,
  elevation: 10,
};

// Glow risco alto
export const SHADOW_ALTO = {
  shadowColor: '#EF4444',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};

// Glow risco medio
export const SHADOW_MEDIO = {
  shadowColor: '#F59E0B',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};

// Glow risco baixo
export const SHADOW_BAIXO = {
  shadowColor: '#10B981',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};
```

#### Glassmorphism em RN

O CSS usa `backdrop-filter: blur(14px)` — não disponível em React Native padrão. Simular com:

```typescript
// Estilo glassmorphism RN
const estiloGlass = {
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  borderWidth: 1,
  borderColor: 'rgba(59, 130, 246, 0.2)',
  borderRadius: 14,
  // O efeito de desfoque não é aplicável sem expo-blur,
  // mas a transparência semelhante é suficiente visualmente.
};
```

#### Gradientes (expo-linear-gradient)

```typescript
// Botão primário
<LinearGradient colors={['#4d8df8', '#3B82F6']} style={styles.botao}>
  <Text>Entrar</Text>
</LinearGradient>

// Fundo da tela de Login
<LinearGradient colors={['#080E1C', '#0D1B35']} style={StyleSheet.absoluteFill} />

// Header das telas internas
<LinearGradient colors={['#0c1733', '#080e1c']} style={styles.header} />

// FAB
<LinearGradient colors={['#60A5FA', '#3B82F6']} style={styles.fab} />
```

---

### 2.3 Árvore de Diretórios

```
geovigil/
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── tsconfig.json
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── mockup/                          # ← ARQUIVOS DO CLAUDE DESIGN (já existem, não criar)
│   ├── ds.css                       #   Fonte de verdade dos tokens visuais
│   ├── icons.jsx                    #   Ícones SVG + constantes TYPES e RISKS
│   ├── data.jsx                     #   Mock data e helpers de formatação
│   ├── components.jsx               #   OccurrenceCard, Field, Header
│   ├── screens-auth.jsx             #   LoginScreen, SignupScreen
│   ├── screens-feed.jsx             #   FeedScreen, NewOccurrenceScreen
│   ├── screens-detail.jsx           #   DetailScreen, MineScreen
│   ├── app.jsx                      #   Roteamento e estado (referência de fluxo)
│   ├── index.html                   #   Entry point HTML
│   ├── Design System.html           #   Documentação visual completa
│   └── screenshots/                 #   PNGs de referência por tela
└── src/
    ├── navigation/
    │   └── index.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── screens/
    │   ├── index.ts
    │   ├── Login.tsx
    │   ├── Cadastro.tsx
    │   ├── Home.tsx
    │   ├── NovaOcorrencia.tsx
    │   ├── DetalhesOcorrencia.tsx
    │   └── MinhasOcorrencias.tsx
    ├── components/
    │   ├── OcorrenciaCard.tsx
    │   ├── BadgeRisco.tsx
    │   ├── BotaoPrimario.tsx        # wrapper de LinearGradient + TouchableOpacity
    │   └── IconeSatellite.tsx       # SVG do logo como componente RN
    ├── services/
    │   ├── authService.ts
    │   ├── ocorrenciasService.ts
    │   └── storage.ts
    ├── types/
    │   ├── usuario.ts
    │   ├── ocorrencia.ts
    │   ├── tipoDesastre.ts
    │   └── nivelRisco.ts
    ├── styles/
    │   └── tema.ts                  # Exporta CORES, FONTES, TIPO, RAIOS, ESPACO, ALTURAS, SHADOWs
    └── utils/
        ├── formatters.ts
        └── validators.ts
```

---

### 2.4 Planejamento das Telas

Referência visual primária: `mockup/screenshots/` e arquivos `screens-*.jsx`.
Referência de tokens: `mockup/ds.css`.
Referência de ícones: `mockup/icons.jsx` (ícones SVG stroke — reimplementar em RN como componentes SVG ou substituir por react-native-svg equivalentes).

#### Tela 1 — Login (`src/screens/Login.tsx`)

**Rota:** `Login` (pública, sem header do navigator — `headerShown: false`)

**Layout** (ver `mockup/screens-auth.jsx → LoginScreen` e `mockup/screenshots/01-login2.png`):
- Fundo: `LinearGradient` vertical `#080E1C → #0D1B35`, ocupa tela inteira.
- `ScrollView` flex com conteúdo centralizado verticalmente.
- **Bloco de marca** (centralizado): Logo (`LogoMark` — quadrado 56px, `borderRadius: 16`, gradiente `#14213f → #0b1428`, borda `rgba(96,165,250,0.45)`, glow azul, ícone de satélite interno); título `GEOVIGIL` (Space Grotesk 700, 30px, letterSpacing 0.28em); subtítulo "Alerta Comunitário de Desastres Naturais" (Inter 400, 13.5px, `textoSec`).
- **Formulário**: 2 campos (`Field` com label "EMAIL" / "SENHA", altura 48px, bg `fundoInput`, borda `borda`, `borderRadius: 10`; foco acende borda `azul` + shadow glow).
- **Mensagem de erro** inline: cor `#fca5a5`, ícone X à esquerda.
- **Botão "Entrar"**: `BotaoPrimario` com `LinearGradient ['#4d8df8', '#3B82F6']`, altura 50px, `borderRadius: 10`, glow shadow azul.
- **Link "Não tem conta? Cadastrar-se"**: `textoSec`, texto span sublinhado em `azulEl`, centralizado.
- **Chip de credenciais** (rodapé): `fontFamily mono`, 11px, `textoMuted`, bg `rgba(15,23,42,0.5)`, borda `borda`, borderRadius 8. Ao expandir: card glassmorphism com linhas EMAIL/SENHA em mono + botão "Preencher automaticamente" (`gv-btn-secondary` em RN: bg `fundoCard`, borda `borda`, altura 40px).

**Lógica:** `useAuth().login(email, senha)` → em sucesso Navigator redireciona automaticamente para Home via contexto.

**Credenciais do mock:** `fiap@teste.com` / `123456` (exibidas no chip, preenchidas ao toque).

---

#### Tela 2 — Cadastro (`src/screens/Cadastro.tsx`)

**Rota:** `Cadastro` (pública, `headerShown: false`)

**Layout** (ver `mockup/screens-auth.jsx → SignupScreen` e `mockup/screenshots/01-signup.png`):
- Header customizado com botão ← (iconBtn 38px, `fundoCard`, borda `borda`, `borderRadius: 10`) e título "Nova Conta" (gv-title).
- Texto descritivo "Crie sua conta para registrar e acompanhar alertas de desastres na sua região." (Inter, 13px, `textoSec`).
- 4 campos `Field`: Nome completo, Email, Senha, Confirmar senha.
- Indicador de força da senha: barra 4 segmentos (height 4px, gap 5px); estados: inativa `borda`, Fraca `#EF4444`, Razoável `#F59E0B`, Boa `#06B6D4`, Forte `#10B981` — com glow colorido ao segmento ativo. Label da força em IBM Plex Mono abaixo da barra.
- Validação inline por campo: borda `rgba(6,182,212,0.5)` + ícone ✓ ciano → válido; borda `rgba(239,68,68,0.6)` + ícone ✕ vermelho → inválido.
- Botão "Criar conta" primário: desabilitado (`opacity: 0.4`) enquanto campos inválidos.

**Lógica:** `authService.cadastrarUsuario(nome, email, senha)` → persiste em `@geovigil:usuarios`, grava sessão em `@geovigil:usuarioLogado`, redireciona para Home.

---

#### Tela 3 — Home / Feed de Alertas (`src/screens/Home.tsx`)

**Rota:** `Home` (privada — rota inicial pós-login)

**Layout** (ver `mockup/screens-feed.jsx → FeedScreen` e `mockup/screenshots/02-feed.png`):
- **Header** (`LinearGradient #0c1733 → #080e1c`, borda inferior `borda` + glow azul sutil):
  - Esquerda: mini logo satélite (34×34px).
  - Centro: eyebrow mono `<dot pulsante /> N alertas ativos` + título "Feed de Alertas".
  - Direita: avatar circular com iniciais do usuário (38px, `borderRadius: 10`, gradiente `#1e3a6b → #0f1c38`, borda `rgba(96,165,250,0.4)`). Tap abre dropdown glassmorphism com nome, email, botão "Meus alertas" e botão "Sair da conta" (danger).
- **Filtros**: `ScrollView` horizontal com chips (height 32px, `borderRadius: 8`, bg `fundoCard`, borda `borda`; ativo: bg `rgba(59,130,246,0.16)`, borda `azul`, texto `azulEl`, glow). Chips: Todos · Enchente · Deslizamento · Vendaval · Incêndio · Estiagem · Outro — cada um com ícone SVG do tipo.
- **Lista** (`FlatList` ou `ScrollView`): gap 12px, padding `18px horizontal / 14px top / 110px bottom` (para o FAB). Estado vazio: ícone de radar 48px + texto "Nenhum alerta" + "Não há registros para este filtro."
- **`<OcorrenciaCard />`**: ver 2.10.
- **FAB**: posição absoluta `right: 20, bottom: 40`, 58×58px, `borderRadius: 17`, `LinearGradient #60A5FA → #3B82F6`, borda `rgba(147,197,253,0.6)`, glow azul intenso. Ícone `+` branco 26px. Tap → `NovaOcorrencia`.

---

#### Tela 4 — Novo Alerta (`src/screens/NovaOcorrencia.tsx`)

**Rota:** `NovaOcorrencia` (privada)

**Layout** (ver `mockup/screens-feed.jsx → NewOccurrenceScreen` e `mockup/screenshots/01-new.png`):
- Header com botão ✕ (iconBtn) e título "Registrar Alerta".
- **Seção "LOCALIZAÇÃO"** (section label com dot azul): 2 campos `Field` com ícone pin — Bairro / Rua e número.
- **Seção "TIPO DE DESASTRE"**: grid 2 colunas, 6 cards de 78px (`gv-typecard`). Cada card: ícone SVG 26px `azulEl` + label Space Grotesk 11.5px. Ativo: borda `azulEl`, bg `rgba(59,130,246,0.12)`, glow inset.
- **Seção "NÍVEL DE RISCO"**: 3 botões segmentados lado a lado, altura 46px. Inativo: bg `fundoCard`, borda `borda`, texto `textoMuted`. Ativo Baixo: texto `#6ee7c0`, borda `#10B981`, bg `rgba(16,185,129,0.14)`, glow verde. Ativo Médio: âmbar. Ativo Alto: vermelho.
- **Seção "DESCRIÇÃO"**: `TextInput` multiline, minHeight 110px, bg `fundoInput`, borda `borda`, `borderRadius: 10`, placeholder "Descreva o risco observado (ex: nível da água, rachaduras, fumaça)...". Contador de caracteres em mono 10.5px, canto inferior direito, muda para `riscoMedio` ao superar 250/280 chars.
- **Dock** (fundo fixo): `LinearGradient ['transparent', fundo 60%]`, borda superior `borda`. Botão "REGISTRAR ALERTA" primário, desabilitado enquanto campos obrigatórios vazios.

**Lógica:** monta `Ocorrencia` com `id: gerarIdAlerta()`, `usuarioId` do contexto, `data: new Date()`, chama `ocorrenciasService.adicionarOcorrencia(...)`. Em sucesso → `Alert.alert` + `navigation.goBack()`.

---

#### Tela 5 — Detalhes do Alerta (`src/screens/DetalhesOcorrencia.tsx`)

**Rota:** `DetalhesOcorrencia` (privada, recebe `route.params.ocorrenciaId: string`)

**Layout** (ver `mockup/screens-detail.jsx → DetailScreen` e `mockup/screenshots/01-detail.png`):
- Header com botão ← e título = tipo do alerta (com ícone SVG do tipo à esquerda do título).
- **Hero card** (glassmorphism, borda colorida pelo risco `rgba(cor, 0.33)`, glow sutil): ícone do tipo 30px (quadrado 60px, bg `fundoInput`, `borderRadius: 16`) + `BadgeRisco` grande (height 30px, fontSize 11.5). Título do tipo em Space Grotesk 22px. Linha mono: data · hora · ID do alerta (`azulEl`, opacity 0.7) à direita.
- **Grid de metadados** (2 colunas, gap 18px): 📍 Localização (bairro em negrito + rua), 👤 Registrado por, 📅 Data, 🕐 Hora. Cada célula com label uppercase 10px + valor 13.5px.
- **Divisor** `height: 1, bg: borda`.
- **Seção "DESCRIÇÃO DO RISCO"** (label + card glassmorphism): parágrafo Inter 14px, lineHeight 1.6, `texto`.
- **Exclusão (somente autor):** Primeiro estado: botão `gv-btn-danger` (bg `dangerFundo`, borda `dangerBorda`, texto `dangerTexto`, ícone lixeira). Após toque: troca por card glassmorphism com borda vermelha + texto de confirmação + botões "Cancelar" (secondary) e "Excluir" (danger compacto). Em confirmação: `ocorrenciasService.removerOcorrencia(id)` → volta para Home.

---

#### Tela 6 — Meus Alertas (`src/screens/MinhasOcorrencias.tsx`)

**Rota:** `MinhasOcorrencias` (privada)

**Layout** (ver `mockup/screens-detail.jsx → MineScreen` e `mockup/screenshots/02-mine.png`):
- Header com botão ← e título "Meus Alertas".
- **Card de estatísticas** (glassmorphism): total de alertas em Space Grotesk 700/38px + nome do usuário + ícone `ILayers`. Mini bar chart: 3 linhas (Baixo/Médio/Alto), cada com label 10.5px, track bg `fundoInput` height 8px `borderRadius: 4`, fill colorido pelo risco com glow, contador mono 12px à direita.
- **Lista filtrada** (igual à Home, sem chips de filtro). Label "HISTÓRICO · N" acima.
- **Estado vazio**: ícone satélite 64px cor `borda`, título "Nenhum alerta registrado", subtexto "Quando você registrar um alerta, ele aparecerá aqui.", botão primário "Registrar primeiro alerta" → `NovaOcorrencia`.

---

### 2.5 Estratégia de Persistência com AsyncStorage

| Key                         | Conteúdo                                                           |
| --------------------------- | ------------------------------------------------------------------ |
| `@geovigil:usuarios`        | `Usuario[]` — todos os cadastros.                                  |
| `@geovigil:usuarioLogado`   | `Usuario \| null` — sessão ativa.                                  |
| `@geovigil:ocorrencias`     | `Ocorrencia[]` — feed completo.                                    |
| `@geovigil:inicializado`    | `"true"` — evita sobrescrever mocks no segundo boot.               |
| `@geovigil:contadorId`      | `number` — próximo sufixo numérico para IDs no formato "AL-XXXX". |

**Fluxos:** `inicializarDados()` no `useEffect` do `App.tsx` checa `@geovigil:inicializado` → se ausente, grava mocks e flag. Login, cadastro, novo alerta, exclusão e logout seguem o padrão do projeto de referência (leitura do array → mutação → gravação do array completo).

**IDs**: gerados pelo utilitário `gerarIdAlerta()` em `utils/formatters.ts`:
```typescript
export async function gerarIdAlerta(): Promise<string> {
  const raw = await AsyncStorage.getItem('@geovigil:contadorId');
  const atual = raw ? parseInt(raw, 10) : 4822;
  await AsyncStorage.setItem('@geovigil:contadorId', String(atual + 1));
  return `AL-${atual}`;
}
```

**Reconversão de datas:** ao ler `@geovigil:ocorrencias`, reconverter `data` de string ISO para `new Date(c.data)` — exatamente como o projeto de referência faz.

---

### 2.6 Mocks de Dados Iniciais

> Alinhados com `mockup/data.jsx → SEED_OCCURRENCES`. As datas são calculadas como offsets de `new Date()` para que o feed pareça recente.

#### Usuários (`inicializarUsuarios`)

```typescript
const USUARIOS_INICIAIS: Usuario[] = [
  { id: 1, nome: "Usuário FIAP", email: "fiap@teste.com", senha: "123456" },
  { id: 2, nome: "Maria Silva",  email: "maria@teste.com", senha: "123456" },
];
```

> ⚠️ As credenciais do design (`agente@geovigil.app` / `vigia123`) são apenas do protótipo HTML. O app usa `fiap@teste.com` / `123456` conforme exigido pelo professor.

#### Alertas (`inicializarOcorrencias`)

```typescript
// ids seguem o padrão "AL-XXXX" definido no design
// os 3 primeiros têm usuarioId 1 para popular "Meus Alertas" do usuário de teste
const agora = new Date();
const min = 60 * 1000, hr = 60 * min, dia = 24 * hr;

const OCORRENCIAS_INICIAIS: Ocorrencia[] = [
  {
    id: "AL-4820",
    usuarioId: 1,
    autorNome: "Usuário FIAP",
    tipo: "deslizamento",
    bairro: "Jardim Ângela",
    rua: "Encosta da Rua Catequese, próximo ao nº 80",
    descricao:
      "Rachaduras novas no barranco depois de 2 dias de chuva contínua. Solo encharcado e pequenos desprendimentos de terra já visíveis sobre o muro de contenção.",
    nivelRisco: "alto",
    data: new Date(agora.getTime() - 1.5 * hr),
  },
  {
    id: "AL-4815",
    usuarioId: 1,
    autorNome: "Usuário FIAP",
    tipo: "incendio",
    bairro: "Parque do Carmo",
    rua: "Trilha leste, próximo ao portão 3",
    descricao:
      "Vegetação seca e foco de fumaça avistado ao longe dentro do parque. Tempo seco e vento ajudam a propagação. Bombeiros ainda não acionados no local.",
    nivelRisco: "medio",
    data: new Date(agora.getTime() - 8 * hr),
  },
  {
    id: "AL-4805",
    usuarioId: 1,
    autorNome: "Usuário FIAP",
    tipo: "enchente",
    bairro: "Vila Prudente",
    rua: "Córrego do Oratório, Rua Ibitirama",
    descricao:
      "Córrego subindo rápido e bocas de lobo entupidas. Água acumulando na pista e já entrando em garagens no trecho mais baixo da rua.",
    nivelRisco: "medio",
    data: new Date(agora.getTime() - 2 * dia - 3 * hr),
  },
  {
    id: "AL-4821",
    usuarioId: 2,
    autorNome: "Maria Silva",
    tipo: "enchente",
    bairro: "Jardim Pantanal",
    rua: "Margem do Rio Tietê, altura da Rua Antônio Pereira",
    descricao:
      "Nível do Rio Tietê subiu cerca de 1m em 3h após chuva forte a montante. Água já cobre a marginal e avança sobre as primeiras ruas. Moradores começando a sair.",
    nivelRisco: "alto",
    data: new Date(agora.getTime() - 22 * min),
  },
  {
    id: "AL-4818",
    usuarioId: 2,
    autorNome: "Maria Silva",
    tipo: "vendaval",
    bairro: "Santo Amaro",
    rua: "Av. Adolfo Pinheiro, 1500",
    descricao:
      "Previsão de ventos fortes para as próximas horas. Árvores de grande porte já inclinadas sobre a fiação elétrica, com risco de queda sobre a via.",
    nivelRisco: "medio",
    data: new Date(agora.getTime() - 5 * hr),
  },
  {
    id: "AL-4810",
    usuarioId: 2,
    autorNome: "Maria Silva",
    tipo: "estiagem",
    bairro: "Brasilândia",
    rua: "Reservatório comunitário, Rua Parapuã",
    descricao:
      "Nível do reservatório que abastece a comunidade visivelmente baixo após semanas sem chuva. Pressão da água caindo nas casas mais altas da rua.",
    nivelRisco: "baixo",
    data: new Date(agora.getTime() - dia - 6 * hr),
  },
  {
    id: "AL-4798",
    usuarioId: 2,
    autorNome: "Maria Silva",
    tipo: "deslizamento",
    bairro: "Sacomã",
    rua: "Rua dos Mecânicos, encosta sul",
    descricao:
      "Pequeno escorregamento de terra na base da encosta, sem atingir residências. Registrado para monitoramento caso a chuva volte nos próximos dias.",
    nivelRisco: "baixo",
    data: new Date(agora.getTime() - 3 * dia),
  },
];
```

> Com estes 7 mocks o usuário FIAP já tem 3 alertas em "Meus Alertas" (1 alto + 2 médios), tornando o bar chart da Tela 6 visualmente informativo desde o boot.

---

### 2.7 Tipos (TypeScript)

> **Atenção:** Os valores de `TipoDesastre` e `NivelRisco` agora usam **lowercase** sem acentos, exatamente como as chaves dos objetos `TYPES` e `RISKS` em `mockup/icons.jsx`. Isso elimina ambiguidade ao adaptar código do design para RN.

```typescript
// src/types/tipoDesastre.ts
export type TipoDesastre =
  | "enchente"
  | "deslizamento"
  | "vendaval"
  | "incendio"
  | "estiagem"
  | "outro";

// src/types/nivelRisco.ts
export type NivelRisco = "baixo" | "medio" | "alto";

// src/types/usuario.ts
export type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha: string;
};

// src/types/ocorrencia.ts
import { TipoDesastre } from "./tipoDesastre";
import { NivelRisco } from "./nivelRisco";

export type Ocorrencia = {
  id: string;           // formato "AL-XXXX" — alinhado com o design
  usuarioId: number;
  autorNome: string;
  tipo: TipoDesastre;
  bairro: string;
  rua: string;
  descricao: string;
  nivelRisco: NivelRisco;
  data: Date;
};
```

#### Mapeamento Design → App (para referência do Claude Code)

| Campo no `mockup/data.jsx` | Campo em `Ocorrencia` | Notas                          |
| -------------------------- | ---------------------- | ------------------------------ |
| `id`                       | `id`                   | Mesmo formato "AL-XXXX"        |
| `type`                     | `tipo`                 | Mesmos valores lowercase       |
| `risk`                     | `nivelRisco`           | Mesmos valores lowercase       |
| `bairro`                   | `bairro`               | Idêntico                       |
| `rua`                      | `rua`                  | Idêntico                       |
| `desc`                     | `descricao`            | Conteúdo igual, nome diferente |
| `author`                   | `autorNome`            | Conteúdo igual, nome diferente |
| `ts` (ms number)           | `data` (Date)          | `new Date(ts)` ↔ `data.getTime()` |

---

### 2.8 Tipagem das Rotas (Navigation)

```typescript
// src/navigation/index.tsx
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  NovaOcorrencia: undefined;
  DetalhesOcorrencia: { ocorrenciaId: string };  // string, não number
  MinhasOcorrencias: undefined;
};
```

`Stack.Navigator` condicional por `usuario` (padrão do projeto de referência). `headerShown: false` nas rotas públicas (Login, Cadastro) pois usam header customizado. Nas telas privadas, o header nativo pode ser omitido e substituído pelo componente `Header` customizado do design, ou usar `headerStyle: { backgroundColor: CORES.fundo }` + `headerTintColor: CORES.texto`.

---

### 2.9 AuthContext

API mínima (igual ao projeto de referência):

```typescript
type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
};
```

No mount: checa `@geovigil:usuarioLogado` e popula estado. Log no console com emojis 🔐/🔓 para debug durante apresentação.

---

### 2.10 Componentes Reutilizáveis

#### `<OcorrenciaCard ocorrencia={Ocorrencia} onPress={() => void} />`

Referência: `mockup/components.jsx → OccurrenceCard` e `mockup/ds.css → .gv-occ`.

```
┌──────────────────────────────────────────────────────────┐  ← borderRadius 12
│  [ícone tipo 19px] Deslizamento          [●Alto]         │  ← linha 1: tipo + badge
│  📍 Jardim Ângela · Encosta da Rua Catequese...          │  ← linha 2: localização
│  Rachaduras novas no barranco depois de 2 dias...        │  ← linha 3: descrição 2 linhas
│  🕐 há 1h 30min · 07 JUN 2026              AL-4820       │  ← linha 4: tempo mono + ID
└──────────────────────────────────────────────────────────┘
   ↑ borderLeft: 4px cor sólida do risco
```

- **Fundo:** glassmorphism (`rgba(15,23,42,0.7)`, borda `rgba(59,130,246,0.2)`, `borderRadius: 12`).
- **Borda esquerda:** 4px, cor sólida: `riscoBaixo | riscoMedio | riscoAlto`.
- **Padding:** `13px vertical / 15px left / 14px right`.
- **Ícone do tipo:** 19px, cor `azulEl`, componente SVG ou emoji fallback.
- **Tipo:** Space Grotesk 600, 15px, `texto`.
- **Badge:** `<BadgeRisco nivel={...} />` à direita.
- **Localização:** `textoSec` 12.5px, ícone pin `textoMuted` 14px.
- **Descrição:** Inter 13px, `textoSec`, `numberOfLines={2}`.
- **Timestamp:** IBM Plex Mono 11px, `textoMuted`, ícone clock 13px. Formato: `há X min/h/dias · DD MMM AAAA`.
- **ID:** IBM Plex Mono 10.5px, `azulEl`, opacity 0.65, alinhado à direita.

#### `<BadgeRisco nivel={NivelRisco} size?: 'sm' | 'lg' />`

Referência: `mockup/icons.jsx → RiskBadge` e `mockup/ds.css → .gv-badge, .gv-risk-*`.

```typescript
// Configuração por nível
const CONFIG_BADGE = {
  baixo: {
    texto:  '#6ee7c0',
    fundo:  'rgba(16,185,129,0.12)',
    borda:  'rgba(16,185,129,0.4)',
    dot:    '#10B981',
    glow:   'rgba(16,185,129,0.55)',
  },
  medio: {
    texto:  '#fcd081',
    fundo:  'rgba(245,158,11,0.12)',
    borda:  'rgba(245,158,11,0.4)',
    dot:    '#F59E0B',
    glow:   'rgba(245,158,11,0.55)',
  },
  alto: {
    texto:  '#fca5a5',
    fundo:  'rgba(239,68,68,0.12)',
    borda:  'rgba(239,68,68,0.45)',
    dot:    '#EF4444',
    glow:   'rgba(239,68,68,0.6)',
  },
};
// Estrutura: [dot 6px circular] "Risco Baixo/Médio/Alto"
// sm: height 26, fontSize 11, padding 0 10
// lg: height 30, fontSize 11.5, padding 0 13
```

Shadow em iOS:
```typescript
shadowColor: config.dot,
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 0.55,
shadowRadius: 6,
elevation: 3,
```

#### `<BotaoPrimario label={string} onPress={...} disabled={boolean} />`

```typescript
// Wrapper: LinearGradient + TouchableOpacity
<LinearGradient
  colors={disabled ? ['#2a3a5c', '#1e2d4a'] : ['#4d8df8', '#3B82F6']}
  style={{ height: 50, borderRadius: 10, ...SHADOW_AZUL }}
>
  <TouchableOpacity style={estilosBotao.inner} onPress={onPress} disabled={disabled}>
    <Text style={estilosBotao.label}>{label}</Text>
  </TouchableOpacity>
</LinearGradient>
// label: Space Grotesk 700, 13px, letterSpacing 0.12em, uppercase, branco
```

---

### 2.11 Utils

```typescript
// src/utils/formatters.ts

export function formatarData(data: Date): string {
  const MESES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  const d = new Date(data);
  return `${String(d.getDate()).padStart(2,"0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatarHora(data: Date): string {
  const d = new Date(data);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

export function formatarRelativo(data: Date): string {
  const diff = Date.now() - new Date(data).getTime();
  const min = 60000, hr = 60 * min, dia = 24 * hr;
  if (diff < hr) return `há ${Math.max(1, Math.round(diff / min))} min`;
  if (diff < dia) return `há ${Math.round(diff / hr)} h`;
  const d = Math.round(diff / dia);
  return `há ${d} ${d === 1 ? "dia" : "dias"}`;
}

// Exibição: "há 22 min · 07 JUN 2026"
export function formatarTimestamp(data: Date): string {
  return `${formatarRelativo(data)} · ${formatarData(data)}`;
}

export async function gerarIdAlerta(): Promise<string> {
  const raw = await AsyncStorage.getItem('@geovigil:contadorId');
  const atual = raw ? parseInt(raw, 10) : 4822;
  await AsyncStorage.setItem('@geovigil:contadorId', String(atual + 1));
  return `AL-${atual}`;
}

// src/utils/validators.ts
export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validarSenha(senha: string): boolean {
  return senha.length >= 6;
}
```

---

### 2.12 Checklist Final para o Claude Code

- [ ] `npm install` roda sem erros com as versões exatas do `package.json` (incluindo `expo-linear-gradient`).
- [ ] `npx expo start` levanta o Metro Bundler sem warnings críticos.
- [ ] Login com `fiap@teste.com` / `123456` funciona no primeiro boot.
- [ ] Feed da Home aparece populado com os 7 alertas mock, ordenados do mais recente.
- [ ] Cards têm borda esquerda colorida pelo nível de risco.
- [ ] Filtros por tipo de desastre funcionam corretamente.
- [ ] FAB abre a tela de Novo Alerta; alerta criado aparece no topo do feed.
- [ ] Novo alerta persiste após fechar e reabrir o app (valida AsyncStorage).
- [ ] Detalhes do alerta exibem metadados completos e botão de exclusão apenas para o autor.
- [ ] Exclusão com confirmação de dois passos funciona e remove do feed.
- [ ] "Meus Alertas" exibe corretamente os 3 alertas do Usuário FIAP + bar chart.
- [ ] Estado vazio em "Meus Alertas" aparece se criado usuário sem alertas.
- [ ] Logout retorna corretamente à tela de Login.
- [ ] Cores escuras aplicadas em todas as telas (fundo `#080E1C`, nunca branco).
- [ ] Botão primário usa `LinearGradient` (não cor sólida).
- [ ] Badges de risco têm a cor e o dot indicator corretos.
- [ ] Nenhuma biblioteca fora da lista do `package.json` foi adicionada.
- [ ] Código em português (variáveis, funções, mensagens PT-BR), em linha com a referência.

---

### 2.13 Guia de Uso dos Arquivos de Mockup (`mockup/`)

> Esta seção instrui o Claude Code sobre como ler e aplicar os arquivos do design. A pasta `mockup/` estará na raiz do projeto — não criar, apenas referenciar.

#### Mapa de arquivos

| Arquivo                  | O que contém / Como usar                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `mockup/ds.css`          | **Fonte primária de tokens.** Extrair valores de cores, tamanhos, bordas, transições. Ver variáveis `:root`.         |
| `mockup/icons.jsx`       | Ícones SVG stroke (path data) + constantes `TYPES` e `RISKS`. Recriar como componentes `react-native-svg` ou usar emojis como fallback. |
| `mockup/data.jsx`        | Estrutura de dados mock e helpers `fmtRelative`, `fmtDate`, `fmtTime`. Adaptar para `formatters.ts`.                |
| `mockup/components.jsx`  | `OccurrenceCard`, `Field`, `Header`. Usar como especificação visual de cada elemento (quais props, quais estilos).   |
| `mockup/screens-auth.jsx`| Layout e lógica de Login e Cadastro. Traduzir de HTML/CSS para View/StyleSheet.                                      |
| `mockup/screens-feed.jsx`| Layout e lógica de Home e NovaOcorrencia.                                                                            |
| `mockup/screens-detail.jsx`| Layout e lógica de Detalhes e MinhasOcorrencias.                                                                   |
| `mockup/app.jsx`         | Fluxo de navegação e gestão de estado (referência de UX, não de código RN).                                          |
| `mockup/screenshots/`    | Imagens PNG de cada tela. Comparar renderização final com as screenshots para validar fidelidade visual.             |

#### Regras de tradução CSS → React Native

| Propriedade CSS                              | Equivalente React Native                                               |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `background: linear-gradient(...)`           | `<LinearGradient colors={[...]} />` (expo-linear-gradient)             |
| `backdrop-filter: blur(14px)`                | Não disponível nativo. Usar `backgroundColor: 'rgba(...)'` semitransparente. |
| `box-shadow: 0 0 14px -2px rgba(...)`        | `shadowColor + shadowOffset + shadowOpacity + shadowRadius + elevation` |
| `font-family: var(--font-head)`              | `fontFamily: 'SpaceGrotesk-Bold'` (ou system bold como fallback)       |
| `letter-spacing: 0.14em` com font-size 17px  | `letterSpacing: 17 * 0.14 ≈ 2.4`                                       |
| `text-transform: uppercase`                  | `textTransform: 'uppercase'`                                           |
| `display: flex; gap: 12px`                   | `flexDirection: 'row', gap: 12` (ou `marginRight` nos filhos)          |
| `overflow-y: auto` / `scroll`                | `<ScrollView>` ou `<FlatList>`                                         |
| `position: absolute; right: 20; bottom: 40` | `position: 'absolute', right: 20, bottom: 40`                          |
| `-webkit-line-clamp: 2`                      | `numberOfLines={2}` no `<Text>`                                        |
| `border-left: 4px solid cor`                 | `borderLeftWidth: 4, borderLeftColor: cor`                             |
| `border-radius: 14px`                        | `borderRadius: 14`                                                     |
| `height: 50px`                               | `height: 50`                                                           |
| `padding: 13px 14px 13px 15px`               | `paddingVertical: 13, paddingLeft: 15, paddingRight: 14`               |

#### Mapeamento de classes CSS do design para estilos RN

| Classe CSS         | Comportamento em RN                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `.gv-screen`       | `View` flex com `backgroundColor: CORES.fundo`, ocupa a tela inteira.                   |
| `.gv-card`         | `View` com estiloGlass (fundo `rgba(15,23,42,0.7)`, borda glassBorda, borderRadius 14). |
| `.gv-occ`          | `TouchableOpacity` com estiloGlass + borderLeftWidth 4, borderRadius 12.                 |
| `.gv-header`       | `View` com `LinearGradient ['#0c1733','#080e1c']` + borda inferior `borda`.             |
| `.gv-chip`         | `TouchableOpacity` com height 32, `borderRadius: 8`, bg `fundoCard`, borda `borda`.     |
| `.gv-chip.active`  | + bg `rgba(59,130,246,0.16)`, borda `azul`, texto `azulEl`.                             |
| `.gv-typecard`     | `TouchableOpacity` height 78, `borderRadius: 11`, bg `fundoCard`, borda `borda`.        |
| `.gv-typecard.active` | + borda `azulEl`, bg `rgba(59,130,246,0.12)`.                                        |
| `.gv-segbtn`       | `TouchableOpacity` height 46, `borderRadius: 10`, flex 1.                               |
| `.gv-fab`          | `TouchableOpacity` posição absoluta, 58×58, `borderRadius: 17`, `LinearGradient`.       |
| `.gv-input-wrap`   | `View` height 48, bg `fundoInput`, borda `borda`, `borderRadius: 10`, flexRow.          |
| `.gv-btn`          | `TouchableOpacity` height 50, `borderRadius: 10`, alinhamento central.                  |
| `.gv-btn-primary`  | + `LinearGradient` + shadow azul.                                                        |
| `.gv-btn-secondary`| + bg `fundoCard`, borda `borda`.                                                         |
| `.gv-btn-danger`   | + bg `dangerFundo`, borda `dangerBorda`, texto `dangerTexto`.                            |
| `.gv-iconbtn`      | `TouchableOpacity` 38×38, `borderRadius: 10`, bg `fundoCard`, borda `borda`.            |
| `.gv-label::before`| Quadrado 5×5px, bg `azul`, shadow `azul`, `borderRadius: 1` — renderizar como `View`.  |
| `.gv-live`         | `View` 7×7px circular, bg `riscoAlto`, com `Animated` pulsante (opacity 1→0.4→1).      |
| `.gv-dock`         | `View` padding `14px top / 18px horizontal / 30px bottom`, borda superior `borda`.      |

---

**Fim do Blueprint.**

O Claude Code deve ler esta especificação integralmente, inspecionar os arquivos em `
` para referência visual, e então criar o projeto. Em caso de conflito entre a especificação e os mockups, os **mockups prevalecem para decisões visuais** e a **especificação prevalece para lógica de negócio e estrutura de dados**.
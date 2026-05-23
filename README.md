# Moak Tasks

Aplicativo mobile feito com Expo para organizar tarefas do dia e, aos poucos, conectar isso com rotina de treino. A ideia inicial e simples: registrar o que precisa ser feito hoje, marcar progresso e evoluir para check-ins de academia por localizacao.

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- NativeWind + Tailwind CSS
- AsyncStorage
- Expo Location

## Rodando Localmente

Instale as dependencias:

```bash
npm install
```

Inicie o projeto:

```bash
npm run start
```

Ou rode direto em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

Se o NativeWind ou o Expo parecerem estar usando cache antigo, rode:

```bash
npm run start -- --clear
```

## Scripts

```bash
npm run start    # inicia o Expo
npm run android  # abre no Android
npm run ios      # abre no iOS
npm run web      # abre no navegador
```

## Estrutura

```txt
app/
  _layout.tsx          # layout raiz e navegacao do Expo Router
  index.tsx            # rota inicial

src/
  components/
    ui/
      button.tsx       # botao reutilizavel
      task-card.tsx    # card de tarefa

  features/
    tasks/
      home-screen.tsx  # tela principal de tarefas

    gym-checkin/
      gym-check-in.tsx # feature de check-in por localizacao
      utils/
        distanceCalc.ts

  lib/
    storage.ts         # persistencia local com AsyncStorage

global.css             # entrada do Tailwind/NativeWind
metro.config.js        # Metro configurado com NativeWind
tailwind.config.js     # configuracao do Tailwind
```

## Funcionalidades Atuais

- Criar tarefas para o dia.
- Listar tarefas salvas localmente.
- Marcar tarefa como concluida.
- Apagar tarefa.
- Persistir dados com AsyncStorage.
- Base inicial para check-in de academia usando GPS.

## Estilizacao

O projeto usa NativeWind para escrever estilos com `className` em componentes React Native:

```tsx
<View className="flex-1 bg-gray-50 p-4">
  <Text className="text-2xl font-bold text-gray-800">Moak Tasks</Text>
</View>
```

A entrada global do Tailwind fica em `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Esse arquivo e importado no layout raiz:

```tsx
import "../global.css";
```

## Roadmap

- Criar navegacao para acessar a feature de check-in.
- Melhorar a UI da home e dos cards.
- Criar historico de tarefas e check-ins.
- Adicionar notificacoes/lembretes.
- Adicionar testes para `storage` e `distanceCalc`.
- Investigar integracao com apps de treino via deep link.

## Observacoes de Desenvolvimento

- O app usa `expo-router`, entao as rotas vivem dentro de `app/`.
- Regras de negocio ficam em `src/features/`.
- Componentes reutilizaveis ficam em `src/components/ui/`.
- Antes de mexer em APIs do Expo, conferir a documentacao versionada do SDK 54.

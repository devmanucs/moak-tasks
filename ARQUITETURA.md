# 🏗️ Arquitetura - Moak Tasks

## Estrutura de Pastas

```
moak-tasks/
├── app/                           # File-based routing (Expo Router)
│   ├── _layout.tsx               # Define navegação nativa
│   └── index.tsx                 # Rota "/" - Home Screen
│
├── src/
│   ├── features/                 # Lógica de negócio isolada por feature
│   │   ├── tasks/
│   │   │   ├── HomeScreenFeature.tsx      # Gerenciador de tasks
│   │   │   └── components/
│   │   │
│   │   └── gym-checkin/
│   │       ├── GymCheckinFeature.tsx      # Feature de check-in
│   │       └── utils/
│   │           └── distanceCalc.ts       # Cálculo de Haversine
│   │
│   ├── components/               # UI globais reutilizáveis
│   │   └── ui/
│   │       ├── Button.tsx        # Botão customizado
│   │       └── TaskCard.tsx      # Card de tarefa
│   │
│   └── lib/                      # Config e utilitários
│       └── storage.ts           # AsyncStorage wrapper
│
├── App.tsx                       # Entry point (usa expo-router)
├── app.json                      # Configuração Expo
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Fluxo de Dados

### 1️⃣ Camada de Roteamento (`app/`)

- **Responsabilidade**: Apenas definir que uma rota existe
- **Exemplo**: `app/index.tsx` importa `HomeScreenFeature` e a renderiza
- **Padrão**: Extremamente limpo, sem lógica

### 2️⃣ Camada de Feature (`src/features/`)

- **Responsabilidade**: Toda a lógica de negócio
- **Contém**: States, useEffect, Context, chamadas de API
- **Exemplo**: `HomeScreenFeature.tsx` gerencia lista de tarefas, chamadas ao storage

### 3️⃣ Camada de Componentes (`src/components/`)

- **Responsabilidade**: UI reutilizável, stateless
- **Contém**: Props tipadas, estilos
- **Exemplo**: `Button.tsx`, `TaskCard.tsx` - recebem props e renderizam

### 4️⃣ Camada de Utilitários (`src/lib/`)

- **Responsabilidade**: Funções puras, configurações globais
- **Exemplo**: `storage.ts` (persistência), `distanceCalc.ts` (Haversine)

## Padrões

### Storage (Persistência Local)

```typescript
// Salvar tarefa
const newTask = await storage.addTask({
  title: "Ir à academia",
  completed: false,
});

// Buscar tasks
const tasks = await storage.getTasks();

// Atualizar task
await storage.updateTask(taskId, { completed: true });
```

### Geolocalização (Check-in)

```typescript
// Definir localização da academia (uma vez)
await storage.setGymLocation(latitude, longitude);

// Verificar distância usando Haversine
const distance = calculateDistance(userLat, userLon, gymLat, gymLon);
const isAtGym = isWithinGym(userLat, userLon, gymLat, gymLon, 50); // 50m de raio
```

## Vantagens da Arquitetura

✅ **Escalabilidade**: Fácil adicionar features novas  
✅ **Testabilidade**: Funções puras separadas  
✅ **Manutenibilidade**: Responsabilidades claras  
✅ **Reusabilidade**: Componentes isolados  
✅ **Performance**: Separation of concerns evita re-renders desnecessários

## Próximos Passos

1. [ ] Adicionar integração com Hevy via Deep Linking
2. [ ] Criar tela de histórico de check-ins
3. [ ] Adicionar autenticação (se necessário)
4. [ ] Implementar notificações push
5. [ ] Testes unitários para utils

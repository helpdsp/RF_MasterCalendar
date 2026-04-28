import type { Atom } from '@/lib/types'

const playbookMarkdown = `# Component Composition Patterns in React

## Why Composition Matters

React's component model is built on composition rather than inheritance. Understanding composition patterns helps you build more flexible, maintainable UIs.

## The Container/Presentational Pattern

Separate data fetching from rendering:

\`\`\`jsx
// Container: handles data and logic
function UserListContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => { fetchUsers().then(setUsers); }, []);
  return <UserList users={users} />;
}

// Presentational: pure rendering
function UserList({ users }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\`

## Compound Components

Share implicit state between related components:

\`\`\`jsx
function Select({ children, value, onChange }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      {children}
    </SelectContext.Provider>
  );
}

Select.Option = function Option({ value, children }) {
  const { value: selected, onChange } = useContext(SelectContext);
  return (
    <li
      className={selected === value ? 'selected' : ''}
      onClick={() => onChange(value)}
    >
      {children}
    </li>
  );
};

// Usage
<Select value={color} onChange={setColor}>
  <Select.Option value="red">Red</Select.Option>
  <Select.Option value="blue">Blue</Select.Option>
</Select>
\`\`\`

## Render Props

Share stateful logic via function props:

\`\`\`jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker render={pos => <Cursor x={pos.x} y={pos.y} />} />
\`\`\`

## Higher-Order Components (HOCs)

Wrap components to add cross-cutting behavior:

\`\`\`jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}
\`\`\`

## When to Use Each Pattern

| Pattern | Use When |
|---------|----------|
| Compound Components | Tightly coupled UI parts sharing state |
| Render Props | Need flexible rendering with shared logic |
| HOCs | Adding behavior to many components |
| Custom Hooks | Reusing stateful logic without UI |
`

const tsPlaybookMarkdown = `# TypeScript Utility Types in Practice

## Introduction

TypeScript ships with a rich library of built-in utility types that transform existing types into new ones. Mastering these eliminates boilerplate and keeps your types DRY.

## Partial and Required

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

// All fields optional — great for update payloads
type UpdateUserDto = Partial<User>;

// All fields required — enforce completeness
type CompleteUser = Required<User>;
\`\`\`

## Pick and Omit

\`\`\`typescript
// Select only the fields you need
type UserSummary = Pick<User, 'id' | 'name'>;

// Exclude sensitive or irrelevant fields
type PublicUser = Omit<User, 'email'>;
\`\`\`

## Record

\`\`\`typescript
// Map string keys to a value type
type RolePermissions = Record<'admin' | 'editor' | 'viewer', string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};
\`\`\`

## ReturnType and Parameters

\`\`\`typescript
function fetchUser(id: string, options?: RequestInit) {
  return fetch(\`/api/users/\${id}\`, options).then(r => r.json() as Promise<User>);
}

type FetchUserParams = Parameters<typeof fetchUser>;
// [id: string, options?: RequestInit]

type FetchUserReturn = ReturnType<typeof fetchUser>;
// Promise<User>
\`\`\`

## Conditional Types

\`\`\`typescript
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false

// Unwrap array element type
type ElementType<T> = T extends (infer E)[] ? E : T;
type C = ElementType<number[]>; // number
type D = ElementType<string>;   // string
\`\`\`

## Template Literal Types

\`\`\`typescript
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = \`on\${Capitalize<EventName>}\`;
// 'onClick' | 'onFocus' | 'onBlur'
\`\`\`

## Practical Pattern: Discriminated Unions

\`\`\`typescript
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function render<T>(res: ApiResponse<T>) {
  if (res.status === 'success') return res.data;   // T
  if (res.status === 'error') return res.error;    // string
  return null; // loading
}
\`\`\`
`

export const mockAtoms: Record<string, Atom> = {
  // ─── React Hooks track ───────────────────────────────────────────────────────

  'atom-hooks-intro': {
    id: 'atom-hooks-intro',
    title: 'useState & useEffect: The Foundation',
    type: 'video',
    estimatedMinutes: 3,
    content: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      durationSeconds: 212,
      thumbnailUrl:
        'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      notes: [
        { timestampSeconds: 0, text: "We're no strangers to love" },
        { timestampSeconds: 18, text: 'You know the rules and so do I' },
        { timestampSeconds: 43, text: "Never gonna give you up" },
        { timestampSeconds: 47, text: "Never gonna let you down" },
        { timestampSeconds: 51, text: "Never gonna run around and desert you" },
      ],
    },
  },

  'atom-hooks-quiz': {
    id: 'atom-hooks-quiz',
    title: 'React Hooks: Knowledge Check',
    type: 'quiz',
    estimatedMinutes: 10,
    content: {
      passingScore: 70,
      questions: [
        {
          id: 'q-hooks-1',
          text: 'What is the correct way to update state based on previous state?',
          options: [
            'setState(count + 1)',
            'setState(prev => prev + 1)',
            'state.count++',
            'setState({count: count+1})',
          ],
          correctIndex: 1,
          reviewHint:
            'Always use the functional form when new state depends on old state to avoid stale closure issues.',
        },
        {
          id: 'q-hooks-2',
          text: 'When does useEffect run when the dependency array is empty []?',
          options: [
            'Never',
            'After every render',
            'Only after the first render',
            'Only when component unmounts',
          ],
          correctIndex: 2,
          reviewHint:
            'An empty dependency array means the effect runs once after the initial render, similar to componentDidMount.',
        },
        {
          id: 'q-hooks-3',
          text: 'What will happen if you forget to return a cleanup function in useEffect?',
          options: [
            'React will throw an error',
            'Memory leaks may occur',
            'The component won\'t render',
            'Nothing, cleanup is optional',
          ],
          correctIndex: 1,
          reviewHint:
            'Without cleanup, subscriptions, timers, and event listeners persist after component unmount causing memory leaks.',
        },
        {
          id: 'q-hooks-4',
          text: 'Which hook should you use to memoize an expensive calculation?',
          options: ['useCallback', 'useMemo', 'useRef', 'useState'],
          correctIndex: 1,
          reviewHint:
            'useMemo memoizes the result of a calculation, while useCallback memoizes the function itself.',
        },
        {
          id: 'q-hooks-5',
          text: 'What is a custom hook?',
          options: [
            'A hook built into React',
            "A function starting with 'use' that calls other hooks",
            'A class method',
            'A Redux action',
          ],
          correctIndex: 1,
          reviewHint:
            "Custom hooks are functions whose names start with 'use' and may call other hooks. They let you reuse stateful logic.",
        },
      ],
    },
  },

  'atom-hooks-flashcards': {
    id: 'atom-hooks-flashcards',
    title: 'React Hooks Flashcards',
    type: 'flashcard',
    estimatedMinutes: 8,
    content: {
      cards: [
        {
          id: 'fc-hooks-1',
          front: 'useState',
          back: 'React hook for managing component-level state. Returns [state, setState] tuple. Re-renders component when state changes.',
        },
        {
          id: 'fc-hooks-2',
          front: 'useEffect',
          back: 'Hook for synchronizing with external systems. Runs after render. Optionally returns cleanup function.',
        },
        {
          id: 'fc-hooks-3',
          front: 'useCallback',
          back: 'Returns a memoized callback function. Only recreates when dependencies change. Prevents unnecessary child re-renders.',
        },
        {
          id: 'fc-hooks-4',
          front: 'useMemo',
          back: 'Returns a memoized value. Recomputes only when dependencies change. Useful for expensive calculations.',
        },
        {
          id: 'fc-hooks-5',
          front: 'useRef',
          back: 'Returns a mutable ref object persisting across renders. Does NOT trigger re-render when changed. Used for DOM refs and instance variables.',
        },
        {
          id: 'fc-hooks-6',
          front: 'Stale Closure',
          back: "When an effect or callback captures an outdated value from a previous render. Prevented by correct dependency arrays.",
        },
      ],
    },
  },

  'atom-hooks-playbook': {
    id: 'atom-hooks-playbook',
    title: 'Component Composition Patterns in React',
    type: 'playbook',
    estimatedMinutes: 15,
    content: {
      markdown: playbookMarkdown,
      estimatedReadMinutes: 15,
      keyTakeaways: [
        'Composition > Inheritance in React',
        'Container/Presentational separates concerns clearly',
        'Compound components share implicit context',
        'Custom hooks replaced most render prop use cases',
      ],
    },
  },

  'atom-hooks-task': {
    id: 'atom-hooks-task',
    title: 'Implement useDebounce Hook',
    type: 'task',
    estimatedMinutes: 20,
    content: {
      instructionsHtml:
        '<h2>Implement a useDebounce Hook</h2><p>Build a custom hook that delays updating a value until after a specified delay period. This is useful for search inputs, preventing excessive API calls, and form validation.</p><h3>Requirements</h3><ul><li>Accept a value and delay (ms) as parameters</li><li>Return the debounced value</li><li>Clear timeout on cleanup to prevent memory leaks</li><li>Update debounced value only after delay has passed without new changes</li></ul><h3>Example Usage</h3><pre><code>const [search, setSearch] = useState(\'\');\nconst debouncedSearch = useDebounce(search, 300);\n\nuseEffect(() => {\n  if (debouncedSearch) fetchResults(debouncedSearch);\n}, [debouncedSearch]);</code></pre>',
      checklistItems: [
        { id: 'check-debounce-1', label: 'Create useDebounce.ts in src/hooks/' },
        { id: 'check-debounce-2', label: 'Accept value and delay parameters with TypeScript generics' },
        { id: 'check-debounce-3', label: 'Use useEffect with setTimeout and proper cleanup' },
        { id: 'check-debounce-4', label: 'Test with a search input — verify delay works' },
        { id: 'check-debounce-5', label: 'Add JSDoc comment explaining the hook' },
      ],
      referenceImageUrl: null,
    },
  },

  'atom-hooks-usecontext': {
    id: 'atom-hooks-usecontext',
    title: 'useContext & Context API Deep Dive',
    type: 'video',
    estimatedMinutes: 10,
    content: {
      url: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc',
      durationSeconds: 600,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80',
      notes: [
        { timestampSeconds: 60, text: 'Creating a context with createContext and a default value' },
        { timestampSeconds: 180, text: 'Wrapping the tree with Context.Provider' },
        { timestampSeconds: 320, text: 'useContext replaces Context.Consumer — cleaner syntax' },
        { timestampSeconds: 480, text: 'When NOT to use context — prop drilling is sometimes fine' },
      ],
    },
  },

  'atom-hooks-usereducer': {
    id: 'atom-hooks-usereducer',
    title: 'useReducer for Complex State',
    type: 'flashcard',
    estimatedMinutes: 7,
    content: {
      cards: [
        {
          id: 'fc-reducer-1',
          front: 'useReducer signature',
          back: 'useReducer(reducer, initialState) → [state, dispatch]. Reducer is (state, action) => newState. Dispatch sends actions.',
        },
        {
          id: 'fc-reducer-2',
          front: 'When to use useReducer vs useState',
          back: 'Prefer useReducer when state has multiple sub-values, next state depends on previous state in complex ways, or you want Redux-like action traceability.',
        },
        {
          id: 'fc-reducer-3',
          front: 'Reducer function contract',
          back: 'Must be a pure function — no side effects, no mutations. Takes (currentState, action) and returns a brand new state object.',
        },
        {
          id: 'fc-reducer-4',
          front: 'Lazy initialization in useReducer',
          back: 'Pass an init function as 3rd argument: useReducer(reducer, initialArg, init). Useful for expensive initial state computation.',
        },
      ],
    },
  },

  'atom-hooks-patterns-video': {
    id: 'atom-hooks-patterns-video',
    title: 'Testing Custom Hooks with React Testing Library',
    type: 'video',
    estimatedMinutes: 12,
    content: {
      url: 'https://www.youtube.com/watch?v=9lkZ77m-39I',
      durationSeconds: 720,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&q=80',
      notes: [
        { timestampSeconds: 90, text: 'renderHook API — isolating hooks from components' },
        { timestampSeconds: 240, text: 'act() wrapper — flushing state updates in tests' },
        { timestampSeconds: 400, text: 'Testing async hooks with waitFor' },
        { timestampSeconds: 560, text: 'Mocking dependencies — jest.mock and MSW patterns' },
      ],
    },
  },

  'atom-hooks-testing-quiz': {
    id: 'atom-hooks-testing-quiz',
    title: 'Hooks Testing: Knowledge Check',
    type: 'quiz',
    estimatedMinutes: 8,
    content: {
      passingScore: 70,
      questions: [
        {
          id: 'q-test-1',
          text: 'Which utility from React Testing Library is used to test a hook in isolation?',
          options: ['mount', 'renderHook', 'shallow', 'createWrapper'],
          correctIndex: 1,
          reviewHint:
            'renderHook renders a component that calls your hook, letting you test it without building a full UI component.',
        },
        {
          id: 'q-test-2',
          text: 'Why do you need to wrap state-updating calls in act() when testing hooks?',
          options: [
            'It is required by TypeScript',
            'To flush all pending state updates and re-renders before assertions',
            'To spy on component lifecycle',
            'act() is not needed with React Testing Library',
          ],
          correctIndex: 1,
          reviewHint:
            'act() ensures all pending React state updates, effects, and re-renders are processed before you make assertions.',
        },
        {
          id: 'q-test-3',
          text: 'What does result.current refer to in a renderHook test?',
          options: [
            'The current render count',
            'The current return value of the hook',
            'The component instance',
            'The current props',
          ],
          correctIndex: 1,
          reviewHint:
            'result.current gives you access to the latest value returned by the hook after the most recent render.',
        },
        {
          id: 'q-test-4',
          text: 'Which testing library is commonly used to mock HTTP requests in hook tests?',
          options: ['axios-mock-adapter', 'nock', 'Mock Service Worker (MSW)', 'sinon'],
          correctIndex: 2,
          reviewHint:
            'MSW intercepts requests at the network level using service workers, giving you realistic mock responses without changing production code.',
        },
      ],
    },
  },

  'atom-hooks-testing-task': {
    id: 'atom-hooks-testing-task',
    title: 'Write Tests for useLocalStorage Hook',
    type: 'task',
    estimatedMinutes: 25,
    content: {
      instructionsHtml:
        '<h2>Write Tests for a useLocalStorage Hook</h2><p>Given the <code>useLocalStorage</code> hook below, write a complete test suite covering all edge cases using React Testing Library\'s <code>renderHook</code>.</p><h3>Hook to test</h3><pre><code>function useLocalStorage&lt;T&gt;(key: string, initialValue: T) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) as T : initialValue;\n  });\n  const set = (v: T) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); };\n  return [value, set] as const;\n}</code></pre><h3>Test cases to cover</h3><ul><li>Returns initialValue when nothing is stored</li><li>Reads existing value from localStorage</li><li>Updates state and localStorage when setter is called</li><li>Handles JSON serialization of objects</li><li>Does not throw if localStorage is unavailable</li></ul>',
      checklistItems: [
        { id: 'check-ls-1', label: 'Set up test file useLocalStorage.test.ts' },
        { id: 'check-ls-2', label: 'Mock localStorage using jest.spyOn or vi.spyOn' },
        { id: 'check-ls-3', label: 'Test returns initialValue when storage is empty' },
        { id: 'check-ls-4', label: 'Test reads and parses existing stored JSON value' },
        { id: 'check-ls-5', label: 'Test setter updates both state and localStorage' },
      ],
      referenceImageUrl: null,
    },
  },

  'atom-hooks-patterns-flashcards': {
    id: 'atom-hooks-patterns-flashcards',
    title: 'Advanced Hook Patterns Flashcards',
    type: 'flashcard',
    estimatedMinutes: 6,
    content: {
      cards: [
        {
          id: 'fc-adv-1',
          front: 'useImperativeHandle',
          back: 'Customizes the instance value exposed when using ref with forwardRef. Allows parent to call specific child methods without exposing the full DOM node.',
        },
        {
          id: 'fc-adv-2',
          front: 'useLayoutEffect',
          back: 'Fires synchronously after all DOM mutations but before the browser paints. Use for reading layout and synchronously re-rendering. Prefer useEffect unless you see flicker.',
        },
        {
          id: 'fc-adv-3',
          front: 'useDeferredValue',
          back: 'Defers updating a non-urgent part of the UI. Keeps the UI responsive during expensive re-renders by showing stale content briefly.',
        },
        {
          id: 'fc-adv-4',
          front: 'useTransition',
          back: 'Marks a state update as non-urgent. Returns [isPending, startTransition]. React can interrupt the deferred work to handle urgent updates.',
        },
      ],
    },
  },

  'atom-hooks-review-playbook': {
    id: 'atom-hooks-review-playbook',
    title: 'Hooks Best Practices & Rules of Hooks',
    type: 'playbook',
    estimatedMinutes: 10,
    content: {
      markdown: `# Hooks Best Practices & Rules of Hooks

## The Two Rules of Hooks

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions. React relies on call order to associate state with the correct hook.
2. **Only call hooks from React functions** — either function components or custom hooks. Never from regular JavaScript functions.

## ESLint Plugin

Install \`eslint-plugin-react-hooks\` to catch violations automatically:

\`\`\`bash
npm install --save-dev eslint-plugin-react-hooks
\`\`\`

## Dependency Array Checklist

- Include every value from component scope used inside the effect.
- Wrap functions passed as dependencies in \`useCallback\`.
- Wrap objects/arrays in \`useMemo\` or move them outside the component.
- Use the \`exhaustive-deps\` ESLint rule — it will catch missing dependencies.

## Performance Tips

| Pattern | When |
|---------|------|
| \`useMemo\` | Expensive pure calculation, referential equality for child props |
| \`useCallback\` | Stable function identity needed by child component or effect |
| \`React.memo\` | Wrap child component that renders with same props frequently |
| \`useRef\` | Persist value across renders without triggering re-render |

## Avoid These Common Mistakes

- Setting state unconditionally inside \`useEffect\` (infinite loop risk).
- Reading stale closure values by not listing them in the dependency array.
- Calling a hook inside a condition — extract conditional logic instead.
`,
      estimatedReadMinutes: 10,
      keyTakeaways: [
        'Never call hooks inside loops or conditions',
        'exhaustive-deps ESLint rule prevents stale closure bugs',
        'useMemo and useCallback optimize referential equality, not just computation cost',
        'useRef is the right tool when you need mutable state without re-renders',
      ],
    },
  },

  // ─── TypeScript track ────────────────────────────────────────────────────────

  'atom-ts-types': {
    id: 'atom-ts-types',
    title: 'TypeScript Core Types Flashcards',
    type: 'flashcard',
    estimatedMinutes: 10,
    content: {
      cards: [
        {
          id: 'fc-ts-1',
          front: 'Union Types',
          back: 'A type that can be one of several types. Example: string | number | null. Narrowed using typeof, instanceof, or discriminant properties.',
        },
        {
          id: 'fc-ts-2',
          front: 'Intersection Types',
          back: 'Combines multiple types into one using &. The result must satisfy ALL constituent types. Useful for mixins and type merging.',
        },
        {
          id: 'fc-ts-3',
          front: 'Generic Types',
          back: 'Types parameterized by other types. Written as Type<T>. Allow writing flexible, type-safe functions and data structures.',
        },
        {
          id: 'fc-ts-4',
          front: 'Type Guards',
          back: "Runtime checks that narrow TypeScript union types. Can be typeof, instanceof checks, or custom predicates using 'is' keyword.",
        },
        {
          id: 'fc-ts-5',
          front: 'Mapped Types',
          back: 'Transform all properties of a type using [K in keyof T]. Used to create Partial<T>, Required<T>, Readonly<T>, etc.',
        },
        {
          id: 'fc-ts-6',
          front: 'Template Literal Types',
          back: 'String types built from template literals. Example: type EventName = `on${Capitalize<string>}`. Enables precise string manipulation at the type level.',
        },
      ],
    },
  },

  'atom-ts-quiz': {
    id: 'atom-ts-quiz',
    title: 'TypeScript Tipos: Evaluación',
    type: 'quiz',
    estimatedMinutes: 8,
    content: {
      passingScore: 70,
      questions: [
        {
          id: 'q-ts-1',
          text: '¿Qué operador se usa para crear un tipo de intersección en TypeScript?',
          options: ['|', '&', '+', '::'],
          correctIndex: 1,
          reviewHint:
            'El operador & combina múltiples tipos. El resultado debe satisfacer todos los tipos constituyentes simultáneamente.',
        },
        {
          id: 'q-ts-2',
          text: '¿Cuál es la diferencia principal entre `type` e `interface` en TypeScript?',
          options: [
            'No hay diferencia, son intercambiables',
            'Las interfaces pueden extenderse por declaración; los tipos no',
            'Los tipos son más lentos en compilación',
            'Las interfaces no pueden describir funciones',
          ],
          correctIndex: 1,
          reviewHint:
            'Las interfaces soportan declaration merging (declarar la misma interfaz dos veces las fusiona). Los alias de tipo no lo permiten.',
        },
        {
          id: 'q-ts-3',
          text: '¿Qué hace el tipo utilitario `Partial<T>`?',
          options: [
            'Elimina la mitad de las propiedades de T',
            'Hace todas las propiedades de T opcionales',
            'Convierte T en un tipo readonly',
            'Extrae las claves de T como string literal union',
          ],
          correctIndex: 1,
          reviewHint:
            'Partial<T> genera un tipo con todas las propiedades de T establecidas como opcionales (?). Es equivalente a [K in keyof T]?: T[K].',
        },
        {
          id: 'q-ts-4',
          text: '¿Qué es un tipo condicional en TypeScript?',
          options: [
            'Un tipo que solo existe en tiempo de ejecución',
            'Un tipo que evalúa a uno u otro tipo según una condición: T extends U ? X : Y',
            'Un tipo que depende del valor de una variable',
            'Un tipo generado por una función',
          ],
          correctIndex: 1,
          reviewHint:
            'Los tipos condicionales tienen la forma T extends U ? X : Y. Si T es asignable a U el tipo resulta X, de lo contrario Y.',
        },
      ],
    },
  },

  'atom-ts-intro-video': {
    id: 'atom-ts-intro-video',
    title: 'TypeScript en 10 Minutos: Por qué y cómo',
    type: 'video',
    estimatedMinutes: 10,
    content: {
      url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
      durationSeconds: 600,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&q=80',
      notes: [
        { timestampSeconds: 30, text: 'Por qué TypeScript: errores en tiempo de compilación vs. ejecución' },
        { timestampSeconds: 150, text: 'Anotaciones de tipo básicas: string, number, boolean, array' },
        { timestampSeconds: 300, text: 'Interfaces vs. type aliases — cuándo usar cada uno' },
        { timestampSeconds: 480, text: 'Configuración de tsconfig.json — strict mode explicado' },
      ],
    },
  },

  'atom-ts-basics-task': {
    id: 'atom-ts-basics-task',
    title: 'Tipar una API de Usuarios',
    type: 'task',
    estimatedMinutes: 20,
    content: {
      instructionsHtml:
        '<h2>Tarea: Tipar una API REST de Usuarios</h2><p>Dado el siguiente JSON de respuesta de una API, crea los tipos TypeScript necesarios y una función tipada que consuma el endpoint.</p><pre><code>{\n  "users": [\n    { "id": "u1", "name": "Ana", "role": "admin", "active": true },\n    { "id": "u2", "name": "Luis", "role": "viewer", "active": false }\n  ],\n  "total": 2,\n  "page": 1\n}</code></pre><h3>Requisitos</h3><ul><li>Define el tipo <code>User</code> con los campos correctos</li><li>Define <code>UsersApiResponse</code> con paginación</li><li>Crea <code>fetchUsers(page: number): Promise&lt;UsersApiResponse&gt;</code></li><li>Usa un tipo discriminante para los roles</li><li>Maneja el caso de error con un tipo Result</li></ul>',
      checklistItems: [
        { id: 'check-ts-1', label: 'Definir tipo User con role como union type literal' },
        { id: 'check-ts-2', label: 'Definir UsersApiResponse con campos total y page' },
        { id: 'check-ts-3', label: 'Implementar fetchUsers con tipado correcto de retorno' },
        { id: 'check-ts-4', label: 'Crear tipo Result<T, E> para manejo de errores' },
        { id: 'check-ts-5', label: 'Verificar que TypeScript no muestre errores con tsc --noEmit' },
      ],
      referenceImageUrl: null,
    },
  },

  'atom-ts-playbook': {
    id: 'atom-ts-playbook',
    title: 'Utility Types de TypeScript en la Práctica',
    type: 'playbook',
    estimatedMinutes: 12,
    content: {
      markdown: tsPlaybookMarkdown,
      estimatedReadMinutes: 12,
      keyTakeaways: [
        'Partial y Required transforman la opcionalidad de todos los campos',
        'Pick y Omit seleccionan subconjuntos de un tipo existente',
        'Record es ideal para mapas tipados de clave-valor',
        'Los tipos condicionales e inferidos permiten transformaciones de tipo avanzadas',
      ],
    },
  },

  'atom-ts-advanced-quiz': {
    id: 'atom-ts-advanced-quiz',
    title: 'Tipos Avanzados: Evaluación Final',
    type: 'quiz',
    estimatedMinutes: 10,
    content: {
      passingScore: 75,
      questions: [
        {
          id: 'q-tsadv-1',
          text: '¿Qué hace `infer` en un tipo condicional?',
          options: [
            'Infiere el tipo de una variable en tiempo de ejecución',
            'Captura y nombra un tipo dentro de la cláusula extends para usarlo en la rama verdadera',
            'Deshabilita la verificación de tipos temporalmente',
            'Convierte un tipo genérico en any',
          ],
          correctIndex: 1,
          reviewHint:
            'infer declara una variable de tipo dentro de la condición extends. Ejemplo: T extends Promise<infer U> ? U : never extrae el tipo resuelto de una Promise.',
        },
        {
          id: 'q-tsadv-2',
          text: '¿Cuál es el resultado de `keyof { a: number; b: string }`?',
          options: [
            'number | string',
            '"a" | "b"',
            'string',
            '{ a: number; b: string }',
          ],
          correctIndex: 1,
          reviewHint:
            "keyof T produce una unión de los nombres de propiedades de T como string literals. En este caso 'a' | 'b'.",
        },
        {
          id: 'q-tsadv-3',
          text: '¿Qué tipo utilitario extrae las claves de un objeto cuyos valores son del tipo especificado?',
          options: ['Pick', 'Extract', 'Ninguno nativo — se implementa con tipos mapeados', 'Filter'],
          correctIndex: 2,
          reviewHint:
            'No existe un FilterByValue nativo, pero se puede construir: type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T].',
        },
        {
          id: 'q-tsadv-4',
          text: '¿Qué hace `NonNullable<string | null | undefined>`?',
          options: [
            'Lanza un error en tiempo de ejecución si el valor es null',
            'Produce el tipo string eliminando null y undefined de la unión',
            'Convierte el tipo en string | null',
            'Es equivalente a Required<string>',
          ],
          correctIndex: 1,
          reviewHint:
            'NonNullable<T> elimina null y undefined de T. Es equivalente al tipo condicional T extends null | undefined ? never : T.',
        },
      ],
    },
  },

  'atom-ts-generics-flashcards': {
    id: 'atom-ts-generics-flashcards',
    title: 'Genéricos y Tipos Avanzados: Flashcards',
    type: 'flashcard',
    estimatedMinutes: 8,
    content: {
      cards: [
        {
          id: 'fc-tsadv-1',
          front: 'Constraint de genérico (extends)',
          back: 'Limita qué tipos pueden usarse como argumento genérico. Ejemplo: function getLength<T extends { length: number }>(arr: T). T debe tener propiedad length.',
        },
        {
          id: 'fc-tsadv-2',
          front: 'Readonly<T>',
          back: 'Hace todas las propiedades de T inmutables. Equivale a [K in keyof T]: readonly T[K]. Útil para objetos de configuración y estado inmutable.',
        },
        {
          id: 'fc-tsadv-3',
          front: 'Extract<T, U>',
          back: 'De la unión T, extrae solo los miembros asignables a U. Opuesto de Exclude. Ejemplo: Extract<"a"|"b"|"c", "a"|"c"> → "a"|"c".',
        },
        {
          id: 'fc-tsadv-4',
          front: 'ReturnType<T>',
          back: 'Extrae el tipo de retorno de un tipo función. Ejemplo: ReturnType<() => string> → string. Muy útil para tipar valores sin duplicar tipos.',
        },
        {
          id: 'fc-tsadv-5',
          front: 'Discriminated Union',
          back: 'Unión de tipos donde cada miembro tiene una propiedad discriminante literal común (ej. type: "success" | "error"). TypeScript usa esa propiedad para narrowing automático.',
        },
      ],
    },
  },

  'atom-ts-final-task': {
    id: 'atom-ts-final-task',
    title: 'Construir un tipo-safe Event Emitter',
    type: 'task',
    estimatedMinutes: 30,
    content: {
      instructionsHtml:
        '<h2>Tarea: Event Emitter Tipado con TypeScript</h2><p>Implementa una clase <code>TypedEventEmitter&lt;Events&gt;</code> donde <code>Events</code> es un mapa de nombre de evento a tipo de payload. Los métodos <code>on</code>, <code>off</code> y <code>emit</code> deben ser completamente type-safe.</p><h3>Interfaz esperada</h3><pre><code>interface AppEvents {\n  userLogin: { userId: string; timestamp: Date };\n  pageView: { path: string };\n  error: Error;\n}\n\nconst emitter = new TypedEventEmitter&lt;AppEvents&gt;();\n\nemitter.on("userLogin", (payload) => {\n  console.log(payload.userId); // TypeScript conoce el tipo\n});\n\nemitter.emit("userLogin", { userId: "u1", timestamp: new Date() });\n// emitter.emit("userLogin", { wrong: true }); // Error de TypeScript</code></pre>',
      checklistItems: [
        { id: 'check-ee-1', label: 'Definir el tipo genérico Events como Record<string, unknown>' },
        { id: 'check-ee-2', label: 'Implementar on<K extends keyof Events> con callback tipado' },
        { id: 'check-ee-3', label: 'Implementar emit<K extends keyof Events> con payload tipado' },
        { id: 'check-ee-4', label: 'Implementar off para remover listeners específicos' },
        { id: 'check-ee-5', label: 'Verificar que tipos incorrectos generan error en compilación' },
      ],
      referenceImageUrl: null,
    },
  },
}

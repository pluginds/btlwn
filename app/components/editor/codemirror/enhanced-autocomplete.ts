import { autocompletion, completionKeymap, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

// Enhanced autocomplete with better IntelliSense-like features
export function enhancedAutocompletion() {
  return [
    autocompletion({
      override: [
        // Custom completion sources
        jsFrameworkCompletions,
        commonSnippets,
        filePathCompletions,
      ],
      closeOnBlur: false,
      activateOnTyping: true,
      maxRenderedOptions: 20,
      defaultKeymap: true,
    }),
    keymap.of(completionKeymap),
  ];
}

// JavaScript/TypeScript framework completions
function jsFrameworkCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;

  const completions = [
    // React completions
    { label: 'useState', type: 'function', info: 'React hook for state management', detail: 'React Hook' },
    { label: 'useEffect', type: 'function', info: 'React hook for side effects', detail: 'React Hook' },
    { label: 'useContext', type: 'function', info: 'React hook for context', detail: 'React Hook' },
    { label: 'useCallback', type: 'function', info: 'React hook for memoized callbacks', detail: 'React Hook' },
    { label: 'useMemo', type: 'function', info: 'React hook for memoized values', detail: 'React Hook' },
    { label: 'useRef', type: 'function', info: 'React hook for refs', detail: 'React Hook' },
    
    // Next.js completions
    { label: 'getServerSideProps', type: 'function', info: 'Next.js server-side rendering', detail: 'Next.js' },
    { label: 'getStaticProps', type: 'function', info: 'Next.js static generation', detail: 'Next.js' },
    { label: 'getStaticPaths', type: 'function', info: 'Next.js static paths', detail: 'Next.js' },
    
    // Vue/Nuxt completions
    { label: 'defineComponent', type: 'function', info: 'Vue 3 component definition', detail: 'Vue 3' },
    { label: 'ref', type: 'function', info: 'Vue 3 reactive reference', detail: 'Vue 3' },
    { label: 'reactive', type: 'function', info: 'Vue 3 reactive object', detail: 'Vue 3' },
    { label: 'computed', type: 'function', info: 'Vue 3 computed property', detail: 'Vue 3' },
    
    // Svelte/SvelteKit completions
    { label: 'onMount', type: 'function', info: 'Svelte lifecycle hook', detail: 'Svelte' },
    { label: 'beforeUpdate', type: 'function', info: 'Svelte lifecycle hook', detail: 'Svelte' },
    { label: 'afterUpdate', type: 'function', info: 'Svelte lifecycle hook', detail: 'Svelte' },
    { label: 'onDestroy', type: 'function', info: 'Svelte lifecycle hook', detail: 'Svelte' },
  ];

  return {
    from: word.from,
    options: completions.filter(c => c.label.toLowerCase().includes(word.text.toLowerCase())),
  };
}

// Common code snippets
function commonSnippets(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;

  const snippets = [
    {
      label: 'log',
      type: 'snippet',
      apply: 'console.log(${1});',
      info: 'Console log statement',
      detail: 'Snippet'
    },
    {
      label: 'func',
      type: 'snippet',
      apply: 'function ${1:name}(${2:params}) {\n  ${3}\n}',
      info: 'Function declaration',
      detail: 'Snippet'
    },
    {
      label: 'arrow',
      type: 'snippet',
      apply: 'const ${1:name} = (${2:params}) => {\n  ${3}\n};',
      info: 'Arrow function',
      detail: 'Snippet'
    },
    {
      label: 'try',
      type: 'snippet',
      apply: 'try {\n  ${1}\n} catch (${2:error}) {\n  ${3}\n}',
      info: 'Try-catch block',
      detail: 'Snippet'
    },
    {
      label: 'for',
      type: 'snippet',
      apply: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  ${3}\n}',
      info: 'For loop',
      detail: 'Snippet'
    },
    {
      label: 'foreach',
      type: 'snippet',
      apply: '${1:array}.forEach((${2:item}) => {\n  ${3}\n});',
      info: 'ForEach loop',
      detail: 'Snippet'
    },
    {
      label: 'map',
      type: 'snippet',
      apply: '${1:array}.map((${2:item}) => {\n  return ${3};\n});',
      info: 'Map function',
      detail: 'Snippet'
    },
    {
      label: 'filter',
      type: 'snippet',
      apply: '${1:array}.filter((${2:item}) => ${3});',
      info: 'Filter function',
      detail: 'Snippet'
    },
    {
      label: 'reduce',
      type: 'snippet',
      apply: '${1:array}.reduce((${2:acc}, ${3:item}) => {\n  return ${4};\n}, ${5:initial});',
      info: 'Reduce function',
      detail: 'Snippet'
    },
  ];

  return {
    from: word.from,
    options: snippets.filter(s => s.label.toLowerCase().includes(word.text.toLowerCase())),
  };
}

// File path completions
function filePathCompletions(context: CompletionContext): CompletionResult | null {
  const line = context.state.doc.lineAt(context.pos);
  const lineText = line.text;
  
  // Check if we're in an import statement or require
  const importMatch = lineText.match(/(?:import.*from\s+['"]|require\(['"]|import\(['"])([^'"]*)/);
  if (!importMatch) return null;

  const path = importMatch[1];
  const word = context.matchBefore(/[^'"]*$/);
  if (!word) return null;

  // Common file paths and modules
  const completions = [
    { label: './components/', type: 'folder', info: 'Components directory' },
    { label: './utils/', type: 'folder', info: 'Utilities directory' },
    { label: './lib/', type: 'folder', info: 'Library directory' },
    { label: './hooks/', type: 'folder', info: 'Hooks directory' },
    { label: './types/', type: 'folder', info: 'Types directory' },
    { label: 'react', type: 'module', info: 'React library' },
    { label: 'react-dom', type: 'module', info: 'React DOM library' },
    { label: 'next', type: 'module', info: 'Next.js framework' },
    { label: 'vue', type: 'module', info: 'Vue.js framework' },
    { label: 'svelte', type: 'module', info: 'Svelte framework' },
    { label: 'lodash', type: 'module', info: 'Lodash utility library' },
    { label: 'axios', type: 'module', info: 'HTTP client library' },
  ];

  return {
    from: word.from,
    options: completions.filter(c => c.label.toLowerCase().includes(path.toLowerCase())),
  };
}
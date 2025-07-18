import { LanguageDescription, StreamLanguage } from '@codemirror/language';

export const supportedLanguages = [
  // JavaScript/TypeScript
  LanguageDescription.of({
    name: 'TS',
    extensions: ['ts'],
    async load() {
      return import('@codemirror/lang-javascript').then((module) => module.javascript({ typescript: true }));
    },
  }),
  LanguageDescription.of({
    name: 'JS',
    extensions: ['js', 'mjs', 'cjs'],
    async load() {
      return import('@codemirror/lang-javascript').then((module) => module.javascript());
    },
  }),
  LanguageDescription.of({
    name: 'TSX',
    extensions: ['tsx'],
    async load() {
      return import('@codemirror/lang-javascript').then((module) => module.javascript({ jsx: true, typescript: true }));
    },
  }),
  LanguageDescription.of({
    name: 'JSX',
    extensions: ['jsx'],
    async load() {
      return import('@codemirror/lang-javascript').then((module) => module.javascript({ jsx: true }));
    },
  }),

  // Web languages
  LanguageDescription.of({
    name: 'HTML',
    extensions: ['html'],
    async load() {
      return import('@codemirror/lang-html').then((module) => module.html());
    },
  }),
  LanguageDescription.of({
    name: 'CSS',
    extensions: ['css'],
    async load() {
      return import('@codemirror/lang-css').then((module) => module.css());
    },
  }),
  LanguageDescription.of({
    name: 'SASS',
    extensions: ['sass'],
    async load() {
      return import('@codemirror/lang-sass').then((module) => module.sass({ indented: true }));
    },
  }),
  LanguageDescription.of({
    name: 'SCSS',
    extensions: ['scss'],
    async load() {
      return import('@codemirror/lang-sass').then((module) => module.sass({ indented: false }));
    },
  }),

  // Data formats
  LanguageDescription.of({
    name: 'JSON',
    extensions: ['json'],
    async load() {
      return import('@codemirror/lang-json').then((module) => module.json());
    },
  }),
  LanguageDescription.of({
    name: 'Markdown',
    extensions: ['md'],
    async load() {
      return import('@codemirror/lang-markdown').then((module) => module.markdown());
    },
  }),

  // Other supported languages
  LanguageDescription.of({
    name: 'Python',
    extensions: ['py'],
    async load() {
      return import('@codemirror/lang-python').then((module) => module.python());
    },
  }),
  LanguageDescription.of({
    name: 'C++',
    extensions: ['cpp', 'cc', 'cxx', 'c++', 'hpp', 'hh', 'hxx', 'h++'],
    async load() {
      return import('@codemirror/lang-cpp').then((module) => module.cpp());
    },
  }),
  LanguageDescription.of({
    name: 'Wasm',
    extensions: ['wat'],
    async load() {
      return import('@codemirror/lang-wast').then((module) => module.wast());
    },
  }),

  // Legacy mode languages
  LanguageDescription.of({
    name: 'Rust',
    extensions: ['rs'],
    async load() {
      const { rust } = await import('@codemirror/legacy-modes/mode/rust');
      return StreamLanguage.define(rust);
    },
  }),
  LanguageDescription.of({
    name: 'Go',
    extensions: ['go'],
    async load() {
      const { go } = await import('@codemirror/legacy-modes/mode/go');
      return StreamLanguage.define(go);
    },
  }),
  LanguageDescription.of({
    name: 'Java',
    extensions: ['java'],
    async load() {
      const { java } = await import('@codemirror/legacy-modes/mode/clike');
      return StreamLanguage.define(java);
    },
  }),
  LanguageDescription.of({
    name: 'C#',
    extensions: ['cs'],
    async load() {
      const { csharp } = await import('@codemirror/legacy-modes/mode/clike');
      return StreamLanguage.define(csharp);
    },
  }),
  LanguageDescription.of({
    name: 'PHP',
    extensions: ['php'],
    async load() {
      const { php } = await import('@codemirror/legacy-modes/mode/php');
      return StreamLanguage.define(php);
    },
  }),
  LanguageDescription.of({
    name: 'XML',
    extensions: ['xml'],
    async load() {
      const { xml } = await import('@codemirror/legacy-modes/mode/xml');
      return StreamLanguage.define(xml);
    },
  }),
  LanguageDescription.of({
    name: 'YAML',
    extensions: ['yml', 'yaml'],
    async load() {
      const { yaml } = await import('@codemirror/legacy-modes/mode/yaml');
      return StreamLanguage.define(yaml);
    },
  }),
  LanguageDescription.of({
    name: 'SQL',
    extensions: ['sql'],
    async load() {
      const { sql } = await import('@codemirror/legacy-modes/mode/sql');
      return StreamLanguage.define(sql);
    },
  }),
];

export async function getLanguage(fileName: string) {
  const languageDescription = LanguageDescription.matchFilename(supportedLanguages, fileName);

  if (languageDescription) {
    try {
      return await languageDescription.load();
    } catch (error) {
      console.warn(`Failed to load language for ${fileName}:`, error);
      return undefined;
    }
  }

  return undefined;
}
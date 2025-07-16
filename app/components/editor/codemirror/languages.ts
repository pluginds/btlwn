import { LanguageDescription } from '@codemirror/language';

export const supportedLanguages = [
  // Existing languages
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
  LanguageDescription.of({
    name: 'Wasm',
    extensions: ['wat'],
    async load() {
      return import('@codemirror/lang-wast').then((module) => module.wast());
    },
  }),
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
  // New languages
  LanguageDescription.of({
    name: 'Rust',
    extensions: ['rs'],
    async load() {
      return import('@codemirror/lang-rust').then((module) => module.rust());
    },
  }),
  LanguageDescription.of({
    name: 'Go',
    extensions: ['go'],
    async load() {
      return import('@codemirror/lang-go').then((module) => module.go());
    },
  }),
  LanguageDescription.of({
    name: 'Java',
    extensions: ['java'],
    async load() {
      return import('@codemirror/lang-java').then((module) => module.java());
    },
  }),
  LanguageDescription.of({
    name: 'C#',
    extensions: ['cs'],
    async load() {
      return import('@codemirror/lang-csharp').then((module) => module.csharp());
    },
  }),
  LanguageDescription.of({
    name: 'PHP',
    extensions: ['php'],
    async load() {
      return import('@codemirror/lang-php').then((module) => module.php());
    },
  }),
  LanguageDescription.of({
    name: 'XML',
    extensions: ['xml'],
    async load() {
      return import('@codemirror/lang-xml').then((module) => module.xml());
    },
  }),
  LanguageDescription.of({
    name: 'YAML',
    extensions: ['yml', 'yaml'],
    async load() {
      return import('@codemirror/lang-yaml').then((module) => module.yaml());
    },
  }),
  LanguageDescription.of({
    name: 'SQL',
    extensions: ['sql'],
    async load() {
      return import('@codemirror/lang-sql').then((module) => module.sql());
    },
  }),
];

export async function getLanguage(fileName: string) {
  const languageDescription = LanguageDescription.matchFilename(supportedLanguages, fileName);

  if (languageDescription) {
    return await languageDescription.load();
  }

  return undefined;
}
import { memo, useState, useCallback } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { classNames } from '~/utils/classNames';

interface Framework {
  id: string;
  name: string;
  icon: string;
  description: string;
  commands: {
    create: string;
    dev: string;
    build: string;
    test?: string;
  };
  files: {
    config: string[];
    entry: string;
  };
}

const FRAMEWORKS: Framework[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'i-logos:nextjs-icon',
    description: 'React framework for production',
    commands: {
      create: 'npx create-next-app@latest .',
      dev: 'npm run dev',
      build: 'npm run build',
      test: 'npm test',
    },
    files: {
      config: ['next.config.js', 'tailwind.config.js', 'tsconfig.json'],
      entry: 'pages/index.js',
    },
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    icon: 'i-logos:nuxt-icon',
    description: 'Vue.js framework',
    commands: {
      create: 'npx nuxi@latest init .',
      dev: 'npm run dev',
      build: 'npm run build',
    },
    files: {
      config: ['nuxt.config.ts', 'tailwind.config.js'],
      entry: 'app.vue',
    },
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    icon: 'i-logos:svelte-icon',
    description: 'Svelte application framework',
    commands: {
      create: 'npm create svelte@latest .',
      dev: 'npm run dev',
      build: 'npm run build',
      test: 'npm test',
    },
    files: {
      config: ['svelte.config.js', 'vite.config.js'],
      entry: 'src/app.html',
    },
  },
  {
    id: 'astro',
    name: 'Astro',
    icon: 'i-logos:astro-icon',
    description: 'Static site generator',
    commands: {
      create: 'npm create astro@latest .',
      dev: 'npm run dev',
      build: 'npm run build',
    },
    files: {
      config: ['astro.config.mjs'],
      entry: 'src/pages/index.astro',
    },
  },
  {
    id: 'vite-react',
    name: 'Vite + React',
    icon: 'i-logos:vitejs',
    description: 'Fast React development',
    commands: {
      create: 'npm create vite@latest . -- --template react-ts',
      dev: 'npm run dev',
      build: 'npm run build',
    },
    files: {
      config: ['vite.config.ts', 'tsconfig.json'],
      entry: 'src/main.tsx',
    },
  },
  {
    id: 'vite-vue',
    name: 'Vite + Vue',
    icon: 'i-logos:vue',
    description: 'Fast Vue development',
    commands: {
      create: 'npm create vite@latest . -- --template vue-ts',
      dev: 'npm run dev',
      build: 'npm run build',
    },
    files: {
      config: ['vite.config.ts', 'tsconfig.json'],
      entry: 'src/main.ts',
    },
  },
];

interface FrameworkIntegrationProps {
  onFrameworkSelect: (framework: Framework) => void;
  onCommandRun: (command: string) => void;
  className?: string;
}

export const FrameworkIntegration = memo(({
  onFrameworkSelect,
  onCommandRun,
  className,
}: FrameworkIntegrationProps) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [showFrameworkSelector, setShowFrameworkSelector] = useState(false);

  const handleFrameworkSelect = useCallback((framework: Framework) => {
    setSelectedFramework(framework);
    onFrameworkSelect(framework);
    setShowFrameworkSelector(false);
  }, [onFrameworkSelect]);

  const handleCommandRun = useCallback((command: string) => {
    onCommandRun(command);
  }, [onCommandRun]);

  return (
    <div className={classNames('relative', className)}>
      <PanelHeader>
        <div className="i-ph:stack-duotone shrink-0" />
        Framework Tools
        <div className="ml-auto">
          <IconButton
            icon="i-ph:plus"
            size="sm"
            title="Select Framework"
            onClick={() => setShowFrameworkSelector(!showFrameworkSelector)}
          />
        </div>
      </PanelHeader>

      {showFrameworkSelector && (
        <div className="absolute top-full left-0 right-0 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
          <div className="text-sm font-medium text-bolt-elements-textPrimary mb-3">
            Choose Framework
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {FRAMEWORKS.map((framework) => (
              <button
                key={framework.id}
                onClick={() => handleFrameworkSelect(framework)}
                className="flex items-center gap-3 p-3 text-left rounded-lg border border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-item-backgroundActive transition-all"
              >
                <div className={classNames('text-2xl', framework.icon)} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-bolt-elements-textPrimary">
                    {framework.name}
                  </div>
                  <div className="text-xs text-bolt-elements-textSecondary">
                    {framework.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedFramework && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className={classNames('text-xl', selectedFramework.icon)} />
            <div>
              <div className="text-sm font-medium text-bolt-elements-textPrimary">
                {selectedFramework.name}
              </div>
              <div className="text-xs text-bolt-elements-textSecondary">
                {selectedFramework.description}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-bolt-elements-textPrimary">
              Quick Actions
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCommandRun(selectedFramework.commands.create)}
                className="px-3 py-2 text-xs bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text rounded hover:bg-bolt-elements-button-primary-backgroundHover"
              >
                Create Project
              </button>
              
              <button
                onClick={() => handleCommandRun(selectedFramework.commands.dev)}
                className="px-3 py-2 text-xs bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded hover:bg-bolt-elements-button-secondary-backgroundHover"
              >
                Start Dev Server
              </button>
              
              <button
                onClick={() => handleCommandRun(selectedFramework.commands.build)}
                className="px-3 py-2 text-xs bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded hover:bg-bolt-elements-button-secondary-backgroundHover"
              >
                Build Project
              </button>
              
              {selectedFramework.commands.test && (
                <button
                  onClick={() => handleCommandRun(selectedFramework.commands.test)}
                  className="px-3 py-2 text-xs bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded hover:bg-bolt-elements-button-secondary-backgroundHover"
                >
                  Run Tests
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-bolt-elements-textPrimary">
              Key Files
            </div>
            <div className="space-y-1">
              {selectedFramework.files.config.map((file) => (
                <div
                  key={file}
                  className="text-xs text-bolt-elements-textSecondary font-mono bg-bolt-elements-code-background px-2 py-1 rounded"
                >
                  {file}
                </div>
              ))}
              <div className="text-xs text-bolt-elements-textPrimary font-mono bg-bolt-elements-code-background px-2 py-1 rounded border-l-2 border-bolt-elements-borderColorActive">
                {selectedFramework.files.entry} (entry point)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
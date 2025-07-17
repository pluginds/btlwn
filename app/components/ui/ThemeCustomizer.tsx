import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { themeStore, toggleTheme, type Theme } from '~/lib/stores/theme';
import { IconButton } from './IconButton';
import { classNames } from '~/utils/classNames';

interface ThemeCustomizerProps {
  className?: string;
}

interface ThemePreset {
  id: string;
  name: string;
  theme: Theme;
  accent: string;
  description: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light-default',
    name: 'Light',
    theme: 'light',
    accent: '#2563eb',
    description: 'Clean and bright interface',
  },
  {
    id: 'dark-default',
    name: 'Dark',
    theme: 'dark',
    accent: '#3b82f6',
    description: 'Easy on the eyes',
  },
  {
    id: 'dark-blue',
    name: 'Dark Blue',
    theme: 'dark',
    accent: '#1e40af',
    description: 'Professional blue theme',
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    theme: 'dark',
    accent: '#7c3aed',
    description: 'Creative purple theme',
  },
  {
    id: 'light-warm',
    name: 'Light Warm',
    theme: 'light',
    accent: '#ea580c',
    description: 'Warm and inviting',
  },
];

export const ThemeCustomizer = memo(({ className }: ThemeCustomizerProps) => {
  const theme = useStore(themeStore);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('light-default');

  const applyThemePreset = (preset: ThemePreset) => {
    // Apply theme
    if (theme !== preset.theme) {
      toggleTheme();
    }
    
    // Apply accent color (this would require extending the theme system)
    document.documentElement.style.setProperty('--accent-color', preset.accent);
    
    setSelectedPreset(preset.id);
    setShowCustomizer(false);
  };

  return (
    <div className={classNames('relative', className)}>
      <IconButton
        icon={theme === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'}
        size="xl"
        title="Customize Theme"
        onClick={() => setShowCustomizer(!showCustomizer)}
      />
      
      {showCustomizer && (
        <div className="absolute right-0 top-12 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg p-4 min-w-[280px] z-50">
          <div className="text-sm font-medium text-bolt-elements-textPrimary mb-3">
            Theme Customizer
          </div>
          
          <div className="space-y-2 mb-4">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyThemePreset(preset)}
                className={classNames(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  selectedPreset === preset.id
                    ? 'border-bolt-elements-borderColorActive bg-bolt-elements-item-backgroundAccent'
                    : 'border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-item-backgroundActive'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border border-bolt-elements-borderColor"
                    style={{ backgroundColor: preset.accent }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-bolt-elements-textPrimary">
                      {preset.name}
                    </div>
                    <div className="text-xs text-bolt-elements-textSecondary">
                      {preset.description}
                    </div>
                  </div>
                  <div className={classNames(
                    'text-lg',
                    preset.theme === 'dark' ? 'i-ph-moon-stars' : 'i-ph-sun-dim'
                  )} />
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-bolt-elements-borderColor pt-3">
            <div className="text-xs text-bolt-elements-textSecondary mb-2">
              Quick Actions
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 px-3 py-2 text-xs bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded hover:bg-bolt-elements-button-secondary-backgroundHover"
              >
                Toggle Theme
              </button>
              <button
                onClick={() => setShowCustomizer(false)}
                className="px-3 py-2 text-xs bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text rounded hover:bg-bolt-elements-button-primary-backgroundHover"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
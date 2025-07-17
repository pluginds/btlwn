import { useStore } from '@nanostores/react';
import { memo, useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { renderLogger } from '~/utils/logger';

interface WorkspaceLayout {
  id: string;
  name: string;
  panels: {
    fileTree: { size: number; visible: boolean };
    editor: { size: number; visible: boolean };
    preview: { size: number; visible: boolean };
    terminal: { size: number; visible: boolean };
    debug: { size: number; visible: boolean };
  };
  orientation: 'horizontal' | 'vertical';
}

const DEFAULT_LAYOUTS: WorkspaceLayout[] = [
  {
    id: 'default',
    name: 'Default',
    panels: {
      fileTree: { size: 20, visible: true },
      editor: { size: 60, visible: true },
      preview: { size: 20, visible: false },
      terminal: { size: 25, visible: false },
      debug: { size: 25, visible: false },
    },
    orientation: 'horizontal',
  },
  {
    id: 'full-stack',
    name: 'Full Stack',
    panels: {
      fileTree: { size: 15, visible: true },
      editor: { size: 45, visible: true },
      preview: { size: 40, visible: true },
      terminal: { size: 25, visible: true },
      debug: { size: 0, visible: false },
    },
    orientation: 'horizontal',
  },
  {
    id: 'debugging',
    name: 'Debugging',
    panels: {
      fileTree: { size: 20, visible: true },
      editor: { size: 40, visible: true },
      preview: { size: 15, visible: true },
      terminal: { size: 25, visible: true },
      debug: { size: 25, visible: true },
    },
    orientation: 'horizontal',
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Dev',
    panels: {
      fileTree: { size: 25, visible: true },
      editor: { size: 50, visible: true },
      preview: { size: 25, visible: true },
      terminal: { size: 20, visible: true },
      debug: { size: 0, visible: false },
    },
    orientation: 'vertical',
  },
];

interface CustomizableWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export const CustomizableWorkspace = memo(({ children, className }: CustomizableWorkspaceProps) => {
  renderLogger.trace('CustomizableWorkspace');

  const [currentLayout, setCurrentLayout] = useState<WorkspaceLayout>(DEFAULT_LAYOUTS[0]);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [customLayouts, setCustomLayouts] = useState<WorkspaceLayout[]>([]);

  const applyLayout = useCallback((layout: WorkspaceLayout) => {
    setCurrentLayout(layout);
    
    // Apply layout to workbench store
    workbenchStore.showWorkbench.set(true);
    workbenchStore.toggleTerminal(layout.panels.terminal.visible);
    
    // You would implement panel size adjustments here
    // This would require extending the workbench store to support layout management
    
    setShowLayoutSelector(false);
  }, []);

  const saveCurrentLayout = useCallback(() => {
    const layoutName = prompt('Enter layout name:');
    if (!layoutName) return;

    const newLayout: WorkspaceLayout = {
      id: `custom-${Date.now()}`,
      name: layoutName,
      panels: { ...currentLayout.panels },
      orientation: currentLayout.orientation,
    };

    setCustomLayouts(prev => [...prev, newLayout]);
  }, [currentLayout]);

  const deleteCustomLayout = useCallback((layoutId: string) => {
    setCustomLayouts(prev => prev.filter(layout => layout.id !== layoutId));
  }, []);

  return (
    <div className={classNames('relative h-full', className)}>
      {/* Layout Controls */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-2">
        <div className="relative">
          <IconButton
            icon="i-ph:layout"
            size="sm"
            title="Change Layout"
            onClick={() => setShowLayoutSelector(!showLayoutSelector)}
            className="bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor"
          />
          
          {showLayoutSelector && (
            <div className="absolute right-0 top-8 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg p-2 min-w-[200px] z-50">
              <div className="text-sm font-medium text-bolt-elements-textPrimary mb-2 px-2">
                Workspace Layouts
              </div>
              
              {/* Default Layouts */}
              <div className="space-y-1 mb-2">
                {DEFAULT_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => applyLayout(layout)}
                    className={classNames(
                      'w-full text-left px-2 py-1 text-sm rounded hover:bg-bolt-elements-item-backgroundActive',
                      currentLayout.id === layout.id
                        ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                        : 'text-bolt-elements-textPrimary'
                    )}
                  >
                    {layout.name}
                  </button>
                ))}
              </div>
              
              {/* Custom Layouts */}
              {customLayouts.length > 0 && (
                <>
                  <div className="border-t border-bolt-elements-borderColor pt-2 mb-2">
                    <div className="text-xs text-bolt-elements-textSecondary mb-1 px-2">
                      Custom Layouts
                    </div>
                    <div className="space-y-1">
                      {customLayouts.map((layout) => (
                        <div key={layout.id} className="flex items-center gap-1">
                          <button
                            onClick={() => applyLayout(layout)}
                            className={classNames(
                              'flex-1 text-left px-2 py-1 text-sm rounded hover:bg-bolt-elements-item-backgroundActive',
                              currentLayout.id === layout.id
                                ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                                : 'text-bolt-elements-textPrimary'
                            )}
                          >
                            {layout.name}
                          </button>
                          <IconButton
                            icon="i-ph:trash"
                            size="sm"
                            onClick={() => deleteCustomLayout(layout.id)}
                            className="text-bolt-elements-item-contentDanger hover:bg-bolt-elements-item-backgroundDanger"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Actions */}
              <div className="border-t border-bolt-elements-borderColor pt-2">
                <button
                  onClick={saveCurrentLayout}
                  className="w-full text-left px-2 py-1 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded"
                >
                  Save Current Layout
                </button>
              </div>
            </div>
          )}
        </div>
        
        <IconButton
          icon="i-ph:gear"
          size="sm"
          title="Workspace Settings"
          className="bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor"
        />
      </div>

      {/* Workspace Content */}
      {children}
    </div>
  );
});
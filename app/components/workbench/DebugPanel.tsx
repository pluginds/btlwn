import { memo, useState, useEffect } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { classNames } from '~/utils/classNames';
import type { DebugManager, Breakpoint } from '../editor/codemirror/debugging';

interface DebugPanelProps {
  debugManager?: DebugManager;
  isVisible: boolean;
  onToggle: () => void;
}

export const DebugPanel = memo(({ debugManager, isVisible, onToggle }: DebugPanelProps) => {
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [currentLine, setCurrentLine] = useState<number | undefined>();
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [callStack, setCallStack] = useState<string[]>([]);

  useEffect(() => {
    if (!debugManager) return;

    // Update breakpoints when they change
    const updateBreakpoints = () => {
      setBreakpoints(debugManager.getBreakpoints());
      setCurrentLine(debugManager.getCurrentLine());
    };

    // Initial update
    updateBreakpoints();

    // Set up periodic updates (in a real implementation, this would be event-driven)
    const interval = setInterval(updateBreakpoints, 100);

    return () => clearInterval(interval);
  }, [debugManager]);

  const handleBreakpointToggle = (line: number) => {
    debugManager?.toggleBreakpoint(line);
  };

  const handleBreakpointRemove = (line: number) => {
    debugManager?.removeBreakpoint(line);
  };

  const handleStepOver = () => {
    // Implement step over functionality
    console.log('Step over');
  };

  const handleStepInto = () => {
    // Implement step into functionality
    console.log('Step into');
  };

  const handleStepOut = () => {
    // Implement step out functionality
    console.log('Step out');
  };

  const handleContinue = () => {
    // Implement continue functionality
    console.log('Continue');
  };

  const handleStop = () => {
    // Implement stop functionality
    debugManager?.setCurrentLine(undefined);
    console.log('Stop debugging');
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-2 border-l border-bolt-elements-borderColor">
      <PanelHeader>
        <div className="i-ph:bug-duotone shrink-0" />
        Debug
        <div className="ml-auto">
          <IconButton icon="i-ph:x" size="sm" onClick={onToggle} />
        </div>
      </PanelHeader>

      <div className="flex-1 overflow-auto">
        {/* Debug Controls */}
        <div className="p-3 border-b border-bolt-elements-borderColor">
          <div className="flex gap-1">
            <IconButton
              icon="i-ph:play"
              size="sm"
              title="Continue (F5)"
              onClick={handleContinue}
              className="text-green-500 hover:text-green-400"
            />
            <IconButton
              icon="i-ph:arrow-down"
              size="sm"
              title="Step Over (F10)"
              onClick={handleStepOver}
            />
            <IconButton
              icon="i-ph:arrow-down-right"
              size="sm"
              title="Step Into (F11)"
              onClick={handleStepInto}
            />
            <IconButton
              icon="i-ph:arrow-up-right"
              size="sm"
              title="Step Out (Shift+F11)"
              onClick={handleStepOut}
            />
            <IconButton
              icon="i-ph:stop"
              size="sm"
              title="Stop"
              onClick={handleStop}
              className="text-red-500 hover:text-red-400"
            />
          </div>
        </div>

        {/* Breakpoints */}
        <div className="p-3 border-b border-bolt-elements-borderColor">
          <h3 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Breakpoints</h3>
          {breakpoints.length === 0 ? (
            <div className="text-xs text-bolt-elements-textSecondary">No breakpoints set</div>
          ) : (
            <div className="space-y-1">
              {breakpoints.map((bp) => (
                <div
                  key={bp.line}
                  className="flex items-center gap-2 text-xs p-1 rounded hover:bg-bolt-elements-item-backgroundActive"
                >
                  <button
                    onClick={() => handleBreakpointToggle(bp.line)}
                    className={classNames(
                      'w-3 h-3 rounded-full border',
                      bp.enabled
                        ? 'bg-red-500 border-red-500'
                        : 'bg-transparent border-bolt-elements-borderColor'
                    )}
                  />
                  <span className="flex-1 text-bolt-elements-textPrimary">
                    Line {bp.line + 1}
                  </span>
                  <IconButton
                    icon="i-ph:x"
                    size="sm"
                    onClick={() => handleBreakpointRemove(bp.line)}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call Stack */}
        <div className="p-3 border-b border-bolt-elements-borderColor">
          <h3 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Call Stack</h3>
          {callStack.length === 0 ? (
            <div className="text-xs text-bolt-elements-textSecondary">Not debugging</div>
          ) : (
            <div className="space-y-1">
              {callStack.map((frame, index) => (
                <div
                  key={index}
                  className={classNames(
                    'text-xs p-1 rounded cursor-pointer hover:bg-bolt-elements-item-backgroundActive',
                    index === 0 ? 'text-bolt-elements-textPrimary font-medium' : 'text-bolt-elements-textSecondary'
                  )}
                >
                  {frame}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variables */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Variables</h3>
          {Object.keys(variables).length === 0 ? (
            <div className="text-xs text-bolt-elements-textSecondary">No variables in scope</div>
          ) : (
            <div className="space-y-1">
              {Object.entries(variables).map(([name, value]) => (
                <div key={name} className="text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-bolt-elements-textPrimary font-mono">{name}:</span>
                    <span className="text-bolt-elements-textSecondary font-mono">
                      {typeof value === 'string' ? `"${value}"` : String(value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
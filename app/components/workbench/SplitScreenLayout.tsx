import { useStore } from '@nanostores/react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { toast } from 'react-toastify';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { Slider, type SliderOptions } from '~/components/ui/Slider';
import { workbenchStore, type WorkbenchViewType } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import { EnhancedEditorPanel } from './EnhancedEditorPanel';
import { Preview } from './Preview';

interface SplitScreenLayoutProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

const viewTransition = { ease: cubicEasingFn };

const sliderOptions: SliderOptions<WorkbenchViewType> = {
  left: {
    value: 'code',
    text: 'Code',
  },
  right: {
    value: 'preview',
    text: 'Preview',
  },
};

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const SplitScreenLayout = memo(({ chatStarted, isStreaming }: SplitScreenLayoutProps) => {
  renderLogger.trace('SplitScreenLayout');

  const hasPreview = useStore(computed(workbenchStore.previews, (previews) => previews.length > 0));
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);
  const files = useStore(workbenchStore.files);
  const selectedView = useStore(workbenchStore.currentView);

  const [splitMode, setSplitMode] = useState<'single' | 'split'>('single');
  const [layoutOrientation, setLayoutOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  const setSelectedView = (view: WorkbenchViewType) => {
    workbenchStore.currentView.set(view);
  };

  useEffect(() => {
    if (hasPreview && splitMode === 'single') {
      setSelectedView('preview');
    }
  }, [hasPreview, splitMode]);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error('Failed to update file content');
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  const toggleSplitMode = () => {
    setSplitMode(splitMode === 'single' ? 'split' : 'single');
  };

  const toggleLayoutOrientation = () => {
    setLayoutOrientation(layoutOrientation === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return (
    chatStarted && (
      <motion.div
        initial="closed"
        animate={showWorkbench ? 'open' : 'closed'}
        variants={workbenchVariants}
        className="z-workbench"
      >
        <div
          className={classNames(
            'fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
            {
              'left-[var(--workbench-left)]': showWorkbench,
              'left-[100%]': !showWorkbench,
            },
          )}
        >
          <div className="absolute inset-0 px-6">
            <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
              <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor">
                {splitMode === 'single' && (
                  <Slider selected={selectedView} options={sliderOptions} setSelected={setSelectedView} />
                )}
                
                <div className="ml-auto flex items-center gap-2">
                  {hasPreview && (
                    <>
                      <PanelHeaderButton
                        className="text-sm"
                        onClick={toggleSplitMode}
                        title={splitMode === 'single' ? 'Enable split view' : 'Disable split view'}
                      >
                        <div className={splitMode === 'single' ? 'i-ph:columns' : 'i-ph:square'} />
                        {splitMode === 'single' ? 'Split' : 'Single'}
                      </PanelHeaderButton>
                      
                      {splitMode === 'split' && (
                        <PanelHeaderButton
                          className="text-sm"
                          onClick={toggleLayoutOrientation}
                          title={`Switch to ${layoutOrientation === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
                        >
                          <div className={layoutOrientation === 'horizontal' ? 'i-ph:rows' : 'i-ph:columns'} />
                          {layoutOrientation === 'horizontal' ? 'Vertical' : 'Horizontal'}
                        </PanelHeaderButton>
                      )}
                    </>
                  )}
                  
                  {(selectedView === 'code' || splitMode === 'split') && (
                    <PanelHeaderButton
                      className="text-sm"
                      onClick={() => {
                        workbenchStore.toggleTerminal(!workbenchStore.showTerminal.get());
                      }}
                    >
                      <div className="i-ph:terminal" />
                      Toggle Terminal
                    </PanelHeaderButton>
                  )}
                  
                  <IconButton
                    icon="i-ph:x-circle"
                    className="-mr-1"
                    size="xl"
                    onClick={() => {
                      workbenchStore.showWorkbench.set(false);
                    }}
                  />
                </div>
              </div>
              
              <div className="relative flex-1 overflow-hidden">
                {splitMode === 'single' ? (
                  // Single view mode
                  <>
                    <View
                      initial={{ x: selectedView === 'code' ? 0 : '-100%' }}
                      animate={{ x: selectedView === 'code' ? 0 : '-100%' }}
                    >
                      <EnhancedEditorPanel
                        editorDocument={currentDocument}
                        isStreaming={isStreaming}
                        selectedFile={selectedFile}
                        files={files}
                        unsavedFiles={unsavedFiles}
                        onFileSelect={onFileSelect}
                        onEditorScroll={onEditorScroll}
                        onEditorChange={onEditorChange}
                        onFileSave={onFileSave}
                        onFileReset={onFileReset}
                      />
                    </View>
                    <View
                      initial={{ x: selectedView === 'preview' ? 0 : '100%' }}
                      animate={{ x: selectedView === 'preview' ? 0 : '100%' }}
                    >
                      <Preview />
                    </View>
                  </>
                ) : (
                  // Split view mode
                  <PanelGroup direction={layoutOrientation}>
                    <Panel defaultSize={50} minSize={30}>
                      <EnhancedEditorPanel
                        editorDocument={currentDocument}
                        isStreaming={isStreaming}
                        selectedFile={selectedFile}
                        files={files}
                        unsavedFiles={unsavedFiles}
                        onFileSelect={onFileSelect}
                        onEditorScroll={onEditorScroll}
                        onEditorChange={onEditorChange}
                        onFileSave={onFileSave}
                        onFileReset={onFileReset}
                      />
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={50} minSize={30}>
                      <Preview />
                    </Panel>
                  </PanelGroup>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  );
});

interface ViewProps extends HTMLMotionProps<'div'> {
  children: JSX.Element;
}

const View = memo(({ children, ...props }: ViewProps) => {
  return (
    <motion.div className="absolute inset-0" transition={viewTransition} {...props}>
      {children}
    </motion.div>
  );
});
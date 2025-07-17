import { useStore } from '@nanostores/react';
import { motion, type Variants } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { MobileResponsiveLayout } from '~/components/ui/MobileResponsiveLayout';
import { ThemeCustomizer } from '~/components/ui/ThemeCustomizer';
import { workbenchStore, type WorkbenchViewType } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';
import { CustomizableWorkspace } from './CustomizableWorkspace';
import { DragDropFileManager } from './DragDropFileManager';
import { FrameworkIntegration } from './FrameworkIntegration';
import { Preview } from './Preview';
import { SplitScreenLayout } from './SplitScreenLayout';

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

const viewTransition = { ease: cubicEasingFn };

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

export const Workbench = memo(({ chatStarted, isStreaming }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const files = useStore(workbenchStore.files);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const handleFileUpload = useCallback((files: FileList) => {
    // Handle file upload logic
    console.log('Files uploaded:', files);
    toast.success(`${files.length} file(s) uploaded successfully`);
  }, []);

  const handleFolderCreate = useCallback((name: string) => {
    // Handle folder creation logic
    console.log('Create folder:', name);
    toast.success(`Folder "${name}" created`);
  }, []);

  const handleFileCreate = useCallback((name: string) => {
    // Handle file creation logic
    console.log('Create file:', name);
    toast.success(`File "${name}" created`);
  }, []);

  const handleFrameworkSelect = useCallback((framework: any) => {
    console.log('Framework selected:', framework);
    toast.success(`${framework.name} framework selected`);
  }, []);

  const handleCommandRun = useCallback((command: string) => {
    console.log('Run command:', command);
    toast.info(`Running: ${command}`);
  }, []);

  return (
    chatStarted && (
      <motion.div
        initial="closed"
        animate={showWorkbench ? 'open' : 'closed'}
        variants={workbenchVariants}
        className="z-workbench"
      >
        <MobileResponsiveLayout
          className={classNames(
            'fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
            {
              'left-[var(--workbench-left)]': showWorkbench,
              'left-[100%]': !showWorkbench,
            },
          )}
          sidebar={
            <div className="w-64 h-full">
              <FrameworkIntegration
                onFrameworkSelect={handleFrameworkSelect}
                onCommandRun={handleCommandRun}
                className="border-b border-bolt-elements-borderColor"
              />
              <DragDropFileManager
                onFileUpload={handleFileUpload}
                onFolderCreate={handleFolderCreate}
                onFileCreate={handleFileCreate}
              />
            </div>
          }
          header={
            <div className="flex items-center justify-between p-2">
              <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">Workbench</h2>
              <ThemeCustomizer />
            </div>
          }
        >
          <CustomizableWorkspace className="h-full">
            <SplitScreenLayout chatStarted={chatStarted} isStreaming={isStreaming} />
          </CustomizableWorkspace>
        </MobileResponsiveLayout>
      </motion.div>
    )
  );
});

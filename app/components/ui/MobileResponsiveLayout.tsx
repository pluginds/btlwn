import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from './IconButton';
import { classNames } from '~/utils/classNames';
import { isMobile } from '~/utils/mobile';

interface MobileResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export const MobileResponsiveLayout = memo(({
  children,
  sidebar,
  header,
  className,
}: MobileResponsiveLayoutProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobileView) {
    return (
      <div className={classNames('flex h-full', className)}>
        {sidebar && <div className="flex-shrink-0">{sidebar}</div>}
        <div className="flex-1 flex flex-col">
          {header && <div className="flex-shrink-0">{header}</div>}
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('flex flex-col h-full', className)}>
      {/* Mobile Header */}
      {header && (
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor">
          {sidebar && (
            <IconButton
              icon="i-ph:list"
              size="lg"
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden"
            />
          )}
          <div className="flex-1">{header}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileSidebar && sidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-40"
                onClick={() => setShowMobileSidebar(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[80vw] bg-bolt-elements-background-depth-1 border-r border-bolt-elements-borderColor z-50 overflow-y-auto"
              >
                <div className="p-4 border-b border-bolt-elements-borderColor flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">Menu</h2>
                  <IconButton
                    icon="i-ph:x"
                    size="lg"
                    onClick={() => setShowMobileSidebar(false)}
                  />
                </div>
                <div className="p-4">{sidebar}</div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
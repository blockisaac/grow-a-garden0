import { motion } from "motion/react";

interface FlowerGardenProps {
  streakCount: number;
  lastSubmission: string | null;
}

export function FlowerGarden({ streakCount, lastSubmission }: FlowerGardenProps) {
  const getFlowerStage = (streak: number) => {
    if (streak === 0) return 'dormant';
    if (streak <= 3) return 'node';
    if (streak <= 7) return 'branch';
    if (streak <= 14) return 'network';
    if (streak <= 30) return 'matrix';
    return 'system';
  };

  const stage = getFlowerStage(streakCount);
  
  const isToday = lastSubmission === new Date().toDateString();
  const isDecaying = lastSubmission && 
    new Date().getTime() - new Date(lastSubmission).getTime() > 24 * 60 * 60 * 1000;

  const renderStructure = () => {
    const baseClass = "transition-all duration-2000 ease-out";
    
    switch (stage) {
      case 'dormant':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            className="relative"
          >
            <div className="w-2 h-2 bg-primary/30 border border-primary/20" />
            <div className="absolute inset-0 border border-primary/10 animate-pulse" />
          </motion.div>
        );
      
      case 'node':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div 
              className={`w-px h-8 bg-primary/60 ${baseClass}`}
              animate={{ height: isDecaying ? 12 : 32, opacity: isDecaying ? 0.3 : 0.8 }}
            />
            <div className="w-3 h-3 border border-primary/50 bg-primary/10" />
          </motion.div>
        );
      
      case 'branch':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div className="relative">
              <motion.div 
                className={`w-px h-12 bg-primary/70 ${baseClass}`}
                animate={{ height: isDecaying ? 16 : 48, opacity: isDecaying ? 0.4 : 0.9 }}
              />
              <motion.div 
                className={`absolute -left-6 top-2 w-6 h-px bg-primary/50 transform -rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.7 }}
              />
              <motion.div 
                className={`absolute -right-6 top-4 w-6 h-px bg-primary/50 transform rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.7 }}
              />
            </motion.div>
            <div className="w-4 h-4 border border-primary/60 bg-primary/15" />
          </motion.div>
        );
      
      case 'network':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div className="relative">
              <motion.div 
                className={`w-px h-16 bg-primary/80 ${baseClass}`}
                animate={{ height: isDecaying ? 24 : 64, opacity: isDecaying ? 0.4 : 1 }}
              />
              <motion.div 
                className={`absolute -left-8 top-3 w-8 h-px bg-primary/60 transform -rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.8 }}
              />
              <motion.div 
                className={`absolute -right-8 top-6 w-8 h-px bg-primary/60 transform rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.8 }}
              />
              <motion.div 
                className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${baseClass}`}
                animate={{ 
                  scale: isDecaying ? 0.5 : 1,
                  opacity: isDecaying ? 0.3 : 0.9,
                  rotate: isToday ? [0, 360] : 0
                }}
                transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" } }}
              >
                <div className="w-6 h-6 border border-primary/70 bg-primary/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary/60" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <div className="w-5 h-5 border border-primary/70 bg-primary/20" />
          </motion.div>
        );
      
      case 'matrix':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div className="relative">
              <motion.div 
                className={`w-px h-20 bg-primary/90 ${baseClass}`}
                animate={{ height: isDecaying ? 32 : 80, opacity: isDecaying ? 0.4 : 1 }}
              />
              <motion.div 
                className={`absolute -left-10 top-4 w-10 h-px bg-primary/70 transform -rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.9 }}
              />
              <motion.div 
                className={`absolute -right-10 top-8 w-10 h-px bg-primary/70 transform rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.9 }}
              />
              <motion.div 
                className={`absolute -left-8 top-12 w-8 h-px bg-primary/60 transform -rotate-30 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.2 : 0.8 }}
              />
              <motion.div 
                className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${baseClass}`}
                animate={{ 
                  scale: isDecaying ? 0.6 : 1,
                  opacity: isDecaying ? 0.3 : 1,
                  rotate: isToday ? [0, 360] : 0
                }}
                transition={{ rotate: { repeat: Infinity, duration: 12, ease: "linear" } }}
              >
                <div className="w-8 h-8 border border-primary bg-primary/25 relative">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div 
                      key={i}
                      className="w-6 h-px bg-primary/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
                    />
                  ))}
                  <div className="w-3 h-3 bg-primary/70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </motion.div>
            </motion.div>
            <div className="w-6 h-6 border border-primary bg-primary/25" />
          </motion.div>
        );
      
      default: // system
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div className="relative">
              <motion.div 
                className={`w-px h-24 bg-primary ${baseClass}`}
                animate={{ height: isDecaying ? 48 : 96, opacity: isDecaying ? 0.5 : 1 }}
              />
              
              {/* Connection nodes */}
              <motion.div 
                className={`absolute -left-12 top-5 w-12 h-px bg-primary/80 transform -rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.3 : 1 }}
              />
              <motion.div 
                className={`absolute -right-12 top-10 w-12 h-px bg-primary/80 transform rotate-45 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.3 : 1 }}
              />
              <motion.div 
                className={`absolute -left-10 top-16 w-10 h-px bg-primary/70 transform -rotate-30 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.3 : 0.9 }}
              />
              <motion.div 
                className={`absolute -right-10 top-20 w-10 h-px bg-primary/70 transform rotate-30 ${baseClass}`}
                animate={{ opacity: isDecaying ? 0.3 : 0.9 }}
              />
              
              {/* Central matrix */}
              <motion.div 
                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${baseClass}`}
                animate={{ 
                  scale: isDecaying ? 0.7 : 1,
                  opacity: isDecaying ? 0.4 : 1,
                  rotate: isToday ? [0, 360] : 0
                }}
                transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" } }}
              >
                <div className="w-12 h-12 border border-primary bg-primary/30 relative">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-px bg-primary/60 absolute top-1/2 left-1/2"
                      style={{ 
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg)`, 
                        transformOrigin: '50% 50%' 
                      }}
                    />
                  ))}
                  <div className="w-4 h-4 bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </motion.div>
            </motion.div>
            <div className="w-8 h-8 border border-primary bg-primary/30" />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-card border border-border/50 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      {/* Central node */}
      <div className="relative z-10 flex flex-col items-center">
        {renderStructure()}
        
        {/* Status indicator */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-xs text-muted-foreground tracking-wide uppercase">
            {stage === 'dormant' ? 'Initialization' : 
             stage === 'node' ? 'Processing' :
             stage === 'branch' ? 'Expanding' :
             stage === 'network' ? 'Connecting' :
             stage === 'matrix' ? 'Stabilizing' : 'Optimized'}
          </div>
          <div className="w-16 h-px bg-primary/30 mx-auto mt-1" />
        </motion.div>
      </div>
      
      {isDecaying && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 text-center"
        >
          <div className="text-xs text-destructive/70 tracking-wide">
            System degradation detected
          </div>
        </motion.div>
      )}
      
      {isToday && streakCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </motion.div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { usePokerStore } from "@/lib/poker-store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";

export function Timer() {
  const {
    timeRemaining,
    isRunning,
    currentLevel,
    blindLevels,
    levelDuration,
    setTimeRemaining,
    toggleTimer,
    resetTimer,
    nextLevel,
    previousLevel,
    resetTournament,
  } = usePokerStore();

  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      // Auto advance to next level
      if (currentLevel < blindLevels.length) {
        nextLevel();
      } else {
        toggleTimer();
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeRemaining,
    currentLevel,
    blindLevels.length,
    setTimeRemaining,
    nextLevel,
    toggleTimer,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = ((levelDuration - timeRemaining) / levelDuration) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8">
      {/* Progress bar background */}
      <div
        className="absolute inset-0 bg-primary/10 transition-all duration-1000"
        style={{ width: `${progressPercentage}%` }}
      />

      <div className="relative z-10">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Level {currentLevel} / {blindLevels.length}
          </p>
          <div className="text-8xl font-mono font-bold text-foreground tabular-nums">
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={previousLevel}
            disabled={currentLevel <= 1}
            className="h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={resetTimer}
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            onClick={toggleTimer}
            size="lg"
            className="h-14 w-32 text-lg font-semibold"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pauza
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={nextLevel}
            disabled={currentLevel >= blindLevels.length}
            className="h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowResetDialog(true)}
            className="h-12 w-12 ml-4"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restartovat turnaj?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce resetuje casovac na level 1, vynuluje vsechny rebuys a
              zrusi prirazeni hracu ke stolum. Tuto akci nelze vratit zpet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrusit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetTournament();
                setShowResetDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ano, restartovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

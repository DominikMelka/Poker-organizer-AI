import { create } from "zustand";

export interface Player {
  id: string;
  name: string;
  rebuys: number;
  tableId: number | null;
  isEliminated?: boolean;
}

export interface BlindLevel {
  id: string;
  level: number;
  smallBlind: number;
  bigBlind: number;
}

interface PokerState {
  // Timer
  levelDuration: number; // in seconds
  timeRemaining: number;
  isRunning: boolean;
  currentLevel: number;

  // Blinds
  blindLevels: BlindLevel[];

  // Buy-in
  buyInAmount: number;
  rebuyAmount: number;

  // Tables
  activeTables: number;
  players: Player[];

  // Actions
  setLevelDuration: (duration: number) => void;
  setTimeRemaining: (time: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  nextLevel: () => void;
  previousLevel: () => void;

  setBlindLevels: (levels: BlindLevel[]) => void;
  addBlindLevel: () => void;
  updateBlindLevel: (id: string, smallBlind: number, bigBlind: number) => void;
  removeBlindLevel: (id: string) => void;

  setBuyInAmount: (amount: number) => void;
  setRebuyAmount: (amount: number) => void;

  setActiveTables: (count: number) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  eliminatePlayer: (id: string) => void;
  addRebuy: (playerId: string) => void;
  removeRebuy: (playerId: string) => void;
  assignPlayerToTable: (playerId: string, tableId: number | null) => void;
  randomizePlayerAssignment: () => void;
  resetTournament: () => void;
}

const defaultBlindLevels: BlindLevel[] = [
  { id: "1", level: 1, smallBlind: 25, bigBlind: 50 },
  { id: "2", level: 2, smallBlind: 50, bigBlind: 100 },
  { id: "3", level: 3, smallBlind: 75, bigBlind: 150 },
  { id: "4", level: 4, smallBlind: 100, bigBlind: 200 },
  { id: "5", level: 5, smallBlind: 150, bigBlind: 300 },
  { id: "6", level: 6, smallBlind: 200, bigBlind: 400 },
  { id: "7", level: 7, smallBlind: 300, bigBlind: 600 },
  { id: "8", level: 8, smallBlind: 400, bigBlind: 800 },
  { id: "9", level: 9, smallBlind: 500, bigBlind: 1000 },
  { id: "10", level: 10, smallBlind: 600, bigBlind: 1200 },
];

export const usePokerStore = create<PokerState>((set, get) => ({
  // Initial state
  levelDuration: 20 * 60, // 20 minutes in seconds
  timeRemaining: 20 * 60,
  isRunning: false,
  currentLevel: 1,

  blindLevels: defaultBlindLevels,

  buyInAmount: 200,
  rebuyAmount: 200,

  activeTables: 3,
  players: [],

  // Timer actions
  setLevelDuration: (duration) =>
    set({ levelDuration: duration, timeRemaining: duration }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),

  resetTimer: () =>
    set((state) => ({
      timeRemaining: state.levelDuration,
      isRunning: false,
    })),

  nextLevel: () =>
    set((state) => {
      const newLevel = Math.min(
        state.currentLevel + 1,
        state.blindLevels.length
      );
      return {
        currentLevel: newLevel,
        timeRemaining: state.levelDuration,
      };
    }),

  previousLevel: () =>
    set((state) => {
      const newLevel = Math.max(state.currentLevel - 1, 1);
      return {
        currentLevel: newLevel,
        timeRemaining: state.levelDuration,
      };
    }),

  // Blinds actions
  setBlindLevels: (levels) => set({ blindLevels: levels }),

  addBlindLevel: () =>
    set((state) => {
      const lastLevel = state.blindLevels[state.blindLevels.length - 1];
      const newLevel: BlindLevel = {
        id: crypto.randomUUID(),
        level: state.blindLevels.length + 1,
        smallBlind: lastLevel ? lastLevel.bigBlind : 100,
        bigBlind: lastLevel ? lastLevel.bigBlind * 2 : 200,
      };
      return { blindLevels: [...state.blindLevels, newLevel] };
    }),

  updateBlindLevel: (id, smallBlind, bigBlind) =>
    set((state) => ({
      blindLevels: state.blindLevels.map((level) =>
        level.id === id ? { ...level, smallBlind, bigBlind } : level
      ),
    })),

  removeBlindLevel: (id) =>
    set((state) => ({
      blindLevels: state.blindLevels
        .filter((level) => level.id !== id)
        .map((level, index) => ({ ...level, level: index + 1 })),
    })),

  // Buy-in actions
  setBuyInAmount: (amount) => set({ buyInAmount: amount }),
  setRebuyAmount: (amount) => set({ rebuyAmount: amount }),

  // Tables actions
  setActiveTables: (count) => {
    set((state) => ({
      activeTables: count,
      players: state.players.map((player) => ({
        ...player,
        tableId: player.tableId && player.tableId > count ? null : player.tableId,
      })),
    }));
  },

  setPlayers: (players) => set({ players }),

  addPlayer: (name) =>
    set((state) => ({
      players: [
        ...state.players,
        { id: crypto.randomUUID(), name, rebuys: 0, tableId: null, isEliminated: false },
      ],
    })),

  eliminatePlayer: (id) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, isEliminated: true } : player
      ),
    })),

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((player) => player.id !== id),
    })),

  addRebuy: (playerId) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === playerId
          ? { ...player, rebuys: player.rebuys + 1 }
          : player
      ),
    })),

  removeRebuy: (playerId) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === playerId && player.rebuys > 0
          ? { ...player, rebuys: player.rebuys - 1 }
          : player
      ),
    })),

  assignPlayerToTable: (playerId, tableId) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === playerId ? { ...player, tableId } : player
      ),
    })),

  randomizePlayerAssignment: () =>
    set((state) => {
      const { players, activeTables } = state;
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      const maxPlayersPerTable = 9;

      const assigned = shuffled.map((player, index) => {
        const tableIndex = index % activeTables;
        const playersAtTable = shuffled
          .slice(0, index)
          .filter((_, i) => i % activeTables === tableIndex).length;

        if (playersAtTable >= maxPlayersPerTable) {
          return { ...player, tableId: null };
        }

        return { ...player, tableId: tableIndex + 1 };
      });

      return { players: assigned };
    }),

  resetTournament: () =>
    set((state) => ({
      timeRemaining: state.levelDuration,
      isRunning: false,
      currentLevel: 1,
      players: state.players.map((player) => ({
        ...player,
        rebuys: 0,
        tableId: null,
        isEliminated: false,
      })),
    })),
}));

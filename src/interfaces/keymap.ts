import React from 'react';

export type CommandHandler = () => void;
export type OnTextHandler = (text: string) => void;
export type ConditionHandler = (e: React.KeyboardEvent) => boolean;

export interface CommandMap {
  [key: string]: CommandHandler;
}

export interface Command {
  test: ConditionHandler;
  handler: () => void;
}

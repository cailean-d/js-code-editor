import React from 'react';
import { observable, computed, action } from 'mobx';
import { Command, CommandMap, CommandHandler, OnTextHandler, ConditionHandler } from '@/interfaces/keymap';

export default class Keymap {

  @observable private commandMap: CommandMap = {};
  @observable private onTextHandlers: OnTextHandler[] = [];

  @computed private get commands(): Command[] {
    const commands: Command[] = [];
    for (const key of Object.keys(this.commandMap)) {
      const conditionList = this.mapToConditionList(key);
      commands.push({
        test: e => conditionList.every(item => item(e)),
        handler: this.commandMap[key],
      });
    }
    return commands;
  }

  @action onText(callback: OnTextHandler) {
    this.onTextHandlers.push(callback);
  }

  @action addCommand(keybind: string, command: CommandHandler) {
    this.commandMap[keybind] = command;
  }

  processInput(e: React.KeyboardEvent) {
    requestAnimationFrame(() => {
      const target = e.target as HTMLTextAreaElement;
      const text = target.value.trim();
      const isCommandExecuted = this.executeCommands(e);
      if (!isCommandExecuted && text) {
        this.executeTextHandlers(text);
      }
      target.value = null;
    });
  }

  private executeCommands(e: React.KeyboardEvent): boolean {
    let isCommandExecuted = false;
    for (const cmd of this.commands) {
      if (cmd.test(e)) {
        isCommandExecuted = true;
        cmd.handler();
      }
    }
    return isCommandExecuted;
  }

  private executeTextHandlers(text: string) {
    for (const handler of this.onTextHandlers) {
      handler(text);
    }
  }

  private mapToConditionList(keybind: string): ConditionHandler[] {
    const keybinds = keybind.split('+');
    const letter = /^[A-Za-z]{1}$/;
    const conditionList: ConditionHandler[] = keybinds.map(item => {
      const isKey = letter.test(item);
      if (isKey)
        return e => e.key === item.toUpperCase() || e.key === item.toLowerCase();
      if (item === 'Ctrl')
        return e => e.ctrlKey;
      else if (item === 'Shift')
        return e => e.shiftKey;
      else if (item === 'Alt')
        return e => e.shiftKey;
      else if (item === 'Space')
        return e => e.key === ' ';
      else
        return e => e.key === item;
    });
    this.excludeMidifiers(keybinds, conditionList);
    return conditionList;
  }

  private excludeMidifiers(keybinds: string[], conditionList: ConditionHandler[]) {
    if (!keybinds.includes('Ctrl') && this.isIncludeModifier(keybinds, 'Ctrl'))
      conditionList.push(e => !e.ctrlKey);
    if (!keybinds.includes('Shift') && this.isIncludeModifier(keybinds, 'Shift'))
      conditionList.push(e => !e.shiftKey);
    if (!keybinds.includes('Alt') && this.isIncludeModifier(keybinds, 'Alt'))
      conditionList.push(e => !e.altKey);
  }

  private isIncludeModifier(keybinds: string[], modifier: string): boolean {
    const keybind = keybinds.join('+');
    const key = keybinds[keybinds.length - 1];
    const regex = new RegExp(`${modifier}\\+.*${key}$`);
    for (const k of Object.keys(this.commandMap)) {
      if (k !== keybind && regex.test(k)) {
        return true;
      }
    }
    return false;
  }
}

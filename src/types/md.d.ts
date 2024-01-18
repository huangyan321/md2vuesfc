/** @format */

export interface Template {
  type: string;
  content: string;
  contentStripped: string;
  tagOpen: string;
  tagClose: string;
}

export interface ScriptSetup {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
}

export interface Script {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
}

export interface Style {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
  scoped?: boolean;
}

export interface SfcBlock {
  template: Template;
  script?: any;
  scriptSetup: ScriptSetup;
  scripts: Script[];
  styles: Style[];
  customBlocks: any[];
}

export interface MarkDownEnv {
  sfcBlocks: SfcBlock;
}

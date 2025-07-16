import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, type Extension } from '@codemirror/state';
import { gutter, GutterMarker } from '@codemirror/view';

// Debugging capabilities
export interface Breakpoint {
  line: number;
  enabled: boolean;
  condition?: string;
}

export interface DebugState {
  breakpoints: Breakpoint[];
  currentLine?: number;
  variables: Record<string, any>;
  callStack: string[];
}

// Breakpoint marker
class BreakpointMarker extends GutterMarker {
  constructor(private enabled: boolean) {
    super();
  }

  toDOM() {
    const marker = document.createElement('div');
    marker.className = `breakpoint-marker ${this.enabled ? 'enabled' : 'disabled'}`;
    marker.innerHTML = '●';
    marker.style.color = this.enabled ? '#ff4444' : '#888888';
    marker.style.cursor = 'pointer';
    marker.style.fontSize = '16px';
    marker.style.lineHeight = '1';
    return marker;
  }
}

// Current execution line marker
class CurrentLineMarker extends GutterMarker {
  toDOM() {
    const marker = document.createElement('div');
    marker.className = 'current-line-marker';
    marker.innerHTML = '▶';
    marker.style.color = '#00aa00';
    marker.style.fontSize = '12px';
    return marker;
  }
}

// State effects for debugging
export const addBreakpoint = StateEffect.define<{ line: number; enabled: boolean }>();
export const removeBreakpoint = StateEffect.define<{ line: number }>();
export const toggleBreakpoint = StateEffect.define<{ line: number }>();
export const setCurrentLine = StateEffect.define<{ line: number | undefined }>();

// Debug state field
export const debugState = StateField.define<DebugState>({
  create: () => ({
    breakpoints: [],
    variables: {},
    callStack: [],
  }),
  
  update(state, tr) {
    let newState = { ...state };
    
    for (const effect of tr.effects) {
      if (effect.is(addBreakpoint)) {
        const existing = newState.breakpoints.findIndex(bp => bp.line === effect.value.line);
        if (existing >= 0) {
          newState.breakpoints[existing].enabled = effect.value.enabled;
        } else {
          newState.breakpoints.push({
            line: effect.value.line,
            enabled: effect.value.enabled,
          });
        }
      } else if (effect.is(removeBreakpoint)) {
        newState.breakpoints = newState.breakpoints.filter(bp => bp.line !== effect.value.line);
      } else if (effect.is(toggleBreakpoint)) {
        const existing = newState.breakpoints.findIndex(bp => bp.line === effect.value.line);
        if (existing >= 0) {
          newState.breakpoints[existing].enabled = !newState.breakpoints[existing].enabled;
        } else {
          newState.breakpoints.push({
            line: effect.value.line,
            enabled: true,
          });
        }
      } else if (effect.is(setCurrentLine)) {
        newState.currentLine = effect.value.line;
      }
    }
    
    return newState;
  },
});

// Breakpoint gutter
export const breakpointGutter = gutter({
  class: 'cm-breakpoint-gutter',
  markers: (view) => {
    const state = view.state.field(debugState);
    const markers = [];
    
    // Add breakpoint markers
    for (const bp of state.breakpoints) {
      markers.push(new BreakpointMarker(bp.enabled).range(view.state.doc.line(bp.line + 1).from));
    }
    
    // Add current line marker
    if (state.currentLine !== undefined) {
      markers.push(new CurrentLineMarker().range(view.state.doc.line(state.currentLine + 1).from));
    }
    
    return markers;
  },
  
  domEventHandlers: {
    click: (view, line) => {
      const lineNumber = view.state.doc.lineAt(line.from).number - 1;
      view.dispatch({
        effects: toggleBreakpoint.of({ line: lineNumber }),
      });
      return true;
    },
  },
});

// Current line highlighting
export const currentLineHighlight = EditorView.decorations.compute([debugState], (state) => {
  const debug = state.field(debugState);
  if (debug.currentLine === undefined) return Decoration.none;
  
  const line = state.doc.line(debug.currentLine + 1);
  return Decoration.set([
    Decoration.line({
      class: 'cm-current-debug-line',
    }).range(line.from),
  ]);
});

// Debug extension
export function debugExtension(): Extension {
  return [
    debugState,
    breakpointGutter,
    currentLineHighlight,
    EditorView.theme({
      '.cm-breakpoint-gutter': {
        width: '20px',
        backgroundColor: 'var(--bolt-elements-bg-depth-2)',
      },
      '.cm-current-debug-line': {
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
      },
    }),
  ];
}

// Debug utilities
export class DebugManager {
  constructor(private view: EditorView) {}
  
  addBreakpoint(line: number, enabled = true) {
    this.view.dispatch({
      effects: addBreakpoint.of({ line, enabled }),
    });
  }
  
  removeBreakpoint(line: number) {
    this.view.dispatch({
      effects: removeBreakpoint.of({ line }),
    });
  }
  
  toggleBreakpoint(line: number) {
    this.view.dispatch({
      effects: toggleBreakpoint.of({ line }),
    });
  }
  
  setCurrentLine(line: number | undefined) {
    this.view.dispatch({
      effects: setCurrentLine.of({ line }),
    });
  }
  
  getBreakpoints(): Breakpoint[] {
    return this.view.state.field(debugState).breakpoints;
  }
  
  getCurrentLine(): number | undefined {
    return this.view.state.field(debugState).currentLine;
  }
}
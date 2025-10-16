import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

// --- Tipos ---
interface Dialogue {
  id: string;
  character: string;
  line: string;
}

interface Scene {
  id: string;
  content: string;
  dialogues: Dialogue[];
  listening?: boolean;
  activeDialogueId?: string;
  activeCharacterDialogueId?: string;
}

// Gera IDs únicos
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

// --- Componente da Fala ---
interface DialogueBoxProps {
  dialogue: Dialogue;
  sceneId: string;
  onDialogueChange: (sceneId: string, dialogueId: string, field: 'character' | 'line', value: string) => void;
  onDeleteDialogue: (sceneId: string, dialogueId: string) => void;
  onStartDialogueRec: (sceneId: string, dialogueId: string) => void;
  onStopDialogueRec: (sceneId: string, dialogueId: string) => void;
  onStartCharacterRec: (sceneId: string, dialogueId: string) => void;
  onStopCharacterRec: (sceneId: string, dialogueId: string) => void;
  isListening: boolean;
  isCharacterListening: boolean;
  voiceButtonsEnabled: boolean;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, sceneId, onDialogueChange, onDeleteDialogue, onStartDialogueRec, onStopDialogueRec, onStartCharacterRec, onStopCharacterRec, isListening, isCharacterListening, voiceButtonsEnabled }) => (
  <div className="dialogue-box">
    <div className="dialogue-inputs-compact">
      <div className="dialogue-character-container">
        <input
          type="text"
          className="dialogue-character-input"
          value={dialogue.character}
          onChange={(e) => onDialogueChange(sceneId, dialogue.id, 'character', e.target.value.toUpperCase())}
        />
        {voiceButtonsEnabled && (isCharacterListening ? (
          <button
            className="dialogue-voice-button recording"
            onClick={() => onStopCharacterRec(sceneId, dialogue.id)}
            title="Parar gravação"
          >
            ⏹
          </button>
        ) : (
          <button
            className="dialogue-voice-button"
            onClick={() => onStartCharacterRec(sceneId, dialogue.id)}
            title="Gravar nome"
          >
            🔴
          </button>
        ))}
      </div>
      <div className="dialogue-line-container">
        <textarea
          className="dialogue-line-input-compact"
          value={dialogue.line}
          onChange={(e) => onDialogueChange(sceneId, dialogue.id, 'line', e.target.value)}
        />
        {voiceButtonsEnabled && (isListening ? (
          <button
            className="dialogue-voice-button recording"
            onClick={() => onStopDialogueRec(sceneId, dialogue.id)}
            title="Parar gravação"
          >
            ⏹
          </button>
        ) : (
          <button
            className="dialogue-voice-button"
            onClick={() => onStartDialogueRec(sceneId, dialogue.id)}
            title="Gravar fala"
          >
            🔴
          </button>
        ))}
      </div>
    </div>
    <button
      className="delete-dialogue-button"
      onClick={() => onDeleteDialogue(sceneId, dialogue.id)}
      title="Deletar Fala"
    >
      ×
    </button>
  </div>
);

// --- Componente da Cena ---
interface SceneBoxProps {
  scene: Scene;
  index: number;
  totalScenes: number;
  onContentChange: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
  onAddDialogue: (sceneId: string) => void;
  onDialogueChange: (sceneId: string, dialogueId: string, field: 'character' | 'line', value: string) => void;
  onDeleteDialogue: (sceneId: string, dialogueId: string) => void;
  onStartRec: (sceneId: string) => void;
  onStopRec: (sceneId: string) => void;
  onStartDialogueRec: (sceneId: string, dialogueId: string) => void;
  onStopDialogueRec: (sceneId: string, dialogueId: string) => void;
  onStartCharacterRec: (sceneId: string, dialogueId: string) => void;
  onStopCharacterRec: (sceneId: string, dialogueId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddSceneAbove: (index: number) => void;
  onAddSceneBelow: (index: number) => void;
  voiceButtonsEnabled: boolean;
}

const SceneBox: React.FC<SceneBoxProps> = ({
  scene,
  index,
  totalScenes,
  onContentChange,
  onDelete,
  onAddDialogue,
  onDialogueChange,
  onDeleteDialogue,
  onStartRec,
  onStopRec,
  onStartDialogueRec,
  onStopDialogueRec,
  onStartCharacterRec,
  onStopCharacterRec,
  onMoveUp,
  onMoveDown,
  onAddSceneAbove,
  onAddSceneBelow,
  voiceButtonsEnabled,
}) => {
  return (
    <div className="scene-wrapper">
      <div className="scene-box" data-scene-id={scene.id}>
        <div className="scene-content">
        <header className="scene-header">
          <span className="scene-index">{index + 1}</span>
          <div className="scene-actions">
            {voiceButtonsEnabled && (scene.listening ? (
              <button
                className="voice-button recording"
                onClick={() => onStopRec(scene.id)}
                title="Parar gravação"
              >
                ⏹
              </button>
            ) : (
              <button
                className="voice-button"
                onClick={() => onStartRec(scene.id)}
                title="Gravar cena"
              >
                🔴
              </button>
            ))}

            <button
              className="add-dialogue-button"
              onClick={() => onAddDialogue(scene.id)}
              title="Adicionar Fala"
            >
              Fala
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(scene.id)}
              title="Deletar Cena"
            >
              ×
            </button>
          </div>
        </header>

        <textarea
          className="scene-textarea scene-action-input"
          value={scene.content}
          onChange={(e) => onContentChange(scene.id, e.target.value)}
        />

        <div className="dialogue-list">
          {scene.dialogues.map((dialogue) => (
            <DialogueBox
              key={dialogue.id}
              dialogue={dialogue}
              sceneId={scene.id}
              onDialogueChange={onDialogueChange}
              onDeleteDialogue={onDeleteDialogue}
              onStartDialogueRec={onStartDialogueRec}
              onStopDialogueRec={onStopDialogueRec}
              onStartCharacterRec={onStartCharacterRec}
              onStopCharacterRec={onStopCharacterRec}
              isListening={scene.activeDialogueId === dialogue.id}
              isCharacterListening={scene.activeCharacterDialogueId === dialogue.id}
              voiceButtonsEnabled={voiceButtonsEnabled}
            />
          ))}
        </div>
        </div>
      </div>
      <div className="scene-controls">
        <button
          className="scene-control-btn"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          title="Mover cena para cima"
        >
          ↑
        </button>
        <button
          className="scene-control-btn"
          onClick={() => onMoveDown(index)}
          disabled={index === totalScenes - 1}
          title="Mover cena para baixo"
        >
          ↓
        </button>
        <button
          className="scene-control-btn add-scene-ctrl"
          onClick={() => onAddSceneAbove(index)}
          title="Adicionar cena acima"
        >
          +↑
        </button>
        <button
          className="scene-control-btn add-scene-ctrl"
          onClick={() => onAddSceneBelow(index)}
          title="Adicionar cena abaixo"
        >
          +↓
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal ---
const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'full' | 'scenes' | 'dialogues'>('full');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState<boolean>(false);
  const [scriptPanelCollapsed, setScriptPanelCollapsed] = useState<boolean>(false);
  const [translatedDialogues, setTranslatedDialogues] = useState<string>('');
  const [isOrganized, setIsOrganized] = useState<boolean>(false);
  const [originalTranslation, setOriginalTranslation] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [newIdea, setNewIdea] = useState<string>('');
  const [savedScripts, setSavedScripts] = useState<Array<{name: string, data: any}>>([]);
  const [newScriptName, setNewScriptName] = useState<string>('');
  const [voiceButtonsEnabled, setVoiceButtonsEnabled] = useState<boolean>(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activeSceneRef = useRef<string | null>(null);
  const dialogueRecognitionRef = useRef<SpeechRecognition | null>(null);
  const activeDialogueRef = useRef<{ sceneId: string; dialogueId: string } | null>(null);
  const characterRecognitionRef = useRef<SpeechRecognition | null>(null);
  const activeCharacterRef = useRef<{ sceneId: string; dialogueId: string } | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef<boolean>(false);

  // 🔹 Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('roteiro_scenes');
    if (saved) {
      try {
        setScenes(JSON.parse(saved));
      } catch {
        console.warn('Erro ao carregar cenas salvas');
      }
    }
    const savedNotes = localStorage.getItem('roteiro_notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
    const savedCounter = localStorage.getItem('roteiro_counter');
    if (savedCounter) {
      setCounter(parseInt(savedCounter, 10));
    }
    const savedIdeas = localStorage.getItem('roteiro_ideas');
    if (savedIdeas) {
      try {
        setIdeas(JSON.parse(savedIdeas));
      } catch {
        console.warn('Erro ao carregar ideias salvas');
      }
    }
    const savedScriptsList = localStorage.getItem('roteiro_saved_scripts');
    if (savedScriptsList) {
      try {
        setSavedScripts(JSON.parse(savedScriptsList));
      } catch {
        console.warn('Erro ao carregar roteiros salvos');
      }
    }
    const savedVoiceButtons = localStorage.getItem('roteiro_voice_buttons_enabled');
    if (savedVoiceButtons !== null) {
      setVoiceButtonsEnabled(savedVoiceButtons === 'true');
    }
  }, []);

  // 🔹 Salva cenas sempre que mudar
  useEffect(() => {
    localStorage.setItem('roteiro_scenes', JSON.stringify(scenes));
  }, [scenes]);

  // 🔹 Salva anotações sempre que mudar
  useEffect(() => {
    localStorage.setItem('roteiro_notes', notes);
  }, [notes]);

  // 🔹 Salva contador sempre que mudar
  useEffect(() => {
    localStorage.setItem('roteiro_counter', counter.toString());
  }, [counter]);

  // 🔹 Salva ideias sempre que mudar
  useEffect(() => {
    localStorage.setItem('roteiro_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // 🔹 Salva estado dos botões de voz sempre que mudar
  useEffect(() => {
    localStorage.setItem('roteiro_voice_buttons_enabled', voiceButtonsEnabled.toString());
  }, [voiceButtonsEnabled]);

  // Adiciona cena
  const addScene = useCallback(() => {
    const newScene: Scene = { id: generateId(), content: '', dialogues: [] };
    setScenes((prev) => [...prev, newScene]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 0);
  }, []);

  const deleteScene = useCallback((id: string) => {
    if (activeSceneRef.current === id) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      activeSceneRef.current = null;
    }
    setScenes((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleContentChange = useCallback((id: string, newContent: string) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, content: newContent } : s)));
  }, []);

  const addDialogue = useCallback((sceneId: string) => {
    const newDialogue: Dialogue = { id: generateId(), character: '', line: '' };
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId ? { ...s, dialogues: [...s.dialogues, newDialogue] } : s
      )
    );
  }, []);

  const deleteDialogue = useCallback((sceneId: string, dialogueId: string) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId ? { ...s, dialogues: s.dialogues.filter((d) => d.id !== dialogueId) } : s
      )
    );
  }, []);

  const handleDialogueChange = useCallback(
    (sceneId: string, dialogueId: string, field: 'character' | 'line', value: string) => {
      setScenes((prev) =>
        prev.map((s) => {
          if (s.id !== sceneId) return s;
          return {
            ...s,
            dialogues: s.dialogues.map((d) => (d.id === dialogueId ? { ...d, [field]: value } : d)),
          };
        })
      );
    },
    []
  );

  // Reconhecimento de voz
  const startRec = (sceneId: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Seu navegador não suporta SpeechRecognition');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      activeSceneRef.current = null;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalAppend = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalAppend += res[0].transcript;
        }
      }
      if (finalAppend.trim()) {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === sceneId
              ? { ...s, content: (s.content ? s.content + ' ' : '') + finalAppend.trim() }
              : s
          )
        );
      }
    };

    rec.onend = () => {
      setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, listening: false } : s)));
      recognitionRef.current = null;
      activeSceneRef.current = null;
    };

    rec.onerror = () => {
      recognitionRef.current = null;
      activeSceneRef.current = null;
      setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, listening: false } : s)));
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      activeSceneRef.current = sceneId;
      setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, listening: true } : s)));
    } catch (err) {
      console.error('Erro ao iniciar reconhecimento:', err);
      alert('Não foi possível iniciar o reconhecimento. Tente novamente.');
    }
  };

  const stopRec = (sceneId: string) => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    activeSceneRef.current = null;
    setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, listening: false } : s)));
  };

  // Reconhecimento de voz para diálogos individuais
  const startDialogueRec = (sceneId: string, dialogueId: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Seu navegador não suporta SpeechRecognition');
      return;
    }

    if (dialogueRecognitionRef.current) {
      dialogueRecognitionRef.current.stop();
      dialogueRecognitionRef.current = null;
      activeDialogueRef.current = null;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalAppend = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalAppend += res[0].transcript;
        }
      }
      if (finalAppend.trim()) {
        setScenes((prev) =>
          prev.map((s) => {
            if (s.id !== sceneId) return s;
            return {
              ...s,
              dialogues: s.dialogues.map((d) => {
                if (d.id !== dialogueId) return d;
                return {
                  ...d,
                  line: (d.line ? d.line + ' ' : '') + finalAppend.trim(),
                };
              }),
            };
          })
        );
      }
    };

    rec.onend = () => {
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeDialogueId: undefined } : s))
      );
      dialogueRecognitionRef.current = null;
      activeDialogueRef.current = null;
    };

    rec.onerror = () => {
      dialogueRecognitionRef.current = null;
      activeDialogueRef.current = null;
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeDialogueId: undefined } : s))
      );
    };

    try {
      rec.start();
      dialogueRecognitionRef.current = rec;
      activeDialogueRef.current = { sceneId, dialogueId };
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeDialogueId: dialogueId } : s))
      );
    } catch (err) {
      console.error('Erro ao iniciar reconhecimento:', err);
      alert('Não foi possível iniciar o reconhecimento. Tente novamente.');
    }
  };

  const stopDialogueRec = (sceneId: string, dialogueId: string) => {
    dialogueRecognitionRef.current?.stop();
    dialogueRecognitionRef.current = null;
    activeDialogueRef.current = null;
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, activeDialogueId: undefined } : s))
    );
  };

  const startCharacterRec = (sceneId: string, dialogueId: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Seu navegador não suporta SpeechRecognition');
      return;
    }

    if (characterRecognitionRef.current) {
      characterRecognitionRef.current.stop();
      characterRecognitionRef.current = null;
      activeCharacterRef.current = null;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript;
        }
      }
      if (finalText.trim()) {
        setScenes((prev) =>
          prev.map((s) => {
            if (s.id !== sceneId) return s;
            return {
              ...s,
              dialogues: s.dialogues.map((d) => {
                if (d.id !== dialogueId) return d;
                return {
                  ...d,
                  character: finalText.trim().toUpperCase(),
                };
              }),
            };
          })
        );
      }
    };

    rec.onend = () => {
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeCharacterDialogueId: undefined } : s))
      );
      characterRecognitionRef.current = null;
      activeCharacterRef.current = null;
    };

    rec.onerror = () => {
      characterRecognitionRef.current = null;
      activeCharacterRef.current = null;
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeCharacterDialogueId: undefined } : s))
      );
    };

    try {
      rec.start();
      characterRecognitionRef.current = rec;
      activeCharacterRef.current = { sceneId, dialogueId };
      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, activeCharacterDialogueId: dialogueId } : s))
      );
    } catch (err) {
      console.error('Erro ao iniciar reconhecimento:', err);
      alert('Não foi possível iniciar o reconhecimento. Tente novamente.');
    }
  };

  const stopCharacterRec = (sceneId: string, dialogueId: string) => {
    characterRecognitionRef.current?.stop();
    characterRecognitionRef.current = null;
    activeCharacterRef.current = null;
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, activeCharacterDialogueId: undefined } : s))
    );
  };

  // Exporta texto
  const formatScenesForExport = () => {
    return scenes
      .map((scene, index) => {
        let script = '';
        if (scene.content.trim()) script += `${index + 1} - ${scene.content.trim()}\n`;
        else script += `${index + 1}\n`;

        scene.dialogues.forEach((d) => {
          if (d.character.trim()) script += `${d.character.trim().toUpperCase()}\n`;
          if (d.line.trim()) script += `- ${d.line.trim()}\n`;
        });

        script += '\n';
        return script;
      })
      .join('');
  };

  const formatScenesOnly = () => {
    return scenes
      .map((scene, index) => {
        if (scene.content.trim()) return `${index + 1} - ${scene.content.trim()}`;
        return `${index + 1}`;
      })
      .join('\n\n');
  };

  const formatDialoguesOnly = () => {
    return scenes
      .map((scene, index) => {
        let script = '';
        if (scene.dialogues.length > 0) {
          script += `${index + 1}\n`;
          scene.dialogues.forEach((d) => {
            if (d.character.trim()) script += `${d.character.trim().toUpperCase()}\n`;
            if (d.line.trim()) script += `- ${d.line.trim()}\n`;
          });
          script += '\n';
        }
        return script;
      })
      .filter(s => s.trim())
      .join('');
  };

  const translateToSpanish = async () => {
    setIsTranslating(true);
    try {
      const textToTranslate = formatDialoguesOnly();
      const lines = textToTranslate.split('\n');
      const translatedLines: string[] = [];

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (/^\d+$/.test(trimmedLine) || (trimmedLine === trimmedLine.toUpperCase() && trimmedLine !== '' && !trimmedLine.startsWith('-'))) {
          translatedLines.push(line);
        } else if (trimmedLine.startsWith('-')) {
          const textToTranslate = trimmedLine.replace('-', '').trim();

          if (textToTranslate) {
            try {
              const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=pt|es`);
              const data = await response.json();

              if (data.responseData && data.responseData.translatedText) {
                translatedLines.push(`- ${data.responseData.translatedText}`);
              } else {
                translatedLines.push(line);
              }

              await new Promise(resolve => setTimeout(resolve, 200));
            } catch {
              translatedLines.push(line);
            }
          } else {
            translatedLines.push(line);
          }
        } else if (trimmedLine === '') {
          translatedLines.push('');
        } else {
          translatedLines.push(line);
        }
      }

      setTranslatedDialogues(translatedLines.join('\n'));
    } catch (error) {
      console.error('Erro na tradução:', error);
      alert('Erro ao traduzir');
    } finally {
      setIsTranslating(false);
    }
  };

  // Atualiza cenas a partir do texto editado no roteiro final
  const handleFullScriptChange = (text: string) => {
    const lines = text.split('\n');
    const newScenes: Scene[] = [];
    let currentScene: Scene | null = null;

    lines.forEach((line) => {
      if (/^\d+/.test(line)) {
        if (currentScene) newScenes.push(currentScene);
        currentScene = { id: generateId(), content: '', dialogues: [] };

        const match = line.match(/^\d+\s*-\s*(.*)$/);
        if (match) currentScene.content = match[1];
      } else if (line.trim().toUpperCase() === line.trim() && line.trim() !== '' && !line.startsWith('-')) {
        if (currentScene) {
          currentScene.dialogues.push({ id: generateId(), character: line.trim(), line: '' });
        }
      } else if (line.trim().startsWith('-')) {
        if (currentScene && currentScene.dialogues.length > 0) {
          currentScene.dialogues[currentScene.dialogues.length - 1].line = line.replace('-', '').trim();
        }
      }
    });

    if (currentScene) newScenes.push(currentScene);
    setScenes(newScenes);
  };

  const handleCounterMouseDown = () => {
    isHoldingRef.current = false;
    holdTimerRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setCounter(0);
    }, 1000);
  };

  const handleCounterClick = () => {
    if (!isHoldingRef.current) {
      setCounter(prev => prev + 1);
    }
    isHoldingRef.current = false;
  };

  const addIdea = () => {
    if (newIdea.trim()) {
      setIdeas(prev => [...prev, newIdea.trim()]);
      setNewIdea('');
    }
  };

  const deleteIdea = (index: number) => {
    setIdeas(prev => prev.filter((_, i) => i !== index));
  };

  const saveScript = () => {
    if (!newScriptName.trim()) {
      alert('Digite um nome para o roteiro');
      return;
    }

    const scriptData = {
      scenes,
      notes,
      ideas,
      counter,
      savedAt: new Date().toISOString()
    };

    const newSaved = {
      name: newScriptName.trim(),
      data: scriptData
    };

    const updated = [...savedScripts, newSaved];
    setSavedScripts(updated);
    localStorage.setItem('roteiro_saved_scripts', JSON.stringify(updated));
    setNewScriptName('');
  };

  const loadScript = (index: number) => {
    const script = savedScripts[index];
    if (!script) return;

    const { data } = script;
    if (data.scenes) setScenes(data.scenes);
    if (data.notes) setNotes(data.notes);
    if (data.ideas) setIdeas(data.ideas);
    if (data.counter !== undefined) setCounter(data.counter);
  };

  const deleteScript = (index: number) => {
    const updated = savedScripts.filter((_, i) => i !== index);
    setSavedScripts(updated);
    localStorage.setItem('roteiro_saved_scripts', JSON.stringify(updated));
  };

  const [showClearModal, setShowClearModal] = useState(false);

  const clearScript = () => {
    setScenes([]);
    setNotes('');
    setCounter(0);
    setShowClearModal(false);
  };

  const handleCounterMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const moveSceneUp = (index: number) => {
    if (index === 0) return;
    setScenes((prev) => {
      const newScenes = [...prev];
      [newScenes[index - 1], newScenes[index]] = [newScenes[index], newScenes[index - 1]];
      return newScenes;
    });
  };

  const moveSceneDown = (index: number) => {
    if (index === scenes.length - 1) return;
    setScenes((prev) => {
      const newScenes = [...prev];
      [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];
      return newScenes;
    });
  };

  const addSceneAbove = (index: number) => {
    const newScene: Scene = { id: generateId(), content: '', dialogues: [] };
    setScenes((prev) => {
      const newScenes = [...prev];
      newScenes.splice(index, 0, newScene);
      return newScenes;
    });
  };

  const addSceneBelow = (index: number) => {
    const newScene: Scene = { id: generateId(), content: '', dialogues: [] };
    setScenes((prev) => {
      const newScenes = [...prev];
      newScenes.splice(index + 1, 0, newScene);
      return newScenes;
    });
  };

  const organizeTranslatedDialogues = (translatedText: string) => {
    const lines = translatedText.split('\n');
    const dialogues: Array<{ character: string; line: string; sceneIndex: number }> = [];
    let currentCharacter = '';
    let currentSceneIndex = 0;

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (/^\d+$/.test(trimmedLine)) {
        currentSceneIndex = parseInt(trimmedLine, 10);
      } else if (trimmedLine && trimmedLine === trimmedLine.toUpperCase() && !trimmedLine.startsWith('-')) {
        currentCharacter = trimmedLine;
      } else if (trimmedLine.startsWith('-')) {
        const cleanLine = trimmedLine.replace(/^-\s*/, '').replace(/^["']/, '').replace(/["']$/, '').trim();
        if (cleanLine) {
          dialogues.push({
            character: currentCharacter,
            line: cleanLine,
            sceneIndex: currentSceneIndex
          });
        }
      }
    });

    dialogues.sort((a, b) => {
      if (a.character === b.character) {
        return a.sceneIndex - b.sceneIndex;
      }
      return a.character.localeCompare(b.character);
    });

    let output = '';
    let lastCharacter = '';
    dialogues.forEach(({ character, line, sceneIndex }) => {
      if (character !== lastCharacter) {
        if (output) output += '\n';
        output += `${character}\n`;
        lastCharacter = character;
      }
      output += `${sceneIndex} - ${line}\n`;
    });

    return output;
  };


  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="app-layout">
      <div className={`left-panel ${leftPanelCollapsed ? 'collapsed' : ''}`}>
        <button
          className="toggle-panel-button"
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          title={leftPanelCollapsed ? 'Expandir' : 'Minimizar'}
        >
          {leftPanelCollapsed ? '›' : '‹'}
        </button>

        {!leftPanelCollapsed && (
          <div className="panel-content">
            <h2>Informação</h2>
            <div className="info-section">
              <p>Cenas: <strong>{scenes.length}</strong></p>
              <p>Falas: <strong>{scenes.reduce((sum, scene) => sum + scene.dialogues.length, 0)}</strong></p>
              <button
                className={`voice-toggle-button ${voiceButtonsEnabled ? 'enabled' : 'disabled'}`}
                onClick={() => setVoiceButtonsEnabled(!voiceButtonsEnabled)}
                title={voiceButtonsEnabled ? 'Desativar gravação de voz' : 'Ativar gravação de voz'}
              >
                {voiceButtonsEnabled ? '🔴' : '⭕'}
              </button>
            </div>

            <div className="counter-section">
              <h3>Contador</h3>
              <button
                className="counter-button"
                onClick={handleCounterClick}
                onMouseDown={handleCounterMouseDown}
                onMouseUp={handleCounterMouseUp}
                onMouseLeave={handleCounterMouseUp}
              >
                <div className="counter-display">{counter}</div>
              </button>
            </div>

            <div className="notes-section">
              <h3>Anotações</h3>
              <textarea
                className="notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva suas anotações aqui..."
              />
            </div>

            <div className="ideas-section">
              <h3>Ideias de Vídeos</h3>
              <div className="idea-input-container">
                <input
                  type="text"
                  className="idea-input"
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addIdea()}
                  placeholder="Título do vídeo..."
                />
                <button className="add-idea-button" onClick={addIdea}>
                  +
                </button>
              </div>
              <div className="ideas-list">
                {ideas.map((idea, index) => {
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = idea.split(urlRegex);

                  return (
                    <div key={index} className="idea-item">
                      <span className="idea-text">
                        {parts.map((part, i) => {
                          if (part.match(urlRegex)) {
                            return (
                              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="idea-link">
                                {part}
                              </a>
                            );
                          }
                          return part;
                        })}
                      </span>
                      <button
                        className="delete-idea-button"
                        onClick={() => deleteIdea(index)}
                        title="Deletar ideia"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="script-save-section">
                <h3>Salvar/Carregar Roteiro</h3>
                <div className="idea-input-container">
                  <input
                    type="text"
                    className="idea-input"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveScript()}
                    placeholder="Nome do roteiro..."
                  />
                  <button className="add-idea-button" onClick={saveScript}>
                    +
                  </button>
                </div>
                <button className="clear-script-button" onClick={() => setShowClearModal(true)}>
                  Limpar Roteiro
                </button>
                <div className="ideas-list">
                  {savedScripts.map((script, index) => (
                    <div key={index} className="idea-item">
                      <span className="idea-text">{script.name}</span>
                      <div className="script-item-actions">
                        <button
                          className="load-script-btn"
                          onClick={() => loadScript(index)}
                          title="Carregar roteiro"
                        >
                          ↓
                        </button>
                        <button
                          className="delete-idea-button"
                          onClick={() => deleteScript(index)}
                          title="Deletar roteiro"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="app-container">
        <h1>Roteiro</h1>

        <div className="scene-list">
        {scenes.map((scene, index) => (
          <SceneBox
            key={scene.id}
            scene={scene}
            index={index}
            totalScenes={scenes.length}
            onContentChange={handleContentChange}
            onDelete={deleteScene}
            onAddDialogue={addDialogue}
            onDialogueChange={handleDialogueChange}
            onDeleteDialogue={deleteDialogue}
            onStartRec={startRec}
            onStopRec={stopRec}
            onStartDialogueRec={startDialogueRec}
            onStopDialogueRec={stopDialogueRec}
            onStartCharacterRec={startCharacterRec}
            onStopCharacterRec={stopCharacterRec}
            onMoveUp={moveSceneUp}
            onMoveDown={moveSceneDown}
            onAddSceneAbove={addSceneAbove}
            onAddSceneBelow={addSceneBelow}
            voiceButtonsEnabled={voiceButtonsEnabled}
          />
        ))}
        <button className="add-scene-button" onClick={addScene}>
          +
        </button>
      </div>

      {scenes.length > 0 && (
        <div className={`full-script-container ${scriptPanelCollapsed ? 'collapsed' : ''}`}>
          <div className="script-header">
            <h2>Roteiro Final</h2>
            <div className="script-header-right">
              <div className="script-tabs">
                <button
                  className={`tab-button ${activeTab === 'full' ? 'active' : ''}`}
                  onClick={() => setActiveTab('full')}
                >
                  Completo
                </button>
                <button
                  className={`tab-button ${activeTab === 'scenes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('scenes')}
                >
                  Cenas
                </button>
                <button
                  className={`tab-button ${activeTab === 'dialogues' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dialogues')}
                >
                  Falas
                </button>
              </div>
              <button
                className="toggle-script-button"
                onClick={() => setScriptPanelCollapsed(!scriptPanelCollapsed)}
                title={scriptPanelCollapsed ? 'Expandir' : 'Minimizar'}
              >
                {scriptPanelCollapsed ? 'ˆ' : 'ˇ'}
              </button>
            </div>
          </div>

          {activeTab === 'full' && (
            <>
              <textarea
                className="full-script-textarea"
                value={formatScenesForExport()}
                rows={20}
                onChange={(e) => handleFullScriptChange(e.target.value)}
              />
              <button className="copy-button" onClick={() => navigator.clipboard.writeText(formatScenesForExport())}>
                Copiar
              </button>
            </>
          )}

          {activeTab === 'scenes' && (
            <>
              <textarea
                className="full-script-textarea"
                value={formatScenesOnly()}
                rows={20}
                readOnly
              />
              <button className="copy-button" onClick={() => navigator.clipboard.writeText(formatScenesOnly())}>
                Copiar
              </button>
            </>
          )}

          {activeTab === 'dialogues' && (
            <>
              <div className="dialogue-translation-section">
                <div className="translation-column">
                  <h3>Português</h3>
                  <textarea
                    className="full-script-textarea"
                    value={formatDialoguesOnly()}
                    rows={20}
                    readOnly
                  />
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(formatDialoguesOnly())}>
                    Copiar
                  </button>
                </div>

                <div className="translation-column">
                  <h3>Espanhol</h3>
                  <div className="translation-buttons">
                    <button
                      className="translate-button"
                      onClick={translateToSpanish}
                      disabled={isTranslating || scenes.length === 0}
                    >
                      {isTranslating ? 'Traduzindo...' : 'Traduzir'}
                    </button>
                    {translatedDialogues && (
                      <>
                        <button
                          className="translate-button organize-button"
                          onClick={() => {
                            if (isOrganized) {
                              setTranslatedDialogues(originalTranslation);
                              setIsOrganized(false);
                            } else {
                              setOriginalTranslation(translatedDialogues);
                              const organized = organizeTranslatedDialogues(translatedDialogues);
                              setTranslatedDialogues(organized);
                              setIsOrganized(true);
                            }
                          }}
                        >
                          {isOrganized ? 'Desfazer' : 'Organizar'}
                        </button>
                        <button className="translate-button" onClick={() => navigator.clipboard.writeText(translatedDialogues.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim()).join('\n'))}>
                          Copiar
                        </button>
                      </>
                    )}
                  </div>
                  {translatedDialogues ? (
                    <div className="translated-lines-list">
                      {translatedDialogues.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();

                        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('"') || /^\d+\s*-/.test(trimmedLine)) {
                          let cleanLine = trimmedLine
                            .replace(/^-\s*/, '')
                            .replace(/^[""]/, '')
                            .replace(/[""]$/, '')
                            .trim();

                          const sceneMatch = cleanLine.match(/^(\d+)\s*-\s*(.+)$/);
                          const displayText = sceneMatch ? cleanLine : cleanLine;
                          const copyText = sceneMatch ? sceneMatch[2] : cleanLine;

                          return (
                            <div
                              key={index}
                              className="translated-line-item"
                              onClick={() => navigator.clipboard.writeText(copyText)}
                              title="Clique para copiar"
                            >
                              <div className="translated-line-text">{displayText}</div>
                            </div>
                          );
                        }

                        if (trimmedLine) {
                          return (
                            <div key={index} className="translated-line-header">
                              {line}
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="translation-placeholder">
                      Clique em 'Traduzir' para gerar a versão em espanhol
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      </div>

      {showClearModal && (
        <div className="modal-overlay" onClick={() => setShowClearModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Tem certeza que deseja limpar todo o roteiro atual?</p>
            <div className="modal-actions">
              <button className="modal-cancel-button" onClick={() => setShowClearModal(false)}>
                Cancelar
              </button>
              <button className="modal-confirm-button" onClick={clearScript}>
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

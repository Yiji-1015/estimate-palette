import { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { EstimationProgressBar } from '@/components/estimation/EstimationProgressBar';
import { ContextPanel } from '@/components/estimation/ContextPanel';
import { ModuleMappingBlock } from '@/components/estimation/ModuleMappingBlock';
import { FactorSelectBlock } from '@/components/estimation/FactorSelectBlock';
import { EffortConfirmBlock } from '@/components/estimation/EffortConfirmBlock';
import { CostSummaryBlock } from '@/components/estimation/CostSummaryBlock';
import { ScenarioSelectBlock } from '@/components/estimation/ScenarioSelectBlock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';
import type { ChatMessage, EstimationPhase, ModuleMappingData, FactorSelectData, EffortConfirmData, CostSummaryData, ScenarioSelectData } from '@/types/estimation';
import { mockFollowUpMessages } from '@/data';
import { saveEstimationState, loadEstimationState, getDefaultEstimationState } from '@/stores/estimationStore';

// TODO: API 연동 시 아래로 교체
// POST /api/estimation/:rfpId/start → 견적 산정 시작
// GET  /api/estimation/:rfpId → 현재 진행 상태 + 전체 결과 조회
// PUT  /api/estimation/:rfpId/phase/:phase → 단계별 사용자 선택/수정 저장
// POST /api/estimation/:rfpId/confirm → 시나리오 확정 → Step 4 진행 가능

const phaseOrder: EstimationPhase[] = ['mapping', 'factors', 'effort', 'cost', 'scenario'];

export default function Estimation() {
  const saved = loadEstimationState();
  const initial = saved ?? getDefaultEstimationState();

  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [currentPhase, setCurrentPhase] = useState<EstimationPhase>(initial.currentPhase);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextMsgIdx = useRef(initial.nextMsgIdx);

  // 상태가 바뀔 때마다 저장
  useEffect(() => {
    saveEstimationState({
      messages,
      currentPhase,
      nextMsgIdx: nextMsgIdx.current,
    });
  }, [messages, currentPhase]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const advancePhase = useCallback(() => {
    const idx = phaseOrder.indexOf(currentPhase);
    if (idx < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[idx + 1];
      setCurrentPhase(nextPhase);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const nextMsg = mockFollowUpMessages[nextMsgIdx.current];
        if (nextMsg) {
          setMessages(prev => [...prev, { ...nextMsg, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() }]);
          nextMsgIdx.current += 1;
        }
      }, 1500);
    } else {
      setCurrentPhase('complete');
    }
  }, [currentPhase]);

  const handleConfirm = useCallback((msgId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId && m.interaction
          ? { ...m, interaction: { ...m.interaction, confirmed: true } }
          : m
      )
    );
    advancePhase();
  }, [advancePhase]);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '네, 확인했습니다. 해당 부분을 반영하여 진행하겠습니다.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1200);
  }, [inputText]);

  const renderInteraction = (msg: ChatMessage) => {
    if (!msg.interaction) return null;
    const { type, data, confirmed } = msg.interaction;

    switch (type) {
      case 'module-mapping':
        return <ModuleMappingBlock data={data as ModuleMappingData} confirmed={confirmed} onConfirm={() => handleConfirm(msg.id)} />;
      case 'factor-select':
        return <FactorSelectBlock data={data as FactorSelectData} confirmed={confirmed} onConfirm={() => handleConfirm(msg.id)} />;
      case 'effort-confirm':
        return <EffortConfirmBlock data={data as EffortConfirmData} confirmed={confirmed} onConfirm={() => handleConfirm(msg.id)} />;
      case 'cost-summary':
        return <CostSummaryBlock data={data as CostSummaryData} confirmed={confirmed} onConfirm={() => handleConfirm(msg.id)} />;
      case 'scenario-select':
        return <ScenarioSelectBlock data={data as ScenarioSelectData} confirmed={confirmed} onConfirm={() => handleConfirm(msg.id)} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout currentStep={3}>
      <div className="flex flex-col h-screen">
        <EstimationProgressBar currentPhase={currentPhase} />
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4" style={{ backgroundColor: 'hsl(var(--muted))' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-card text-foreground border border-border'
                      }`}
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                      {renderInteraction(msg)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">
                    <span className="animate-pulse">입력 중...</span>
                  </div>
                </div>
              )}
            </div>
            {/* Input */}
            <div className="border-t border-border bg-card p-3 flex gap-2">
              <Input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="질문이나 수정 요청을 입력하세요..."
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!inputText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Context Panel */}
          <ContextPanel currentPhase={currentPhase} />
        </div>
      </div>
    </AppLayout>
  );
}

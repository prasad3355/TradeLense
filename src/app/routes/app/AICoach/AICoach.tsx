import React, { useState } from 'react';
import { CoachHeader } from './CoachHeader';
import { CoachChat } from './CoachChat';
import { CoachSidebar } from './CoachSidebar';
import { sampleConversation, ChatMessage, cannedResponses } from './coachData';

export function AICoach() {
    // Start with the curated sample conversation to demonstrate the intended experience,
    // but allow resetting to the empty welcome state via CoachHeader or after clearing.
    const [messages, setMessages] = useState<ChatMessage[]>(sampleConversation);
    const [composerText, setComposerText] = useState('');

    const handleSelectPrompt = (promptText: string) => {
        // Populates the composer as requested in technical requirements:
        // "Selecting a prompt may populate the message composer, but must not pretend to generate a real AI response."
        setComposerText(promptText);
    };

    const handleSendMessage = (text: string) => {
        const userMsg: ChatMessage = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: {
                sessionContext: 'Interactive Prompt',
            },
        };

        // Check if there is a pre-curated canned answer for this prompt, or a general demo coaching reply
        const canned = cannedResponses[text] || {
            text: `[SIMULATED DEMO RESPONSE] Regarding "${text}": In this preview mode, the AI Coach identifies that your London session execution remains your strongest technical asset, while discretionary afternoon entries exhibit higher emotional variance.`,
            takeaways: [
                'Execution discipline remains above 80% during planned setup hours.',
                'Discretionary trade attempts account for 78% of recorded psychological friction.',
            ],
            actionItems: [
                'Log pre-trade emotional state before opening any live position.',
                'Review rule compliance criteria at the end of each trading day.',
            ],
        };

        const assistantMsg: ChatMessage = {
            id: `asst-${Date.now() + 1}`,
            sender: 'assistant',
            text: canned.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: {
                sessionContext: 'Demo Simulation Vector',
                tags: ['Preview Mode', 'Simulated Analysis'],
            },
            takeaways: canned.takeaways,
            actionItems: canned.actionItems,
        };

        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setComposerText('');
    };

    const handleResetConversation = () => {
        setMessages([]);
        setComposerText('');
    };

    const handleLoadSample = () => {
        setMessages(sampleConversation);
    };

    return (
        <div className="flex flex-col w-full gap-6 pb-12 animate-fade-in">
            {/* Page Header */}
            <CoachHeader
                hasMessages={messages.length > 0}
                onResetConversation={handleResetConversation}
                onLoadSample={handleLoadSample}
            />

            {/* Main Interactive Stage: Chat Area + Context Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                {/* Visual Chat / Welcome Area */}
                <CoachChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onSelectPrompt={handleSelectPrompt}
                    composerText={composerText}
                    setComposerText={setComposerText}
                />

                {/* Contextual Intelligence Sidebar */}
                <CoachSidebar />
            </div>
        </div>
    );
}

export default AICoach;


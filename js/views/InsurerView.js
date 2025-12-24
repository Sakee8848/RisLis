import { el } from '../utils.js';
import { state, setState } from '../state.js';
import { Header } from '../components/Header.js';

export function InsurerView() {
    return el('div', { class: 'animate-fade-in' },
        Header('PICC 人保财险 - 定价工作台'),
        el('div', { style: { padding: '20px', paddingBottom: '100px' } },
            // Stats
            el('div', { class: 'card', style: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' } },
                el('div', {},
                    el('div', { class: 'text-sub' }, '当前赔付率'),
                    el('div', { style: { fontSize: '24px', fontWeight: '800', color: 'var(--success)' } }, '32%')
                ),
                el('button', { class: 'btn btn-secondary' }, '导出报表')
            ),

            // Tab Switcher (Simple)
            el('div', { style: { display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' } },
                el('strong', { style: { borderBottom: '2px solid var(--primary)', paddingBottom: '8px' } }, '风险因子管理'),
                el('span', { class: 'text-sub' }, '定价模型')
            ),

            // Risk Factor Editor
            el('div', {},
                el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
                    el('h3', { class: 'title-medium' }, '动态风险因子'),
                    el('button', {
                        class: 'btn btn-primary',
                        style: { fontSize: '12px', padding: '6px 12px' },
                        onClick: () => {
                            const label = prompt('输入新因子名称 (如: 年龄段):');
                            if (label) {
                                const newFactor = { id: 'rf' + Date.now(), label, type: 'text', weight: 1.0 };
                                state.riskFactors.push(newFactor);
                                setState({ riskFactors: state.riskFactors });
                            }
                        }
                    }, '+ 添加因子')
                ),
                el('div', { style: { display: 'grid', gap: '12px' } },
                    state.riskFactors.map((factor, index) =>
                        el('div', { class: 'card', style: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' } },
                            el('div', {},
                                el('div', { style: { fontWeight: '600' } }, factor.label),
                                el('div', { class: 'text-sub', style: { fontSize: '12px' } }, `类型: ${factor.type === 'select' ? '下拉选择' : '数值输入'} • 权重: ${factor.weight}`)
                            ),
                            el('button', {
                                style: { color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' },
                                onClick: () => {
                                    if (confirm('确定删除此因子吗?')) {
                                        state.riskFactors.splice(index, 1);
                                        setState({ riskFactors: state.riskFactors });
                                    }
                                }
                            }, '删除')
                        )
                    )
                )
            ),

            // Copilot Section (Floating or fixed at bottom)
            CopilotWidget()
        )
    );
}

function CopilotWidget() {
    // Minimized State
    if (!state.isCopilotOpen) {
        return el('div', {
            style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '30px',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)',
                cursor: 'pointer',
                zIndex: 1000,
                fontSize: '30px',
                transition: 'all 0.3s',
            },
            onClick: () => setState({ isCopilotOpen: true })
        }, '🤖');
    }

    // Expanded State
    return el('div', {
        class: 'card',
        style: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '320px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            padding: '0',
            overflow: 'hidden',
            animation: 'fade-in-up 0.3s',
            borderRadius: '16px'
        }
    },
        // Header
        el('div', { style: { background: '#f5f5f7', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' } },
                el('span', {}, '🤖 定价 Copilot'),
            ),
            el('button', {
                style: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' },
                onClick: () => setState({ isCopilotOpen: false })
            }, '➖')
        ),

        // Chat Area
        el('div', { style: { flex: 1, padding: '16px', overflowY: 'auto', background: 'white' } },
            state.copilotMessages.map(msg =>
                el('div', {
                    style: {
                        marginBottom: '12px',
                        textAlign: msg.role === 'user' ? 'right' : 'left'
                    }
                },
                    el('div', {
                        style: {
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            background: msg.role === 'user' ? 'var(--primary)' : '#f5f5f7',
                            color: msg.role === 'user' ? 'white' : 'black',
                            fontSize: '14px',
                            maxWidth: '85%'
                        }
                    }, msg.content)
                )
            )
        ),

        // Input Area
        el('div', { style: { padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', background: 'white' } },
            el('input', {
                type: 'text',
                placeholder: '输入指令或上传文档...',
                style: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' },
                id: 'copilot-input',
                onKeydown: (e) => {
                    if (e.key === 'Enter') handleSend();
                }
            }),
            el('button', {
                class: 'btn btn-primary',
                style: { padding: '8px 12px', fontSize: '12px' },
                onClick: handleSend
            }, '发送')
        )
    );
}

function handleSend() {
    const input = document.getElementById('copilot-input');
    const text = input.value.trim();
    if (!text) return;

    state.copilotMessages.push({ role: 'user', content: text });

    // Mock AI Response
    setTimeout(() => {
        state.copilotMessages.push({ role: 'system', content: `收到指令："${text}"。正在分析历史赔付数据... 建议将【${text.includes('工时') ? '工时' : '该因子'}】权重调整为 1.8 以覆盖潜在风险。` });
        setState({ copilotMessages: state.copilotMessages });
    }, 1000);

    input.value = '';
    setState({ copilotMessages: state.copilotMessages });
}

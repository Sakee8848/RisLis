import { el } from '../utils.js';
import { state, setState } from '../state.js';
import { Header } from '../components/Header.js';

export function ReportView() {
    const candidate = state.group.pendingMembers[0];
    if (!candidate) return el('div', {}, '无数据。');

    const details = candidate.riskAssessment.details || {};

    return el('div', { class: 'animate-fade-in' },
        el('div', {
            class: 'glass',
            style: { padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: '16px' }
        },
            el('button', {
                style: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
                onClick: () => setState({ currentView: 'voting' })
            }, '←'),
            el('span', { style: { fontWeight: '700', fontSize: '20px' } }, '风险分析报告')
        ),

        el('div', { style: { padding: '20px' } },

            // Header Info
            el('div', { style: { marginBottom: '24px' } },
                el('h2', { class: 'title-medium' }, '对象: ' + candidate.name),
                el('div', { class: 'text-sub' }, 'ID: ' + candidate.id + ' • 由风团 AI 生成'),
                el('div', {
                    style: {
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '4px 8px',
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                    }
                }, '🔒 隐私保护：基于联邦学习技术')
            ),

            // Traffic Module
            ReportModule('🚦 交通与出行', details.traffic, [
                { label: '违章记录 (12个月)', value: '0' },
                { label: '平均骑行速度', value: '28km/h' },
                { label: '疲劳驾驶风险', value: '低' }
            ]),

            // Medical Module
            ReportModule('💊 医疗与健康', details.medical, [
                { label: '购药频率', value: '中等' },
                { label: '慢性病史', value: '未检测到' },
                { label: '急诊记录 (24个月)', value: '2' }
            ]),

            // Legal/Credit Module
            ReportModule('⚖️ 征信与法律', details.credit, [
                { label: '民事判决', value: '无' },
                { label: '信用评分等级', value: 'A 级' },
                { label: '保险欺诈黑名单', value: '未命中' }
            ])
        )
    );
}

function ReportModule(title, riskLevel, items) {
    const color = riskLevel === 'High' ? 'var(--danger)' : (riskLevel === 'Medium' ? 'var(--warning)' : 'var(--success)');
    const localizedRisk = riskLevel === 'High' ? '高' : (riskLevel === 'Medium' ? '中' : '低');

    return el('div', { class: 'card' },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' } },
            el('h3', { style: { fontSize: '18px', fontWeight: '600' } }, title),
            el('span', { style: { color: color, fontWeight: 'bold' } }, localizedRisk + '风险')
        ),
        el('div', { style: { display: 'grid', gap: '12px' } },
            items.map(item =>
                el('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                    el('span', { class: 'text-sub' }, item.label),
                    el('span', { style: { fontWeight: '500' } }, item.value)
                )
            )
        )
    );
}

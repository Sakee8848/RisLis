import { el } from '../utils.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';

export function AdminView() {
    return el('div', { class: 'animate-fade-in' },
        Header('系统管理员'),
        el('div', { style: { padding: '20px' } },
            // System Stats
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' } },
                StatCard('团队总数', '128', '+12'),
                StatCard('用户总数', '2,405', '+85'),
                StatCard('生效保单', '2,100', '+70'),
                StatCard('全局赔付率', '32%', '-2%', 'var(--success)')
            ),

            el('h3', { class: 'title-medium', style: { marginBottom: '16px' } }, '接入保险公司'),
            el('div', { style: { display: 'grid', gap: '12px' } },
                InsurerRow('PICC (人保)', '运行中', '在线率 98%'),
                InsurerRow('Ping An (平安)', '运行中', '在线率 99%'),
                InsurerRow('CPIC (太保)', '维护中', 'API 降级', 'var(--warning)')
            ),

            el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '16px' } }, '系统警报'),
            el('div', { class: 'card', style: { padding: '16px', borderLeft: '4px solid var(--danger)' } },
                el('div', { style: { fontWeight: '600' } }, '数据同步延迟'),
                el('div', { class: 'text-sub' }, '上海节点的交通数据 API 响应延迟 > 500ms。')
            )
        )
    );
}

function StatCard(label, value, change, color = 'var(--text-primary)') {
    return el('div', { class: 'card', style: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0' } },
        el('span', { class: 'text-sub', style: { fontSize: '12px' } }, label),
        el('span', { style: { fontSize: '24px', fontWeight: '700', color: color } }, value),
        el('span', { style: { fontSize: '12px', color: 'var(--text-secondary)' } }, change)
    );
}

function InsurerRow(name, status, subtext, statusColor = 'var(--success)') {
    return el('div', { class: 'card', style: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' } },
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
            el('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: statusColor } }),
            el('div', {},
                el('div', { style: { fontWeight: '600' } }, name),
                el('div', { class: 'text-sub', style: { fontSize: '11px' } }, subtext)
            )
        ),
        el('div', { class: 'text-sub' }, status)
    );
}

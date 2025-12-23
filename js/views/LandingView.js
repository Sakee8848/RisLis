import { el } from '../utils.js';
import { state, setState } from '../state.js';

export function LandingView() {
    return el('div', { class: 'animate-fade-in', style: { padding: '40px 24px', textAlign: 'center' } },
        // Logo Area
        el('div', { style: { marginBottom: '40px' } },
            el('img', { src: 'assets/logo.png', width: '120', style: { borderRadius: '24px', boxShadow: 'var(--shadow-lg)' } })
        ),

        el('h1', { class: 'title-large' }, 'RisLis 风团'),
        el('p', { class: 'text-sub', style: { marginBottom: '48px' } }, '降低风险，安享无忧'),

        el('h2', { class: 'title-medium', style: { marginBottom: '24px', textAlign: 'left' } }, '选择您的角色'),

        el('div', { style: { display: 'grid', gap: '16px' } },
            state.users.map(user =>
                el('button', {
                    class: 'card',
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', textAlign: 'left' },
                    onClick: () => {
                        setState({ currentUser: user, currentView: 'dashboard' });
                    }
                },
                    el('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                        el('span', { style: { fontSize: '32px' } }, user.avatar),
                        el('div', {},
                            el('div', { style: { fontWeight: '600', fontSize: '17px' } }, user.name),
                            el('div', { class: 'text-sub' }, capitalize(user.role))
                        )
                    ),
                    el('div', { style: { color: 'var(--text-secondary)' } }, '→')
                )
            )
        )
    );
}

function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

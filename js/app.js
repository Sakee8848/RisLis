import { state, subscribe, setState } from './state.js';
import { LandingView } from './views/LandingView.js';
import { DashboardView } from './views/DashboardView.js';
import { VotingView } from './views/VotingView.js';
import { ReportView } from './views/ReportView.js';
import { el } from './utils.js';

function render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear

    let viewComponent;
    switch (state.currentView) {
        case 'landing':
            viewComponent = LandingView();
            break;
        case 'dashboard':
            viewComponent = DashboardView();
            break;
        case 'voting':
            viewComponent = VotingView();
            break;
        case 'report':
            viewComponent = ReportView();
            break;
        default:
            viewComponent = LandingView();
    }

    app.appendChild(viewComponent);
}

// Initial Render
render();

// Subscribe to changes
subscribe(render);

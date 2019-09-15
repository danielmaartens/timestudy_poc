import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import Session from './views/Session.vue';
import SessionStart from './components/session/Start.vue';
import SessionProgress from './components/session/SessionProgress.vue';
import SessionSummary from './components/session/Summary.vue';
import Dashboard from './components/admin/Dashboard.vue';
import AdminPortal from './components/admin/Portal.vue';
import ClientProfile from './components/admin/ClientProfile.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: App,
    },
    {
      path: '/session',
      name: 'session',
      component: Session,
    },
    {
      path: '/session/start',
      name: 'session-start',
      component: SessionStart,
    },
    {
      path: '/session/progress',
      name: 'session-progress',
      component: SessionProgress,
    },
    {
      path: '/admin/dash',
      name: 'admin-dash',
      component: Dashboard,
    },
    {
      path: '/session/summary',
      name: 'session-summary',
      component: SessionSummary,
    },
    {
      path: '/admin/portal',
      name: 'admin-portal',
      component: AdminPortal,
    },
    {
      path: '/admin/portal/client',
      name: 'admin-portal-client',
      component: ClientProfile,
    },
  ],
});

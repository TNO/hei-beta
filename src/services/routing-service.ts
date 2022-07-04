import m, { RouteDefs } from 'mithril';
import { Dashboards, IDashboard } from '../models';
import { appActions, cells } from './meiosis';
import { Layout } from '../components/layout';
import { AboutPage, HomePage, TechnologyPage, SettingsPage, AllWordsPage } from '../components';
import { TechnologyOverviewPage } from '../components/technology-overview-page';

class RoutingService {
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor(dashboards: IDashboard[]) {
    this.setList(dashboards);
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IDashboard[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter((d) => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(dashboardId: Dashboards, query?: { [key: string]: string | number | undefined }) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    return dashboard
      ? '#!' + dashboard.route + (query ? '?' + m.buildQueryString(query) : '')
      : this.defaultRoute;
  }

  public href(dashboardId: Dashboards, params = '' as string | number) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    return dashboard ? `#!${dashboard.route.replace(/:\w*/, '')}${params}` : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    if (dashboard) {
      const url = dashboard.route + (query ? '?' + m.buildQueryString(query) : '');
      m.route.set(url, params);
    }
  }

  public routingTable() {
    // console.log('INIT');
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => {
                const cell = cells();
                const actions = appActions(cell);
                return m(c.component, { ...cell, actions });
              },
            }
          : {
              // onmatch:
              //   c.id === Dashboards.LOGIN
              //     ? undefined
              //     : () => {
              //         if (c.id !== Dashboards.HOME && !Auth.isLoggedIn()) m.route.set('/login');
              //       },
              render: () => {
                const cell = cells();
                const actions = appActions(cell);
                return m(
                  Layout,
                  { ...cell, actions, options: {} },
                  m(c.component, { ...cell, actions })
                );
              },
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService([
  {
    id: Dashboards.HOME,
    title: 'HOME',
    icon: 'home',
    route: '/',
    visible: true,
    component: HomePage,
  },
  {
    id: Dashboards.TECHNOLOGIES,
    title: 'OVERVIEW',
    icon: 'dashboard',
    // icon: 'display_settings',
    route: '/overview',
    visible: true,
    component: TechnologyOverviewPage,
  },
  {
    id: Dashboards.TECHNOLOGY,
    title: 'TECHNOLOGY',
    icon: 'military_tech',
    route: '/technology',
    visible: true,
    component: TechnologyPage,
  },
  {
    id: Dashboards.SETTINGS,
    title: 'Settings',
    icon: 'settings',
    route: '/settings',
    visible: true,
    component: SettingsPage,
  },
  {
    id: Dashboards.TAXONOMY,
    title: 'TAXONOMY',
    icon: 'book',
    route: '/taxonomy',
    visible: true,
    component: AllWordsPage,
  },
  {
    id: Dashboards.ABOUT,
    title: 'About',
    icon: 'info',
    route: '/about',
    visible: true,
    component: AboutPage,
  },
]);

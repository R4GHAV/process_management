const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Admin',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          classes: 'nav-item disabled',
          // url: '/app/dashboard/default'
        }
      ]
    },
    // {
    //   id: 'ui-element',
    //   title: 'Features',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'component',
    //       title: 'Component',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'Button',
    //           type: 'item',
    //           url: '/basic/button'
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Badges',
    //           type: 'item',
    //           url: '/basic/badges'
    //         },
    //         {
    //           id: 'breadcrumb',
    //           title: 'Breadcrumb & Pagination',
    //           type: 'item',
    //           url: '/basic/breadcrumb-paging'
    //         },
    //         {
    //           id: 'collapse',
    //           title: 'Collapse',
    //           type: 'item',
    //           url: '/basic/collapse'
    //         },
    //         {
    //           id: 'tabs-pills',
    //           title: 'Tabs & Pills',
    //           type: 'item',
    //           url: '/basic/tabs-pills'
    //         },
    //         {
    //           id: 'typography',
    //           title: 'Typography',
    //           type: 'item',
    //           url: '/basic/typography'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 'ui-forms',
      title: 'Features',
      type: 'group',
      icon: 'icon-group',
      children: [
        // {
        //   id: 'forms',
        //   title: 'Form Elements',
        //   type: 'item',
        //   icon: 'feather icon-file-text',
        //   url: '/forms/form-basic'
        // },
        {
          id: 'table',
          title: 'Raw Materials',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap'
        },
        {
          id: 'processTable',
          title: 'Process Flow',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/processFlow'
        },
        {
          id: 'productionTable',
          title: 'Production Form',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/production'
        },
        {
          id: 'outsourceForm',
          title: 'Outsource Form',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/outsourceForm'
        },
        {
          id: 'recdOutsourceForm',
          title: 'Recd Outsource Form',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/recdOutsource'
        }
      ]
    },
    // {
    //   id: 'chart-maps',
    //   title: 'Chart & Maps',
    //   type: 'group',
    //   icon: 'icon-charts',
    //   children: [
    //     {
    //       id: 'charts',
    //       title: 'Charts',
    //       type: 'item',
    //       icon: 'feather icon-pie-chart',
    //       url: '/charts/nvd3'
    //     },
    //     {
    //       id: 'maps',
    //       title: 'Maps',
    //       type: 'item',
    //       icon: 'feather icon-map',
    //       url: '/maps/google-map'
    //     }
    //   ]
    // },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        // {
        //   id: 'sample-page',
        //   title: 'Sample Page',
        //   type: 'item',
        //   url: '/sample-page',
        //   classes: 'nav-item',
        //   icon: 'feather icon-sidebar'
        // },
        // {
        //   id: 'documentation',
        //   title: 'Documentation',
        //   type: 'item',
        //   icon: 'feather icon-book',
        //   classes: 'nav-item',
        //   url: 'https://codedthemes.gitbook.io/datta/',
        //   target: true,
        //   external: true
        // },
        // {
        //   id: 'menu-level',
        //   title: 'Menu Levels',
        //   type: 'collapse',
        //   icon: 'feather icon-menu',
        //   children: [
        //     {
        //       id: 'menu-level-1.1',
        //       title: 'Menu Level 1.1',
        //       type: 'item',
        //       url: '#!'
        //     },
        //     {
        //       id: 'menu-level-1.2',
        //       title: 'Menu Level 2.2',
        //       type: 'collapse',
        //       children: [
        //         {
        //           id: 'menu-level-2.1',
        //           title: 'Menu Level 2.1',
        //           type: 'item',
        //           url: '#'
        //         },
        //         {
        //           id: 'menu-level-2.2',
        //           title: 'Menu Level 2.2',
        //           type: 'collapse',
        //           children: [
        //             {
        //               id: 'menu-level-3.1',
        //               title: 'Menu Level 3.1',
        //               type: 'item',
        //               url: '#'
        //             },
        //             {
        //               id: 'menu-level-3.2',
        //               title: 'Menu Level 3.2',
        //               type: 'item',
        //               url: '#'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // },
        {
          id: 'disabled-menu',
          title: 'Premium Features',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power'
        }
      ]
    }
  ]
};

export default menuItems;

// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from 'C:/Users/Administrator/Documents/hk-sq/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/Loading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__index' */'@/layouts/index.tsx'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'@/pages/404.tsx'), loading: LoadingComponent})
      },
      {
        "path": "/demo",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__demo__index' */'@/pages/demo/index.tsx'), loading: LoadingComponent})
      },
      {
        "path": "/",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__index' */'@/pages/index.tsx'), loading: LoadingComponent})
      },
      {
        "path": "/share",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__share__index' */'@/pages/share/index.tsx'), loading: LoadingComponent})
      },
      {
        "path": "/test",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__test__index' */'@/pages/test/index.tsx'), loading: LoadingComponent})
      },
      {
        "path": "/menu",
        "routes": [
          {
            "path": "/menu/audio",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__audio__index' */'@/pages/menu/audio/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/createFolder",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__createFolder__index' */'@/pages/menu/createFolder/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/document",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__document__index' */'@/pages/menu/document/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/file",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__file__index' */'@/pages/menu/file/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/history",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__history__index' */'@/pages/menu/history/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/home",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__home__index' */'@/pages/menu/home/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/image",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__image__index' */'@/pages/menu/image/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__index' */'@/pages/menu/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/other",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__other__index' */'@/pages/menu/other/index.tsx'), loading: LoadingComponent})
          },
          {
            "path": "/menu/video",
            "exact": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu__video__index' */'@/pages/menu/video/index.tsx'), loading: LoadingComponent})
          }
        ],
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__menu___layout' */'@/pages/menu/_layout.tsx'), loading: LoadingComponent})
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'@/pages/404.tsx'), loading: LoadingComponent})
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}

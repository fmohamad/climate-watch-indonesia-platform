export default [
  {
    slug: 'regions-ghg-emissions',
    path: '/:locale/regions/:region/regions-ghg-emissions',
    exact: true,
    province: true,
<<<<<<< HEAD
    member: 'all',
    default: true
=======
    default: true,
    member: 'ID.PB'
>>>>>>> origin/pb-population
  },
  {
    slug: 'sectoral-circumstances',
    path: '/:locale/regions/:region/sectoral-circumstances',
    member: 'all',
    province: true
  },
  {
    slug: 'vulnerability-adaptivity',
    path: '/:locale/regions/:region/vulnerability-adaptivity',
    member: 'all',
    province: true
  },
  {
    slug: 'climate-sectoral-plan',
    path: '/:locale/regions/:region/sectoral-plan',
    member: 'all',
    province: true
  },
  {
    slug: 'economy',
    path: '/:locale/regions/:region/economy',
    member: 'ID.PB',
    province: true
  },
  {
    slug: 'region-population',
    path: '/:locale/regions/:region/region-population',
    member: 'ID.PB',
    province: true
  },
  {
    slug: 'social',
    path: '/:locale/regions/:region/social',
    member: 'ID.PB',
    province: true
  },
  {
    slug: 'policy',
    path: '/:locale/regions/:region/policy',
    member: 'ID.PB',
    province: true
  }
];

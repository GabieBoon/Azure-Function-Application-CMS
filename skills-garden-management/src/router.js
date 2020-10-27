import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/',
      name: 'dashboard',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/locations',
      name: 'locations',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/locations/Locations.vue')
    },
    {
      path: '/locations/edit/:id',
      name: 'locationEdit',
      props: true,
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/locations/LocationEdit.vue')
    },
    {
      path: '/locations/create',
      name: 'locationCreate',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/locations/LocationCreate.vue')
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/users/Users.vue')
    },
    {
      path: '/users/edit/:id',
      name: 'userEdit',
      props: true,
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/users/UserEdit.vue')
    },
    {
      path: '/users/create',
      name: 'userCreate',
      props: true,
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/users/UserCreate.vue')
    },
    {
      path: '/components',
      name: 'components',
      component: () => import('./views/components/Components.vue')
    },
    {
      path: '/components/create',
      name: 'componentCreate',
      component: () => import('./views/components/ComponentCreate.vue')
    },
    {
      path: '/locations/:locationId/components/:componentId/edit',
      name: 'componentEdit',
      props: true,
      component: () => import('./views/components/ComponentEdit.vue')
    },
    {
      path: '/beacons',
      name: 'beacons',
      component: () => import('./views/beacons/Beacons.vue')
    },
    {
      path: '/beacons/create',
      name: 'beaconCreate',
      component: () => import('./views/beacons/BeaconCreate.vue')
    },
    {
      path: '/beacons/:beaconId/edit',
      name: 'beaconEdit',
      props: true,
      component: () => import('./views/beacons/BeaconEdit.vue')
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('./views/exercises/Exercises.vue')
    },
    {
      path: '/exercises/create',
      name: 'exerciseCreate',
      component: () => import('./views/exercises/ExerciseCreate.vue')
    },
    {
      path: '/exercises/:exerciseId/edit',
      name: 'exerciseEdit',
      props: true,
      component: () => import('./views/exercises/ExerciseEdit.vue')
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('./views/workouts/Workouts.vue')
    },
    {
      path: '/workouts/create',
      name: 'workoutCreate',
      component: () => import('./views/workouts/WorkoutCreate.vue')
    },
    {
      path: '/workouts/:workoutId/edit',
      name: 'workoutEdit',
      props: true,
      component: () => import('./views/workouts/WorkoutEdit.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('./views/events/Events.vue')
    },
    {
      path: '/events/create',
      name: 'eventCreate',
      component: () => import('./views/events/EventCreate.vue')
    },
    {
      path: '/locations/:locationId/events/:eventId/edit',
      name: 'eventEdit',
      props: true,
      component: () => import('./views/events/EventEdit.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router;
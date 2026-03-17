import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Jobs from '@/views/Jobs.vue'
import Candidates from '@/views/Candidates.vue'
import Employers from '@/views/Employers.vue'
import Admin from '@/views/Admin.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/jobs',
      name: 'Jobs',
      component: Jobs
    },
    {
      path: '/candidates',
      name: 'Candidates',
      component: Candidates
    },
    {
      path: '/employers',
      name: 'Employers',
      component: Employers
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
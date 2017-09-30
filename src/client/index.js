import './style/style.css';

import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './components/App.vue';


Vue.use(Vuetify);

new Vue({

    components: {
        App: App
    },

    render: h => h(App)

}).$mount('#app');





console.log('I\'m loaded !!');

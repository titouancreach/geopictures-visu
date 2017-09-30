<template>
    <v-app class="main-container">
        <ToolBar title="Geolocalised pictures" :leafletMap="leafletMap" :photoLayer="photoLayer" @reject="reject" />
        <div id="map"></div>
        <v-dialog
          v-model="hasError"
          :width="800"
         >
            <v-card>
                <v-card-title>
                    <div class="headline">Some files have been rejected</div>
                </v-card-title>
                <v-card-text>
                    <v-list two-line>
                    <template v-for="rejected in rejectedFiles">
                         <v-list-tile>
                              <v-list-tile-avatar>
                                <v-icon class="red--text">error</v-icon>
                                </v-list-tile-avatar>
                               <v-list-tile-content>
                                   <v-list-tile-title>{{ rejected.exception.source }}</v-list-tile-title>
                                   <v-list-tile-sub-title> {{ rejected.exception.code }}</v-list-tile-sub-title>
                               </v-list-tile-content>
                         </v-list-tile>
                        <v-divider></v-divider>
                    </template>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat="flat" primary @click.native.stop="hasError = false">Close</v-btn>
                </v-card-actions>
            </v-card>
            <!-- <v-btn dark flat @click.native="hasError = false">Close</v-btn> -->
        </v-dialog>
    </v-app>
</template>

<script>
    import ToolBar from './ToolBar.vue';
    import '../vendors/leaflet/leaflet.js';
    import '../vendors/cluster/leaflet.markercluster.js';
    import '../vendors/LeafletPhoto/Leaflet.Photo.js';
    import VCardTitle from "vuetify/src/components/VCard/VCardTitle";


    export default {
        components: {
            VCardTitle,
            ToolBar: ToolBar
        },

        data: () => ({
            leafletMap: null,
            photoLayer: null,
            hasError: false,
            rejectedFiles: []
        }),

        methods: {
            reject(rejected) {
                this.rejectedFiles = rejected;
                this.hasError = true;

            }
        },

        mounted() {
            this.leafletMap = L.map('map').setView([48.8534, 2.3488], 13);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: '&copy; <a href="https://github.com/titouancreach"> @titouancreach </a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoieXVuamllbGkiLCJhIjoiY2lxdmV5MG5rMDAxNmZta3FlNGhyMmpicSJ9.CTEQgAyZGROcpJouZuzJyA'
            }).addTo(this.leafletMap);

            this.photoLayer = L.photo.cluster().on('click', (evt) => {
                const photo = evt.layer.photo;
                const template = `<img src="{url}" /></a><p>{caption}</p>`;

                evt.layer.bindPopup(L.Util.template(template, photo), {
                    className: 'leaflet-popup-photo',
                    minWidth: 400
                }).openPopup();
            });
        }
    };
</script>

<style>
    .main-container {
        height: inherit;
    }

    #map {
        height: calc(100% - 64px);
    }
</style>



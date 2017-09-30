<template>
    <v-toolbar dark class="primary">
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="upload">
            <v-icon>file_upload</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>

    const {dialog} = require('electron').remote;
    import _ from 'lodash';
    import {getGPSData} from '../helper/exif-helper.js';

    export default {
        props: {
            title: String,
            leafletMap: Object,
            photoLayer: Object
        },


        methods: {
            async upload() {

                const paths = dialog.showOpenDialog({
                    properties: [ 'openFile', 'multiSelections' ]
                });


                const photos = paths.map(async path => {

                    const {lat, lng} = await getGPSData(path);

                    return {
                        lat: lat,
                        lng: lng,
                        url: encodeURI(path),
                        thumbnail: encodeURI(path),
                        caption: path
                    }
                });

                const FAIL_TOKEN = Symbol('fail');


                const mappedPromises = photos.map(p => p.catch(e =>  ({exception: e})));

                // wait for promises to resolve
                const resolvedPromises = await Promise.all(mappedPromises);

                // partitions
                const [rejected, resolved] = _.partition(resolvedPromises, e => 'exception' in e);

                if (rejected.length > 0) {
                    this.$emit('reject', rejected);
                }

                if (resolved.length > 0) {
                    this.photoLayer.add(resolved).addTo(this.leafletMap);
                    this.leafletMap.fitBounds(this.photoLayer.getBounds());
                }
            }
        }
    }
</script>
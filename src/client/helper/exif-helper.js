const ExifImage = require('exif').ExifImage;


export function getGPSData(imgFile) {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({image: imgFile}, (err, data) => {
                if (err) {
                    reject(err);
                } else {

                    if (!data['gps'] || !data['gps']['GPSLatitude']) {
                        reject({source: `File: ${imgFile}`, code: 'BAD_LOCATION'});
                    }
                    if (!data['gps'] || !data['gps']['GPSLongitude']) {
                        reject({source: `File: ${imgFile}`, code: 'BAD_LOCATION'});
                    }

                    const latitude = data['gps']['GPSLatitude'];
                    const longitude = data['gps']['GPSLongitude'];

                    const lat = latitude[0] + ((latitude[1] / 60) + (latitude[2] / 3600));
                    const lng = longitude[0] + ((longitude[1] / 60) + (longitude[2] / 3600));

                    if (lat > 90 || lat < -90) {
                        reject({source: `File ${imgFile}`, code: 'BAD_LOCATION'});
                    }

                    if (lng > 180 || lng < -180) {
                        reject({source: `File: ${imgFile}`, code: 'BAD_LOCATION'});
                    }

                    console.log(lat);
                    console.log(lng);

                    resolve({lat: lat, lng: lng});
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

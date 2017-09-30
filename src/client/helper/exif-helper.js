const ExifImage = require('exif').ExifImage;


function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}

export function getGPSData(imgFile) {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({image: imgFile}, (err, data) => {
                if (err) {
                    reject(err);
                } else {


                    console.log(data);

                    if (!data['gps'] || !data['gps']['GPSLatitude'] || !data['gps']['GPSLatitudeRef']) {
                        reject({source: `File: ${imgFile}`, code: 'BAD_LOCATION'});
                    }
                    if (!data['gps'] || !data['gps']['GPSLongitude'] || !data['gps']['GPSLongitudeRef']) {
                        reject({source: `File: ${imgFile}`, code: 'BAD_LOCATION'});
                    }

                    const latitude = data['gps']['GPSLatitude'];
                    const longitude = data['gps']['GPSLongitude'];

                    const lat = ConvertDMSToDD(latitude[0], latitude[1], latitude[2], data['gps']['GPSLatitudeRef']);
                    const lng = ConvertDMSToDD(longitude[0], longitude[1], longitude[2], data['gps']['GPSLongitudeRef']);

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

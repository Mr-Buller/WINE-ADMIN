import imageCompression from 'browser-image-compression';
const Helper = {}

Helper.compressImage = async function (imageFile) {
    const options = {
        maxSizeMB: .25,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }
    try {
        const compressedFile = await imageCompression(imageFile, options);
        var file = Helper.buildFile(compressedFile, compressedFile.name, compressedFile.type);
        return file;
    } catch (error) {
        console.log(error);
    }
    return;
};

Helper.buildFile = function(blob, name, type) {
    return new File([blob], name, { type: type });
};

export default Helper;
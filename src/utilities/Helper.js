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

Helper.formatPrice = function(price) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    })
    return formatter.format(price)
};

export default Helper;
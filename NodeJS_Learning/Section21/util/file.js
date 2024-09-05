const fs = require(`fs`);

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new Error(`Failed to delete the file.`);
        }
    }
    )
}

exports.deleteFile = deleteFile;
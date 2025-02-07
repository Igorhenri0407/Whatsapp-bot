// --------------------------------------------------
// resources.js contains the schema for  course resources
// --------------------------------------------------

const { Schema, model } = require('mongoose');
const fs = require('fs');


/**
 * Schema for course resources
 */
const ResourceSchema = new Schema({
    title: String,
    courseCode: String,
    binData: String, // when Buffer is used, puppeteer complains that it's not properly encoded
});

const devModelName = "files-dev";
const prodModelName = "files";
const currentModelName = process.env.NODE_ENV === 'production' ? prodModelName : devModelName;
const ResourceModel = model(currentModelName, ResourceSchema);

/**
 * Helper function to encode the local courses materials and save them on the cloud database.
 * @async
 */
const initCollection = async () => {
    const count = await ResourceModel.countDocuments({});
    console.log('Doc count:', count);
    if (!count) {
        const dir = './course_resources';
        for (const folder of fs.readdirSync(dir)) {
            console.log(folder)
            const courseCode = folder.split('-')[0].trim();
            for (const file of fs.readdirSync(dir + '/' + folder)) {
                const binData = fs.readFileSync(dir + '/' + folder + '/' + file, { encoding: 'base64' });
                const doc = new ResourceModel({ title: file, courseCode, binData });
                try {
                    await doc.save();
                } catch (err) {
                    console.log(err);
                }
            }
        }
        console.log("Done encoding all course resources!");
    } else console.log(currentModelName + " collection is not empty");
}
initCollection();


/**
 * Gets specific course materials from the database.
 * @param {string} courseCode String representing the course code for a specific course
 * @returns 
 */
exports.getResource = async (courseCode) => {
    const res = await ResourceModel.find({ courseCode });
    // console.log(res);
    return res;
}
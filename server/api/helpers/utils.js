const mongoose = require('mongoose');
module.exports = {
    isEmpty: (str) => !str || str === null || str.trim() === '',
    isValidObjectId: (str) => {
        try {
            new mongoose.Types.ObjectId(str);
            return true;
        } catch (error) {
            return false
        }
    },
    getPagingParams(query, res) {
        let { skip, limit } = query;
        if (!skip) skip = 0; else skip = Number(skip);
        if (!limit) limit = 20; else limit = Number(limit);
        if (!Number.isInteger(skip) || skip < 0) {
            return res.status(400).json({ message: '"skip" parameter has invalid value' });
        }
        if (!Number.isInteger(limit) || limit < 0 || limit > 100) {
            return res.status(400).json({ message: '"limit" parameter has invalid value' });
        }
        return { skip, limit }
    }
}
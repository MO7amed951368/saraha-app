export default class BaseRepository {
    constructor(model) {
        this.model = model;
    }
        
    createNewDocument(data) {
        return this.model.create(data);
    }
       
    findDocumentById(_id) {

        return this.model.findById(_id);
    }
       
    findOneDocument(filter = {}) {
        return this.model.findOne(filter);
    }
      
    findAndUpdateDocument(filter, data, options = {}) {
        return this.model.findOneAndUpdate(filter, data, options);
    }

    findAndDeleteDocument(filter) {
        return this.model.findOneAndDelete(filter);
    }
}


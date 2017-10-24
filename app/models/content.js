//Aqui iremos pegar a instância do mongoose:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const competitionSectionSchema = new mongoose.Schema({

})

const teamSectionSchema = new mongoose.Schema({

})

const contentSchema = new mongoose.Schema({
    leadspace: {
        title: {type: String},
        subtitle: {type: String},
        button: {type: String}
    },
    section1: {
        section_title:{type: String},
        textArea_1: {
            heading: {type: String},
            text: {type: String}
        },
        textArea_2: {
            heading: {type: String},
            text: {type: String}
        },
        imgUrl_1: {type: String},
        imgUrl_2: {type: String},
        imgUrl_3: {type: String},
        description_1: {type: String},
        description_2: {type: String}
    },
    section2: {
        section_title: {type: String},
        textArea_1: {
            heading: {type: String},
            text: {type: String}
        },
        imgUrl_1: {type: String},
        imgUrl_2: {type: String},
        imgUrl_3: {type: String},
        imgUrl_4: {type: String},
        imgUrl_5: {type: String},
        imgUrl_6: {type: String},
        imgUrl_7: {type: String},
        imgUrl_8: {type: String},
    },
    section3: {
        section_title: {type: String},
        imgUrl_1: {type: String},
        textArea_1: {
            heading: {type: String},
            text: {type: String}
        }
    },
    section4: {
        section_title: {type: String},
        member_1: {
            name: {type: String},
            imgUrl: {type: String}
        },
        member_2: {
            name: {type: String},
            imgUrl: {type: String}
        },
        member_3: {
            name: {type: String},
            imgUrl: {type: String}
        },
        member_4: {
            name: {type: String},
            imgUrl: {type: String}
        },
        member_5: {
            name: {type: String},
            imgUrl: {type: String}
        }
    }
})

// Aqui iremos configura um modelo e depois usar o module.exports:
module.exports = mongoose.model('Content', contentSchema)
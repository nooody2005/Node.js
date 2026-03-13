const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
//make collection (table)

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true
        },

        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },

        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },

        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty']
        },

        ratingsAverage: {
            type: Number,
            default: 4.5
        },

        ratingsQuantity: {
            type: Number,
            default: 0
        },

        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },

        priceDiscount: Number,

        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },

        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },

        images: [String],

        createdAt: {
            type: Date,
            default: Date.now()
        },

        startDates: [Date] ,

        secretTour: {
            type : Boolean,
            default : false
        }

        },
    {
        toJSON : { virtuals : true},
        toObject : { virtuals : true }
    },
    
);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//DOCUMENT MIDDLEWARE run before save and create

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('save done :)');
//     next();
// });

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });


//QUERY MIDDLEWARE 
tourSchema.pre(/^find/,function(next){
    this.find({secretTour : {$ne : true}});
    // wanna calculate the process time
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/,function(docs,next){
    console.log(`process take ${Date.now() - this.start} millesSconds :)`);
    console.log(docs);
    next();
});
// tourSchema.pre('find',function(next){
//     this.find({secretTour : {$ne : true}});
//     next();
// });
// tourSchema.pre('findOne',function(next){
//     this.find({secretTour : {$ne : true}});
//     next();
// });


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
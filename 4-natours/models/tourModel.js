const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./usermodel');
//make collection (table)

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'name must be less than 40 characters'],
      minlength: [10, 'name must be above 10 characters']
      // validate : [validator.isAlpha,'name should contains characters only :)']
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty must be eaither easy or medium or difficult :)'
      }
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be less than 5']
    },

    ratingsQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to the new DOC in new document creation
          return val < this.price;
        },
        message: 'price dicount ({VALUE}) should be below the regular price'
      }
    },

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

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // guides: Array            //// embedding way
    guides:[    //referencing way
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]

  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1 , ratingsAverage: -1});
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE run before save and create

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
        path:'guides',
        select: '-__v -passwordChangedAt'
    }); //we make population
    
  next();
});



// only for new document        ..not update  ---> make embedding
// tourSchema.pre('save', async function(next){
//     const guidePromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidePromises);
//     next();
// });





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


tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match: {secretTour : {$ne : true} } } );
    next();
});



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    // 1 A ) Filtering Basics
    const queryObj = { ...this.queryObject };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1 B ) Advance Filtering
    let queryObjString = JSON.stringify(queryObj);
    queryObjString = queryObjString.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryObjString));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('ratingsAverage');
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      this.query.select(this.queryObject.fields.split(',').join(' '));
    } else {
      // this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

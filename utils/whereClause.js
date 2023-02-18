// base - Product.find()
// base - Product.find(email: {"piyush@gmail.com"})

//bigQ - //search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199&limit=5
// contructor generally means always run
// in this we chabging query or url that we get from frontend end to search or greater than value check mongoose blog for universal query selector 
class WhereClause {
    constructor(base, bigQ) {
      this.base = base;
      this.bigQ = bigQ;
    }
  
    search() {
      const searchword = this.bigQ.search
        ? {
            name: {
                // regex search the thing get url
              $regex: this.bigQ.search,
              $options: "i",
            },
          }
        : {};
  
      this.base = this.base.find({ ...searchword });
      return this;
    }
  
    filter() {
      const copyQ = { ...this.bigQ };
  // deleting the extra things that come in url we only want greater or less
      delete copyQ["search"];
      delete copyQ["limit"];
      delete copyQ["page"];
  
      //convert bigQ into a string => copyQ
      let stringOfCopyQ = JSON.stringify(copyQ);
  // converting gte inro $gte
      stringOfCopyQ = stringOfCopyQ.replace(
        /\b(gte|lte|gt|lt)\b/g,
        (m) => `$${m}`
      );
  
      const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
  
      this.base = this.base.find(jsonOfCopyQ);
      return this;
    }
  
    pager(resultperPage) {
      let currentPage = 1;
      if (this.bigQ.page) {
        currentPage = this.bigQ.page;
      }
  
      const skipVal = resultperPage * (currentPage - 1);
  
      this.base = this.base.limit(resultperPage).skip(skipVal);
      return this;
    }
  }
  
  module.exports = WhereClause;
  
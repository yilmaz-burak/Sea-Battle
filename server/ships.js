class Ships{

  constructor(length, firstCoordinate, lastCoordinate){
    this.coordinates = [];
    console.log(this.coordinates);
    if(this.coordinateAvailable(firstCoordinate) && this.coordinateAvailable(lastCoordinate)){
      this.coordinates = this.coordinates.concat(this.createCoordinates(length, firstCoordinate, lastCoordinate));
    }


    console.log(this.coordinates);
  }

  coordinateAvailable(length, firstCoordinate, lastCoordinate){
    const firstletterPart = firstCoordinate.charAt(0).charCodeAt(0);
    const firstNumberPart = firstCoordinate.charAt(1).charCodeAt(0);
    const lastLetterPart = lastCoordinate.charAt(0).charCodeAt(0);
    const lastNumberPart = lastCoordinate.charAt(1).charCodeAt(0);


      if(firstLetterPart === lastLetterPart && (Math.abs(lastNumberPart-firstNumberPart)+1) === length) return true;
      else if(firstNumberPart === lastNumberPart && (Math.abs(lastLetterPart-firstLetterPart)+1) === length) return true;
      else return false;
    }


  createCoordinates(length, firstCoordinate, lastCoordinate){
    const firstLetterPart = firstCoordinate.charAt(0);
    const secondLetterPart = lastCoordinate.charAt(0);
    const firstNumberPart = firstCoordinate.charAt(1);
    const lastNumberPart = lastCoordinate.charAt(1);
    const coordinates = [];

    if(firstLetterPart === secondLetterPart){
      for(let i=0; i<length; i++){
        coordinates.push(firstLetterPart + String.fromCharCode((firstNumberPart.charCodeAt(0) + i)));
      }
    }
    else if(firstNumberPart === lastNumberPart){
      for(let i=0; i<length; i++){
        coordinates.push(String.fromCharCode((firstLetterPart.charCodeAt(0)+i)) + firstNumberPart);
      }
    }
    else{
      console.log("Error");
    }
    return coordinates;

  }

}

(function(){

  angular
    .module('BeerApp')
    .controller('BeersController', BeersController);

    BeersController.$inject = ['Resources'];

    function BeersController(Resources){
      // Capture variable
      var self = this;

      // Use Resource to perform CRUD
      var BeerResources = new Resources('beers');

      // Index of beers
      self.index = BeerResources.query();
    }

})();

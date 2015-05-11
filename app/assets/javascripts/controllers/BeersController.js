(function(){

  angular
    .module('BeerApp')
    .controller('BeersController', BeersController);

    BeersController.$inject = ['Resources', '$scope'];

    function BeersController(Resources, $scope){
      // Capture variable
      var self = this;

      // Use Resource to perform CRUD
      var BeerResources = new Resources('beers');

      // Index of beers
      self.index = BeerResources.query();

      // Create the beer
      self.create = function(){
        var beer = {
          name: self.name,
          quantity: self.quantity,
          location: self.location,
          description: self.description
        };

        BeerResources.save(beer, function(data, headers){
          // Add to feed
          self.index.unshift(data);
          // Set form to pristine
          $scope.brew.$setPristine();

          // Clear the fields
          self.name = null;
          self.quantity = null;
          self.location = null;
          self.description = null;

          self.isPosted = true;

          //console.log(headers());
        });
      };
    }

})();

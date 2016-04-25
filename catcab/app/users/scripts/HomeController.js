angular
	.module('users')
	.controller("HomeController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {
		
		// view = new supersonic.ui.View("users#home");
		// view.start("home").then(function (startedView) {
	 //  		supersonic.ui.layers.replace(startedView);
		// });

		$scope.phone = localStorage.getItem("phoneNumber");

		var ref1 = new Firebase("https://catcab.firebaseio.com/users/" + $scope.phone);
		$scope.userme = $firebaseObject(ref1);

		$scope.cancel_ride = function(v) {
			$scope.userme.matches[v].status = 'cancelled';
			$scope.userme.$save();
		};

		$scope.get_user = function(id) {
			var userRef = new Firebase("https://catcab.firebaseio.com/users/"+id);
			return $firebaseObject(userRef);
		};

		$scope.pretty_time = function(timeStr) {
			// If timeStr is empty, we have a "now" match
			if (timeStr==""){
				// timeStr = new Date(); // Generates the current date/time
				return "Now";
			}
			var date = new Date(timeStr);
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+ minutes : minutes;
			var time = hours + ':' + minutes + ' ' + ampm;
			return date.toDateString() + " at " + time;
		};


		$scope.logout_tapped = function() {



			// deletes from localStorage and goes to login page 
			localStorage.removeItem("phoneNumber");
			localStorage.removeItem("firstName");
			localStorage.removeItem("lastName");
			localStorage.removeItem("imgSrc");		

			var loginView = new supersonic.ui.View({
					location: "users#login",
					id: "login"		
			});

			loginView.isStarted().then(function(started){
				if (started){
					supersonic.logger.log("It was started ");
					supersonic.ui.layers.replace(loginView);	
				}
				else
				{
					supersonic.logger.log("i'm messing with you ");
					loginView.start().then(function () {
						supersonic.ui.layers.replace(loginView);
					});

				}
			});

		};
	}
]);
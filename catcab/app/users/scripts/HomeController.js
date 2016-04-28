angular
	.module('users')
	.controller("HomeController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {

		$scope.phone = localStorage.getItem("phoneNumber");

		var ref1 = new Firebase("https://catcab.firebaseio.com/users/" + $scope.phone);
		$scope.userme = $firebaseObject(ref1);

		// $scope.userme.$loaded().then(function() {
		// 	$scope.userme.$watch(function() {
		// 		window.location.reload();
		// 	});
		// });

		$scope.cancel_ride = function(v) {
			supersonic.logger.log("Attempting to cancel ride with key " + v);
			$scope.userme.matches[v].status = 'cancelled';
			$scope.userme.$save();
		};

		$scope.get_user = function(id) {
			var userRef = new Firebase("https://catcab.firebaseio.com/users/"+id);
			return $firebaseObject(userRef);
		};

		$scope.location_to_icon = function(location) {
			if (location.indexOf("Northwestern") !== -1) {
				return "super-university";
			} else if (location === "Downtown Evanston") {
				return "super-home";
			} else if (location.indexOf("ORD") !== -1 || location.indexOf("Midway") !== -1) {
				return "super-android-plane";
			}
		};

		$scope.name_to_initial = function(str) {
			if (str) {
				return str.substring(0, 1) + ".";
			}
		};

		$scope.pretty_time = function(timeStr) {
			// If timeStr is empty, we have a "now" match
			if (timeStr === "") {
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
				} else {
					supersonic.logger.log("i'm messing with you ");
					loginView.start().then(function () {
						supersonic.ui.layers.replace(loginView);
					});
				}
			});

		};

		$scope.load_match_form = function() {
			var matchView = new supersonic.ui.View({
				location: "users#match_form",
				id: "match_form"		
			});

			supersonic.ui.layers.push(matchView);
		};
	}
]);
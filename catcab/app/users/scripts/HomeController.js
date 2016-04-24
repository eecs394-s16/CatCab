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
	}
]);
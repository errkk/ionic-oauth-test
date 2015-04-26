var CLIENT_ID = 'b15573ce0951ab945d67';
var CLIENT_SECRET = 'aa10eef53949f3f7f408553cb9f87c86eb476bf9';

angular.module('starter.controllers', [])

.run(function($window, $http, $ionicPopup) {
    var token = $window.localStorage.getItem("access_token");

    if(token) {
        $http.defaults.headers.common.Authorization = "Bearer " + token;
    }
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $window, $ionicPopup, pradOauth) {
    $scope.googleLogin = function() {
        pradOauth(CLIENT_ID, CLIENT_SECRET).then(function(result) {
            $window.localStorage.setItem("access_token", result.access_token);
            $scope.access_token = $window.localStorage.getItem("access_token");
        }, function(error) {
            console.log(error);
            $ionicPopup.alert({
                title: 'Error',
                template: error
            });
        });
    }
    $scope.settings = {
        enableFriends: true
    };
    $scope.access_token = $window.localStorage.getItem("access_token");
});

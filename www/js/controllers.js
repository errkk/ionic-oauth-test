angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $http, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $window, $http, $ionicPopup, pradOauth, CLIENT_ID, CLIENT_SECRET) {
    $scope.googleLogin = function() {
        pradOauth(CLIENT_ID, CLIENT_SECRET).then(function(result) {
            $window.localStorage.setItem("access_token", result.access_token);
            $window.localStorage.setItem("refresh_token", result.refresh_token);
            $scope.access_token = $window.localStorage.getItem("access_token");
        }, function(error) {
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
